// Annual / recurring Bay Area family events.
//
// We intentionally do NOT store fabricated exact dates. These are well-established
// events that recur every year around a known season; we record the typical month
// (for ordering + "what's on now") and a human `timing` string, and always link to
// the official site where the current-year dates are authoritative. The UI tells
// users to confirm exact dates on the official page. This mirrors the places.ts
// policy of never inventing hours/prices.
//
// To add a one-off dated event, set `recurring: false` and fill `startDate` /
// `endDate` (ISO "YYYY-MM-DD"). The seo-cron or a maintainer can append entries.

import type { Region } from "./places";

export type EventCategory =
  | "festival"
  | "seasonal"
  | "fair"
  | "cultural"
  | "outdoor"
  | "free-day";

export interface FamilyEvent {
  slug: string;
  name: { en: string; zh: string };
  description: { en: string; zh: string };
  category: EventCategory;
  region: Region;
  city: string;
  // 1-12. The month the event typically falls in (used for ordering + "on now").
  month: number;
  // Human-readable timing, e.g. "Mid-October, annually". Never a fabricated exact date.
  timing: { en: string; zh: string };
  recurring: boolean;
  // Optional precise dates for one-off events (ISO). Leave undefined for recurring.
  startDate?: string;
  endDate?: string;
  priceNote: { en: string; zh: string };
  officialUrl: string;
  ageRange: string; // free-form, e.g. "All ages"
}

export const eventCategoryNames: Record<
  EventCategory,
  { en: string; zh: string; emoji: string }
> = {
  festival: { en: "Festival", zh: "节庆", emoji: "🎉" },
  seasonal: { en: "Seasonal", zh: "季节活动", emoji: "🍂" },
  fair: { en: "Fair", zh: "集市", emoji: "🎡" },
  cultural: { en: "Cultural", zh: "文化", emoji: "🎎" },
  outdoor: { en: "Outdoor", zh: "户外", emoji: "🏞️" },
  "free-day": { en: "Free Day", zh: "免费日", emoji: "🎟️" },
};

export const events: FamilyEvent[] = [
  {
    slug: "sf-chinese-new-year-parade",
    name: {
      en: "San Francisco Chinese New Year Parade",
      zh: "旧金山农历新年大游行",
    },
    description: {
      en: "One of the largest Lunar New Year celebrations outside Asia, with illuminated floats, lion dancers, acrobats, and a 200-foot Golden Dragon winding through downtown and Chinatown. Free to watch from the street.",
      zh: "亚洲以外最大的农历新年庆典之一，有花车、舞狮、杂技和长达200英尺的金龙巡游市中心和唐人街。街边观看免费。",
    },
    category: "cultural",
    region: "sf",
    city: "San Francisco",
    month: 2,
    timing: { en: "Late January–February (Lunar New Year), annually", zh: "每年一月底至二月（农历新年）" },
    recurring: true,
    priceNote: { en: "Free to watch from the street", zh: "街边观看免费" },
    officialUrl: "https://chineseparade.com/",
    ageRange: "All ages",
  },
  {
    slug: "sf-cherry-blossom-festival",
    name: { en: "Northern California Cherry Blossom Festival", zh: "北加州樱花节" },
    description: {
      en: "A two-weekend celebration of Japanese and Japanese-American culture in Japantown, with taiko drumming, martial-arts demos, a grand parade, food stalls, and kid-friendly crafts.",
      zh: "在日本町举办的为期两个周末的日本及日裔文化庆典，有太鼓表演、武术展示、大游行、美食摊位和适合孩子的手工活动。",
    },
    category: "cultural",
    region: "sf",
    city: "San Francisco",
    month: 4,
    timing: { en: "Two weekends in April, annually", zh: "每年四月的两个周末" },
    recurring: true,
    priceNote: { en: "Free admission (food/activities extra)", zh: "免费入场（餐饮/活动另计）" },
    officialUrl: "https://sfcherryblossom.org/",
    ageRange: "All ages",
  },
  {
    slug: "san-mateo-county-fair",
    name: { en: "San Mateo County Fair", zh: "圣马特奥县集市" },
    description: {
      en: "A classic county fair with carnival rides, farm animals, live music, a petting zoo, and hands-on kids' zones. A Peninsula early-summer tradition.",
      zh: "经典的县级集市，有游乐设施、农场动物、现场音乐、动物触摸区和亲子互动区。半岛初夏的传统活动。",
    },
    category: "fair",
    region: "peninsula",
    city: "San Mateo",
    month: 6,
    timing: { en: "Early June, annually", zh: "每年六月初" },
    recurring: true,
    priceNote: { en: "Paid admission; kids' discounts available", zh: "需购票入场；有儿童优惠" },
    officialUrl: "https://www.sanmateocountyfair.com/",
    ageRange: "All ages",
  },
  {
    slug: "alameda-county-fair",
    name: { en: "Alameda County Fair", zh: "阿拉米达县集市" },
    description: {
      en: "One of the Bay Area's biggest fairs in Pleasanton: carnival midway, livestock barns, horse racing, concerts, and a huge lineup of family attractions.",
      zh: "湾区最大的集市之一，位于普莱森顿：游乐场、牲畜棚、赛马、演唱会和众多家庭游乐项目。",
    },
    category: "fair",
    region: "east-bay",
    city: "Pleasanton",
    month: 6,
    timing: { en: "Mid-June to early July, annually", zh: "每年六月中至七月初" },
    recurring: true,
    priceNote: { en: "Paid admission; kids' discounts available", zh: "需购票入场；有儿童优惠" },
    officialUrl: "https://alamedacountyfair.com/",
    ageRange: "All ages",
  },
  {
    slug: "fourth-of-july-bay-area",
    name: { en: "Fourth of July Fireworks & Parades", zh: "美国国庆日烟花与游行" },
    description: {
      en: "Independence Day fireworks and hometown parades across the Bay Area — from the San Francisco waterfront to Redwood City's big parade and East Bay marina shows. Most are free.",
      zh: "全湾区的国庆烟花和家乡游行——从旧金山海滨到红木城的大游行和东湾码头烟花秀。大多免费。",
    },
    category: "seasonal",
    region: "sf",
    city: "Bay Area–wide",
    month: 7,
    timing: { en: "July 4th, annually", zh: "每年7月4日" },
    recurring: true,
    priceNote: { en: "Most events free", zh: "大多数活动免费" },
    officialUrl: "https://www.redwoodcity.org/residents/fourth-of-july",
    ageRange: "All ages",
  },
  {
    slug: "hmb-pumpkin-festival",
    name: { en: "Half Moon Bay Art & Pumpkin Festival", zh: "半月湾艺术与南瓜节" },
    description: {
      en: "The self-proclaimed 'World Pumpkin Capital' throws a giant coastal harvest festival with a costume parade, pie-eating contests, live music, and the famous giant-pumpkin weigh-off nearby.",
      zh: "自称“世界南瓜之都”的半月湾举办盛大的海滨丰收节，有化装游行、吃派比赛、现场音乐，附近还有著名的巨型南瓜称重赛。",
    },
    category: "festival",
    region: "peninsula",
    city: "Half Moon Bay",
    month: 10,
    timing: { en: "Mid-October, annually", zh: "每年十月中旬" },
    recurring: true,
    priceNote: { en: "Free admission", zh: "免费入场" },
    officialUrl: "https://pumpkinfest.miramarevents.com/",
    ageRange: "All ages",
  },
  {
    slug: "sf-fleet-week",
    name: { en: "San Francisco Fleet Week Air Show", zh: "旧金山舰队周飞行表演" },
    description: {
      en: "The Blue Angels roar over the bay during Fleet Week, with an air show, ship tours, and waterfront viewing. Spectacular and free to watch from the shoreline.",
      zh: "舰队周期间蓝天使飞行表演队在海湾上空呼啸而过，还有飞行表演、军舰参观和海滨观赏。壮观且岸边观看免费。",
    },
    category: "outdoor",
    region: "sf",
    city: "San Francisco",
    month: 10,
    timing: { en: "Early-to-mid October, annually", zh: "每年十月上中旬" },
    recurring: true,
    priceNote: { en: "Free to watch from the shoreline", zh: "岸边观看免费" },
    officialUrl: "https://fleetweeksf.org/",
    ageRange: "All ages",
  },
  {
    slug: "bay-area-science-festival",
    name: { en: "Bay Area Science Festival", zh: "湾区科学节" },
    description: {
      en: "Two weeks of hands-on science across the region, capped by the huge free Discovery Day expo with hundreds of interactive booths, experiments, and demos for kids.",
      zh: "为期两周的全区互动科学活动，以大型免费的“探索日”展会收尾，有数百个互动展位、实验和演示，适合孩子参与。",
    },
    category: "free-day",
    region: "sf",
    city: "Bay Area–wide",
    month: 11,
    timing: { en: "Late October–November, annually", zh: "每年十月底至十一月" },
    recurring: true,
    priceNote: { en: "Many events free (Discovery Day is free)", zh: "多数活动免费（探索日免费）" },
    officialUrl: "https://www.bayareascience.org/festival",
    ageRange: "All ages",
  },
  {
    slug: "dickens-christmas-fair",
    name: { en: "The Great Dickens Christmas Fair", zh: "狄更斯圣诞集市" },
    description: {
      en: "Step into Victorian London at the Cow Palace: costumed characters, carolers, a Father Christmas, dancing, and old-world holiday shopping across an immersive indoor recreation.",
      zh: "在牛宫走进维多利亚时代的伦敦：身着戏服的角色、颂歌歌手、圣诞老人、舞蹈和怀旧的节日购物，沉浸式室内布景。",
    },
    category: "seasonal",
    region: "peninsula",
    city: "Daly City",
    month: 12,
    timing: { en: "Weekends late November–December, annually", zh: "每年十一月底至十二月的周末" },
    recurring: true,
    priceNote: { en: "Paid admission; kids' discounts available", zh: "需购票入场；有儿童优惠" },
    officialUrl: "https://dickensfair.com/",
    ageRange: "All ages",
  },
  {
    slug: "bay-area-holiday-lights",
    name: { en: "Holiday Lights & Zoo Lights", zh: "节日灯展与动物园灯光秀" },
    description: {
      en: "December fills the Bay Area with walk-through and drive-through light displays — Oakland Zoo's ZooLights, botanical-garden glow trails, and neighborhood spectacles like San Francisco's Tom & Jerry houses.",
      zh: "十二月的湾区处处是可步行和驾车穿越的灯光展——奥克兰动物园的ZooLights、植物园的灯光步道，以及旧金山Tom & Jerry灯饰屋等社区盛景。",
    },
    category: "seasonal",
    region: "east-bay",
    city: "Bay Area–wide",
    month: 12,
    timing: { en: "December, annually", zh: "每年十二月" },
    recurring: true,
    priceNote: { en: "Varies (some free, some ticketed)", zh: "价格不一（部分免费，部分需票）" },
    officialUrl: "https://www.oaklandzoo.org/zoolights",
    ageRange: "All ages",
  },
];

// Order events for display: starting from the current month, wrapping around the
// year, so the soonest upcoming events come first. Deterministic given `now`.
export function orderByUpcoming(nowMonth: number): FamilyEvent[] {
  return [...events].sort((a, b) => {
    const da = (a.month - nowMonth + 12) % 12;
    const db = (b.month - nowMonth + 12) % 12;
    return da - db;
  });
}
