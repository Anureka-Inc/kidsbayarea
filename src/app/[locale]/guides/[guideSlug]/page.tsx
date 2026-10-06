import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { routing, isFullyTranslated } from "@/i18n/routing";
import GuideContent from "./GuideContent";

const validGuides = [
  "babies-0-2",
  "toddlers-2-5",
  "kids-5-8",
  "tweens-8-12",
  "rainy-day",
  "family-favorites",
  "birthday-party",
  "free",
  "indoor-playgrounds",
  "museums",
  "fall",
  "field-trips",
  "winter",
] as const;

type GuideSlug = (typeof validGuides)[number];

const guideMeta: Record<
  GuideSlug,
  { titleEn: string; titleZh: string; descEn: string; descZh: string }
> = {
  "winter": {
    titleEn: "Winter Activities for Kids in the Bay Area \u2014 Ice Skating, Whales & Holiday Trains",
    titleZh: "湾区冬季亲子活动：溜冰、观鲸、象海豹与节日火车",
    descEn:
      "Bay Area winter fun for families: ice skating at Winter Lodge and Sharks Ice, elephant seals at A\u00f1o Nuevo, whale watching from Point Reyes and Pigeon Point, monarch butterflies, rainy-season waterfalls, and Roaring Camp holiday trains.",
    descZh:
      "湾区冬季亲子活动：Winter Lodge 和 Sharks Ice 溜冰、Año Nuevo 看象海豹、Point Reyes 和 Pigeon Point 观鲸、帝王蝶、雨季瀑布，以及 Roaring Camp 节日火车。",
  },
  "babies-0-2": {
    titleEn: "Best Bay Area Activities for Babies (0-2 Years)",
    titleZh: "湾区宝宝活动推荐（0-2岁）",
    descEn:
      "Safe, stroller-friendly, and baby-approved activities in the Bay Area. Find the best spots for crawlers and early walkers.",
    descZh:
      "安全、婴儿车友好、适合宝宝的湾区活动。找到最适合爬行和学步宝宝的好去处。",
  },
  "toddlers-2-5": {
    titleEn: "Bay Area Toddler Activities (Ages 2–5) — Play Spaces, Splash Pads & More",
    titleZh: "湾区幼儿活动推荐（2-5岁）",
    descEn:
      "Best things to do with toddlers in the Bay Area: indoor play cafes, splash pads, free petting farms, discovery museums, and stroller-friendly playgrounds for ages 2–5.",
    descZh:
      "互动性强、充满想象力的湾区幼儿活动空间。适合好奇的小小探险家。",
  },
  "kids-5-8": {
    titleEn: "Bay Area Activities for Kids Ages 5–8 — Museums, Indoor Play & STEM Programs",
    titleZh: "湾区儿童活动推荐（5-8岁）",
    descEn:
      "Best Bay Area activities for kids ages 5–8: hands-on science museums, indoor playgrounds, children's art studios, coding programs, and outdoor adventures across SF, East Bay, South Bay, and Peninsula.",
    descZh: "STEM、运动、探险和教育活动，适合学龄儿童的湾区好去处。",
  },
  "tweens-8-12": {
    titleEn: "Bay Area Activities for Tweens (Ages 8–12) — Things to Do with Older Kids",
    titleZh: "湾区少年活动推荐（8-12岁）",
    descEn:
      "Best Bay Area activities for tweens ages 8–12: climbing gyms, trampoline parks, escape rooms, STEM camps, amusement parks, and after-school programs across SF, East Bay, and South Bay.",
    descZh:
      "挑战性活动、科技营、户外探险，适合大孩子的湾区好去处。",
  },
  "rainy-day": {
    titleEn: "Rainy Day Activities for Kids in the Bay Area — Indoor Fun",
    titleZh: "湾区雨天亲子活动指南",
    descEn:
      "Best rainy day activities for Bay Area kids: the Exploratorium (SF), Children's Discovery Museum of San Jose, Bay Area Discovery Museum (Sausalito), Sky Zone trampoline parks, and The Tech Interactive.",
    descZh:
      "室内游乐场、博物馆和室内活动，雨天也不无聊！",
  },
  "family-favorites": {
    titleEn: "Top-Rated Family Favorites in the Bay Area",
    titleZh: "湾区亲子活动最受欢迎排行",
    descEn:
      "The highest-rated, most-loved family activities in the Bay Area. Places the whole family will enjoy together.",
    descZh:
      "湾区评分最高、最受家庭喜爱的亲子活动。全家老少都开心的好去处。",
  },
  "birthday-party": {
    titleEn: "Best Kids Birthday Party Places in the Bay Area",
    titleZh: "湾区儿童生日派对场地推荐",
    descEn:
      "The best venues for kids birthday parties in the Bay Area: indoor playgrounds, trampoline parks, museums, and party-ready spots that handle the setup so you don't have to.",
    descZh:
      "湾区最适合举办儿童生日派对的场地：室内游乐场、蹦床公园、博物馆和省心的派对好去处。",
  },
  free: {
    titleEn: "Free Things to Do with Kids in the Bay Area",
    titleZh: "湾区免费亲子活动大全",
    descEn:
      "Free family activities in the Bay Area that won't cost a thing: parks, beaches, free-admission museums, nature trails, and budget-friendly fun for kids of all ages.",
    descZh:
      "湾区不花钱的亲子好去处：公园、海滩、免费博物馆、自然步道，适合各年龄段孩子的省钱活动。",
  },
  "field-trips": {
    titleEn: "Bay Area Field Trip Ideas for Kids — Museums, Farms & History",
    titleZh: "湾区亲子校外参观推荐：博物馆、农场与历史遗址",
    descEn:
      "Bay Area field trip ideas for kids and groups: science museums, working farms like Ardenwood and Hidden Villa, history sites like John Muir National Historic Site and Fort Point, tide pools, and free options.",
    descZh:
      "湾区亲子和团体校外参观推荐：科学博物馆、Ardenwood 和 Hidden Villa 等农场、John Muir 故居和 Fort Point 等历史遗址、潮池，以及免费去处。",
  },
  fall: {
    titleEn: "Fall Activities & Pumpkin Patches for Kids in the Bay Area",
    titleZh: "湾区秋季亲子活动与南瓜田推荐",
    descEn:
      "Bay Area fall fun for families: Half Moon Bay pumpkin patches, Lemos Farm hay rides, corn mazes, apple picking at Gizdich Ranch, harvest festivals, monarch butterflies, and where to buy Halloween costumes.",
    descZh:
      "湾区秋季亲子活动：Half Moon Bay 南瓜田、Lemos Farm 干草车、玉米迷宫、Gizdich Ranch 摘苹果、丰收节、帝王蝶，以及万圣节服装店推荐。",
  },
  museums: {
    titleEn: "Best Children's Museums & Science Centers in the Bay Area",
    titleZh: "湾区儿童博物馆与科学馆推荐",
    descEn:
      "Bay Area children's and science museums for kids: the Exploratorium, California Academy of Sciences, Children's Discovery Museum of San Jose, Bay Area Discovery Museum, The Tech Interactive, plus free museums and resident free days.",
    descZh:
      "湾区适合孩子的儿童博物馆和科学馆：Exploratorium、California Academy of Sciences、圣何塞儿童探索博物馆、Bay Area Discovery Museum、The Tech Interactive，以及免费博物馆和居民免费日。",
  },
  "indoor-playgrounds": {
    titleEn: "Best Indoor Playgrounds for Kids in the Bay Area",
    titleZh: "湾区室内游乐场推荐",
    descEn:
      "The best indoor playgrounds and play spaces in the Bay Area: soft-play areas, climbing structures, trampoline parks, and indoor fun perfect for any weather.",
    descZh:
      "湾区最棒的室内游乐场和游玩空间：软体游乐区、攀爬设施、蹦床公园，任何天气都能玩。",
  },
};

// ISR: guides pages inline filtered places, so 30 locales × 6 guides bloats
// the artifact. Pre-render English only; other locales render on demand and
// are cached for 24h via the export below.
export const revalidate = 86400;

export function generateStaticParams() {
  return validGuides.map((slug) => ({ locale: "en", guideSlug: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; guideSlug: string }>;
}): Promise<Metadata> {
  const { locale, guideSlug } = await params;
  const meta = guideMeta[guideSlug as GuideSlug];

  if (!meta) return { title: "Not Found" };

  const title = locale === "zh" ? meta.titleZh : meta.titleEn;
  const description = locale === "zh" ? meta.descZh : meta.descEn;

  const alternates: Record<string, string> = {};
  for (const altLocale of routing.locales) {
    alternates[altLocale] = `https://www.kidsbayarea.com/${altLocale}/guides/${guideSlug}`;
  }

  // Untranslated locales serve EN body content, so we point canonical at the
  // EN version and ask Google not to index the duplicate. hreflang still maps
  // the language variants for users who switch via the language picker.
  const translated = isFullyTranslated(locale);
  const canonicalUrl = translated
    ? `https://www.kidsbayarea.com/${locale}/guides/${guideSlug}`
    : `https://www.kidsbayarea.com/en/guides/${guideSlug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: alternates,
    },
    ...(translated
      ? {}
      : { robots: { index: false, follow: true } }),
  };
}

// FAQPage JSON-LD for winter guide. Targets "winter activities for kids bay area" / "ice skating bay area" — seasonal peak Nov–Jan.
// Venues and facts sourced from places.ts only; mirrors the visible FAQ.
const winterFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Where can kids go ice skating in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Winter Lodge in Palo Alto is the only permanent outdoor ice skating rink west of the Sierras, open mid-October through mid-April with twinkling lights. Year-round indoor rinks include Oakland Ice Center in downtown Oakland (two rinks, classes for kids 3 and up, and skating aids for beginners), Sharks Ice at San Jose (six NHL-sized rinks, the largest ice rink facility west of the Mississippi), Sharks Ice at Fremont, and Nazareth Ice Oasis in San Mateo's Bridgepointe Shopping Center. In Santa Rosa, Snoopy's Home Ice was built by Peanuts creator Charles Schulz in 1969 and has the Warm Puppy Cafe rink-side. Check each rink's website for public session times.",
      },
    },
    {
      "@type": "Question",
      name: "Where can families see elephant seals and whales in winter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Elephant seals breed at A\u00f1o Nuevo State Park in Pescadero from December to March, and Point Reyes National Seashore has elephant seal viewing from December through March. Whale watching season runs December through May: Point Reyes Lighthouse is one of the best whale watching spots on the California coast (its 308 steps are not suitable for strollers), and you can also look for passing whales from Pigeon Point Lighthouse and Muir Beach Overlook. Dress warmly, because the coast is windy and cold.",
      },
    },
    {
      "@type": "Question",
      name: "What nature activities are best in the Bay Area in winter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Monarch butterflies stay at Natural Bridges State Beach in Santa Cruz through January, with the peak in November and December. At Samuel P. Taylor State Park, kids can spot spawning salmon in Lagunitas Creek during winter. Palo Alto Baylands is best at high tide in winter for migratory birds. Winter rains also bring the waterfalls to life: the Waterfall Loop at Uvas Canyon County Park passes five waterfalls (reservation required), Cascade Falls in Fairfax is best in winter and early spring, and Tiptoe Falls at Portola Redwoods State Park is best in winter and spring.",
      },
    },
    {
      "@type": "Question",
      name: "Are there holiday train rides for kids in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Roaring Camp Railroads in Felton runs historic narrow-gauge steam trains through ancient redwood forests, and its special holiday trains are seasonal favorites that sell out fast, so book early. Check Roaring Camp's website for this season's holiday train dates.",
      },
    },
  ],
};

// FAQPage JSON-LD for birthday-party guide. Targets "birthday party places for kids bay area".
// Venues and facts sourced from places.ts only; mirrors the visible FAQ in GuideContent.
const birthdayPartyFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the best birthday party places for kids in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Popular Bay Area kids' birthday party venues include Sky Zone trampoline parks in Fremont and Dublin (Sky Zone Dublin has private party rooms), Altitude Trampoline Park in South San Jose, Ninja Republic in San Mateo (American Ninja Warrior-style obstacles), Round1 entertainment centers in Concord, Hayward, and San Jose (bowling, arcade games, karaoke, and party rooms), Lucky Strike San Jose (formerly Bowlero; 59 lanes with bumper bowling), and Laser Tagging Inc. in Newark (a two-story laser tag arena). Check each venue's website for current party packages and availability.",
      },
    },
    {
      "@type": "Question",
      name: "Where can toddlers have birthday parties in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Toddler-friendly Bay Area birthday party venues include La Petite Playhouse in Redwood City (10,000 sq ft indoor playground with separate baby and toddler areas), Little Oceanauts in San Francisco (ocean-themed playground and party venue with a separate area for tots under 2), Whirlygig in San Jose (play space for ages 8 weeks to 8 years that hosts 2-hour private parties), and WOW Kids Playground in San Francisco (indoor playground designed for younger children). Party rooms at popular toddler venues fill up quickly, so book ahead.",
      },
    },
    {
      "@type": "Question",
      name: "Are there outdoor birthday party options for kids in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For an outdoor celebration, consider Pixieland Amusement Park in Concord (free admission with pay-per-ride tickets, rides sized for ages 1 to 10), Children's Fairyland in Oakland (storybook theme park on Lake Merritt with puppet shows and gentle rides), the Oakland Zoo, or a picnic at Coyote Hills Regional Park in Fremont (flat trails and a marsh boardwalk). Many city and regional parks take picnic-area reservations; check the local parks department for availability and fees.",
      },
    },
    {
      "@type": "Question",
      name: "What are unique birthday party ideas for kids in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For something different, try a climbing party at Bridges Rock Gym in El Cerrito (weekend birthday parties, kids programs from age 5), indoor mini golf at Urban Putt in downtown San Jose (families welcome before 8pm) or Holey Moley in San Francisco (kids birthday packages; under-13s welcome with an adult before 8pm), teppanyaki theater at Benihana in Cupertino (mention the birthday for a special treat), or bumper bowling at Lucky Strike Alameda. Check each venue's website for current packages.",
      },
    },
  ],
};

// FAQPage JSON-LD for free guide. Targets "free things to do with kids bay area".
// Venues and facts sourced from places.ts only; mirrors the visible FAQ in GuideContent.
const freeFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the best free things to do with kids in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Top free Bay Area activities for kids include Tilden Little Farm in Berkeley (free petting farm; bring celery and lettuce for the animals), Adventure Playground at the Berkeley Marina (kids build forts with real hammers and saws under supervision), the Randall Museum in San Francisco (free family museum with live animals and a woodworking shop), Magical Bridge Playground in Palo Alto (inclusive playground designed for children of all abilities), Mia's Dream Come True Playground in Hayward (1-acre all-abilities playground), and Koret Children's Quarter in Golden Gate Park (the oldest public children's playground in the US, with concrete slides built into the hill).",
      },
    },
    {
      "@type": "Question",
      name: "Are there free splash pads for kids in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Free Bay Area splash pads include Emerald Glen Park Splash Pad in Dublin (open Memorial Day through Labor Day), Meadow Homes Spray Park in Concord (pirate-themed, open Memorial Day through September), Ortega Park Splash Pad in Sunnyvale (pirate-themed and great for toddlers), and the 24th & York Mini Park splash pad in San Francisco's Mission District. Splash pads run seasonally, so check city parks websites for current hours.",
      },
    },
    {
      "@type": "Question",
      name: "What free outdoor activities are there for kids in San Francisco?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Free San Francisco outdoor picks include Crissy Field (waterfront promenade with a sandy beach, kite flying, and Golden Gate Bridge views), Baker Beach (stick to the family-friendly south end with picnic tables and restrooms; strong riptides make swimming dangerous), Koret Children's Quarter in Golden Gate Park, and Yerba Buena Gardens Playground atop the Moscone Center. Across the bridge, Battery Spencer in the Marin Headlands is a free quarter-mile walk to classic Golden Gate views.",
      },
    },
    {
      "@type": "Question",
      name: "What are free activities for kids in the East Bay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Free East Bay picks include Tilden Little Farm in Berkeley (free admission, open daily 8:30am to 4pm), Adventure Playground at the Berkeley Marina (open weekends during the school year and daily in summer; closed-toe shoes required), Redwood Regional Park in Oakland (the first mile of the Stream Trail is paved and stroller-friendly, with a playground at Canyon Meadow), Mia's Dream Come True Playground in Hayward, and Pixieland Amusement Park in Concord (free admission; rides are pay-per-ticket).",
      },
    },
  ],
};

// FAQPage JSON-LD for family-favorites guide. Targets "bay area family attractions"
// and "bay area family activities" — DataForSEO 0 rank while bayareakidfun (#3),
// livefreecreative (#5), and 510families (#6) rank top-6. zh variant already gets
// 5 clicks at pos 4.8, showing the page has strong relevance; EN needs structured Q&A
// to match what competitors offer. Venues sourced from places.ts only.
const familyFavoritesFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the top-rated family attractions in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Bay Area's most-loved family attractions include the Exploratorium at Pier 15 in San Francisco (hands-on science exhibits), the California Academy of Sciences in Golden Gate Park (planetarium, rainforest, and aquarium under one roof), the Oakland Zoo in Knowland Park, the Bay Area Discovery Museum in Sausalito (indoor and outdoor exhibits for younger children), and Magical Bridge Playground in Palo Alto (inclusive play space designed for children of all abilities). Check each venue's website for current hours and admission.",
      },
    },
    {
      "@type": "Question",
      name: "Which Bay Area family activities are good for all ages?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All-ages Bay Area favorites include the Exploratorium in San Francisco, Tilden Regional Park in Berkeley (steam trains, a free petting farm, and nature trails), the Santa Cruz Beach Boardwalk (free park entry, pay-per-ride), Angel Island State Park (ferry, hiking, and bay views), and Roaring Camp Railroads in Felton (steam train through old-growth redwoods). Check each venue's website for current hours and admission.",
      },
    },
    {
      "@type": "Question",
      name: "What are the best free Bay Area family activities?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Free Bay Area family highlights include Tilden Little Farm in Berkeley (free admission), Magical Bridge Playground in Palo Alto (free entry), Crissy Field and Baker Beach in San Francisco (National Park Service beaches), and the de Young Museum in Golden Gate Park (free for children 17 and under). Public library systems throughout San Francisco, the East Bay, and Santa Clara County offer free family story times and maker programs as well.",
      },
    },
    {
      "@type": "Question",
      name: "What Bay Area family attractions make great weekend day trips?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Top Bay Area family day trips include the Monterey Bay Aquarium (about two hours south of San Francisco), the Santa Cruz Beach Boardwalk (ocean-side rides and free beach), Roaring Camp Railroads in Felton (steam train through redwoods), Muir Woods National Monument in Mill Valley (old-growth redwoods just north of San Francisco), and Gilroy Gardens Family Theme Park. Check each venue's website for current hours, tickets, and parking reservation requirements.",
      },
    },
  ],
};

// FAQPage JSON-LD for babies-0-2 guide. Targets "things to do with babies bay area" —
// DataForSEO 0 rank while reddit, 510families, and mommypoppins rank #1-3.
// Venues and details sourced from places.ts; no prices, hours, or ages fabricated.
const babies02FaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the best activities for babies (0–2) in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Top Bay Area activities for babies and young toddlers (ages 0–2) include the Bay Area Discovery Museum in Sausalito (indoor and outdoor sensory exhibits designed for the youngest visitors), Tilden Little Farm in Berkeley (free, open 365 days a year — great for babies who love animals), the Koret Children's Quarter playground in Golden Gate Park, Yerba Buena Gardens Children's Garden in San Francisco, and public library baby story-time programs throughout the Bay Area. Check each venue's website for current hours and scheduling.",
      },
    },
    {
      "@type": "Question",
      name: "Which Bay Area venues are stroller-friendly for families with babies?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Stroller-friendly Bay Area venues for babies include Crissy Field in San Francisco (flat paved path along the waterfront), the Main Trail loop at Muir Woods National Monument (1-mile flat paved path through redwoods), Shoreline Park in Mountain View (wide paved trails around the lake), Yerba Buena Gardens in San Francisco, and most indoor venues including the Bay Area Discovery Museum in Sausalito and the Exploratorium at Pier 15 in San Francisco. Venues with stroller parking at the entrance include the Exploratorium and the Children's Creativity Museum in San Francisco.",
      },
    },
    {
      "@type": "Question",
      name: "Are there free activities for babies and infants in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Free activities for Bay Area babies include Tilden Little Farm petting farm in Berkeley (open 365 days a year, free admission), public library baby rhyme times and infant story-times (available at San Francisco Public Library's Fisher Children's Center, Santa Clara County Library, and Oakland Public Library), all municipal playgrounds including Magical Bridge Playgrounds in Palo Alto and Mountain View, Crissy Field and Baker Beach in San Francisco, and free outdoor spaces like Shoreline Park in Mountain View and Oyster Point Marina Park in South San Francisco.",
      },
    },
    {
      "@type": "Question",
      name: "What indoor play spaces in the Bay Area are good for babies under 2?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The best Bay Area indoor play spaces for babies under 2 include the Bay Area Discovery Museum in Sausalito (indoor exhibits for very young children), La Petite Playhouse in Redwood City (soft-play area for infants and toddlers), and the Children's Discovery Museum of San Jose (infant and toddler-friendly exhibits). Many YMCA branches across the Bay Area also offer infant and parent-and-me swim classes. Check each venue's website for current hours and age guidelines.",
      },
    },
  ],
};

// FAQPage JSON-LD for field-trips guide. Targets "bay area field trip ideas" /
// "bay area field trips" (GSC: 156 impressions at pos 50+, no dedicated page).
// Venues and facts sourced from places.ts only; mirrors the visible FAQ.
const fieldTripsFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the best field trip ideas in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Strong Bay Area field trip picks span four themes. Science: the Exploratorium on Pier 15, the California Academy of Sciences in Golden Gate Park, The Tech Interactive in San Jose, Chabot Space & Science Center in Oakland, and the Lawrence Hall of Science in Berkeley. History: John Muir National Historic Site in Martinez, Sanchez Adobe Historic Site in Pacifica, Fort Point under the Golden Gate Bridge, and Black Diamond Mines in Antioch. Farms: Ardenwood Historic Farm in Fremont, Hidden Villa in Los Altos Hills, and Slide Ranch near Muir Beach. Nature: tide pools at Fitzgerald Marine Reserve and rescued animals at Lindsay Wildlife Experience. For school or group visits, contact each venue in advance to arrange a booking.",
      },
    },
    {
      "@type": "Question",
      name: "Which Bay Area farms are good for field trips?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ardenwood Historic Farm in Fremont is a working Victorian-era farm with horse-drawn train rides and seasonal programs such as corn harvest and wool spinning. Hidden Villa in Los Altos Hills is a 1,600-acre organic farm and wilderness preserve. At Slide Ranch near Muir Beach, kids can milk goats, collect eggs, and explore tidepools. Loma Vista Farm in Vallejo is an educational farm with hands-on programs on sustainable farming; book farm tours in advance. Deer Hollow Farm in Los Altos and Emma Prusch Farm Park in San Jose are free to visit.",
      },
    },
    {
      "@type": "Question",
      name: "Where can kids learn about Bay Area history on a field trip?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "John Muir National Historic Site in Martinez has free admission to the naturalist's Victorian mansion, orchards, and a 20-minute film, plus Junior Ranger booklets. Sanchez Adobe Historic Site in Pacifica spans the Ohlone, Spanish, and Mexican eras, with hands-on activities like grinding corn, making candles, and creating adobe bricks. Fort Point is a Civil War-era fort under the Golden Gate Bridge with free ranger-led tours on weekends. Black Diamond Mines Regional Preserve in Antioch explores 19th-century coal mining, with seasonal guided mine tunnel tours, and San Francisco Maritime National Historical Park has a free Maritime Museum.",
      },
    },
    {
      "@type": "Question",
      name: "What are free field trip options in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Free options include the Randall Museum in San Francisco (live animals, art studios, and a woodworking shop), John Muir National Historic Site, Sanchez Adobe Historic Site, Fort Point National Historic Site, the San Francisco Maritime National Historical Park museum, Deer Hollow Farm, Emma Prusch Farm Park, and self-guided visits to Slide Ranch. Fitzgerald Marine Reserve in Moss Beach is free; visit at a zero or minus tide, when rangers and docents are often on site. Edgewood Park in Redwood City offers free docent-led wildflower hikes from March through May.",
      },
    },
  ],
};

// FAQPage JSON-LD for fall guide. Targets "pumpkin patches bay area" /
// "fall activities for kids bay area" — seasonal peak is October.
// Venues and facts sourced from places.ts only; mirrors the visible FAQ.
const fallFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Where are the best pumpkin patches for kids in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Half Moon Bay is the Bay Area's pumpkin patch capital: farms along Highway 92 such as Lemos Farm offer hay rides, corn mazes, pony rides, and pumpkin picking, and the annual Art & Pumpkin Festival draws thousands. Lemos Farm also has a train ride, a petting zoo with baby goats and bunnies, and a farm slide. In the East Bay, Three Nunns Farm in Brentwood has pumpkins in October, free tractor rides, and a corn maze. In San Jose, Emma Prusch Farm Park hosts an annual pumpkin festival in the fall. Go on a weekday if you can, because Highway 92 gets extremely congested on fall weekends.",
      },
    },
    {
      "@type": "Question",
      name: "Where can kids go apple picking or see a harvest festival near the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Gizdich Ranch in Watsonville has U-pick apples from September through November, antique apple press demonstrations on fall weekends, and a Pie Shop with homemade pies. Ardenwood Historic Farm in Fremont runs seasonal programs such as the corn harvest and a Harvest Festival, plus horse-drawn train rides. Tilden Nature Area in Berkeley offers naturalist-led programs that include apple cider pressing, and its weekend programs are free and drop-in.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I buy Halloween costumes for kids in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "House of Humor in Redwood City is Northern California's largest costume retailer, with costumes for toddlers through adults; go early in October for the best selection. Affordable Treasures in Los Gatos carries an extensive costume selection along with party supplies. For DIY costumes, Mendel's Far Out Fabrics on Haight Street in San Francisco sells faux fur, face paint, masks, and costume-making supplies.",
      },
    },
    {
      "@type": "Question",
      name: "What other fall activities can Bay Area families do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Fall is monarch butterfly season at Natural Bridges State Beach in Santa Cruz, California's only State Monarch Butterfly Preserve: the butterflies arrive October through January, peaking in November and December, and the boardwalk is stroller and wheelchair accessible. Winter Lodge in Palo Alto, the only permanent outdoor ice skating rink west of the Sierras, opens in mid-October and runs through mid-April, with group classes for kids 5 and up.",
      },
    },
  ],
};

// FAQPage JSON-LD for museums guide. Targets "children's museums bay area" /
// "science museums for kids bay area" (DataForSEO gap: bayareakidfun #4).
// Venues and facts sourced from places.ts only; mirrors the visible FAQ.
const museumsFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the best children's museums in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Top Bay Area children's museums include the Children's Discovery Museum of San Jose (the largest children's museum west of the Mississippi, with water play, a real fire truck to climb, and a bubbles exhibit), the Bay Area Discovery Museum in Sausalito (hands-on exhibits at the foot of the Golden Gate Bridge, daily Maker Labs, and the outdoor Lookout Cove with tide pools and caves), the Children's Creativity Museum in San Francisco's Yerba Buena Gardens (kids make animations and music videos, plus a historic carousel), and MOCHA - Museum of Children's Art in Old Oakland (open studios and Saturday drop-in sessions). Check each museum's website for current hours and admission.",
      },
    },
    {
      "@type": "Question",
      name: "What are the best science museums for kids in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Bay Area's best science museums for kids are the Exploratorium on San Francisco's Pier 15 (over 650 interactive exhibits, plus the Tactile Dome for older kids), the California Academy of Sciences in Golden Gate Park (an aquarium, planetarium, rainforest dome, and natural history museum under one living roof), The Tech Interactive in San Jose (kids design roller coasters, code robots, and explore biotech), Chabot Space & Science Center in the Oakland Hills (planetarium shows and real telescopes, with Friday and Saturday night viewings), and the Lawrence Hall of Science in Berkeley (hands-on exhibits, a planetarium, and an outdoor science park with Bay views).",
      },
    },
    {
      "@type": "Question",
      name: "Which Bay Area museums are best for toddlers and preschoolers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For toddlers and preschoolers, try the Children's Discovery Museum of San Jose (bring extra clothes for the water play area), the Bay Area Discovery Museum in Sausalito (indoor and outdoor exhibits designed for young children; weekday mornings are less crowded), the Randall Museum in San Francisco (a live animal room with snakes, owls, and rodents), and the Lawrence Hall of Science in Berkeley. The Children's Creativity Museum in Yerba Buena Gardens also welcomes kids from age 2.",
      },
    },
    {
      "@type": "Question",
      name: "Are there free museums or free days for kids in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The Randall Museum in San Francisco is free, with live animals, art studios, and a woodworking shop. The Maritime Museum and Visitor Center at San Francisco Maritime National Historical Park are free, and Fort Point National Historic Site under the Golden Gate Bridge has free admission with ranger-led tours on weekends. Several museums also offer resident free days: the Exploratorium on the first Wednesday for SF residents, the Children's Discovery Museum of San Jose on the first Wednesday for San Jose residents, and the California Academy of Sciences quarterly for SF residents. Confirm free-day dates on each museum's website.",
      },
    },
  ],
};

// FAQPage JSON-LD for indoor-playgrounds guide. Targets "best indoor playgrounds bay area"
// and "indoor play spaces for kids". GSC shows the locale-stripped path at pos 13.4
// with 214 impressions and no FAQ structured data. Venues sourced from places.ts.
const indoorPlaygroundsFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the best indoor playgrounds in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Top Bay Area indoor playgrounds include WOW Kids Playground in San Jose (large multi-level soft-play structure), Lemon Tree Play Cafe in San Jose (indoor play space with a cafe for parents), KidTopia in Fremont (indoor play center for younger children), La Petite Playhouse in Redwood City (open play and toddler-focused structure), and the Exploratorium at Pier 15 in San Francisco (250+ hands-on science play exhibits). For trampoline-style indoor play, Sky Zone Trampoline Park in Fremont and Sky Zone Dublin and House of Air at the Presidio in San Francisco are top picks. Check each venue's website for current hours and admission.",
      },
    },
    {
      "@type": "Question",
      name: "Which indoor play spaces in the Bay Area are best for toddlers and younger children?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The best Bay Area indoor play spaces for toddlers include the Bay Area Discovery Museum in Sausalito (bilingual indoor exhibits and outdoor tide pools), La Petite Playhouse in Redwood City (soft play, age 0–8), WOW Kids Playground in San Jose (dedicated toddler zone), Lemon Tree Play Cafe in San Jose (cafe for parents, safe soft-play for young children), and KidTopia in Fremont. Children's Discovery Museum of San Jose also has a toddler-friendly section. Check each venue's website for current hours and age guidelines.",
      },
    },
    {
      "@type": "Question",
      name: "Are there free or low-cost indoor play options for kids in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Free and low-cost Bay Area indoor play options include public library story times and drop-in play mornings (San Francisco, Oakland, Santa Clara County library systems), the Randall Museum in San Francisco (free general admission), East Bay Depot for Creative Reuse in Oakland (donation-based art supplies and play), and free family art Saturdays at the de Young Museum in Golden Gate Park. Many community recreation centers run subsidized drop-in gym and open-play sessions for toddlers and school-age kids — check city parks and recreation departments for local schedules.",
      },
    },
    {
      "@type": "Question",
      name: "What indoor play and trampoline parks are in the South Bay near San Jose?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "South Bay indoor play venues near San Jose include WOW Kids Playground (San Jose), Lemon Tree Play Cafe (San Jose), KidTopia (Fremont), Altitude Trampoline Park San Jose, and the Children's Discovery Museum of San Jose. For STEM and science-based indoor play, The Tech Interactive in downtown San Jose offers hands-on robotics, AI, and design exhibits for kids of all ages. Check each venue's website for current hours and admission.",
      },
    },
  ],
};

// FAQPage JSON-LD for kids-5-8 guide. Targets "indoor activities for kids bay area"
// and "things to do with kids bay area" — DataForSEO 0 rank while competitors rank
// pos 4-5. Venues sourced from places.ts; no prices, hours, or ages fabricated.
const kids58FaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the best indoor activities for kids ages 5–8 in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Top indoor Bay Area activities for kids ages 5–8 include the Exploratorium at Pier 15 in San Francisco (250+ hands-on science exhibits), Children's Discovery Museum of San Jose (three floors of interactive exhibits), The Tech Interactive in San Jose (robotics, AI, and design-challenge labs), Lawrence Hall of Science in Berkeley (hilltop science center with hands-on exhibits and outdoor science park), Bay Area Discovery Museum in Sausalito (bilingual indoor and outdoor play areas), and Children's Creativity Museum in San Francisco (arts, technology, and animation studios). Check each venue's website for current hours and admission.",
      },
    },
    {
      "@type": "Question",
      name: "What outdoor adventures are good for kids ages 5–8 in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Outdoor Bay Area adventures for kids 5–8 include the Tilden Park Steam Trains in Berkeley (Redwood Valley Railway), Tilden Little Farm (free petting farm, open daily), Adventure Playground at the Berkeley Marina (build-your-own structure using scrap lumber — unique to the region), hiking the easy trails at Muir Woods National Monument (1-mile Main Trail loop, stroller-accessible), the Shoreline Park trails in Mountain View, and the Oakland Zoo in Knowland Park. Magical Bridge Playgrounds in Palo Alto, Sunnyvale, and Mountain View are designed for all abilities.",
      },
    },
    {
      "@type": "Question",
      name: "What STEM classes and programs are available for 5–8 year olds in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bay Area STEM programs for kids ages 5–8 include Code Ninjas (Cupertino, North San Jose, Fremont — beginner coding), Galileo Innovation Camps (multiple Bay Area locations), iD Tech beginner coding courses (Stanford campus), Lawrence Hall of Science after-school clubs (Berkeley), and hands-on workshops at The Tech Interactive (San Jose). Many public library systems — including San Francisco, Santa Clara County, and Oakland — run free STEM Saturdays and maker programs for this age group.",
      },
    },
    {
      "@type": "Question",
      name: "Where can kids ages 5–8 take art and music classes in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bay Area art and music programs for kids 5–8 include Music Together studios (Palo Alto, Menlo Park, Sunnyvale, and East Bay locations), Studio4Art (San Jose), Color Me Mine ceramic painting studios (multiple Bay Area locations), the de Young Museum's family art Saturdays in Golden Gate Park (free), SFMOMA family workshops, and the Asian Art Museum's kids' programs in San Francisco. The Randall Museum in San Francisco also offers hands-on nature, arts, and science classes for this age group.",
      },
    },
  ],
};

// FAQPage JSON-LD for toddlers-2-5 guide. Targets "things to do with toddlers bay
// area" and "toddler activities san francisco" (DataForSEO: 0 rank, competitors #1-5).
// Venues and cities sourced from places.ts; no prices, hours, or ages fabricated.
const toddlersFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the best toddler activities in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Top Bay Area activities for toddlers (ages 2–5) include Bay Area Discovery Museum in Sausalito (outdoor tide pools and hands-on exhibits), Children's Fairyland in Oakland (pint-sized amusement park), Tilden Little Farm in Berkeley (free petting farm, open daily), La Petite Playhouse in Redwood City (large indoor play structure), and splash pads at Castro Valley Splash Park and Larkey Sprayground in Walnut Creek. Check each venue's website for current hours and admission.",
      },
    },
    {
      "@type": "Question",
      name: "Where can toddlers play indoors in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Indoor toddler play spaces in the Bay Area include Bay Area Discovery Museum (Sausalito — indoor and outdoor areas), La Petite Playhouse (Redwood City), WOW Kids Playground (San Jose), Lemon Tree Play Cafe (San Jose), Imagination City (San Jose), and KidTopia (San Jose). Many community recreation centers also offer toddler open-play and drop-in gym sessions — check local schedules.",
      },
    },
    {
      "@type": "Question",
      name: "Are there free activities for toddlers in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Free toddler-friendly activities in the Bay Area include Tilden Little Farm in Berkeley (free, open 365 days a year — bring celery and lettuce for the goats), all municipal playgrounds and inclusive Magical Bridge Playgrounds (Palo Alto, Sunnyvale, Mountain View), seasonal splash pads at 24th & York Mini Park in San Francisco and Castro Valley Splash Park, and free public library story-times throughout Santa Clara County, San Francisco, and the East Bay.",
      },
    },
    {
      "@type": "Question",
      name: "What stroller-friendly activities are available for toddlers in San Francisco?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Stroller-friendly San Francisco toddler activities include the Koret Children's Quarter playground in Golden Gate Park (flat paved paths), Yerba Buena Gardens Playground and Children's Garden, Crissy Field lawn areas, 24th & York Mini Park splash pad in the Mission, Children's Creativity Museum near Union Square, and the Exploratorium at Pier 15 (wide aisles, stroller parking at the entrance). Most Bay Area Discovery Museum trails in Sausalito are also stroller-accessible.",
      },
    },
  ],
};

// FAQPage JSON-LD for tweens-8-12 guide. Targets "things to do with tweens",
// "activities for 12 year old boys", "after school activities for 12 year olds"
// (all ranking pos 3–11 per GSC with low/no clicks — snippet is the bottleneck).
const tweensFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the best activities for tweens (ages 8–12) in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Top Bay Area activities for tweens include rock climbing at Berkeley Ironworks, Movement (Belmont, San Francisco, Sunnyvale), or Diablo Rock Gym; trampoline parks at Sky Zone Fremont and Dublin and House of Air at the Presidio; amusement parks at California's Great America (Santa Clara); laser tag at Laser Tagging Inc.; and adventure-park arcade experiences at Round1 in San Jose, Concord, and Hayward. For outdoor adventures, hiking Mount Diablo State Park or exploring Redwood Regional Park (Oakland) fits tweens well.",
      },
    },
    {
      "@type": "Question",
      name: "What after-school programs and classes are available for 8–12 year olds in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bay Area after-school programs for tweens include coding and STEM camps at iD Tech (Stanford campus), Code Ninjas (Cupertino, North San Jose, Fremont), and Galileo camps. Martial arts is offered widely, including programs in Berkeley and San Jose. For sports, fencing at Halberstadt Fencers Club (San Francisco) and climbing at Berkeley Ironworks both have structured youth tracks. The Tech Interactive (San Jose) runs ongoing design challenges and weekend workshops for this age group.",
      },
    },
    {
      "@type": "Question",
      name: "Where can tweens go with friends in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tween-friendly Bay Area group outings include bowling at Lucky Strike Alameda or Lucky Strike San Francisco; mini-golf at Stagecoach Greens (San Francisco) or Urban Putt San Jose; arcade-style entertainment at Round1 (San Jose, Concord, Hayward); and ice skating at Nazareth Ice Oasis (Fremont), Snoopy's Home Ice (Santa Rosa), or Oakland Ice Center. For outdoors, Roaring Camp Railroads in Felton and the Santa Cruz Beach Boardwalk (free admission, pay-per-ride) are popular tween destinations.",
      },
    },
  ],
};

// FAQPage JSON-LD for rainy-day guide. Targets "rainy day activities kids bay
// area" — competitors rank #1-2 on DataForSEO while we don't appear. Answers
// name venues + city + general category ONLY: no specific prices, hours,
// addresses, or free-admission windows (those weren't sourced from places.ts
// and age badly — an earlier draft cited a trampoline park that has since
// closed). Defer specifics to "check the venue's website."
const rainyDayFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the best rainy day activities for kids in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Top Bay Area rainy-day activities for kids include the Exploratorium in San Francisco (hands-on science), the Children's Discovery Museum of San Jose, the Bay Area Discovery Museum in Sausalito (great for younger children), the Children's Creativity Museum in San Francisco, The Tech Interactive in San Jose, and Chabot Space and Science Center in Oakland. For active kids, Sky Zone trampoline parks in Fremont and Dublin are indoors year-round. Check each venue's website for current hours and admission.",
      },
    },
    {
      "@type": "Question",
      name: "Are there free indoor activities for kids on rainy days in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Free or low-cost rainy-day options include public library story times and kids' programs (such as the San Francisco, Santa Clara County, and Oakland public library systems), the East Bay Depot for Creative Reuse in Oakland, and the Randall Museum in San Francisco. Hours and admission vary by location and season — check each venue's website for current details.",
      },
    },
    {
      "@type": "Question",
      name: "Where can toddlers go on rainy days in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The best rainy-day spots for Bay Area toddlers are the Bay Area Discovery Museum in Sausalito, the Children's Discovery Museum of San Jose, La Petite Playhouse in Redwood City, and Little Gym locations in Palo Alto, San Jose, and Danville. Many community recreation centers also offer indoor family swim times — check local schedules.",
      },
    },
    {
      "@type": "Question",
      name: "What indoor play spaces near San Francisco are good on rainy days?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Indoor play spaces near San Francisco include the Exploratorium and the Children's Creativity Museum, both in San Francisco. A short drive away, the Bay Area Discovery Museum in Sausalito and Chabot Space and Science Center in Oakland offer indoor exhibits. Check each venue's website for current hours and tickets.",
      },
    },
  ],
};

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: string; guideSlug: string }>;
}) {
  const { locale, guideSlug } = await params;

  if (!validGuides.includes(guideSlug as GuideSlug)) {
    notFound();
  }

  setRequestLocale(locale);

  const meta = guideMeta[guideSlug as GuideSlug];

  return (
    <>
      {guideSlug === "winter" && locale === "en" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(winterFaqJsonLd) }}
        />
      )}
      {guideSlug === "birthday-party" && locale === "en" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(birthdayPartyFaqJsonLd) }}
        />
      )}
      {guideSlug === "free" && locale === "en" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(freeFaqJsonLd) }}
        />
      )}
      {guideSlug === "family-favorites" && locale === "en" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(familyFavoritesFaqJsonLd) }}
        />
      )}
      {guideSlug === "babies-0-2" && locale === "en" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(babies02FaqJsonLd) }}
        />
      )}
      {guideSlug === "field-trips" && locale === "en" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(fieldTripsFaqJsonLd) }}
        />
      )}
      {guideSlug === "fall" && locale === "en" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(fallFaqJsonLd) }}
        />
      )}
      {guideSlug === "museums" && locale === "en" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(museumsFaqJsonLd) }}
        />
      )}
      {guideSlug === "indoor-playgrounds" && locale === "en" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(indoorPlaygroundsFaqJsonLd) }}
        />
      )}
      {guideSlug === "kids-5-8" && locale === "en" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(kids58FaqJsonLd) }}
        />
      )}
      {guideSlug === "rainy-day" && locale === "en" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rainyDayFaqJsonLd) }}
        />
      )}
      {guideSlug === "toddlers-2-5" && locale === "en" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(toddlersFaqJsonLd) }}
        />
      )}
      {guideSlug === "tweens-8-12" && locale === "en" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(tweensFaqJsonLd) }}
        />
      )}
      <GuideContent guideSlug={guideSlug as GuideSlug} meta={meta} />
    </>
  );
}
