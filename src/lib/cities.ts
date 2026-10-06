import { places, regionNames, type Place } from "@/data/places";

// City hub pages (/[locale]/cities/[city]) for cities with enough listings to
// be useful on their own. Targets city-scoped searches GSC shows we miss
// ("family restaurants in san jose", "family friendly activities silicon
// valley"). Everything on the page — including the FAQ — is generated from
// places.ts, so it can't drift from the listings or invent venues.
export const MIN_PLACES_PER_CITY = 8;

export interface CityHub {
  slug: string;
  name: string;
  places: Place[];
  regionEn: string;
  regionZh: string;
}

export function citySlug(city: string): string {
  return city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildHubs(): CityHub[] {
  const byCity = new Map<string, Place[]>();
  for (const p of places) {
    if (p.permanentlyClosed) continue;
    byCity.set(p.city, [...(byCity.get(p.city) ?? []), p]);
  }
  return [...byCity.entries()]
    .filter(([, list]) => list.length >= MIN_PLACES_PER_CITY)
    .map(([name, list]) => {
      const sorted = [...list].sort((a, b) => b.rating - a.rating);
      const region = regionNames[sorted[0].region];
      return { slug: citySlug(name), name, places: sorted, regionEn: region.en, regionZh: region.zh };
    })
    .sort((a, b) => b.places.length - a.places.length);
}

export const cityHubs: CityHub[] = buildHubs();

export function getCityHub(slug: string): CityHub | undefined {
  return cityHubs.find((c) => c.slug === slug);
}

/** Slug of the hub for a place's city, if that city has a hub page. */
export function hubSlugForCity(city: string): string | undefined {
  const slug = citySlug(city);
  return cityHubs.some((c) => c.slug === slug) ? slug : undefined;
}

export interface FaqEntry {
  q: string;
  a: string;
}

function list(names: string[], zh: boolean): string {
  if (zh) return names.join("、");
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

const names = (ps: Place[], n: number) => ps.slice(0, n).map((p) => p.name);

/** Play + outings first (what "things to do with kids" searchers want), then classes/museums. */
export function headlineActivities(hub: CityHub): Place[] {
  const rank = (p: Place) => (p.category === "play" || p.category === "explore" ? 0 : 1);
  return hub.places
    .filter((p) => p.category !== "eat" && p.category !== "shop")
    .sort((a, b) => rank(a) - rank(b) || b.rating - a.rating);
}

export function cityFaq(hub: CityHub, locale: string): FaqEntry[] {
  const zh = locale === "zh";
  const c = hub.name;
  const activities = headlineActivities(hub);
  const eat = hub.places.filter((p) => p.category === "eat");
  const free = hub.places.filter((p) => p.priceLevel === "free");
  const indoor = hub.places.filter(
    (p) => p.category !== "eat" && p.category !== "shop" && (p.indoorOutdoor === "indoor" || p.indoorOutdoor === "both"),
  );
  const toddler = activities.filter((p) => p.ageRange.includes("0-2") || p.ageRange.includes("2-5"));
  const out: FaqEntry[] = [];

  if (activities.length >= 3) {
    out.push(
      zh
        ? { q: `${c} 有哪些适合带孩子去的地方？`, a: `${c} 评分最高的亲子去处包括 ${list(names(activities, 5), true)}。下方列出了 ${c} 全部 ${hub.places.length} 个亲子地点，含适合年龄、停车和实用贴士。` }
        : { q: `What are the best things to do with kids in ${c}?`, a: `Top-rated family spots in ${c} include ${list(names(activities, 5), false)}. This page lists all ${hub.places.length} kid-friendly places in ${c}, with age ranges, parking, and tips for each.` },
    );
  }
  if (toddler.length >= 2) {
    out.push(
      zh
        ? { q: `${c} 有哪些适合幼儿的地方？`, a: `${c} 适合 0-5 岁幼儿的去处有 ${list(names(toddler, 5), true)}。` }
        : { q: `Where can I take toddlers in ${c}?`, a: `Toddler-friendly places in ${c} include ${list(names(toddler, 5), false)}.` },
    );
  }
  if (eat.length >= 2) {
    out.push(
      zh
        ? { q: `${c} 有哪些亲子餐厅？`, a: `${c} 适合带孩子的餐厅有 ${list(names(eat, 6), true)}。` }
        : { q: `What are the best family-friendly restaurants in ${c}?`, a: `Kid-friendly restaurants in ${c} include ${list(names(eat, 6), false)}. Check each restaurant's page for kids' menus, high chairs, and tips.` },
    );
  }
  if (indoor.length >= 2) {
    out.push(
      zh
        ? { q: `${c} 下雨天可以带孩子去哪里？`, a: `${c} 的室内亲子去处有 ${list(names(indoor, 5), true)}。` }
        : { q: `What can kids do indoors in ${c} on a rainy day?`, a: `Indoor options in ${c} include ${list(names(indoor, 5), false)}.` },
    );
  }
  if (free.length >= 1) {
    out.push(
      zh
        ? { q: `${c} 有哪些免费的亲子活动？`, a: `${c} 的免费亲子去处有 ${list(names(free, 6), true)}。` }
        : { q: `What are free things to do with kids in ${c}?`, a: `Free family spots in ${c} include ${list(names(free, 6), false)}.` },
    );
  }
  return out;
}
