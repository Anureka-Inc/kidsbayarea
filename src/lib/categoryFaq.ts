import type { Category } from "@/data/places";

// Category-specific FAQ data aligned with real Google Search Console queries.
// Each entry is eligible for FAQ rich results AND extractable by AI engines
// (ChatGPT, Perplexity, Google AIO) as direct answers. Keep answers concrete
// (specific place names + neighborhoods) — generic "many great options"
// answers rarely get cited.

interface FaqEntry {
  q: string;
  a: string;
}

interface CategoryFaqContent {
  en: FaqEntry[];
  zh: FaqEntry[];
}

const FAQ: Record<Category, CategoryFaqContent> = {
  play: {
    en: [
      {
        q: "What are the best playgrounds in the Bay Area?",
        a: "Top Bay Area playgrounds include Magical Bridge Playgrounds (Palo Alto, Sunnyvale, Mountain View), Yerba Buena Gardens playground and Children's Garden (San Francisco), Koret Children's Quarter in Golden Gate Park, Adventure Playground at the Berkeley Marina, Mission Playground splash pad, Shoreline Park playground (Mountain View), Mia's Dream Come True Playground (Hayward), Dennis the Menace Park (Monterey), and the inclusive playgrounds at Burton Park (San Carlos).",
      },
      {
        q: "Where can I find indoor play spaces for kids on rainy days?",
        a: "Bay Area indoor play options include the Exploratorium and Children's Creativity Museum (San Francisco), Bay Area Discovery Museum (Sausalito), Children's Discovery Museum of San Jose, Habitot Children's Museum (Berkeley), the Tech Interactive (San Jose), Chabot Space and Science Center (Oakland), Sky Zone Trampoline Park (Fremont, Dublin), Pump It Up indoor inflatable parks, and Kid-Plex (San Ramon).",
      },
      {
        q: "What trampoline parks and water parks are in the Bay Area?",
        a: "Trampoline parks include Sky Zone Fremont and Dublin, House of Air at the Presidio (SF), and Rockin' Jump in multiple cities. Water parks include Raging Waters San Jose (NorCal's largest), Aqua Adventure Waterpark in Fremont, The Wave Waterpark in Dublin, and seasonal splash pads at Emerald Glen Park, 24th & York Mini Park, and Larkey Sprayground.",
      },
      {
        q: "What are free playgrounds and play activities for Bay Area kids?",
        a: "Free Bay Area play activities include Tilden Little Farm petting zoo (Berkeley), Adventure Playground (Berkeley Marina, just gear is paid), all municipal playgrounds including Magical Bridge sites, Golden Gate Park's Koret Children's Quarter, Yerba Buena Gardens, splash pads at 24th & York and Emerald Glen, the East Bay Depot for Creative Reuse, and Crissy Field beaches.",
      },
      {
        q: "Where are the best Bay Area zoos and animal experiences for kids?",
        a: "Major Bay Area zoos and animal venues include the San Francisco Zoo, Oakland Zoo, Happy Hollow Park & Zoo (San Jose), Tilden Little Farm petting zoo (Berkeley, free), Ardenwood Historic Farm (Fremont), Slide Ranch (Muir Beach), and the Aquarium of the Bay at Pier 39. For wild marine life try Monterey Bay Aquarium (1.5 hours south).",
      },
      {
        q: "Where are the best splash pads and water parks in the Bay Area?",
        a: "Top Bay Area splash pads (free or low-cost): 24th & York Mini Park Splash Pad in San Francisco's Mission District (free), Castro Valley Splash Park (seasonal), Larkey Sprayground in Walnut Creek, Emerald Glen Park Splash Pad in Dublin, Ortega Park Splash Pad in Sunnyvale, and Meadow Homes Spray Park in Concord. For full water parks, Raging Waters San Jose is the largest in Northern California, Aqua Adventure Waterpark is in Fremont, and The Wave Waterpark is in Dublin. Check each venue's website for seasonal hours and admission.",
      },
    ],
    zh: [
      {
        q: "湾区最棒的游乐场有哪些？",
        a: "湾区顶级游乐场包括 Magical Bridge 全龄段无障碍游乐场（Palo Alto、Sunnyvale、Mountain View 三处）、Yerba Buena Gardens 儿童花园和游乐场（旧金山）、金门公园 Koret Children's Quarter、伯克利码头 Adventure Playground、Mission Playground 戏水区、Mountain View 的 Shoreline Park、Hayward 的 Mia's Dream Come True 游乐场。",
      },
      {
        q: "湾区雨天可以带孩子去哪些室内游乐场？",
        a: "湾区雨天室内活动选择包括：旧金山 Exploratorium 和 Children's Creativity Museum、Sausalito 的 Bay Area Discovery Museum、San Jose Children's Discovery Museum、Berkeley Habitot Children's Museum、San Jose 的 The Tech Interactive、Oakland 的 Chabot Space and Science Center、Sky Zone 跳床乐园（Fremont/Dublin）、Pump It Up 充气乐园、San Ramon 的 Kid-Plex。",
      },
      {
        q: "湾区有哪些跳床乐园和水上乐园？",
        a: "湾区跳床乐园：Sky Zone Fremont、Sky Zone Dublin、Presidio 的 House of Air、Rockin' Jump（多家分店）。水上乐园：北加州最大的 Raging Waters San Jose、Fremont 的 Aqua Adventure Waterpark、Dublin 的 The Wave Waterpark；季节性戏水池：Emerald Glen、24th & York Mini Park、Larkey Sprayground。",
      },
      {
        q: "湾区有哪些免费的游乐场和亲子活动？",
        a: "湾区免费遛娃去处：Berkeley 的 Tilden Little Farm 免费动物农场、伯克利码头 Adventure Playground（材料费除外）、所有市政游乐场（含 Magical Bridge 系列）、金门公园 Koret Children's Quarter、Yerba Buena Gardens、24th & York 和 Emerald Glen 戏水区、East Bay Depot for Creative Reuse、Crissy Field 海滩。",
      },
      {
        q: "湾区适合带孩子的动物园有哪些？",
        a: "湾区主要动物园和动物体验场所：旧金山 SF Zoo、Oakland Zoo、San Jose 的 Happy Hollow Park & Zoo、Berkeley 免费的 Tilden Little Farm 触摸动物园、Fremont 的 Ardenwood Historic Farm、Muir Beach 的 Slide Ranch、Pier 39 的 Aquarium of the Bay。再远一些有 1.5 小时车程的 Monterey Bay Aquarium。",
      },
      {
        q: "湾区有哪些戏水区和水上乐园？",
        a: "湾区免费或低价戏水区：旧金山 Mission 区的 24th & York Mini Park Splash Pad（免费）、Castro Valley Splash Park（季节性）、Walnut Creek 的 Larkey Sprayground、Dublin 的 Emerald Glen Park Splash Pad、Sunnyvale 的 Ortega Park Splash Pad、Concord 的 Meadow Homes Spray Park。收费水上乐园：北加州最大的 Raging Waters San Jose、Fremont 的 Aqua Adventure Waterpark、Dublin 的 The Wave Waterpark。请查看各场馆官网获取最新的开放时间和票价。",
      },
    ],
  },
  eat: {
    en: [
      {
        q: "What are the best kid-friendly restaurants in San Francisco?",
        a: "Top kid-friendly San Francisco restaurants include Mel's Drive-In (classic 1950s diner with all-day breakfast), Super Duper Burgers (organic burgers, free pickles), Park Tavern, San Tung (family-style Chinese), Tony's Pizza Napoletana, Lou's Cafe, Tartine Manufactory (bakery + lunch), and pretty much anywhere in Japantown — try Mifune for udon or Benihana for teppanyaki theater.",
      },
      {
        q: "What family-friendly restaurants in the Bay Area have kids' menus and play areas?",
        a: "Bay Area family restaurants with kids' menus include Benihana (Cupertino, Santa Clara, Millbrae, San Jose — teppanyaki entertainment), Spaghetti Factory (downtown San Jose), Homeroom (Oakland — mac & cheese specialist), Lazy Dog Restaurant & Bar (San Jose), In-N-Out Burger, Sizzler (Milpitas), Hobee's (multiple locations, kids eat free Wed 8am-2pm), and Pizza My Heart.",
      },
      {
        q: "Where can I take toddlers and babies to eat in the Bay Area?",
        a: "Toddler-friendly Bay Area restaurants typically have high chairs, changing stations, and shorter wait times for early diners. Try Homeroom (Oakland), Hobee's (kids menu + crayons), Park Chow (SF — outdoor patio), Cafe Reverie (kid-friendly cafe in Cole Valley), Crepevine, and most cafes near playgrounds. Many sushi conveyor-belt restaurants like Sushiritto Sankai entertain little ones.",
      },
      {
        q: "Are there family-friendly restaurants in Oakland and the East Bay?",
        a: "Top kid-friendly Oakland/East Bay restaurants: Homeroom (mac & cheese), Lake Chalet (Lake Merritt views), Jack London Square diners, Hopscotch, Cactus Taqueria, Bakesale Betty, Souley Vegan, Boot & Shoe Service, and Berkeley's Cheese Board Pizza. Many Mexican and Vietnamese spots in Fruitvale and on International Boulevard welcome families.",
      },
    ],
    zh: [
      {
        q: "旧金山有哪些亲子餐厅推荐？",
        a: "旧金山亲子餐厅推荐：Mel's Drive-In 经典 50 年代风格餐车餐厅（全天早餐）、Super Duper Burgers 有机汉堡（免费 pickle）、Park Tavern、San Tung 中式家庭餐厅、Tony's Pizza Napoletana、Lou's Cafe、Tartine Manufactory（面包+午餐）。日本城几乎都欢迎家庭，比如 Mifune 乌冬面或 Benihana 铁板烧表演。",
      },
      {
        q: "湾区有儿童菜单和游乐区的家庭餐厅有哪些？",
        a: "湾区亲子餐厅带儿童菜单：Benihana 铁板烧（Cupertino、Santa Clara、Millbrae、San Jose）、Spaghetti Factory（San Jose 市中心）、Oakland 的 Homeroom（芝士通心粉专门店）、Lazy Dog Restaurant & Bar（San Jose）、In-N-Out Burger、Sizzler（Milpitas）、Hobee's（多家分店，周三 8am-2pm 儿童免费）、Pizza My Heart。",
      },
      {
        q: "湾区带宝宝和幼儿可以去哪些餐厅吃饭？",
        a: "湾区适合带宝宝/幼儿的餐厅通常配备儿童椅、母婴室、且早开餐时间人少：Oakland 的 Homeroom、Hobee's（儿童菜单+蜡笔）、SF 的 Park Chow（户外露台）、Cole Valley 的 Cafe Reverie、Crepevine、以及游乐场附近的咖啡馆。回转寿司店如 Sushiritto Sankai 对小朋友特别有吸引力。",
      },
      {
        q: "Oakland 和东湾有哪些亲子餐厅？",
        a: "Oakland 和东湾亲子餐厅：Homeroom 芝士通心粉、Lake Chalet（Lake Merritt 湖景）、Jack London Square 多家餐厅、Hopscotch、Cactus Taqueria、Bakesale Betty、Souley Vegan、Boot & Shoe Service、Berkeley 的 Cheese Board Pizza。Fruitvale 区和 International Boulevard 上的墨西哥、越南餐厅多数都欢迎家庭。",
      },
    ],
  },
  learn: {
    en: [
      {
        q: "What music classes are available for Bay Area kids?",
        a: "Bay Area music classes include Music Together (Palo Alto, Menlo Park, Sunnyvale, Los Gatos, East Bay franchises), Bach to Rock music school, Suzuki violin/piano programs, Berkeley Music Together, San Francisco Conservatory of Music's Preparatory Division, and community center programs. Mommy & Me music classes typically start at 6 months.",
      },
      {
        q: "What coding and STEM programs are available for Bay Area kids?",
        a: "Bay Area STEM and coding programs include Code Ninjas (Cupertino, North San Jose, Fremont), iD Tech Camps (Stanford and other campuses), CodeREV Kids, Galileo summer camps, ChessKid coding programs, the Tech Interactive's design challenges, Lawrence Hall of Science labs, and Bay Area Steam Academy.",
      },
      {
        q: "Where are the Chinese schools and language immersion programs in the Bay Area?",
        a: "Bay Area Chinese schools include Cupertino Chinese School, Hua Xia Chinese School (multiple campuses), Sing Tao Chinese School, South Bay Chinese School, Berkeley Chinese School, and many community-based Saturday programs. For Mandarin immersion preschools try Yinghua Academy, Chinese American International School, and CAIS Chinatown Y programs.",
      },
      {
        q: "What art classes can kids take in the Bay Area?",
        a: "Bay Area kids' art classes are offered at Studio4Art, the de Young Museum (free family art Saturdays), SFMOMA workshops, the Asian Art Museum's family programs, Color Me Mine ceramic painting, ArtThink (Mountain View), the Randall Museum (San Francisco), and most city recreation departments. Lakeshore Learning offers free Saturday crafts.",
      },
    ],
    zh: [
      {
        q: "湾区有哪些适合孩子的音乐课？",
        a: "湾区音乐课程：Music Together（Palo Alto、Menlo Park、Sunnyvale、Los Gatos、East Bay 多家分校）、Bach to Rock 音乐学校、Suzuki 钢琴/小提琴项目、Berkeley Music Together、San Francisco Conservatory of Music 预备部、各社区中心项目。亲子音乐课（Mommy & Me）通常从 6 个月起报名。",
      },
      {
        q: "湾区有哪些编程和 STEM 课程适合孩子？",
        a: "湾区 STEM 和编程：Code Ninjas（Cupertino、North San Jose、Fremont）、iD Tech Camps（Stanford 等校园）、CodeREV Kids、Galileo 夏令营、ChessKid 编程、The Tech Interactive 设计挑战、Lawrence Hall of Science 实验室、Bay Area Steam Academy。",
      },
      {
        q: "湾区有哪些中文学校和沉浸式课程？",
        a: "湾区中文学校：Cupertino Chinese School、Hua Xia Chinese School（多家校区）、Sing Tao Chinese School、South Bay Chinese School、Berkeley Chinese School，以及众多周末社区项目。中文沉浸幼儿园推荐 Yinghua Academy、Chinese American International School、唐人街 CAIS Y 项目。",
      },
      {
        q: "湾区适合孩子的艺术课有哪些？",
        a: "湾区儿童艺术课程：Studio4Art、de Young Museum（周六免费家庭艺术日）、SFMOMA 工作坊、Asian Art Museum 家庭项目、Color Me Mine 陶瓷彩绘、ArtThink（Mountain View）、SF 的 Randall Museum、各市的康乐部门。Lakeshore Learning 提供周六免费手工活动。",
      },
    ],
  },
  shop: {
    en: [
      {
        q: "What are the best toy stores in the Bay Area?",
        a: "Top Bay Area toy stores include Ambassador Toys (SF), Sweet Dreams (Berkeley), Five Little Monkeys (Berkeley, El Cerrito), Tax-Free Linden Tree Toys (Los Altos), Talbot's Toyland (San Mateo), Quack's of Berkeley, The Ark Toys (Berkeley/Oakland), Mr. Mopps' Children's Books and Toys (Berkeley), and San Marino Toy & Book Shoppe.",
      },
      {
        q: "Where can I find Japanese bookstores and shops for kids in the Bay Area?",
        a: "Bay Area Japanese kids' shops include Kinokuniya Bookstore in San Francisco Japantown (children's books, manga, stationery, character goods) and Daiso stores in Cupertino, Daly City, San Jose, and Mountain View (craft supplies, stationery, kids' items for $1.75 each). Also try Tokio Fish Market and Maido Japan Center for stationery.",
      },
      {
        q: "Where is the IKEA in the Bay Area and is it kid-friendly?",
        a: "The main Bay Area IKEA is at 1700 East Bayshore Road, East Palo Alto, CA. It features Smaland — a supervised free kids' play area for potty-trained children ages 4-10 (sign up early, spots fill fast). The cafeteria has affordable kids' meals under $5 and Swedish meatballs the whole family loves.",
      },
      {
        q: "Where are the educational toy and learning supply stores in the Bay Area?",
        a: "Bay Area educational supply stores include Lakeshore Learning Store (San Jose, San Leandro, Walnut Creek — free Saturday crafts 11am-3pm), Store of Knowledge, Mr. Mopps' Children's Books and Toys (Berkeley), East Bay Depot for Creative Reuse (donation-based art supplies), and museum gift shops at the Tech Interactive, Exploratorium, and Children's Discovery Museum.",
      },
    ],
    zh: [
      {
        q: "湾区最棒的玩具店有哪些？",
        a: "湾区顶级玩具店：Ambassador Toys（SF）、Berkeley 的 Sweet Dreams、Five Little Monkeys（Berkeley、El Cerrito）、Los Altos 的 Linden Tree Toys、San Mateo 的 Talbot's Toyland、Berkeley 的 Quack's、Berkeley/Oakland 的 The Ark Toys、Berkeley 的 Mr. Mopps' Children's Books and Toys、San Marino Toy & Book Shoppe。",
      },
      {
        q: "湾区有哪些日本书店和适合孩子的店？",
        a: "湾区日系亲子购物店：旧金山日本城的 Kinokuniya 书店（童书、漫画、文具、周边）、Cupertino/Daly City/San Jose/Mountain View 的 Daiso（手工材料、文具、儿童用品均 $1.75 起）。还可以去日本城的 Tokio Fish Market 和 Maido 选文具。",
      },
      {
        q: "湾区 IKEA 在哪？适合带孩子吗？",
        a: "湾区主要 IKEA 位于 East Palo Alto 的 1700 East Bayshore Road。店内有 Smaland 免费儿童托管区（接受 4-10 岁会用厕所的小朋友，建议早签到，名额很快满）。餐厅有 $5 以下的儿童套餐和经典瑞典肉丸，全家都爱。",
      },
      {
        q: "湾区有哪些教育玩具和学习用品店？",
        a: "湾区教育用品店：Lakeshore Learning Store（San Jose、San Leandro、Walnut Creek 三家，周六 11am-3pm 免费手工）、Store of Knowledge、Berkeley 的 Mr. Mopps' Children's Books and Toys、East Bay Depot for Creative Reuse（按捐赠制的二手手工材料），以及 The Tech Interactive、Exploratorium、Children's Discovery Museum 的博物馆礼品店。",
      },
    ],
  },
  explore: {
    en: [
      {
        q: "What are the best Bay Area day trips with kids?",
        a: "Top family day trips include Monterey Bay Aquarium (1.5h south), Santa Cruz Beach Boardwalk (free entry, pay per ride), Muir Woods National Monument (parking reservations required via recreation.gov), Angel Island State Park (ferry from Tiburon or SF), Half Moon Bay pumpkin patches (Lemos Farm, Arata's), Roaring Camp Railroads in Felton (steam train rides), Point Reyes National Seashore, and Gilroy Gardens Family Theme Park.",
      },
      {
        q: "Can you visit Muir Woods with kids? What should families know?",
        a: "Yes, Muir Woods is very family-friendly — most trails are stroller-accessible and easy. CRITICAL: A parking reservation is required (book 2+ weeks ahead at recreation.gov; $9 reservation fee + $15 entrance). Visitor center has changing stations. The Main Trail loop is 1 mile, paved/flat. Avoid weekends and arrive before 9am.",
      },
      {
        q: "How do families visit Angel Island State Park with kids?",
        a: "Angel Island is a great family day trip. Take the ferry from Tiburon (~10 min) or San Francisco (~30 min, Pier 41). Once on the island you can rent bikes, take the tram tour (kid-friendly history overview), hike Mount Livermore, or picnic at Ayala Cove. Bring layers — windy. The Civil War-era buildings and Immigration Station offer learning opportunities for older kids.",
      },
      {
        q: "Where can I find Half Moon Bay pumpkin patches and seasonal hayrides?",
        a: "Half Moon Bay pumpkin patches typically open in October. Top picks include Lemos Farm (open year-round with hayrides, train rides, pony rides — admission required), Arata Pumpkin Farm (free entry, hay maze), Pastorino Farms, and the Coastside Farmers Market. Half Moon Bay hosts the world-famous Half Moon Bay Pumpkin Festival in mid-October.",
      },
      {
        q: "Where can I ride a steam train with kids in the Bay Area?",
        a: "Bay Area steam train rides: Tilden Park Steam Trains (Berkeley — Redwood Valley Railway, weekends year-round, $3 per ride), Roaring Camp Railroads in Felton (Santa Cruz Mountains — narrow-gauge steam through redwoods), and the Napa Valley Wine Train (less kid-focused but family-friendly weekend brunches). Ardenwood Historic Farm also has weekend train rides during Railroad Days.",
      },
    ],
    zh: [
      {
        q: "湾区适合带孩子的一日游目的地有哪些？",
        a: "湾区顶级亲子一日游：南向 1.5 小时的 Monterey Bay Aquarium、Santa Cruz Beach Boardwalk（免费入场、按项目付费）、Muir Woods 国家纪念地（需提前在 recreation.gov 预约停车）、Angel Island 州立公园（Tiburon 或 SF 渡轮可达）、Half Moon Bay 南瓜田（Lemos Farm、Arata's）、Felton 的 Roaring Camp 蒸汽火车、Point Reyes 国家海岸、Gilroy Gardens 主题乐园。",
      },
      {
        q: "Muir Woods 适合带孩子去吗？需要注意什么？",
        a: "Muir Woods 非常适合带孩子——多数步道适合推车、平坦易走。重要提醒：必须提前预约停车（建议 2 周前在 recreation.gov 预约，$9 预约费+$15 入园费）。游客中心有母婴室。主步道环线 1 英里、铺装平整。建议避开周末、上午 9 点前到达。",
      },
      {
        q: "怎么带孩子去 Angel Island 州立公园？",
        a: "Angel Island 是绝佳一日游目的地。从 Tiburon（约 10 分钟）或旧金山 Pier 41（约 30 分钟）坐渡轮上岛。岛上可以租自行车、坐观光小火车（亲子友好的历史导览）、徒步 Mount Livermore、在 Ayala Cove 野餐。多带件外套——海风大。岛上的内战时期建筑和移民站对大孩子有教育意义。",
      },
      {
        q: "Half Moon Bay 南瓜田和秋季干草车体验在哪？",
        a: "Half Moon Bay 南瓜田一般 10 月开放。推荐：Lemos Farm 全年开放（干草车、小火车、骑马，需购票）、Arata Pumpkin Farm（免费入场、稻草迷宫）、Pastorino Farms、Coastside Farmers Market。每年 10 月中旬还有世界闻名的 Half Moon Bay Pumpkin Festival。",
      },
      {
        q: "湾区哪里能带孩子坐蒸汽小火车？",
        a: "湾区蒸汽火车体验：Berkeley 的 Tilden Park Steam Trains（Redwood Valley Railway，全年周末运行，$3 一次）、Felton 的 Roaring Camp 窄轨蒸汽火车（穿越红杉林）、Napa Valley Wine Train（家庭友好的周末早午餐线，但不太面向小朋友）。Fremont 的 Ardenwood Historic Farm 在 Railroad Days 周末也有火车。",
      },
    ],
  },
};

export function buildCategoryFaqJsonLd(category: Category, locale: string) {
  const isZh = locale === "zh";
  const entries = isZh ? FAQ[category].zh : FAQ[category].en;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((e) => ({
      "@type": "Question",
      name: e.q,
      acceptedAnswer: { "@type": "Answer", text: e.a },
    })),
  };
}

export function getCategoryFaqEntries(category: Category, locale: string): FaqEntry[] {
  const isZh = locale === "zh";
  return isZh ? FAQ[category].zh : FAQ[category].en;
}
