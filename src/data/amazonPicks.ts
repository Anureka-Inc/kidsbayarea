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
export const AMAZON_PARTNER_TAG = "";

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
