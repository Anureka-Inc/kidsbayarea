"use client";

import { Fragment, useMemo } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Home, ChevronRight } from "lucide-react";
import { places, type AgeRange } from "@/data/places";
import PlaceCard from "@/components/PlaceCard";
import AmazonPicks from "@/components/AmazonPicks";

type GuideSlug =
  | "babies-0-2"
  | "toddlers-2-5"
  | "kids-5-8"
  | "tweens-8-12"
  | "rainy-day"
  | "family-favorites"
  | "birthday-party"
  | "free"
  | "indoor-playgrounds"
  | "museums"
  | "fall"
  | "field-trips"
  | "winter";

interface GuideMeta {
  titleEn: string;
  titleZh: string;
  descEn: string;
  descZh: string;
}

const guideAgeMap: Partial<Record<GuideSlug, AgeRange>> = {
  "babies-0-2": "0-2",
  "toddlers-2-5": "2-5",
  "kids-5-8": "5-8",
  "tweens-8-12": "8-12",
};

interface GuideContentProps {
  guideSlug: GuideSlug;
  meta: GuideMeta;
}

export default function GuideContent({ guideSlug, meta }: GuideContentProps) {
  const locale = useLocale();
  const title = locale === "zh" ? meta.titleZh : meta.titleEn;
  const description = locale === "zh" ? meta.descZh : meta.descEn;

  const filteredPlaces = useMemo(() => {
    let result = [...places];

    if (guideSlug === "winter") {
      result = result.filter((p) => p.tags.includes("winter"));
    } else if (guideSlug === "rainy-day") {
      result = result.filter(
        (p) => p.indoorOutdoor === "indoor" || p.indoorOutdoor === "both"
      );
    } else if (guideSlug === "family-favorites") {
      result = result.filter((p) => p.rating >= 4.5);
    } else if (guideSlug === "birthday-party") {
      result = result.filter((p) => p.tags.includes("birthday-party"));
    } else if (guideSlug === "free") {
      result = result.filter(
        (p) => p.priceLevel === "free" || p.tags.includes("free")
      );
    } else if (guideSlug === "field-trips") {
      result = result.filter((p) => p.tags.includes("field-trip") || p.tags.includes("museum"));
    } else if (guideSlug === "fall") {
      result = result.filter((p) => p.tags.includes("fall"));
    } else if (guideSlug === "museums") {
      result = result.filter((p) => p.tags.includes("museum"));
    } else if (guideSlug === "indoor-playgrounds") {
      result = result.filter(
        (p) =>
          p.tags.includes("indoor-playground") ||
          (p.tags.includes("playground") && p.indoorOutdoor === "indoor")
      );
    } else {
      const age = guideAgeMap[guideSlug];
      if (age) {
        result = result.filter(
          (p) => p.ageRange.includes(age) || p.ageRange.includes("all")
        );
      }
    }

    return result.sort((a, b) => b.rating - a.rating);
  }, [guideSlug]);

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<string, typeof filteredPlaces>();
    for (const place of filteredPlaces) {
      const existing = map.get(place.category) || [];
      existing.push(place);
      map.set(place.category, existing);
    }
    return map;
  }, [filteredPlaces]);

  const categoryEmojis: Record<string, string> = {
    play: "🎪",
    eat: "🍽️",
    learn: "📚",
    shop: "🛍️",
    explore: "🧭",
  };

  const categoryLabels: Record<string, { en: string; zh: string }> = {
    play: { en: "Play & Activities", zh: "玩乐活动" },
    eat: { en: "Kid-Friendly Restaurants", zh: "亲子餐厅" },
    learn: { en: "Classes & Education", zh: "课程教育" },
    shop: { en: "Family Shopping", zh: "亲子购物" },
    explore: { en: "Day Trips & Adventures", zh: "出行探险" },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
        <Link
          href="/"
          className="transition-colors hover:text-teal-600 dark:hover:text-teal-400"
        >
          <Home className="h-4 w-4" />
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <span className="text-gray-900 dark:text-white">
          {locale === "zh" ? "指南" : "Guides"}
        </span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          {title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {description}
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {filteredPlaces.length} {locale === "zh" ? "个推荐" : "recommendations"}
        </p>
      </div>

      {/* Grouped results */}
      {Array.from(grouped.entries()).map(([category, categoryPlaces], groupIndex) => (
        <Fragment key={category}>
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
            <span>{categoryEmojis[category]}</span>
            {locale === "zh"
              ? categoryLabels[category]?.zh
              : categoryLabels[category]?.en}
            <span className="text-sm font-normal text-gray-400">
              ({categoryPlaces.length})
            </span>
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryPlaces.map((p) => (
              <PlaceCard key={p.slug} place={p} />
            ))}
          </div>
        </section>
        {/* Picks sit after the first group of places, where readers are still
            planning — at the page bottom almost nobody saw them (GA4: ~19% of
            views scroll to 90%, 0 Amazon clicks in 90 days). */}
        {groupIndex === 0 && (
          <AmazonPicks contextKey={guideSlug} placement="guide-after-first-group" className="mb-10" />
        )}
        </Fragment>
      ))}

      {/* Birthday party FAQ — targets "birthday party places for kids bay area" */}
      {guideSlug === "birthday-party" && locale === "en" && (
        <section className="mt-12 rounded-2xl border border-teal-100 bg-teal-50 p-6 dark:border-teal-800 dark:bg-teal-900/20">
          <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
            Kids Birthday Party FAQ
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What are the best birthday party places for kids in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Popular Bay Area kids&apos; birthday party venues include Sky Zone trampoline parks in Fremont and Dublin (Sky Zone Dublin has private party rooms), Altitude Trampoline Park in South San Jose, Ninja Republic in San Mateo (American Ninja Warrior-style obstacles), Round1 entertainment centers in Concord, Hayward, and San Jose (bowling, arcade games, karaoke, and party rooms), Lucky Strike San Jose (formerly Bowlero; 59 lanes with bumper bowling), and Laser Tagging Inc. in Newark (a two-story laser tag arena). Check each venue&apos;s website for current party packages and availability.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Where can toddlers have birthday parties in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Toddler-friendly Bay Area birthday party venues include La Petite Playhouse in Redwood City (10,000 sq ft indoor playground with separate baby and toddler areas), Little Oceanauts in San Francisco (ocean-themed playground and party venue with a separate area for tots under 2), Whirlygig in San Jose (play space for ages 8 weeks to 8 years that hosts 2-hour private parties), and WOW Kids Playground in San Francisco (indoor playground designed for younger children). Party rooms at popular toddler venues fill up quickly, so book ahead.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Are there outdoor birthday party options for kids in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                For an outdoor celebration, consider Pixieland Amusement Park in Concord (free admission with pay-per-ride tickets, rides sized for ages 1 to 10), Children&apos;s Fairyland in Oakland (storybook theme park on Lake Merritt with puppet shows and gentle rides), the Oakland Zoo, or a picnic at Coyote Hills Regional Park in Fremont (flat trails and a marsh boardwalk). Many city and regional parks take picnic-area reservations; check the local parks department for availability and fees.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What are unique birthday party ideas for kids in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                For something different, try a climbing party at Bridges Rock Gym in El Cerrito (weekend birthday parties, kids programs from age 5), indoor mini golf at Urban Putt in downtown San Jose (families welcome before 8pm) or Holey Moley in San Francisco (kids birthday packages; under-13s welcome with an adult before 8pm), teppanyaki theater at Benihana in Cupertino (mention the birthday for a special treat), or bumper bowling at Lucky Strike Alameda. Check each venue&apos;s website for current packages.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Free activities FAQ — targets "free things to do with kids bay area" */}
      {guideSlug === "free" && locale === "en" && (
        <section className="mt-12 rounded-2xl border border-teal-100 bg-teal-50 p-6 dark:border-teal-800 dark:bg-teal-900/20">
          <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
            Free Things to Do with Kids FAQ
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What are the best free things to do with kids in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Top free Bay Area activities for kids include Tilden Little Farm in Berkeley (free petting farm; bring celery and lettuce for the animals), Adventure Playground at the Berkeley Marina (kids build forts with real hammers and saws under supervision), the Randall Museum in San Francisco (free family museum with live animals and a woodworking shop), Magical Bridge Playground in Palo Alto (inclusive playground designed for children of all abilities), Mia&apos;s Dream Come True Playground in Hayward (1-acre all-abilities playground), and Koret Children&apos;s Quarter in Golden Gate Park (the oldest public children&apos;s playground in the US, with concrete slides built into the hill).
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Are there free splash pads for kids in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Yes. Free Bay Area splash pads include Emerald Glen Park Splash Pad in Dublin (open Memorial Day through Labor Day), Meadow Homes Spray Park in Concord (pirate-themed, open Memorial Day through September), Ortega Park Splash Pad in Sunnyvale (pirate-themed and great for toddlers), and the 24th &amp; York Mini Park splash pad in San Francisco&apos;s Mission District. Splash pads run seasonally, so check city parks websites for current hours.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What free outdoor activities are there for kids in San Francisco?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Free San Francisco outdoor picks include Crissy Field (waterfront promenade with a sandy beach, kite flying, and Golden Gate Bridge views), Baker Beach (stick to the family-friendly south end with picnic tables and restrooms; strong riptides make swimming dangerous), Koret Children&apos;s Quarter in Golden Gate Park, and Yerba Buena Gardens Playground atop the Moscone Center. Across the bridge, Battery Spencer in the Marin Headlands is a free quarter-mile walk to classic Golden Gate views.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What are free activities for kids in the East Bay?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Free East Bay picks include Tilden Little Farm in Berkeley (free admission, open daily 8:30am to 4pm), Adventure Playground at the Berkeley Marina (open weekends during the school year and daily in summer; closed-toe shoes required), Redwood Regional Park in Oakland (the first mile of the Stream Trail is paved and stroller-friendly, with a playground at Canyon Meadow), Mia&apos;s Dream Come True Playground in Hayward, and Pixieland Amusement Park in Concord (free admission; rides are pay-per-ticket).
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Family favorites FAQ — targets "bay area family attractions" / "bay area family activities" */}
      {guideSlug === "family-favorites" && locale === "en" && (
        <section className="mt-12 rounded-2xl border border-teal-100 bg-teal-50 p-6 dark:border-teal-800 dark:bg-teal-900/20">
          <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
            Bay Area Family Attractions FAQ
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What are the top-rated family attractions in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                The Bay Area&apos;s most-loved family attractions include the <strong>Exploratorium</strong> at Pier 15 in San Francisco (hands-on science exhibits), the <strong>California Academy of Sciences</strong> in Golden Gate Park (planetarium, rainforest, and aquarium under one roof), the <strong>Oakland Zoo</strong> in Knowland Park, the <strong>Bay Area Discovery Museum</strong> in Sausalito (indoor and outdoor exhibits for younger children), and <strong>Magical Bridge Playground</strong> in Palo Alto (inclusive play space designed for children of all abilities). Check each venue&apos;s website for current hours and admission.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Which Bay Area family activities are good for all ages?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                All-ages Bay Area favorites include the <strong>Exploratorium</strong> in San Francisco, <strong>Tilden Regional Park</strong> in Berkeley (steam trains, a free petting farm, and nature trails), the <strong>Santa Cruz Beach Boardwalk</strong> (free park entry, pay-per-ride), <strong>Angel Island State Park</strong> (ferry, hiking, and bay views), and <strong>Roaring Camp Railroads</strong> in Felton (steam train through old-growth redwoods). Check each venue&apos;s website for current hours and admission.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What are the best free Bay Area family activities?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Free Bay Area family highlights include <strong>Tilden Little Farm</strong> in Berkeley (free admission), <strong>Magical Bridge Playground</strong> in Palo Alto (free entry), <strong>Crissy Field</strong> and <strong>Baker Beach</strong> in San Francisco (National Park Service beaches), and the <strong>de Young Museum</strong> in Golden Gate Park (free for children 17 and under). Public library systems throughout San Francisco, the East Bay, and Santa Clara County offer free family story times and maker programs as well.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What Bay Area family attractions make great weekend day trips?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Top Bay Area family day trips include the <strong>Monterey Bay Aquarium</strong> (about two hours south of San Francisco), the <strong>Santa Cruz Beach Boardwalk</strong> (ocean-side rides and free beach), <strong>Roaring Camp Railroads</strong> in Felton (steam train through redwoods), <strong>Muir Woods National Monument</strong> in Mill Valley (old-growth redwoods just north of San Francisco), and <strong>Gilroy Gardens Family Theme Park</strong>. Check each venue&apos;s website for current hours, tickets, and parking reservation requirements.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Field trips FAQ — targets "bay area field trip ideas" */}
      {guideSlug === "field-trips" && locale === "en" && (
        <section className="mt-12 rounded-2xl border border-teal-100 bg-teal-50 p-6 dark:border-teal-800 dark:bg-teal-900/20">
          <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
            Bay Area Field Trip FAQ
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What are the best field trip ideas in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Strong Bay Area field trip picks span four themes. Science: the Exploratorium on Pier 15, the California Academy of Sciences in Golden Gate Park, The Tech Interactive in San Jose, Chabot Space &amp; Science Center in Oakland, and the Lawrence Hall of Science in Berkeley. History: John Muir National Historic Site in Martinez, Sanchez Adobe Historic Site in Pacifica, Fort Point under the Golden Gate Bridge, and Black Diamond Mines in Antioch. Farms: Ardenwood Historic Farm in Fremont, Hidden Villa in Los Altos Hills, and Slide Ranch near Muir Beach. Nature: tide pools at Fitzgerald Marine Reserve and rescued animals at Lindsay Wildlife Experience. For school or group visits, contact each venue in advance to arrange a booking.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Which Bay Area farms are good for field trips?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Ardenwood Historic Farm in Fremont is a working Victorian-era farm with horse-drawn train rides and seasonal programs such as corn harvest and wool spinning. Hidden Villa in Los Altos Hills is a 1,600-acre organic farm and wilderness preserve. At Slide Ranch near Muir Beach, kids can milk goats, collect eggs, and explore tidepools. Loma Vista Farm in Vallejo is an educational farm with hands-on programs on sustainable farming; book farm tours in advance. Deer Hollow Farm in Los Altos and Emma Prusch Farm Park in San Jose are free to visit.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Where can kids learn about Bay Area history on a field trip?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                John Muir National Historic Site in Martinez has free admission to the naturalist&apos;s Victorian mansion, orchards, and a 20-minute film, plus Junior Ranger booklets. Sanchez Adobe Historic Site in Pacifica spans the Ohlone, Spanish, and Mexican eras, with hands-on activities like grinding corn, making candles, and creating adobe bricks. Fort Point is a Civil War-era fort under the Golden Gate Bridge with free ranger-led tours on weekends. Black Diamond Mines Regional Preserve in Antioch explores 19th-century coal mining, with seasonal guided mine tunnel tours, and San Francisco Maritime National Historical Park has a free Maritime Museum.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What are free field trip options in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Free options include the Randall Museum in San Francisco (live animals, art studios, and a woodworking shop), John Muir National Historic Site, Sanchez Adobe Historic Site, Fort Point National Historic Site, the San Francisco Maritime National Historical Park museum, Deer Hollow Farm, Emma Prusch Farm Park, and self-guided visits to Slide Ranch. Fitzgerald Marine Reserve in Moss Beach is free; visit at a zero or minus tide, when rangers and docents are often on site. Edgewood Park in Redwood City offers free docent-led wildflower hikes from March through May.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Fall FAQ — targets "pumpkin patches bay area" / "fall activities for kids" */}
      {guideSlug === "fall" && locale === "en" && (
        <section className="mt-12 rounded-2xl border border-teal-100 bg-teal-50 p-6 dark:border-teal-800 dark:bg-teal-900/20">
          <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
            Bay Area Fall &amp; Pumpkin Patch FAQ
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Where are the best pumpkin patches for kids in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Half Moon Bay is the Bay Area&apos;s pumpkin patch capital: farms along Highway 92 such as Lemos Farm offer hay rides, corn mazes, pony rides, and pumpkin picking, and the annual Art &amp; Pumpkin Festival draws thousands. Lemos Farm also has a train ride, a petting zoo with baby goats and bunnies, and a farm slide. In the East Bay, Three Nunns Farm in Brentwood has pumpkins in October, free tractor rides, and a corn maze. In San Jose, Emma Prusch Farm Park hosts an annual pumpkin festival in the fall. Go on a weekday if you can, because Highway 92 gets extremely congested on fall weekends.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Where can kids go apple picking or see a harvest festival near the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Gizdich Ranch in Watsonville has U-pick apples from September through November, antique apple press demonstrations on fall weekends, and a Pie Shop with homemade pies. Ardenwood Historic Farm in Fremont runs seasonal programs such as the corn harvest and a Harvest Festival, plus horse-drawn train rides. Tilden Nature Area in Berkeley offers naturalist-led programs that include apple cider pressing, and its weekend programs are free and drop-in.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Where can I buy Halloween costumes for kids in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                House of Humor in Redwood City is Northern California&apos;s largest costume retailer, with costumes for toddlers through adults; go early in October for the best selection. Affordable Treasures in Los Gatos carries an extensive costume selection along with party supplies. For DIY costumes, Mendel&apos;s Far Out Fabrics on Haight Street in San Francisco sells faux fur, face paint, masks, and costume-making supplies.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What other fall activities can Bay Area families do?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Fall is monarch butterfly season at Natural Bridges State Beach in Santa Cruz, California&apos;s only State Monarch Butterfly Preserve: the butterflies arrive October through January, peaking in November and December, and the boardwalk is stroller and wheelchair accessible. Winter Lodge in Palo Alto, the only permanent outdoor ice skating rink west of the Sierras, opens in mid-October and runs through mid-April, with group classes for kids 5 and up.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Museums FAQ — targets "children's museums bay area" / "science museums for kids" */}
      {guideSlug === "museums" && locale === "en" && (
        <section className="mt-12 rounded-2xl border border-teal-100 bg-teal-50 p-6 dark:border-teal-800 dark:bg-teal-900/20">
          <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
            Bay Area Children&apos;s Museums FAQ
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What are the best children&apos;s museums in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Top Bay Area children&apos;s museums include the Children&apos;s Discovery Museum of San Jose (the largest children&apos;s museum west of the Mississippi, with water play, a real fire truck to climb, and a bubbles exhibit), the Bay Area Discovery Museum in Sausalito (hands-on exhibits at the foot of the Golden Gate Bridge, daily Maker Labs, and the outdoor Lookout Cove with tide pools and caves), the Children&apos;s Creativity Museum in San Francisco&apos;s Yerba Buena Gardens (kids make animations and music videos, plus a historic carousel), and MOCHA - Museum of Children&apos;s Art in Old Oakland (open studios and Saturday drop-in sessions). Check each museum&apos;s website for current hours and admission.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What are the best science museums for kids in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                The Bay Area&apos;s best science museums for kids are the Exploratorium on San Francisco&apos;s Pier 15 (over 650 interactive exhibits, plus the Tactile Dome for older kids), the California Academy of Sciences in Golden Gate Park (an aquarium, planetarium, rainforest dome, and natural history museum under one living roof), The Tech Interactive in San Jose (kids design roller coasters, code robots, and explore biotech), Chabot Space &amp; Science Center in the Oakland Hills (planetarium shows and real telescopes, with Friday and Saturday night viewings), and the Lawrence Hall of Science in Berkeley (hands-on exhibits, a planetarium, and an outdoor science park with Bay views).
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Which Bay Area museums are best for toddlers and preschoolers?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                For toddlers and preschoolers, try the Children&apos;s Discovery Museum of San Jose (bring extra clothes for the water play area), the Bay Area Discovery Museum in Sausalito (indoor and outdoor exhibits designed for young children; weekday mornings are less crowded), the Randall Museum in San Francisco (a live animal room with snakes, owls, and rodents), and the Lawrence Hall of Science in Berkeley. The Children&apos;s Creativity Museum in Yerba Buena Gardens also welcomes kids from age 2.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Are there free museums or free days for kids in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Yes. The Randall Museum in San Francisco is free, with live animals, art studios, and a woodworking shop. The Maritime Museum and Visitor Center at San Francisco Maritime National Historical Park are free, and Fort Point National Historic Site under the Golden Gate Bridge has free admission with ranger-led tours on weekends. Several museums also offer resident free days: the Exploratorium on the first Wednesday for SF residents, the Children&apos;s Discovery Museum of San Jose on the first Wednesday for San Jose residents, and the California Academy of Sciences quarterly for SF residents. Confirm free-day dates on each museum&apos;s website.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Indoor playgrounds FAQ — targets "best indoor playgrounds bay area" / "indoor play spaces for kids" */}
      {guideSlug === "indoor-playgrounds" && locale === "en" && (
        <section className="mt-12 rounded-2xl border border-teal-100 bg-teal-50 p-6 dark:border-teal-800 dark:bg-teal-900/20">
          <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
            Indoor Playgrounds FAQ
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What are the best indoor playgrounds in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Top picks include <strong>WOW Kids Playground</strong> in San Jose (large multi-level soft-play structure), <strong>Lemon Tree Play Cafe</strong> in San Jose (indoor play with a cafe for parents), <strong>KidTopia</strong> in Fremont, <strong>La Petite Playhouse</strong> in Redwood City, and the <strong>Exploratorium</strong> at Pier 15 in San Francisco (250+ hands-on science play exhibits). For trampoline-style play, <strong>Sky Zone</strong> in Fremont and Dublin and <strong>House of Air</strong> at the Presidio in San Francisco are popular choices. Check each venue&apos;s website for current hours and admission.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Which indoor play spaces are best for toddlers in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Best for toddlers: <strong>Bay Area Discovery Museum</strong> in Sausalito, <strong>La Petite Playhouse</strong> in Redwood City, <strong>WOW Kids Playground</strong> in San Jose (dedicated toddler zone), <strong>Lemon Tree Play Cafe</strong> in San Jose, and <strong>KidTopia</strong> in Fremont. The <strong>Children&apos;s Discovery Museum of San Jose</strong> also has a toddler-friendly section. Check each venue&apos;s website for age guidelines.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Are there free or low-cost indoor play options for kids in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Free and low-cost options include public library story times and drop-in play mornings (San Francisco, Oakland, Santa Clara County), the <strong>Randall Museum</strong> in San Francisco (free general admission), <strong>East Bay Depot for Creative Reuse</strong> in Oakland, and free family art Saturdays at the <strong>de Young Museum</strong> in Golden Gate Park. Many city recreation centers also run subsidized drop-in gym sessions for families — check local parks and recreation departments for schedules.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What indoor play and trampoline parks are near San Jose?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                South Bay indoor play venues near San Jose include <strong>WOW Kids Playground</strong>, <strong>Lemon Tree Play Cafe</strong>, <strong>KidTopia</strong> (Fremont), <strong>Altitude Trampoline Park</strong> San Jose, and the <strong>Children&apos;s Discovery Museum of San Jose</strong>. For STEM-based indoor play, <strong>The Tech Interactive</strong> in downtown San Jose offers hands-on robotics, AI, and design exhibits for kids of all ages.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Kids 5-8 FAQ — targets "indoor activities for kids bay area" / "things to do with kids bay area" */}
      {guideSlug === "kids-5-8" && locale === "en" && (
        <section className="mt-12 rounded-2xl border border-teal-100 bg-teal-50 p-6 dark:border-teal-800 dark:bg-teal-900/20">
          <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
            Kids 5–8 Activities FAQ
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What are the best indoor activities for kids ages 5–8 in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Top indoor picks include the <strong>Exploratorium</strong> at Pier 15 in San Francisco (250+ hands-on science exhibits), <strong>Children&apos;s Discovery Museum of San Jose</strong> (three floors of interactive exhibits), <strong>The Tech Interactive</strong> in San Jose (robotics, AI, and design labs), <strong>Lawrence Hall of Science</strong> in Berkeley (hilltop science center with hands-on exhibits), <strong>Bay Area Discovery Museum</strong> in Sausalito, and <strong>Children&apos;s Creativity Museum</strong> in San Francisco. Check each venue&apos;s website for current hours and admission.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What outdoor adventures are good for kids ages 5–8 in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Great outdoor options include <strong>Tilden Park Steam Trains</strong> in Berkeley, <strong>Tilden Little Farm</strong> (free petting farm, open daily), <strong>Adventure Playground</strong> at the Berkeley Marina (build-your-own structures from scrap lumber — unique to the region), the 1-mile Main Trail loop at <strong>Muir Woods National Monument</strong>, <strong>Shoreline Park</strong> trails in Mountain View, and the <strong>Oakland Zoo</strong>. <strong>Magical Bridge Playgrounds</strong> in Palo Alto, Sunnyvale, and Mountain View are designed for all abilities.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What STEM classes are available for 5–8 year olds in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Bay Area STEM programs for this age group include <strong>Code Ninjas</strong> (Cupertino, North San Jose, Fremont), <strong>Galileo Innovation Camps</strong> (multiple Bay Area locations), <strong>iD Tech</strong> beginner coding courses (Stanford campus), <strong>Lawrence Hall of Science</strong> after-school clubs (Berkeley), and workshops at <strong>The Tech Interactive</strong> (San Jose). Many public library systems — including San Francisco, Santa Clara County, and Oakland — run free STEM Saturdays for this age group.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Where can kids ages 5–8 take art and music classes in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Art and music programs include <strong>Music Together</strong> studios (Palo Alto, Menlo Park, Sunnyvale, and East Bay), <strong>Studio4Art</strong> in San Jose, <strong>Color Me Mine</strong> ceramic painting (multiple Bay Area locations), the <strong>de Young Museum</strong>&apos;s family art Saturdays in Golden Gate Park (free), <strong>SFMOMA</strong> family workshops, the <strong>Asian Art Museum</strong>&apos;s kids&apos; programs, and the <strong>Randall Museum</strong> in San Francisco (hands-on nature, arts, and science classes).
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Toddlers FAQ — targets "things to do with toddlers bay area" / "toddler activities san francisco" */}
      {guideSlug === "toddlers-2-5" && locale === "en" && (
        <section className="mt-12 rounded-2xl border border-teal-100 bg-teal-50 p-6 dark:border-teal-800 dark:bg-teal-900/20">
          <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
            Toddler Activities FAQ
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What are the best toddler activities in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Top picks include the <strong>Bay Area Discovery Museum</strong> in Sausalito (outdoor tide pools and hands-on exhibits), <strong>Children&apos;s Fairyland</strong> in Oakland (pint-sized amusement park), <strong>Tilden Little Farm</strong> in Berkeley (free petting farm, open daily), <strong>La Petite Playhouse</strong> in Redwood City (large indoor play structure), and splash pads at <strong>Castro Valley Splash Park</strong> and <strong>Larkey Sprayground</strong> in Walnut Creek. Check each venue&apos;s website for current hours and admission.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Where can toddlers play indoors in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Indoor toddler play spaces include <strong>Bay Area Discovery Museum</strong> (Sausalito — indoor and outdoor areas), <strong>La Petite Playhouse</strong> (Redwood City), <strong>WOW Kids Playground</strong> (San Jose), <strong>Lemon Tree Play Cafe</strong> (San Jose), <strong>Imagination City</strong> (San Jose), and <strong>KidTopia</strong> (San Jose). Many community recreation centers also offer toddler open-play and drop-in gym sessions — check local schedules.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Are there free activities for toddlers in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Yes. Free toddler-friendly activities include <strong>Tilden Little Farm</strong> in Berkeley (free, open 365 days a year — bring celery and lettuce for the goats), all municipal playgrounds and inclusive <strong>Magical Bridge Playgrounds</strong> (Palo Alto, Sunnyvale, Mountain View), seasonal splash pads at <strong>24th &amp; York Mini Park</strong> in San Francisco and <strong>Castro Valley Splash Park</strong>, and free public library story-times throughout Santa Clara County, San Francisco, and the East Bay.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What stroller-friendly activities are available for toddlers in San Francisco?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Stroller-friendly San Francisco toddler activities include the <strong>Koret Children&apos;s Quarter</strong> playground in Golden Gate Park (flat paved paths), <strong>Yerba Buena Gardens Playground</strong>, <strong>Crissy Field</strong> lawn areas, <strong>24th &amp; York Mini Park</strong> splash pad in the Mission, <strong>Children&apos;s Creativity Museum</strong> near Union Square, and the <strong>Exploratorium</strong> at Pier 15. Most Bay Area Discovery Museum trails in Sausalito are also stroller-accessible.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Tweens FAQ — targets "things to do with tweens" / "activities for 12 year olds" */}
      {guideSlug === "tweens-8-12" && locale === "en" && (
        <section className="mt-12 rounded-2xl border border-teal-100 bg-teal-50 p-6 dark:border-teal-800 dark:bg-teal-900/20">
          <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
            Tweens Activities FAQ
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What are the best activities for tweens (ages 8–12) in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Top picks for tweens include rock climbing at <strong>Berkeley Ironworks</strong>, <strong>Movement</strong> (Belmont, San Francisco, Sunnyvale), or <strong>Diablo Rock Gym</strong>; trampoline parks at <strong>Sky Zone Fremont</strong> and Dublin and <strong>House of Air</strong> at the Presidio; amusement parks at <strong>California&apos;s Great America</strong> (Santa Clara); laser tag at <strong>Laser Tagging Inc.</strong>; and arcade experiences at <strong>Round1</strong> in San Jose, Concord, and Hayward. For outdoor adventures, hiking Mount Diablo State Park or exploring Redwood Regional Park (Oakland) is ideal for tweens.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What after-school programs are available for 8–12 year olds in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Bay Area after-school programs for tweens include coding and STEM at iD Tech (Stanford campus), Code Ninjas (Cupertino, North San Jose, Fremont), and Galileo camps. Fencing at <strong>Halberstadt Fencers Club</strong> (San Francisco) and climbing at <strong>Berkeley Ironworks</strong> both have structured youth tracks. <strong>The Tech Interactive</strong> (San Jose) runs ongoing design challenges and weekend workshops for ages 8–12.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Where can tweens go with friends in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Tween group outings: bowling at <strong>Lucky Strike Alameda</strong> or <strong>Lucky Strike San Francisco</strong>; mini-golf at <strong>Stagecoach Greens</strong> (San Francisco) or <strong>Urban Putt</strong> San Jose; arcade experiences at <strong>Round1</strong> (San Jose, Concord, Hayward); and ice skating at <strong>Nazareth Ice Oasis</strong> (Fremont), <strong>Snoopy&apos;s Home Ice</strong> (Santa Rosa), or <strong>Oakland Ice Center</strong>. The <strong>Santa Cruz Beach Boardwalk</strong> (free admission, pay-per-ride) and <strong>Roaring Camp Railroads</strong> in Felton are popular tween destinations.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Rainy-day FAQ — renders as readable HTML for GEO citability */}
      {guideSlug === "rainy-day" && locale === "en" && (
        <section className="mt-12 rounded-2xl border border-teal-100 bg-teal-50 p-6 dark:border-teal-800 dark:bg-teal-900/20">
          <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
            Rainy Day Activities FAQ
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What are the best rainy day activities for kids in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Top picks include the <strong>Exploratorium</strong> in San Francisco (hands-on science), the <strong>Children&apos;s Discovery Museum of San Jose</strong>, the <strong>Bay Area Discovery Museum</strong> in Sausalito (great for younger children), the <strong>Children&apos;s Creativity Museum</strong> in San Francisco, <strong>The Tech Interactive</strong> in San Jose, and <strong>Chabot Space and Science Center</strong> in Oakland. <strong>Sky Zone</strong> trampoline parks in Fremont and Dublin are indoors year-round. Check each venue&apos;s website for current hours and admission.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Are there free indoor activities for kids on rainy days?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Yes. Free or low-cost options include public library story times and kids&apos; programs (such as the San Francisco, Santa Clara County, and Oakland public library systems), the <strong>East Bay Depot for Creative Reuse</strong> in Oakland, and the <strong>Randall Museum</strong> in San Francisco. Hours and admission vary by location and season — check each venue&apos;s website for current details.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Where can toddlers go on rainy days in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Best rainy day spots for toddlers: the <strong>Bay Area Discovery Museum</strong> in Sausalito, the <strong>Children&apos;s Discovery Museum of San Jose</strong>, <strong>La Petite Playhouse</strong> in Redwood City, and <strong>Little Gym</strong> locations in Palo Alto, San Jose, and Danville. Many community recreation centers also offer indoor family swim times — check local schedules.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What indoor play spaces near San Francisco are open on rainy days?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Near SF: the <strong>Exploratorium</strong> and the <strong>Children&apos;s Creativity Museum</strong>, both in San Francisco. A short drive away, the <strong>Bay Area Discovery Museum</strong> in Sausalito and <strong>Chabot Space and Science Center</strong> in Oakland offer indoor exhibits. Check each venue&apos;s website for current hours and tickets.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Bay Area Winter Activities FAQ — Targets "winter activities for kids bay area" / "ice skating bay area" — seasonal peak Nov–Jan. */}
      {guideSlug === "winter" && locale === "en" && (
        <section className="mt-12 rounded-2xl border border-teal-100 bg-teal-50 p-6 dark:border-teal-800 dark:bg-teal-900/20">
          <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
            Bay Area Winter Activities FAQ
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Where can kids go ice skating in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Winter Lodge in Palo Alto is the only permanent outdoor ice skating rink west of the Sierras, open mid-October through mid-April with twinkling lights. Year-round indoor rinks include Oakland Ice Center in downtown Oakland (two rinks, classes for kids 3 and up, and skating aids for beginners), Sharks Ice at San Jose (six NHL-sized rinks, the largest ice rink facility west of the Mississippi), Sharks Ice at Fremont, and Nazareth Ice Oasis in San Mateo&apos;s Bridgepointe Shopping Center. In Santa Rosa, Snoopy&apos;s Home Ice was built by Peanuts creator Charles Schulz in 1969 and has the Warm Puppy Cafe rink-side. Check each rink&apos;s website for public session times.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Where can families see elephant seals and whales in winter?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Elephant seals breed at Año Nuevo State Park in Pescadero from December to March, and Point Reyes National Seashore has elephant seal viewing from December through March. Whale watching season runs December through May: Point Reyes Lighthouse is one of the best whale watching spots on the California coast (its 308 steps are not suitable for strollers), and you can also look for passing whales from Pigeon Point Lighthouse and Muir Beach Overlook. Dress warmly, because the coast is windy and cold.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What nature activities are best in the Bay Area in winter?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Monarch butterflies stay at Natural Bridges State Beach in Santa Cruz through January, with the peak in November and December. At Samuel P. Taylor State Park, kids can spot spawning salmon in Lagunitas Creek during winter. Palo Alto Baylands is best at high tide in winter for migratory birds. Winter rains also bring the waterfalls to life: the Waterfall Loop at Uvas Canyon County Park passes five waterfalls (reservation required), Cascade Falls in Fairfax is best in winter and early spring, and Tiptoe Falls at Portola Redwoods State Park is best in winter and spring.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Are there holiday train rides for kids in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Roaring Camp Railroads in Felton runs historic narrow-gauge steam trains through ancient redwood forests, and its special holiday trains are seasonal favorites that sell out fast, so book early. Check Roaring Camp&apos;s website for this season&apos;s holiday train dates.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Cross-link to other guides */}

      <section className="mt-12 rounded-2xl border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
        <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
          {locale === "zh" ? "更多指南" : "More Guides"}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {(
            [
              { slug: "babies-0-2", label: "👶 0-2", zhLabel: "👶 0-2岁" },
              { slug: "toddlers-2-5", label: "🧒 2-5", zhLabel: "🧒 2-5岁" },
              { slug: "kids-5-8", label: "🎒 5-8", zhLabel: "🎒 5-8岁" },
              { slug: "tweens-8-12", label: "🧑 8-12", zhLabel: "🧑 8-12岁" },
              { slug: "rainy-day", label: "🌧️ Rainy Day", zhLabel: "🌧️ 雨天" },
              { slug: "family-favorites", label: "⭐ Top Rated", zhLabel: "⭐ 最佳" },
              { slug: "museums", label: "🏛️ Museums", zhLabel: "🏛️ 博物馆" },
              { slug: "fall", label: "🎃 Fall & Pumpkins", zhLabel: "🎃 秋季南瓜田" },
              { slug: "field-trips", label: "🚌 Field Trips", zhLabel: "🚌 校外参观" },
              { slug: "indoor-playgrounds", label: "🧸 Indoor Play", zhLabel: "🧸 室内游乐" },
              { slug: "free", label: "🆓 Free", zhLabel: "🆓 免费" },
              { slug: "birthday-party", label: "🎂 Birthdays", zhLabel: "🎂 生日派对" },
              { slug: "winter", label: "❄️ Winter", zhLabel: "❄️ 冬季活动" },
            ] as const
          )
            .filter((g) => g.slug !== guideSlug)
            .map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-sm font-medium text-gray-700 transition-all hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-teal-600 dark:hover:bg-teal-900/30"
              >
                {locale === "zh" ? g.zhLabel : g.label}
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
