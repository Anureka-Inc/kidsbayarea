// Guide FAQs — single source for both the visible FAQ section (GuideContent)
// and the FAQPage JSON-LD (guides/[guideSlug]/page.tsx), so the two can't
// drift. EN + ZH. Facts and venue names must come from src/data/places.ts
// (the seo-cron venue gate checks added names against it). Venue names stay
// in English in the ZH answers, matching the rest of the site.

export interface GuideFaqEntry {
  q: string;
  a: string;
}

export interface GuideFaq {
  headingEn: string;
  headingZh: string;
  en: GuideFaqEntry[];
  zh: GuideFaqEntry[];
}

export const guideFaq: Record<string, GuideFaq> = {
  "winter": {
    headingEn: "Bay Area Winter Activities FAQ",
    headingZh: "湾区冬季亲子活动常见问题",
    en: [
      {
        q: "Where can kids go ice skating in the Bay Area?",
        a: "Winter Lodge in Palo Alto is the only permanent outdoor ice skating rink west of the Sierras, open mid-October through mid-April with twinkling lights. Year-round indoor rinks include Oakland Ice Center in downtown Oakland (two rinks, classes for kids 3 and up, and skating aids for beginners), Sharks Ice at San Jose (six NHL-sized rinks, the largest ice rink facility west of the Mississippi), Sharks Ice at Fremont, and Nazareth Ice Oasis in San Mateo's Bridgepointe Shopping Center. In Santa Rosa, Snoopy's Home Ice was built by Peanuts creator Charles Schulz in 1969 and has the Warm Puppy Cafe rink-side. Check each rink's website for public session times.",
      },
      {
        q: "Where can families see elephant seals and whales in winter?",
        a: "Elephant seals breed at Año Nuevo State Park in Pescadero from December to March, and Point Reyes National Seashore has elephant seal viewing from December through March. Whale watching season runs December through May: Point Reyes Lighthouse is one of the best whale watching spots on the California coast (its 308 steps are not suitable for strollers), and you can also look for passing whales from Pigeon Point Lighthouse and Muir Beach Overlook. Dress warmly, because the coast is windy and cold.",
      },
      {
        q: "What nature activities are best in the Bay Area in winter?",
        a: "Monarch butterflies stay at Natural Bridges State Beach in Santa Cruz through January, with the peak in November and December. At Samuel P. Taylor State Park, kids can spot spawning salmon in Lagunitas Creek during winter. Palo Alto Baylands is best at high tide in winter for migratory birds. Winter rains also bring the waterfalls to life: the Waterfall Loop at Uvas Canyon County Park passes five waterfalls (reservation required), Cascade Falls in Fairfax is best in winter and early spring, and Tiptoe Falls at Portola Redwoods State Park is best in winter and spring.",
      },
      {
        q: "Are there holiday train rides for kids in the Bay Area?",
        a: "Roaring Camp Railroads in Felton runs historic narrow-gauge steam trains through ancient redwood forests, and its special holiday trains are seasonal favorites that sell out fast, so book early. Check Roaring Camp's website for this season's holiday train dates.",
      },
    ],
    zh: [
      {
        q: "湾区哪里可以带孩子滑冰？",
        a: "Palo Alto 的 Winter Lodge 是 Sierra 山脉以西唯一的永久性户外溜冰场，每年 10 月中旬到次年 4 月中旬开放，场边挂满闪烁的彩灯。全年开放的室内冰场有：Oakland 市中心的 Oakland Ice Center（两块冰场，有 3 岁起的儿童课程，并为初学者提供滑冰辅助器）、Sharks Ice at San Jose（六块 NHL 标准冰场，是密西西比河以西最大的冰场设施）、Sharks Ice at Fremont，以及 San Mateo Bridgepointe Shopping Center 里的 Nazareth Ice Oasis。Santa Rosa 的 Snoopy's Home Ice 由《花生漫画》作者 Charles Schulz 于 1969 年建造，冰场边就是 Warm Puppy Cafe。公众场时间请查看各冰场官网。",
      },
      {
        q: "冬天哪里可以带孩子看象海豹和鲸鱼？",
        a: "每年 12 月到 3 月，象海豹在 Pescadero 的 Año Nuevo State Park 繁殖，Point Reyes National Seashore 在 12 月到 3 月也能观赏象海豹。观鲸季从 12 月持续到 5 月：Point Reyes Lighthouse 是加州海岸最好的观鲸点之一（308 级台阶不适合推婴儿车），也可以在 Pigeon Point Lighthouse 和 Muir Beach Overlook 眺望经过的鲸鱼。海边风大又冷，记得穿暖和。",
      },
      {
        q: "湾区冬天最适合哪些自然活动？",
        a: "帝王蝶会在 Santa Cruz 的 Natural Bridges State Beach 停留到 1 月，11 月和 12 月是高峰。在 Samuel P. Taylor State Park，孩子冬天可以在 Lagunitas Creek 看到洄游产卵的鲑鱼。Palo Alto Baylands 冬季涨潮时最适合观赏候鸟。冬雨也让瀑布活了起来：Uvas Canyon County Park 的 Waterfall Loop 沿途经过五道瀑布（需预约），Fairfax 的 Cascade Falls 冬季和早春最好看，Portola Redwoods State Park 的 Tiptoe Falls 冬春两季最佳。",
      },
      {
        q: "湾区有适合孩子的节日火车吗？",
        a: "Felton 的 Roaring Camp Railroads 运营历史悠久的窄轨蒸汽火车，穿行于古老的红杉林中，特别推出的节日火车是每年的热门项目，很快就会售罄，请尽早预订。本季节日火车的日期请查看 Roaring Camp 官网。",
      },
    ],
  },
  "birthday-party": {
    headingEn: "Kids Birthday Party FAQ",
    headingZh: "湾区儿童生日派对常见问题",
    en: [
      {
        q: "What are the best birthday party places for kids in the Bay Area?",
        a: "Popular Bay Area kids' birthday party venues include Sky Zone trampoline parks in Fremont and Dublin (Sky Zone Dublin has private party rooms), Altitude Trampoline Park in South San Jose, Ninja Republic in San Mateo (American Ninja Warrior-style obstacles), Round1 entertainment centers in Concord, Hayward, and San Jose (bowling, arcade games, karaoke, and party rooms), Lucky Strike San Jose (formerly Bowlero; 59 lanes with bumper bowling), and Laser Tagging Inc. in Newark (a two-story laser tag arena). Check each venue's website for current party packages and availability.",
      },
      {
        q: "Where can toddlers have birthday parties in the Bay Area?",
        a: "Toddler-friendly Bay Area birthday party venues include La Petite Playhouse in Redwood City (10,000 sq ft indoor playground with separate baby and toddler areas), Little Oceanauts in San Francisco (ocean-themed playground and party venue with a separate area for tots under 2), Whirlygig in San Jose (play space for ages 8 weeks to 8 years that hosts 2-hour private parties), and WOW Kids Playground in San Francisco (indoor playground designed for younger children). Party rooms at popular toddler venues fill up quickly, so book ahead.",
      },
      {
        q: "Are there outdoor birthday party options for kids in the Bay Area?",
        a: "For an outdoor celebration, consider Pixieland Amusement Park in Concord (free admission with pay-per-ride tickets, rides sized for ages 1 to 10), Children's Fairyland in Oakland (storybook theme park on Lake Merritt with puppet shows and gentle rides), the Oakland Zoo, or a picnic at Coyote Hills Regional Park in Fremont (flat trails and a marsh boardwalk). Many city and regional parks take picnic-area reservations; check the local parks department for availability and fees.",
      },
      {
        q: "What are unique birthday party ideas for kids in the Bay Area?",
        a: "For something different, try a climbing party at Bridges Rock Gym in El Cerrito (weekend birthday parties, kids programs from age 5), indoor mini golf at Urban Putt in downtown San Jose (families welcome before 8pm) or Holey Moley in San Francisco (kids birthday packages; under-13s welcome with an adult before 8pm), teppanyaki theater at Benihana in Cupertino (mention the birthday for a special treat), or bumper bowling at Lucky Strike Alameda. Check each venue's website for current packages.",
      },
    ],
    zh: [
      {
        q: "湾区最适合办儿童生日派对的地方有哪些？",
        a: "湾区热门的儿童生日派对场地包括：Fremont 和 Dublin 的 Sky Zone 跳床乐园（Sky Zone Dublin 有私人派对房）、南 San Jose 的 Altitude Trampoline Park、San Mateo 的 Ninja Republic（美国忍者勇士式障碍）、Concord、Hayward 和 San Jose 的 Round1 娱乐中心（保龄球、街机、卡拉 OK 和派对房）、Lucky Strike San Jose（原 Bowlero，59 条球道，有护栏保龄球），以及 Newark 的 Laser Tagging Inc.（两层激光枪战场）。最新派对套餐和档期请查看各场地官网。",
      },
      {
        q: "湾区哪里适合给幼儿办生日派对？",
        a: "适合幼儿的湾区生日派对场地有：Redwood City 的 La Petite Playhouse（10,000 平方英尺的室内游乐场，婴儿区和幼儿区分开）、旧金山的 Little Oceanauts（海洋主题游乐场兼派对场地，2 岁以下宝宝有单独区域）、San Jose 的 Whirlygig（面向 8 周到 8 岁孩子的游乐空间，可办 2 小时私人派对），以及旧金山的 WOW Kids Playground（专为低龄儿童设计的室内游乐场）。热门幼儿场地的派对房很快就会订满，请提前预订。",
      },
      {
        q: "湾区有户外生日派对的选择吗？",
        a: "想在户外庆祝，可以考虑 Concord 的 Pixieland Amusement Park（免费入园，游乐设施按票付费，适合 1 到 10 岁）、Oakland 的 Children's Fairyland（Lake Merritt 边的童话主题乐园，有木偶剧和温和的游乐设施）、Oakland Zoo，或者在 Fremont 的 Coyote Hills Regional Park 野餐（平坦的步道和湿地木栈道）。许多市立和区域公园都接受野餐区预订，具体空位和费用请咨询当地公园部门。",
      },
      {
        q: "湾区有哪些特别的儿童生日派对点子？",
        a: "想来点不一样的，可以在 El Cerrito 的 Bridges Rock Gym 办攀岩派对（周末办生日派对，儿童课程 5 岁起），在 San Jose 市中心的 Urban Putt（晚上 8 点前欢迎家庭）或旧金山的 Holey Moley（有儿童生日套餐；13 岁以下须由成人陪同，晚上 8 点前入场）玩室内迷你高尔夫，去 Cupertino 的 Benihana 看铁板烧表演（告诉店家过生日会有特别惊喜），或者在 Lucky Strike Alameda 打护栏保龄球。最新套餐请查看各场地官网。",
      },
    ],
  },
  "free": {
    headingEn: "Free Things to Do with Kids FAQ",
    headingZh: "湾区免费亲子活动常见问题",
    en: [
      {
        q: "What are the best free things to do with kids in the Bay Area?",
        a: "Top free Bay Area activities for kids include Tilden Little Farm in Berkeley (free petting farm; bring celery and lettuce for the animals), Adventure Playground at the Berkeley Marina (kids build forts with real hammers and saws under supervision), the Randall Museum in San Francisco (free family museum with live animals and a woodworking shop), Magical Bridge Playground in Palo Alto (inclusive playground designed for children of all abilities), Mia's Dream Come True Playground in Hayward (1-acre all-abilities playground), and Koret Children's Quarter in Golden Gate Park (the oldest public children's playground in the US, with concrete slides built into the hill).",
      },
      {
        q: "Are there free splash pads for kids in the Bay Area?",
        a: "Yes. Free Bay Area splash pads include Emerald Glen Park Splash Pad in Dublin (open Memorial Day through Labor Day), Meadow Homes Spray Park in Concord (pirate-themed, open Memorial Day through September), Ortega Park Splash Pad in Sunnyvale (pirate-themed and great for toddlers), and the 24th & York Mini Park splash pad in San Francisco's Mission District. Splash pads run seasonally, so check city parks websites for current hours.",
      },
      {
        q: "What free outdoor activities are there for kids in San Francisco?",
        a: "Free San Francisco outdoor picks include Crissy Field (waterfront promenade with a sandy beach, kite flying, and Golden Gate Bridge views), Baker Beach (stick to the family-friendly south end with picnic tables and restrooms; strong riptides make swimming dangerous), Koret Children's Quarter in Golden Gate Park, and Yerba Buena Gardens Playground atop the Moscone Center. Across the bridge, Battery Spencer in the Marin Headlands is a free quarter-mile walk to classic Golden Gate views.",
      },
      {
        q: "What are free activities for kids in the East Bay?",
        a: "Free East Bay picks include Tilden Little Farm in Berkeley (free admission, open daily 8:30am to 4pm), Adventure Playground at the Berkeley Marina (open weekends during the school year and daily in summer; closed-toe shoes required), Redwood Regional Park in Oakland (the first mile of the Stream Trail is paved and stroller-friendly, with a playground at Canyon Meadow), Mia's Dream Come True Playground in Hayward, and Pixieland Amusement Park in Concord (free admission; rides are pay-per-ticket).",
      },
    ],
    zh: [
      {
        q: "湾区带孩子有哪些最好的免费去处？",
        a: "湾区最受欢迎的免费儿童活动有：Berkeley 的 Tilden Little Farm（免费小农场，带芹菜和生菜喂动物）、Berkeley Marina 的 Adventure Playground（孩子在看护下用真锤子和锯子搭堡垒）、旧金山的 Randall Museum（免费家庭博物馆，有活体动物和木工坊）、Palo Alto 的 Magical Bridge Playground（为各种能力的孩子设计的无障碍游乐场）、Hayward 的 Mia's Dream Come True Playground（占地 1 英亩的全能力游乐场），以及金门公园的 Koret Children's Quarter（全美最古老的公共儿童游乐场，山坡上建有水泥滑梯）。",
      },
      {
        q: "湾区有免费的儿童戏水池吗？",
        a: "有。湾区免费戏水池包括 Dublin 的 Emerald Glen Park Splash Pad（阵亡将士纪念日到劳动节开放）、Concord 的 Meadow Homes Spray Park（海盗主题，阵亡将士纪念日到 9 月开放）、Sunnyvale 的 Ortega Park Splash Pad（海盗主题，很适合幼儿），以及旧金山 Mission 区的 24th & York Mini Park 戏水池。戏水池按季节开放，最新开放时间请查看各市公园官网。",
      },
      {
        q: "旧金山有哪些免费的儿童户外活动？",
        a: "旧金山免费户外推荐：Crissy Field（海滨步道和沙滩，可以放风筝，还能看金门大桥）、Baker Beach（去适合家庭的南端，有野餐桌和洗手间；离岸流很强，下水游泳很危险）、金门公园的 Koret Children's Quarter，以及 Moscone Center 楼顶的 Yerba Buena Gardens Playground。过了金门大桥，Marin Headlands 的 Battery Spencer 只需免费步行四分之一英里，就能看到经典的金门大桥景色。",
      },
      {
        q: "东湾有哪些免费的儿童活动？",
        a: "东湾免费推荐：Berkeley 的 Tilden Little Farm（免费入园，每天早上 8:30 到下午 4 点开放）、Berkeley Marina 的 Adventure Playground（上学期间周末开放，夏天每天开放；须穿包头鞋）、Oakland 的 Redwood Regional Park（Stream Trail 第一英里是铺装路面，方便推婴儿车，Canyon Meadow 有游乐场）、Hayward 的 Mia's Dream Come True Playground，以及 Concord 的 Pixieland Amusement Park（免费入园，游乐设施按票付费）。",
      },
    ],
  },
  "family-favorites": {
    headingEn: "Bay Area Family Attractions FAQ",
    headingZh: "湾区热门家庭景点常见问题",
    en: [
      {
        q: "What are the top-rated family attractions in the Bay Area?",
        a: "The Bay Area's most-loved family attractions include the Exploratorium at Pier 15 in San Francisco (hands-on science exhibits), the California Academy of Sciences in Golden Gate Park (planetarium, rainforest, and aquarium under one roof), the Oakland Zoo in Knowland Park, the Bay Area Discovery Museum in Sausalito (indoor and outdoor exhibits for younger children), and Magical Bridge Playground in Palo Alto (inclusive play space designed for children of all abilities). Check each venue's website for current hours and admission.",
      },
      {
        q: "Which Bay Area family activities are good for all ages?",
        a: "All-ages Bay Area favorites include the Exploratorium in San Francisco, Tilden Regional Park in Berkeley (steam trains, a free petting farm, and nature trails), the Santa Cruz Beach Boardwalk (free park entry, pay-per-ride), Angel Island State Park (ferry, hiking, and bay views), and Roaring Camp Railroads in Felton (steam train through old-growth redwoods). Check each venue's website for current hours and admission.",
      },
      {
        q: "What are the best free Bay Area family activities?",
        a: "Free Bay Area family highlights include Tilden Little Farm in Berkeley (free admission), Magical Bridge Playground in Palo Alto (free entry), Crissy Field and Baker Beach in San Francisco (National Park Service beaches), and the de Young Museum in Golden Gate Park (free for children 17 and under). Public library systems throughout San Francisco, the East Bay, and Santa Clara County offer free family story times and maker programs as well.",
      },
      {
        q: "What Bay Area family attractions make great weekend day trips?",
        a: "Top Bay Area family day trips include the Monterey Bay Aquarium (about two hours south of San Francisco), the Santa Cruz Beach Boardwalk (ocean-side rides and free beach), Roaring Camp Railroads in Felton (steam train through redwoods), Muir Woods National Monument in Mill Valley (old-growth redwoods just north of San Francisco), and Gilroy Gardens Family Theme Park. Check each venue's website for current hours, tickets, and parking reservation requirements.",
      },
    ],
    zh: [
      {
        q: "湾区评价最高的家庭景点有哪些？",
        a: "湾区最受喜爱的家庭景点包括旧金山 Pier 15 的 Exploratorium（动手科学展品）、金门公园的 California Academy of Sciences（天文馆、雨林和水族馆集于一处）、Knowland Park 的 Oakland Zoo、Sausalito 的 Bay Area Discovery Museum（为低龄儿童设计的室内外展区），以及 Palo Alto 的 Magical Bridge Playground（为各种能力的孩子设计的无障碍游乐空间）。最新开放时间和门票请查看各场馆官网。",
      },
      {
        q: "湾区哪些家庭活动适合全年龄段？",
        a: "湾区老少皆宜的热门去处有：旧金山的 Exploratorium、Berkeley 的 Tilden Regional Park（蒸汽小火车、免费小农场和自然步道）、Santa Cruz Beach Boardwalk（免费入园，游乐设施按次付费）、Angel Island State Park（渡轮、徒步和海湾风景），以及 Felton 的 Roaring Camp Railroads（蒸汽火车穿行于原始红杉林）。最新开放时间和门票请查看各场馆官网。",
      },
      {
        q: "湾区有哪些最好的免费家庭活动？",
        a: "湾区免费家庭亮点有：Berkeley 的 Tilden Little Farm（免费入园）、Palo Alto 的 Magical Bridge Playground（免费进入）、旧金山的 Crissy Field 和 Baker Beach（国家公园管理局管理的海滩），以及金门公园的 de Young Museum（17 岁及以下儿童免费）。旧金山、东湾和 Santa Clara County 的公共图书馆系统也提供免费的亲子故事时间和创客活动。",
      },
      {
        q: "湾区有哪些适合周末一日游的家庭景点？",
        a: "湾区热门家庭一日游包括 Monterey Bay Aquarium（旧金山以南约两小时车程）、Santa Cruz Beach Boardwalk（海边游乐设施和免费海滩）、Felton 的 Roaring Camp Railroads（蒸汽火车穿行红杉林）、Mill Valley 的 Muir Woods National Monument（旧金山以北不远的原始红杉林），以及 Gilroy Gardens Family Theme Park。最新开放时间、门票和停车预约要求请查看各景点官网。",
      },
    ],
  },
  "babies-0-2": {
    headingEn: "Baby Activities FAQ",
    headingZh: "湾区婴幼儿（0–2 岁）活动常见问题",
    en: [
      {
        q: "What are the best activities for babies (0–2) in the Bay Area?",
        a: "Good picks for babies and young toddlers include the Bay Area Discovery Museum in Sausalito (hands-on exhibits and outdoor play areas under the Golden Gate Bridge), Tilden Little Farm in Berkeley (a free petting farm open 365 days a year), Koret Children's Quarter in Golden Gate Park, and Whirlygig in San Jose (ages 8 weeks to 8 years). Music Together runs parent-child music sessions across the Bay Area, and the Little Bears program at Blue Bear School of Music in San Francisco starts at 4 months.",
      },
      {
        q: "Which Bay Area venues are stroller-friendly for families with babies?",
        a: "Stroller-friendly outings for families with babies include the main boardwalk trail at Muir Woods National Monument in Mill Valley (flat, winding through towering redwoods; book a parking reservation ahead), Shoreline Park in Mountain View (flat trails that connect to the Bay Trail), the Stream Trail at Redwood Regional Park in Oakland (the first mile is paved), and the paved West Shore Trail at Lake Chabot Regional Park in Castro Valley. Muir Woods is less crowded in the morning.",
      },
      {
        q: "Are there free activities for babies and infants in the Bay Area?",
        a: "Yes. Free options include Tilden Little Farm in Berkeley (free admission, open daily 8:30am to 4pm; bring celery and lettuce for the animals), baby rhyme time at the SF Public Library's Fisher Children's Center on the 2nd floor of the Main Library, free weekly story times at San Jose Public Library branches in English and Chinese, Oakland Public Library storytimes, Magical Bridge Playground in Palo Alto, Mia's Dream Come True Playground in Hayward, and Shoreline Park in Mountain View (free parking and admission).",
      },
      {
        q: "What indoor play spaces in the Bay Area are good for babies under 2?",
        a: "Indoor spots with areas for the youngest children include La Petite Playhouse in Redwood City (a dedicated baby-and-toddler soft-play area), Lemon Tree Play Cafe in Santa Clara (designed for crawlers and toddlers ages 6 months to 3.5 years), KidTopia in Fremont (a dedicated baby and toddler playground), Little Oceanauts in San Francisco (a separate area for tots under 2), and Lo's PlayTown in Benicia (a calm baby room). For water time, YMCA of San Francisco swim lessons start at 6 months. Check each venue's website for current hours.",
      },
    ],
    zh: [
      {
        q: "湾区适合婴儿（0–2 岁）的活动有哪些？",
        a: "适合婴儿和小宝宝的好去处有：Sausalito 的 Bay Area Discovery Museum（就在金门大桥下，有动手展品和户外游乐区）、Berkeley 的 Tilden Little Farm（免费小农场，全年 365 天开放）、金门公园的 Koret Children's Quarter，以及 San Jose 的 Whirlygig（8 周到 8 岁）。Music Together 在湾区各地开设亲子音乐课，旧金山 Blue Bear School of Music 的 Little Bears 课程 4 个月起就能参加。",
      },
      {
        q: "湾区哪些地方方便带婴儿推车？",
        a: "适合推婴儿车的去处有：Mill Valley 的 Muir Woods National Monument 主木栈道（平坦，蜿蜒穿过高耸的红杉；需提前预约停车位）、Mountain View 的 Shoreline Park（平坦步道，连接 Bay Trail）、Oakland 的 Redwood Regional Park 的 Stream Trail（第一英里是铺装路面），以及 Castro Valley 的 Lake Chabot Regional Park 铺装的 West Shore Trail。Muir Woods 早上人比较少。",
      },
      {
        q: "湾区有适合婴儿的免费活动吗？",
        a: "有。免费选择包括：Berkeley 的 Tilden Little Farm（免费入园，每天早上 8:30 到下午 4 点开放；带芹菜和生菜喂动物）、旧金山 Main Library 二楼 SF Public Library 的 Fisher Children's Center 的 baby rhyme time（婴儿儿歌时间）、San Jose Public Library 各分馆每周的免费中英文故事时间、Oakland Public Library 的故事时间、Palo Alto 的 Magical Bridge Playground、Hayward 的 Mia's Dream Come True Playground，以及 Mountain View 的 Shoreline Park（免费停车、免费入园）。",
      },
      {
        q: "湾区哪些室内游乐场适合 2 岁以下的宝宝？",
        a: "有专门低龄区域的室内去处包括：Redwood City 的 La Petite Playhouse（专门的婴幼儿软体游乐区）、Santa Clara 的 Lemon Tree Play Cafe（专为 6 个月到 3 岁半会爬会走的宝宝设计）、Fremont 的 KidTopia（专门的婴幼儿游乐区）、旧金山的 Little Oceanauts（2 岁以下宝宝有单独区域），以及 Benicia 的 Lo's PlayTown（有安静的婴儿房）。想玩水的话，YMCA of San Francisco 的游泳课 6 个月起就能上。最新开放时间请查看各场地官网。",
      },
    ],
  },
  "field-trips": {
    headingEn: "Bay Area Field Trip FAQ",
    headingZh: "湾区研学参观常见问题",
    en: [
      {
        q: "What are the best field trip ideas in the Bay Area?",
        a: "Strong Bay Area field trip picks span four themes. Science: the Exploratorium on Pier 15, the California Academy of Sciences in Golden Gate Park, The Tech Interactive in San Jose, Chabot Space & Science Center in Oakland, and the Lawrence Hall of Science in Berkeley. History: John Muir National Historic Site in Martinez, Sanchez Adobe Historic Site in Pacifica, Fort Point under the Golden Gate Bridge, and Black Diamond Mines in Antioch. Farms: Ardenwood Historic Farm in Fremont, Hidden Villa in Los Altos Hills, and Slide Ranch near Muir Beach. Nature: tide pools at Fitzgerald Marine Reserve and rescued animals at Lindsay Wildlife Experience. For school or group visits, contact each venue in advance to arrange a booking.",
      },
      {
        q: "Which Bay Area farms are good for field trips?",
        a: "Ardenwood Historic Farm in Fremont is a working Victorian-era farm with horse-drawn train rides and seasonal programs such as corn harvest and wool spinning. Hidden Villa in Los Altos Hills is a 1,600-acre organic farm and wilderness preserve. At Slide Ranch near Muir Beach, kids can milk goats, collect eggs, and explore tidepools. Loma Vista Farm in Vallejo is an educational farm with hands-on programs on sustainable farming; book farm tours in advance. Deer Hollow Farm in Los Altos and Emma Prusch Farm Park in San Jose are free to visit.",
      },
      {
        q: "Where can kids learn about Bay Area history on a field trip?",
        a: "John Muir National Historic Site in Martinez has free admission to the naturalist's Victorian mansion, orchards, and a 20-minute film, plus Junior Ranger booklets. Sanchez Adobe Historic Site in Pacifica spans the Ohlone, Spanish, and Mexican eras, with hands-on activities like grinding corn, making candles, and creating adobe bricks. Fort Point is a Civil War-era fort under the Golden Gate Bridge with free ranger-led tours on weekends. Black Diamond Mines Regional Preserve in Antioch explores 19th-century coal mining, with seasonal guided mine tunnel tours, and San Francisco Maritime National Historical Park has a free Maritime Museum.",
      },
      {
        q: "What are free field trip options in the Bay Area?",
        a: "Free options include the Randall Museum in San Francisco (live animals, art studios, and a woodworking shop), John Muir National Historic Site, Sanchez Adobe Historic Site, Fort Point National Historic Site, the San Francisco Maritime National Historical Park museum, Deer Hollow Farm, Emma Prusch Farm Park, and self-guided visits to Slide Ranch. Fitzgerald Marine Reserve in Moss Beach is free; visit at a zero or minus tide, when rangers and docents are often on site. Edgewood Park in Redwood City offers free docent-led wildflower hikes from March through May.",
      },
    ],
    zh: [
      {
        q: "湾区有哪些最好的研学参观点？",
        a: "湾区的研学好去处可分四类。科学：Pier 15 的 Exploratorium、金门公园的 California Academy of Sciences、San Jose 的 The Tech Interactive、Oakland 的 Chabot Space & Science Center，以及 Berkeley 的 Lawrence Hall of Science。历史：Martinez 的 John Muir National Historic Site、Pacifica 的 Sanchez Adobe Historic Site、金门大桥下的 Fort Point，以及 Antioch 的 Black Diamond Mines。农场：Fremont 的 Ardenwood Historic Farm、Los Altos Hills 的 Hidden Villa，以及 Muir Beach 附近的 Slide Ranch。自然：去 Fitzgerald Marine Reserve 看潮池，去 Lindsay Wildlife Experience 看获救的动物。学校或团体参观请提前联系各场馆预约。",
      },
      {
        q: "湾区哪些农场适合研学参观？",
        a: "Fremont 的 Ardenwood Historic Farm 是一座仍在运作的维多利亚时代农场，有马拉火车，还有玉米收获、羊毛纺线等季节性活动。Los Altos Hills 的 Hidden Villa 是占地 1,600 英亩的有机农场和荒野保护区。在 Muir Beach 附近的 Slide Ranch，孩子可以挤羊奶、捡鸡蛋、探索潮池。Vallejo 的 Loma Vista Farm 是一座教育农场，提供可持续农业的动手课程，农场导览需提前预约。Los Altos 的 Deer Hollow Farm 和 San Jose 的 Emma Prusch Farm Park 可以免费参观。",
      },
      {
        q: "湾区哪里可以带孩子了解湾区历史？",
        a: "Martinez 的 John Muir National Historic Site 免费参观，可以看这位博物学家的维多利亚式宅邸、果园和一部 20 分钟的影片，还有 Junior Ranger 手册。Pacifica 的 Sanchez Adobe Historic Site 跨越 Ohlone、西班牙和墨西哥三个时期，有磨玉米、做蜡烛、制作土坯砖等动手活动。Fort Point 是金门大桥下的南北战争时期要塞，周末有免费的护林员导览。Antioch 的 Black Diamond Mines Regional Preserve 介绍 19 世纪的煤矿开采，季节性开放矿道导览；San Francisco Maritime National Historical Park 有一座免费的 Maritime Museum。",
      },
      {
        q: "湾区有哪些免费的研学参观选择？",
        a: "免费选择包括旧金山的 Randall Museum（活体动物、艺术工作室和木工坊）、John Muir National Historic Site、Sanchez Adobe Historic Site、Fort Point National Historic Site、San Francisco Maritime National Historical Park 的博物馆、Deer Hollow Farm、Emma Prusch Farm Park，以及 Slide Ranch 的自助参观。Moss Beach 的 Fitzgerald Marine Reserve 免费开放；最好在零潮或负潮时前往，那时常有护林员和讲解员在场。Redwood City 的 Edgewood Park 每年 3 月到 5 月有免费的讲解员带队野花徒步。",
      },
    ],
  },
  "fall": {
    headingEn: "Bay Area Fall & Pumpkin Patch FAQ",
    headingZh: "湾区秋季活动与南瓜园常见问题",
    en: [
      {
        q: "Where are the best pumpkin patches for kids in the Bay Area?",
        a: "Half Moon Bay is the Bay Area's pumpkin patch capital: farms along Highway 92 such as Lemos Farm offer hay rides, corn mazes, pony rides, and pumpkin picking, and the annual Art & Pumpkin Festival draws thousands. Lemos Farm also has a train ride, a petting zoo with baby goats and bunnies, and a farm slide. In the East Bay, Three Nunns Farm in Brentwood has pumpkins in October, free tractor rides, and a corn maze. In San Jose, Emma Prusch Farm Park hosts an annual pumpkin festival in the fall. Go on a weekday if you can, because Highway 92 gets extremely congested on fall weekends.",
      },
      {
        q: "Where can kids go apple picking or see a harvest festival near the Bay Area?",
        a: "Gizdich Ranch in Watsonville has U-pick apples from September through November, antique apple press demonstrations on fall weekends, and a Pie Shop with homemade pies. Ardenwood Historic Farm in Fremont runs seasonal programs such as the corn harvest and a Harvest Festival, plus horse-drawn train rides. Tilden Nature Area in Berkeley offers naturalist-led programs that include apple cider pressing, and its weekend programs are free and drop-in.",
      },
      {
        q: "Where can I buy Halloween costumes for kids in the Bay Area?",
        a: "House of Humor in Redwood City is Northern California's largest costume retailer, with costumes for toddlers through adults; go early in October for the best selection. Affordable Treasures in Los Gatos carries an extensive costume selection along with party supplies. For DIY costumes, Mendel's Far Out Fabrics on Haight Street in San Francisco sells faux fur, face paint, masks, and costume-making supplies.",
      },
      {
        q: "What other fall activities can Bay Area families do?",
        a: "Fall is monarch butterfly season at Natural Bridges State Beach in Santa Cruz, California's only State Monarch Butterfly Preserve: the butterflies arrive October through January, peaking in November and December, and the boardwalk is stroller and wheelchair accessible. Winter Lodge in Palo Alto, the only permanent outdoor ice skating rink west of the Sierras, opens in mid-October and runs through mid-April, with group classes for kids 5 and up.",
      },
    ],
    zh: [
      {
        q: "湾区最适合带孩子去的南瓜园在哪里？",
        a: "Half Moon Bay 是湾区的南瓜园之都：92 号公路沿线的农场，比如 Lemos Farm，有干草车、玉米迷宫、骑小马和摘南瓜，一年一度的 Art & Pumpkin Festival 吸引成千上万的游客。Lemos Farm 还有小火车、可以看小山羊和小兔子的动物园，以及农场滑梯。东湾 Brentwood 的 Three Nunns Farm 10 月有南瓜，还有免费拖拉机车和玉米迷宫。San Jose 的 Emma Prusch Farm Park 每年秋天举办南瓜节。能选工作日就选工作日，因为秋季周末 92 号公路会非常堵。",
      },
      {
        q: "湾区附近哪里可以带孩子摘苹果或参加丰收节？",
        a: "Watsonville 的 Gizdich Ranch 9 月到 11 月可以自摘苹果，秋季周末有古董苹果压榨机演示，Pie Shop 有自制派。Fremont 的 Ardenwood Historic Farm 有玉米收获、Harvest Festival 等季节性活动，还有马拉火车。Berkeley 的 Tilden Nature Area 有博物学家带领的活动，包括压榨苹果汁，周末活动免费，随到随参加。",
      },
      {
        q: "湾区哪里可以买儿童万圣节服装？",
        a: "Redwood City 的 House of Humor 是北加州最大的服装店，从幼儿到成人的服装都有；10 月初去选择最多。Los Gatos 的 Affordable Treasures 有大量服装和派对用品。想自己动手做服装，可以去旧金山 Haight Street 的 Mendel's Far Out Fabrics，那里卖人造毛、面部彩绘颜料、面具和服装制作材料。",
      },
      {
        q: "湾区家庭秋天还能做些什么？",
        a: "秋天是 Santa Cruz 的 Natural Bridges State Beach 的帝王蝶季节，这里是加州唯一的州立帝王蝶保护区：帝王蝶 10 月到次年 1 月到来，11 月和 12 月最多，木栈道可通行婴儿车和轮椅。Palo Alto 的 Winter Lodge 是 Sierra 山脉以西唯一的永久性户外溜冰场，10 月中旬开放到次年 4 月中旬，有 5 岁起的儿童团体课。",
      },
    ],
  },
  "museums": {
    headingEn: "Bay Area Children's Museums FAQ",
    headingZh: "湾区儿童博物馆常见问题",
    en: [
      {
        q: "What are the best children's museums in the Bay Area?",
        a: "Top Bay Area children's museums include the Children's Discovery Museum of San Jose (the largest children's museum west of the Mississippi, with water play, a real fire truck to climb, and a bubbles exhibit), the Bay Area Discovery Museum in Sausalito (hands-on exhibits at the foot of the Golden Gate Bridge, daily Maker Labs, and the outdoor Lookout Cove with tide pools and caves), the Children's Creativity Museum in San Francisco's Yerba Buena Gardens (kids make animations and music videos, plus a historic carousel), and MOCHA - Museum of Children's Art in Old Oakland (open studios and Saturday drop-in sessions). Check each museum's website for current hours and admission.",
      },
      {
        q: "What are the best science museums for kids in the Bay Area?",
        a: "The Bay Area's best science museums for kids are the Exploratorium on San Francisco's Pier 15 (over 650 interactive exhibits, plus the Tactile Dome for older kids), the California Academy of Sciences in Golden Gate Park (an aquarium, planetarium, rainforest dome, and natural history museum under one living roof), The Tech Interactive in San Jose (kids design roller coasters, code robots, and explore biotech), Chabot Space & Science Center in the Oakland Hills (planetarium shows and real telescopes, with Friday and Saturday night viewings), and the Lawrence Hall of Science in Berkeley (hands-on exhibits, a planetarium, and an outdoor science park with Bay views).",
      },
      {
        q: "Which Bay Area museums are best for toddlers and preschoolers?",
        a: "For toddlers and preschoolers, try the Children's Discovery Museum of San Jose (bring extra clothes for the water play area), the Bay Area Discovery Museum in Sausalito (indoor and outdoor exhibits designed for young children; weekday mornings are less crowded), the Randall Museum in San Francisco (a live animal room with snakes, owls, and rodents), and the Lawrence Hall of Science in Berkeley. The Children's Creativity Museum in Yerba Buena Gardens also welcomes kids from age 2.",
      },
      {
        q: "Are there free museums or free days for kids in the Bay Area?",
        a: "Yes. The Randall Museum in San Francisco is free, with live animals, art studios, and a woodworking shop. The Maritime Museum and Visitor Center at San Francisco Maritime National Historical Park are free, and Fort Point National Historic Site under the Golden Gate Bridge has free admission with ranger-led tours on weekends. Several museums also offer resident free days: the Exploratorium on the first Wednesday for SF residents, the Children's Discovery Museum of San Jose on the first Wednesday for San Jose residents, and the California Academy of Sciences quarterly for SF residents. Confirm free-day dates on each museum's website.",
      },
    ],
    zh: [
      {
        q: "湾区最好的儿童博物馆有哪些？",
        a: "湾区顶尖的儿童博物馆包括 Children's Discovery Museum of San Jose（密西西比河以西最大的儿童博物馆，有玩水区、可以爬的真消防车和泡泡展区）、Sausalito 的 Bay Area Discovery Museum（位于金门大桥脚下，有动手展品、每日 Maker Labs，以及有潮池和洞穴的户外 Lookout Cove）、旧金山 Yerba Buena Gardens 的 Children's Creativity Museum（孩子可以制作动画和音乐视频，还有一座历史悠久的旋转木马），以及 Old Oakland 的 MOCHA - Museum of Children's Art（开放工作室和周六随到随参加的活动）。最新开放时间和门票请查看各博物馆官网。",
      },
      {
        q: "湾区最适合孩子的科学博物馆有哪些？",
        a: "湾区最适合孩子的科学博物馆有：旧金山 Pier 15 的 Exploratorium（650 多件互动展品，还有适合大孩子的 Tactile Dome）、金门公园的 California Academy of Sciences（水族馆、天文馆、雨林穹顶和自然历史博物馆都在同一个“活屋顶”下）、San Jose 的 The Tech Interactive（孩子可以设计过山车、给机器人编程、探索生物科技）、Oakland Hills 的 Chabot Space & Science Center（天文馆节目和真正的望远镜，周五、周六晚上有观星活动），以及 Berkeley 的 Lawrence Hall of Science（动手展品、天文馆，以及能看到海湾景色的户外科学公园）。",
      },
      {
        q: "湾区哪些博物馆最适合幼儿和学龄前儿童？",
        a: "幼儿和学龄前儿童可以去 Children's Discovery Museum of San Jose（玩水区记得带换洗衣服）、Sausalito 的 Bay Area Discovery Museum（为低龄儿童设计的室内外展区；工作日上午人较少）、旧金山的 Randall Museum（活体动物室里有蛇、猫头鹰和啮齿动物），以及 Berkeley 的 Lawrence Hall of Science。Yerba Buena Gardens 的 Children's Creativity Museum 也欢迎 2 岁起的孩子。",
      },
      {
        q: "湾区有免费博物馆或儿童免费日吗？",
        a: "有。旧金山的 Randall Museum 免费开放，有活体动物、艺术工作室和木工坊。San Francisco Maritime National Historical Park 的 Maritime Museum 和游客中心免费，金门大桥下的 Fort Point National Historic Site 也免费参观，周末有护林员导览。几家博物馆还提供居民免费日：Exploratorium 每月第一个周三对旧金山居民免费，Children's Discovery Museum of San Jose 每月第一个周三对 San Jose 居民免费，California Academy of Sciences 每季度为旧金山居民提供免费日。免费日的具体日期请以各博物馆官网为准。",
      },
    ],
  },
  "indoor-playgrounds": {
    headingEn: "Indoor Playgrounds FAQ",
    headingZh: "湾区室内游乐场常见问题",
    en: [
      {
        q: "What are the best indoor playgrounds in the Bay Area?",
        a: "Top indoor playgrounds include WOW Kids Playground in San Francisco (multi-level structures, slides, and climbing elements on Polk Street), La Petite Playhouse in Redwood City (10,000 sq ft with a baby-and-toddler soft-play area), KidTopia in Fremont (the East Bay's largest soft-play indoor playground), Luv 2 Play at Eastridge Mall in San Jose (13,000 sq ft across two floors), and Bay Play in Oakland (four levels with climbing walls and a ninja ropes course). For trampolines, try Sky Zone in Fremont or Dublin, or House of Air in the Presidio.",
      },
      {
        q: "Which indoor play spaces in the Bay Area are best for toddlers and younger children?",
        a: "For toddlers and younger children, try Lemon Tree Play Cafe in Santa Clara (ages 6 months to 3.5 years, with a cafe for parents), La Petite Playhouse in Redwood City, KidTopia in Fremont (a dedicated baby and toddler playground; bring socks), WOW Kids Playground in San Francisco, Imagination City in San Mateo (a child-sized role-play city), and Jumpity Bumpity in Pleasanton's Stoneridge Mall (a two-level soft play structure and a toddler zone). Sky Zone Dublin also runs toddler-only jump sessions for ages 6 and under.",
      },
      {
        q: "Are there free or low-cost indoor play options for kids in the Bay Area?",
        a: "Yes. Free indoor options include the Randall Museum in San Francisco (live animals, art studios, and a woodworking shop), the play-to-learn space at the SF Public Library's Fisher Children's Center, Oakland Public Library children's programs (storytimes, science experiments, and crafting), and San Jose Public Library story times. The Junior Center of Art and Science in Oakland has free drop-in hours, and East Bay Depot for Creative Reuse in Oakland sells donated craft materials at low prices for projects at home.",
      },
      {
        q: "What indoor play and trampoline parks are in the South Bay near San Jose?",
        a: "Near San Jose, try Luv 2 Play at Eastridge Mall (two floors with ball pits, slides, and an arcade), Whirlygig on The Alameda (ages 8 weeks to 8 years), Altitude Trampoline Park in South San Jose (trampolines, dodgeball, and a ninja warrior course), Lemon Tree Play Cafe in Santa Clara, and the Children's Discovery Museum of San Jose. For STEM-themed indoor play, The Tech Interactive in San Jose lets kids design roller coasters and code robots. KidTopia is a short drive north in Fremont.",
      },
    ],
    zh: [
      {
        q: "湾区最好的室内游乐场有哪些？",
        a: "湾区顶尖的室内游乐场有：旧金山 Polk Street 的 WOW Kids Playground（多层游乐结构、滑梯和攀爬设施）、Redwood City 的 La Petite Playhouse（10,000 平方英尺，有婴幼儿软体游乐区）、Fremont 的 KidTopia（东湾最大的软体室内游乐场）、San Jose Eastridge Mall 的 Luv 2 Play（两层共 13,000 平方英尺），以及 Oakland 的 Bay Play（四层结构，有攀岩墙和忍者绳索障碍）。想玩蹦床，可以去 Fremont 或 Dublin 的 Sky Zone，或者 Presidio 的 House of Air。",
      },
      {
        q: "湾区哪些室内游乐场最适合幼儿和低龄孩子？",
        a: "幼儿和低龄孩子可以去 Santa Clara 的 Lemon Tree Play Cafe（6 个月到 3 岁半，家长可以在咖啡区休息）、Redwood City 的 La Petite Playhouse、Fremont 的 KidTopia（专门的婴幼儿游乐区；记得带袜子）、旧金山的 WOW Kids Playground、San Mateo 的 Imagination City（儿童尺寸的角色扮演小城），以及 Pleasanton Stoneridge Mall 里的 Jumpity Bumpity（两层软体游乐结构和幼儿区）。Sky Zone Dublin 也有专门给 6 岁及以下孩子的幼儿跳床时段。",
      },
      {
        q: "湾区有免费或低成本的室内游乐选择吗？",
        a: "有。免费的室内去处包括旧金山的 Randall Museum（活体动物、艺术工作室和木工坊）、SF Public Library 的 Fisher Children's Center 的 play-to-learn 互动区、Oakland Public Library 的儿童活动（故事时间、科学实验和手工），以及 San Jose Public Library 的故事时间。Oakland 的 Junior Center of Art and Science 有免费的随到随参加时段，Oakland 的 East Bay Depot for Creative Reuse 以很低的价格出售捐赠的手工材料，方便在家做手工。",
      },
      {
        q: "San Jose 附近的南湾有哪些室内游乐场和蹦床公园？",
        a: "在 San Jose 附近，可以去 Eastridge Mall 的 Luv 2 Play（两层，有球池、滑梯和游戏厅）、The Alameda 上的 Whirlygig（8 周到 8 岁）、南 San Jose 的 Altitude Trampoline Park（蹦床、躲避球和忍者勇士障碍赛道）、Santa Clara 的 Lemon Tree Play Cafe，以及 Children's Discovery Museum of San Jose。想玩 STEM 主题的室内活动，San Jose 的 The Tech Interactive 可以让孩子设计过山车、给机器人编程。往北开一小段就是 Fremont 的 KidTopia。",
      },
    ],
  },
  "kids-5-8": {
    headingEn: "Kids 5\u20138 Activities FAQ",
    headingZh: "湾区 5–8 岁儿童活动常见问题",
    en: [
      {
        q: "What are the best indoor activities for kids ages 5–8 in the Bay Area?",
        a: "Top indoor picks for kids 5–8 include the Exploratorium on Pier 15 in San Francisco (over 650 interactive exhibits), the Children's Discovery Museum of San Jose (water play, a real fire truck to climb, and a bubbles exhibit), The Tech Interactive in San Jose (kids design roller coasters and code robots), the Lawrence Hall of Science in Berkeley (hands-on exhibits and planetarium shows), and the Children's Creativity Museum in San Francisco's Yerba Buena Gardens, where kids create animations and music videos. Check each venue's website for current hours.",
      },
      {
        q: "What outdoor adventures are good for kids ages 5–8 in the Bay Area?",
        a: "Outdoor adventures for kids 5–8 include the Tilden Park Steam Trains in Berkeley (miniature steam trains through redwood groves since 1952) and Tilden Little Farm nearby, Adventure Playground in Berkeley (kids build forts with real hammers, nails, and saws; closed-toe shoes required), the flat main boardwalk trail at Muir Woods National Monument in Mill Valley, Shoreline Park in Mountain View (pedal boats and the Scow Schooner Playground), the Oakland Zoo, and Magical Bridge Playground in Palo Alto, designed for children of all abilities.",
      },
      {
        q: "What STEM classes and programs are available for 5–8 year olds in the Bay Area?",
        a: "STEM programs for kids 5–8 include Code Ninjas in Cupertino (kids learn to code by building video games, starting with Scratch), Young Engineers LEGO Learning Center in Sunnyvale (motorized LEGO models with gears and motors), MakerKids in San Jose (its Mini Makers program for grades 1–2 covers coding and robotics), Mad Science of the Bay Area in Fremont (hands-on STEM for ages 4–12), and the daily Maker Labs at the Bay Area Discovery Museum in Sausalito. Robot building workshops at The Tech Interactive in San Jose fill up fast.",
      },
      {
        q: "Where can kids ages 5–8 take art and music classes in the Bay Area?",
        a: "Art and music options for kids 5–8 include the San Francisco Children's Art Center at Fort Mason (drawing, painting, and clay for ages 22 months to 10), MOCHA - Museum of Children's Art in Old Oakland (Saturday drop-in sessions), the Junior Center of Art and Science on Lake Merritt in Oakland (classes for ages 6–13, with free drop-in hours), Color Me Mine in San Jose (walk-in pottery painting), Crowden Music Center in Berkeley (Suzuki strings from age 3), and art studios at the free Randall Museum in San Francisco.",
      },
    ],
    zh: [
      {
        q: "湾区适合 5–8 岁孩子的室内活动有哪些？",
        a: "适合 5–8 岁孩子的室内首选有：旧金山 Pier 15 的 Exploratorium（650 多件互动展品）、Children's Discovery Museum of San Jose（玩水区、可以爬的真消防车和泡泡展区）、San Jose 的 The Tech Interactive（孩子可以设计过山车、给机器人编程）、Berkeley 的 Lawrence Hall of Science（动手展品和天文馆节目），以及旧金山 Yerba Buena Gardens 的 Children's Creativity Museum，孩子可以在那里制作动画和音乐视频。最新开放时间请查看各场馆官网。",
      },
      {
        q: "湾区适合 5–8 岁孩子的户外活动有哪些？",
        a: "适合 5–8 岁孩子的户外活动有：Berkeley 的 Tilden Park Steam Trains（自 1952 年起穿行红杉林的迷你蒸汽火车）和附近的 Tilden Little Farm、Berkeley 的 Adventure Playground（孩子用真锤子、钉子和锯子搭堡垒；须穿包头鞋）、Mill Valley 的 Muir Woods National Monument 平坦的主木栈道、Mountain View 的 Shoreline Park（脚踏船和 Scow Schooner Playground）、Oakland Zoo，以及 Palo Alto 为各种能力的孩子设计的 Magical Bridge Playground。",
      },
      {
        q: "湾区有哪些适合 5–8 岁孩子的 STEM 课程？",
        a: "适合 5–8 岁孩子的 STEM 课程有：Cupertino 的 Code Ninjas（通过制作电子游戏学编程，从 Scratch 起步）、Sunnyvale 的 Young Engineers LEGO Learning Center（用齿轮和马达搭建电动乐高模型）、San Jose 的 MakerKids（面向一、二年级的 Mini Makers 课程涵盖编程和机器人）、Fremont 的 Mad Science of the Bay Area（面向 4–12 岁的动手 STEM 活动），以及 Sausalito 的 Bay Area Discovery Museum 每天的 Maker Labs。San Jose 的 The Tech Interactive 的机器人制作工作坊很快就会报满。",
      },
      {
        q: "湾区哪里可以让 5–8 岁孩子上美术和音乐课？",
        a: "适合 5–8 岁孩子的美术和音乐课有：Fort Mason 的 San Francisco Children's Art Center（素描、绘画和陶土，面向 22 个月到 10 岁）、Old Oakland 的 MOCHA - Museum of Children's Art（周六随到随参加）、Oakland Lake Merritt 边的 Junior Center of Art and Science（面向 6–13 岁的课程，并有免费的随到随参加时段）、San Jose 的 Color Me Mine（随到随画的陶艺彩绘）、Berkeley 的 Crowden Music Center（Suzuki 弦乐 3 岁起），以及旧金山免费的 Randall Museum 的艺术工作室。",
      },
    ],
  },
  "toddlers-2-5": {
    headingEn: "Toddler Activities FAQ",
    headingZh: "湾区 2–5 岁幼儿活动常见问题",
    en: [
      {
        q: "What are the best toddler activities in the Bay Area?",
        a: "Top activities for toddlers (ages 2–5) include the Bay Area Discovery Museum in Sausalito (hands-on exhibits, outdoor play areas, and art studios), Children's Fairyland in Oakland (a storybook theme park on Lake Merritt with puppet shows, gentle rides, and a petting zoo), Tilden Little Farm in Berkeley (a free petting farm), La Petite Playhouse in Redwood City (giant multi-level play structures), and seasonal splash parks such as Castro Valley Splash Park and Larkey Sprayground in Walnut Creek. Check each venue's website for current hours.",
      },
      {
        q: "Where can toddlers play indoors in the Bay Area?",
        a: "Indoor toddler play spaces include La Petite Playhouse in Redwood City, WOW Kids Playground in San Francisco (multi-level structures and slides designed for younger children), Lemon Tree Play Cafe in Santa Clara (for ages 6 months to 3.5 years), Imagination City in San Mateo's Hillsdale Shopping Center (a child-sized role-play city, open for play on weekdays; book online), KidTopia in Fremont (a dedicated baby and toddler playground), and the hands-on exhibits at the Bay Area Discovery Museum in Sausalito.",
      },
      {
        q: "Are there free activities for toddlers in the Bay Area?",
        a: "Yes. Free toddler picks include Tilden Little Farm in Berkeley (free admission, open 365 days a year; bring celery and lettuce for the animals), Magical Bridge Playground in Palo Alto (inclusive play for children of all abilities), Mia's Dream Come True Playground in Hayward, the 24th & York Mini Park splash pad in San Francisco's Mission District (water features run in warmer months), and free weekly story times at San Jose Public Library branches and toddler tales at the SF Public Library's Fisher Children's Center.",
      },
      {
        q: "What stroller-friendly activities are available for toddlers in San Francisco?",
        a: "Stroller-friendly toddler outings in San Francisco include Koret Children's Quarter in Golden Gate Park (the oldest public children's playground in the US, with concrete slides and a carousel), Yerba Buena Gardens Playground atop the Moscone Center (a sandy play area steps from the Children's Creativity Museum), Crissy Field's waterfront promenade and sandy beach, and the 24th & York Mini Park splash pad in the Mission. In Sausalito, just across the Golden Gate Bridge, the Bay Area Discovery Museum has outdoor areas that are great even on foggy days.",
      },
    ],
    zh: [
      {
        q: "湾区适合幼儿的活动有哪些？",
        a: "适合 2–5 岁幼儿的首选有：Sausalito 的 Bay Area Discovery Museum（动手展品、户外游乐区和艺术工作室）、Oakland 的 Children's Fairyland（Lake Merritt 边的童话主题乐园，有木偶剧、温和的游乐设施和小动物园）、Berkeley 的 Tilden Little Farm（免费小农场）、Redwood City 的 La Petite Playhouse（巨型多层游乐结构），以及季节性戏水乐园，比如 Castro Valley Splash Park 和 Walnut Creek 的 Larkey Sprayground。最新开放时间请查看各场地官网。",
      },
      {
        q: "湾区幼儿可以去哪里室内玩？",
        a: "室内幼儿游乐去处有：Redwood City 的 La Petite Playhouse、旧金山的 WOW Kids Playground（专为低龄儿童设计的多层游乐结构和滑梯）、Santa Clara 的 Lemon Tree Play Cafe（6 个月到 3 岁半）、San Mateo Hillsdale Shopping Center 里的 Imagination City（儿童尺寸的角色扮演小城，工作日开放游玩；需在线预约）、Fremont 的 KidTopia（专门的婴幼儿游乐区），以及 Sausalito 的 Bay Area Discovery Museum 的动手展品。",
      },
      {
        q: "湾区有适合幼儿的免费活动吗？",
        a: "有。免费的幼儿去处有：Berkeley 的 Tilden Little Farm（免费入园，全年 365 天开放；带芹菜和生菜喂动物）、Palo Alto 的 Magical Bridge Playground（为各种能力的孩子设计的无障碍游乐场）、Hayward 的 Mia's Dream Come True Playground、旧金山 Mission 区的 24th & York Mini Park 戏水池（天气暖和时开放喷水），以及 San Jose Public Library 各分馆每周的免费故事时间和 SF Public Library 的 Fisher Children's Center 的 toddler tales（幼儿故事时间）。",
      },
      {
        q: "旧金山有哪些适合推婴儿车带幼儿去的地方？",
        a: "旧金山适合推婴儿车的幼儿去处有：金门公园的 Koret Children's Quarter（全美最古老的公共儿童游乐场，有水泥滑梯和旋转木马）、Moscone Center 楼顶的 Yerba Buena Gardens Playground（有沙坑游乐区，离 Children's Creativity Museum 只有几步路）、Crissy Field 的海滨步道和沙滩，以及 Mission 区的 24th & York Mini Park 戏水池。过了金门大桥就是 Sausalito，那里的 Bay Area Discovery Museum 的户外区域即使在雾天也很好玩。",
      },
    ],
  },
  "tweens-8-12": {
    headingEn: "Tweens Activities FAQ",
    headingZh: "湾区 8–12 岁大孩子活动常见问题",
    en: [
      {
        q: "What are the best activities for tweens (ages 8–12) in the Bay Area?",
        a: "Top tween picks include climbing at Berkeley Ironworks, the Movement gyms in San Francisco, Belmont, and Sunnyvale, or Diablo Rock Gym in Concord; trampoline parks such as Sky Zone in Fremont and Dublin and House of Air in the Presidio; California's Great America in Santa Clara; the two-story arena at Laser Tagging Inc. in Newark; and bowling and Japanese arcade games at Round1 in San Jose, Concord, and Hayward. Outdoors, drive to the summit at Mount Diablo State Park or hike the Stream Trail at Redwood Regional Park in Oakland.",
      },
      {
        q: "What after-school programs and classes are available for 8–12 year olds in the Bay Area?",
        a: "After-school options for tweens include Code Ninjas in Cupertino (coding that progresses from Scratch to JavaScript), STEM4Kids in Cupertino (robots, game design, and engineering models for ages 6–17), and theCoderSchool in Palo Alto (personalized coaching for ages 7–18). Halberstadt Fencers' Club in San Francisco, the city's oldest fencing club, teaches foil, sabre, and epee. Berkeley Ironworks and Diablo Rock Gym in Concord run youth classes and climbing teams, and the Junior Center of Art and Science in Oakland offers after-school art and science classes.",
      },
      {
        q: "Where can tweens go with friends in the Bay Area?",
        a: "Good group outings include bowling at Lucky Strike Alameda or Lucky Strike San Francisco, indoor mini golf at Urban Putt in downtown San Jose (families welcome before 8pm) or outdoor mini golf at Stagecoach Greens in San Francisco's Mission Bay, arcades and karaoke at Round1 (San Jose, Concord, Hayward), and ice skating at Nazareth Ice Oasis in San Mateo, Oakland Ice Center, or Snoopy's Home Ice in Santa Rosa. Farther afield, Roaring Camp Railroads in Felton and the Santa Cruz Beach Boardwalk (free admission, pay per ride) are popular.",
      },
    ],
    zh: [
      {
        q: "湾区适合 8–12 岁大孩子的活动有哪些？",
        a: "适合大孩子的首选有：攀岩，可以去 Berkeley Ironworks、旧金山、Belmont 和 Sunnyvale 的 Movement 攀岩馆，或者 Concord 的 Diablo Rock Gym；蹦床公园，比如 Fremont 和 Dublin 的 Sky Zone，以及 Presidio 的 House of Air；Santa Clara 的 California's Great America；Newark 的 Laser Tagging Inc. 的两层激光枪战场；还有 San Jose、Concord 和 Hayward 的 Round1 的保龄球和日本街机。户外的话，可以开车到 Mount Diablo State Park 山顶，或者在 Oakland 的 Redwood Regional Park 走 Stream Trail。",
      },
      {
        q: "湾区有哪些适合 8–12 岁孩子的课后班和课程？",
        a: "适合大孩子的课后选择有：Cupertino 的 Code Ninjas（编程从 Scratch 进阶到 JavaScript）、Cupertino 的 STEM4Kids（面向 6–17 岁，搭建机器人、设计游戏和制作工程模型），以及 Palo Alto 的 theCoderSchool（面向 7–18 岁的个性化辅导）。旧金山的 Halberstadt Fencers' Club 是该市历史最悠久的击剑俱乐部，教授花剑、佩剑和重剑。Berkeley Ironworks 和 Concord 的 Diablo Rock Gym 开设青少年课程和攀岩队，Oakland 的 Junior Center of Art and Science 提供课后美术和科学课。",
      },
      {
        q: "湾区大孩子可以和朋友去哪里玩？",
        a: "适合结伴出游的去处有：Lucky Strike Alameda 或 Lucky Strike San Francisco 打保龄球，San Jose 市中心的 Urban Putt 玩室内迷你高尔夫（晚上 8 点前欢迎家庭）或旧金山 Mission Bay 的 Stagecoach Greens 玩户外迷你高尔夫，Round1（San Jose、Concord、Hayward）玩街机和卡拉 OK，以及在 San Mateo 的 Nazareth Ice Oasis、Oakland Ice Center 或 Santa Rosa 的 Snoopy's Home Ice 滑冰。走远一点，Felton 的 Roaring Camp Railroads 和 Santa Cruz Beach Boardwalk（免费入园，游乐设施按次付费）都很受欢迎。",
      },
    ],
  },
  "rainy-day": {
    headingEn: "Rainy Day Activities FAQ",
    headingZh: "湾区雨天亲子活动常见问题",
    en: [
      {
        q: "What are the best rainy day activities for kids in the Bay Area?",
        a: "Top rainy-day picks include the Exploratorium in San Francisco (over 650 interactive exhibits), the Children's Discovery Museum of San Jose, the California Academy of Sciences in Golden Gate Park (an aquarium, planetarium, and rainforest dome), the Children's Creativity Museum in San Francisco, The Tech Interactive in San Jose, and Chabot Space & Science Center in Oakland. To burn off energy, Sky Zone Trampoline Park in Fremont is a good rainy-day pick, and Color Me Mine in San Jose is a walk-in pottery painting studio.",
      },
      {
        q: "Are there free indoor activities for kids on rainy days in the Bay Area?",
        a: "Yes. Free rainy-day options include the Randall Museum in San Francisco (live animals, science exhibits, and a woodworking shop), the SF Public Library's Fisher Children's Center (story times and a play-to-learn space), San Jose Public Library story times in English and Chinese, Oakland Public Library children's programs (storytimes, science experiments, and crafting), and the free drop-in hours at the Junior Center of Art and Science in Oakland. Hours vary by location and season, so check each venue's website for current details.",
      },
      {
        q: "Where can toddlers go on rainy days in the Bay Area?",
        a: "For toddlers on a rainy day, try the Bay Area Discovery Museum in Sausalito, the Children's Discovery Museum of San Jose (bring extra clothes for the water play area), La Petite Playhouse in Redwood City, Jumpity Bumpity in Pleasanton (a soft play structure and toddler-friendly zone inside Stoneridge Mall), and The Little Gym in San Jose, which runs parent-child gymnastics classes starting at 4 months. Sky Zone Trampoline Park in Fremont has a dedicated toddler zone, and toddler time on weekday mornings is less crowded.",
      },
      {
        q: "What indoor play spaces near San Francisco are good on rainy days?",
        a: "In San Francisco, the Exploratorium on Pier 15, the California Academy of Sciences, the Children's Creativity Museum, WOW Kids Playground on Polk Street, and Little Oceanauts on Ocean Avenue are all indoors, and House of Air in the Presidio has trampolines in a converted airplane hangar (closed Monday and Tuesday). A short drive away, the Lawrence Hall of Science in Berkeley and Chabot Space & Science Center in Oakland add hands-on exhibits and planetarium shows. Check each venue's website for current hours and tickets.",
      },
    ],
    zh: [
      {
        q: "湾区带孩子最好的雨天活动有哪些？",
        a: "雨天首选有：旧金山的 Exploratorium（650 多件互动展品）、Children's Discovery Museum of San Jose、金门公园的 California Academy of Sciences（水族馆、天文馆和雨林穹顶）、旧金山的 Children's Creativity Museum、San Jose 的 The Tech Interactive，以及 Oakland 的 Chabot Space & Science Center。想消耗精力，Fremont 的 Sky Zone Trampoline Park 是雨天的好选择，San Jose 的 Color Me Mine 是随到随画的陶艺彩绘工作室。",
      },
      {
        q: "湾区雨天有免费的室内儿童活动吗？",
        a: "有。免费的雨天去处有：旧金山的 Randall Museum（活体动物、科学展品和木工坊）、SF Public Library 的 Fisher Children's Center（故事时间和 play-to-learn 互动区）、San Jose Public Library 的中英文故事时间、Oakland Public Library 的儿童活动（故事时间、科学实验和手工），以及 Oakland 的 Junior Center of Art and Science 的免费随到随参加时段。开放时间因地点和季节而异，请查看各场馆官网了解最新信息。",
      },
      {
        q: "雨天湾区幼儿可以去哪里？",
        a: "雨天带幼儿，可以去 Sausalito 的 Bay Area Discovery Museum、Children's Discovery Museum of San Jose（玩水区记得带换洗衣服）、Redwood City 的 La Petite Playhouse、Pleasanton 的 Jumpity Bumpity（Stoneridge Mall 里的软体游乐结构和幼儿区），以及 San Jose 的 The Little Gym，那里有 4 个月起的亲子体操课。Fremont 的 Sky Zone Trampoline Park 有专门的幼儿区，工作日上午的幼儿时段人比较少。",
      },
      {
        q: "旧金山附近有哪些适合雨天去的室内游乐场所？",
        a: "在旧金山，Pier 15 的 Exploratorium、California Academy of Sciences、Children's Creativity Museum、Polk Street 的 WOW Kids Playground 和 Ocean Avenue 的 Little Oceanauts 都在室内，Presidio 的 House of Air 在一座改造过的飞机库里，有蹦床（周一、周二闭馆）。开车不远，Berkeley 的 Lawrence Hall of Science 和 Oakland 的 Chabot Space & Science Center 还有动手展品和天文馆节目。最新开放时间和门票请查看各场馆官网。",
      },
    ],
  },
};

/** FAQ entries for a guide in the given locale (EN fallback only for EN). */
export function getGuideFaq(slug: string, locale: string): { heading: string; entries: GuideFaqEntry[] } | null {
  const f = guideFaq[slug];
  if (!f) return null;
  if (locale === "zh") return f.zh.length ? { heading: f.headingZh, entries: f.zh } : null;
  if (locale === "en") return f.en.length ? { heading: f.headingEn, entries: f.en } : null;
  return null;
}
