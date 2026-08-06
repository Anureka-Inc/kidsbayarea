// Amazon Creators API product picks — per-page context configuration.
//
// Each context maps a guide slug or category page to the products a family
// would actually use on that kind of outing. Two kinds of queries per page:
// the obvious gear ("essentials") and the things parents don't think to bring
// until they wish they had ("smart extras"). The refresh script
// (scripts/refresh-amazon-picks.mjs) runs these queries against the Creators
// API searchItems endpoint and writes results to src/data/amazonProducts.ts.
// Pages render nothing until the tag below is set AND product data exists.

// Your Amazon Associates tracking tag (e.g. "kidsbayarea-20"). Empty string
// keeps every AmazonPicks section hidden site-wide.
export const AMAZON_PARTNER_TAG = "kidsbayarea0d-20";

export interface AmazonProduct {
  asin: string;
  title: string;
  image: string;
  url: string;
  price?: string;
}

export interface AmazonPicksData {
  updatedAt: string;
  items: AmazonProduct[];
}

export interface AmazonPickContext {
  /** Guide slug (e.g. "rainy-day") or category key (e.g. "explore"). */
  key: string;
  headingEn: string;
  /** Ordered searchItems queries: essentials first, then the non-obvious extras. */
  queries: string[];
  /** Cap on rendered products (default 4). */
  maxItems?: number;
}

// Maps a place's tags to the outing-scenario context whose products a family
// would actually pack for that visit. First match wins — ordered from most
// activity-specific to most generic. Falls back to the place's category
// context, or null (no section) when nothing fits.
// Exact tag matches only — the tag vocabulary contains traps like
// "farm-to-table" (a restaurant), "stuffed-animals" (a toy store), and
// "computer-science" (a coding class), so no substring/word matching.
// Lists are curated from the actual places.ts vocabulary.
const TAG_CONTEXT_RULES: Array<[tags: string[], contextKey: string]> = [
  [
    ["farm", "farm-animals", "petting-zoo", "zoo", "children-zoo", "baby-animals", "animals", "wildlife", "aquarium"],
    "animal-encounter",
  ],
  [
    ["splash-pad", "water-play", "water-park", "waterpark", "water-slides", "water-rides", "swimming", "pool", "indoor-pool", "beach", "family-beach", "ocean-beach", "pebble-beach", "tide-pools", "lake", "waterfront"],
    "water-outing",
  ],
  [
    ["hiking", "easy-hike", "short-hike", "guided-hikes", "trail", "easy-trail", "easy-trails", "flat-trail", "creek-trail", "coastal-trail", "bay-trail", "state-park", "national-park", "regional-park", "county-park", "nature", "nature-preserve", "nature-center", "urban-nature", "redwoods", "waterfall", "waterfalls", "camping"],
    "trail-day",
  ],
  [["museum", "science", "interactive"], "museum-day"],
  [
    ["indoor-playground", "trampoline", "play-area", "climbing", "rock-climbing", "inflatables"],
    "indoor-playgrounds",
  ],
  [["playground", "slides"], "play"],
  [["day-trip", "scenic"], "explore"],
];

const CATEGORY_CONTEXT_FALLBACK: Record<string, string> = {
  play: "play",
  explore: "explore",
  shop: "shop",
  eat: "eat-out",
  learn: "learn-enrich",
};

export function resolvePlaceContextKey(
  tags: readonly string[],
  category: string
): string | null {
  // Venue-type categories map straight to their scenario — a waterfront
  // restaurant is still a restaurant, a science class is still a class.
  // Tag rules only differentiate activity venues (play/explore).
  if (category === "eat" || category === "learn" || category === "shop") {
    return CATEGORY_CONTEXT_FALLBACK[category];
  }
  for (const [ruleTags, contextKey] of TAG_CONTEXT_RULES) {
    if (ruleTags.some((t) => tags.includes(t))) return contextKey;
  }
  return CATEGORY_CONTEXT_FALLBACK[category] ?? null;
}

export const amazonPickContexts: AmazonPickContext[] = [
  // --- Age guides -------------------------------------------------------
  {
    key: "babies-0-2",
    headingEn: "Gear That Makes Outings with Baby Easier",
    queries: [
      "baby carrier for hiking",
      "diaper bag backpack",
      "stroller fan clip on",
      "portable white noise machine baby travel",
    ],
  },
  {
    key: "toddlers-2-5",
    headingEn: "Toddler Outing Essentials Parents Swear By",
    queries: [
      "toddler water shoes",
      "toddler sun hat upf 50",
      "snack catcher cups toddler",
      "portable potty seat travel toddler",
    ],
  },
  {
    key: "kids-5-8",
    headingEn: "Adventure Gear Kids 5–8 Will Love",
    queries: [
      "kids binoculars explorer kit",
      "kids insulated water bottle",
      "outdoor scavenger hunt cards kids",
      "kids mini first aid kit",
    ],
  },
  {
    key: "tweens-8-12",
    headingEn: "Gear for Big-Kid Adventures",
    queries: [
      "kids instant camera",
      "grip socks kids trampoline",
      "family escape room game",
      "kids hydration backpack",
    ],
  },
  // --- Themed guides ------------------------------------------------------
  {
    key: "rainy-day",
    headingEn: "Rainy-Day Backup Plan for Home",
    queries: [
      "family board games kids",
      "kids craft kits ages 4-8",
      "kids rain boots",
      "indoor scavenger hunt game kids",
    ],
  },
  {
    key: "birthday-party",
    headingEn: "Party Prep Made Easy",
    queries: [
      "kids birthday party favors bulk",
      "birthday party decorations kids",
      "goodie bag stuffers kids",
      "birthday thank you cards kids",
    ],
  },
  {
    key: "indoor-playgrounds",
    headingEn: "Don't Show Up Without These",
    queries: [
      "kids grip socks",
      "kids water bottle spill proof",
      "travel hand sanitizer kids",
    ],
  },
  {
    key: "free",
    headingEn: "Free Fun Still Needs a Few Things",
    queries: [
      "waterproof picnic blanket family",
      "kite for kids easy fly",
      "bubble machine kids outdoor",
    ],
  },
  // --- Place-detail scenarios (resolved from place tags/category) ----------
  {
    key: "water-outing",
    headingEn: "Pack for a Water Day",
    queries: [
      "kids water shoes",
      "kids hooded beach towel poncho",
      "waterproof phone pouch",
      "swim diapers toddler",
    ],
  },
  {
    key: "trail-day",
    headingEn: "Trail Day Checklist",
    queries: [
      "kids hiking backpack with water bladder",
      "kids binoculars",
      "kids bug spray deet free",
      "kids mini first aid kit",
    ],
  },
  {
    key: "animal-encounter",
    headingEn: "For Farm & Wildlife Visits",
    queries: [
      "kids sun hat",
      "travel hand sanitizer",
      "kids digital camera",
      "kids animal field guide",
    ],
  },
  {
    key: "museum-day",
    headingEn: "Museum Day Helpers",
    queries: [
      "kids travel activity journal",
      "kids water bottle leakproof",
      "toddler backpack harness",
      "kids headphones wired",
    ],
  },
  {
    key: "eat-out",
    headingEn: "Eating Out with Kids, Solved",
    queries: [
      "disposable placemats toddler",
      "toddler travel utensils case",
      "portable high chair travel",
      "silicone bib toddler travel",
    ],
  },
  {
    key: "learn-enrich",
    headingEn: "Keep the Learning Going at Home",
    queries: [
      "STEM kits kids",
      "kids art supplies set",
      "beginner coding toys kids",
      "kids workbooks ages 5-8",
    ],
  },
  // --- Category pages -----------------------------------------------------
  {
    key: "shop",
    headingEn: "Can't Make It to the Store? Top Picks Online",
    queries: [
      "STEM educational toys kids",
      "wooden toys toddler",
      "kids books about san francisco",
    ],
  },
  {
    key: "explore",
    headingEn: "Day-Trip Gear Families Forget",
    queries: [
      "kids hiking backpack",
      "car seat organizer road trip kids",
      "kids travel activity kit car",
      "kids digital camera nature",
    ],
  },
  {
    key: "play",
    headingEn: "Playground & Park Day Essentials",
    queries: [
      "sand toys kids beach",
      "kids sunscreen spf 50",
      "kids scooter helmet",
      "splash pad toys toddler",
    ],
  },
];
