"use client";

import { useMemo } from "react";
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
  | "indoor-playgrounds";

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

    if (guideSlug === "rainy-day") {
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
      {Array.from(grouped.entries()).map(([category, categoryPlaces]) => (
        <section key={category} className="mb-10">
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
      ))}

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
                Top picks for tweens include rock climbing at <strong>Berkeley Ironworks</strong>, <strong>Planet Granite</strong> (Belmont, San Francisco, Sunnyvale), or <strong>Diablo Rock Gym</strong>; trampoline parks at <strong>Sky Zone Fremont</strong> and Dublin and <strong>House of Air</strong> at the Presidio; amusement parks at <strong>California&apos;s Great America</strong> (Santa Clara); laser tag at <strong>Laser Tagging Inc.</strong>; and arcade experiences at <strong>Round1</strong> in San Jose, Concord, and Hayward. For outdoor adventures, hiking Mount Diablo State Park or exploring Redwood Regional Park (Oakland) is ideal for tweens.
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
                Top Bay Area kids&apos; birthday party venues include <strong>Sky Zone</strong> trampoline parks in Fremont and Dublin (private party rooms, jump packages), <strong>Urban Putt</strong> in San Jose (indoor mini-golf with party dining), <strong>La Petite Playhouse</strong> in Redwood City (indoor playground private party packages for ages 0–10), <strong>Round1</strong> entertainment centers in San Jose, Concord, and Hayward (bowling, arcade, karaoke), and <strong>Children&apos;s Fairyland</strong> in Oakland (classic storybook amusement park for toddlers and young kids). Check each venue&apos;s website for current party packages and availability.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Where can toddlers have birthday parties in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Birthday party venues best suited for toddlers (ages 1–4) in the Bay Area include <strong>La Petite Playhouse</strong> in Redwood City (soft-play indoor playground with a toddler section), <strong>WOW Kids Playground</strong> in San Jose (dedicated toddler zone), <strong>Children&apos;s Fairyland</strong> in Oakland (storybook park for young children), and <strong>Bay Area Discovery Museum</strong> in Sausalito (indoor and outdoor play areas). Check each venue&apos;s website for party booking details.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Are there outdoor birthday party venues for kids in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Bay Area outdoor kids&apos; party options include municipal park picnic areas (reservable through city parks departments in San Francisco, Oakland, San Jose, and most Bay Area cities), <strong>Oakland Zoo</strong> (birthday party packages available), and <strong>Roaring Camp Railroads</strong> in Felton (private event rail excursions). Many Bay Area parks have free-use picnic areas — check local city parks and recreation websites for reservation details and fees.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What are unique birthday party ideas for kids in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                For a one-of-a-kind Bay Area birthday, consider <strong>Berkeley Ironworks</strong> or <strong>Planet Granite</strong> (climbing gym birthday parties for active older kids), <strong>Chabot Space and Science Center</strong> in Oakland (sleepover and party packages with planetarium access), or a picnic-with-animals event at <strong>Tilden Little Farm</strong> in Berkeley (free admission, reservable group area nearby). For creative parties, <strong>Color Me Mine</strong> ceramic painting studios offer group party sessions at multiple Bay Area locations. Check each venue&apos;s website for current party package pricing and availability.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Free activities FAQ — targets "free things to do with kids bay area" */}
      {guideSlug === "free" && locale === "en" && (
        <section className="mt-12 rounded-2xl border border-teal-100 bg-teal-50 p-6 dark:border-teal-800 dark:bg-teal-900/20">
          <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
            Free Activities for Kids FAQ
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What are the best free things to do with kids in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Top free Bay Area activities for kids include <strong>Tilden Little Farm</strong> in Berkeley (free petting farm, open 365 days a year), <strong>Crissy Field</strong> in San Francisco (flat waterfront lawn, kite flying, Golden Gate views), <strong>Baker Beach</strong> in San Francisco (free admission, sheltered cove with beach access), the <strong>Koret Children&apos;s Quarter</strong> in Golden Gate Park, and the <strong>Randall Museum</strong> in San Francisco (free general admission, live animal exhibits, and hands-on exhibits). All municipal playgrounds across the Bay Area are free — the <strong>Magical Bridge Playgrounds</strong> in Palo Alto, Sunnyvale, and Mountain View are standouts designed for all abilities.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Are there free splash pads for kids in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Yes. Free Bay Area splash pads include the <strong>24th &amp; York Mini Park</strong> spray area in San Francisco&apos;s Mission District, the <strong>Ortega Park Splash Pad</strong> in Sunnyvale, and water play areas at several East Bay parks. Splash pads typically operate during summer months — check local parks and recreation websites for current seasonal schedules.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What are the best free outdoor activities for kids in the San Francisco Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Free outdoor Bay Area highlights for families include the 1-mile Main Trail at <strong>Muir Woods National Monument</strong> (free for children 15 and under), hiking the easy trails at <strong>Mount Diablo State Park</strong> (day-use fee for cars, no per-person admission), tidepooling at <strong>Point Reyes National Seashore</strong> (free admission), and the <strong>Marin Headlands</strong> trails (free) with views of the Golden Gate Bridge. Beaches along the coast — including <strong>Baker Beach</strong> and <strong>Crissy Field</strong> in San Francisco — are free year-round.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What are free activities for kids in the East Bay?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Free East Bay activities for kids include <strong>Tilden Little Farm</strong> in Berkeley (free petting farm with goats, pigs, and chickens — open 365 days a year), the <strong>Adventure Playground</strong> at the Berkeley Marina (free, kids build structures from scrap lumber and rafts), the free trails in <strong>Redwood Regional Park</strong> in Oakland, and <strong>Don Castro Regional Recreation Area</strong> in Hayward (free trails and a seasonal swim lagoon — check for current swim fees and hours). The <strong>Randall Museum</strong> in San Francisco and <strong>East Bay Depot for Creative Reuse</strong> in Oakland are also free admission.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Cross-link to other guides */}
      <AmazonPicks contextKey={guideSlug} />

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
