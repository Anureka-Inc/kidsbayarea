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
        a: "Standout Bay Area playgrounds include Magical Bridge Playground in Palo Alto (inclusive design for kids of all abilities), Outpost Playground at the Presidio in San Francisco (two acres at Presidio Tunnel Tops, with a giant fallen tree), Koret Children's Quarter in Golden Gate Park (the oldest public children's playground in the US, with concrete slides and a carousel), Adventure Playground in Berkeley (kids build forts with real hammers and saws), Mia's Dream Come True Playground in Hayward, and Magic Mountain Playground at Coyote Point in San Mateo (a 42-foot castle and dragons).",
      },
      {
        q: "Where can I find indoor play spaces for kids on rainy days?",
        a: "Rainy-day options include the Exploratorium on Pier 15 in San Francisco (over 650 hands-on exhibits), Children's Creativity Museum in Yerba Buena Gardens (animation and art projects), Children's Discovery Museum of San Jose (water play, a fire truck to climb, and a bubbles room), Chabot Space & Science Center in Oakland (planetarium shows), Imagination City at Hillsdale Shopping Center in San Mateo (a weekday role-play city), KidPlex in San Ramon (toddler room and pretend play for ages 0 to 8), and WOW Kids Playground on Polk Street in San Francisco.",
      },
      {
        q: "What trampoline parks and water parks are in the Bay Area?",
        a: "Trampoline parks include House of Air at Crissy Field in the Presidio (42 conjoined trampolines, plus The Fort for ages 3 to 6), Sky Zone Dublin (foam pit and dodgeball), Sky Zone Trampoline Park in Fremont (toddler zone), Altitude Trampoline Park in South San Jose (ninja course and kids zone), and Urban Air Adventure Park in Concord. Water parks include Raging Waters San Jose (Northern California's largest), Aqua Adventure Waterpark in Fremont (lazy river and toddler splash pad), and The Wave Waterpark in Dublin (open Memorial Day through Labor Day).",
      },
      {
        q: "What are free playgrounds and play activities for Bay Area kids?",
        a: "Free Bay Area play spots include Tilden Little Farm in Berkeley (bring celery and lettuce for the animals), Deer Hollow Farm in Rancho San Antonio Open Space Preserve (goats, sheep, and pigs; closed Mondays), Adventure Playground in Berkeley (weekends during the school year, daily in summer), Helen Diller Playground in Dolores Park, Yerba Buena Gardens Playground atop the Moscone Center, Outpost Playground at the Presidio, and Mia's Dream Come True Playground in Hayward. Slide Ranch at Muir Beach also offers free self-guided visits.",
      },
      {
        q: "Where are the best Bay Area zoos and animal experiences for kids?",
        a: "Bay Area animal outings include San Francisco Zoo & Gardens near Ocean Beach (gorillas, penguins, and the Fisher Family Children's Zoo), Oakland Zoo (a gondola up to the California Trail with grizzly bears and wolves), Happy Hollow Park & Zoo in San Jose (small zoo plus gentle rides), CuriOdyssey at Coyote Point in San Mateo (bobcat and river otter exhibits), Lindsay Wildlife Experience in Walnut Creek (rescued hawks, owls, and snakes), the free Tilden Little Farm in Berkeley, and Ardenwood Historic Farm in Fremont (a Victorian-era working farm).",
      },
      {
        q: "Where are the best splash pads and water parks in the Bay Area?",
        a: "Free Bay Area splash pads include 24th & York Mini Park Splash Pad in San Francisco's Mission District, Emerald Glen Park Splash Pad in Dublin (open Memorial Day through Labor Day), Ortega Park Splash Pad in Sunnyvale (pirate-themed), and Meadow Homes Spray Park in Concord (pirate-themed, open Memorial Day through September). Castro Valley Splash Park and Larkey Sprayground in Walnut Creek charge admission and open seasonally. For full water parks, try Raging Waters San Jose, Aqua Adventure Waterpark in Fremont, or The Wave Waterpark in Dublin. Check each venue's website for hours.",
      },
    ],
    zh: [
      {
        q: "湾区最棒的游乐场有哪些？",
        a: "湾区值得一去的游乐场：Palo Alto 的 Magical Bridge Playground（为各种能力的孩子设计的无障碍游乐场）、旧金山的 Outpost Playground at the Presidio（位于 Presidio Tunnel Tops，占地两英亩，有一棵巨大的倒木）、金门公园的 Koret Children's Quarter（全美最古老的公共儿童游乐场，有水泥滑梯和旋转木马）、Berkeley 的 Adventure Playground（孩子用真的锤子和锯子搭堡垒）、Hayward 的 Mia's Dream Come True Playground、San Mateo Coyote Point 的 Magic Mountain Playground（42 英尺高的城堡和巨龙）。",
      },
      {
        q: "湾区雨天可以带孩子去哪些室内游乐场？",
        a: "雨天室内去处：旧金山 Pier 15 的 Exploratorium（650 多件动手展品）、Yerba Buena Gardens 的 Children's Creativity Museum（动画和艺术创作）、Children's Discovery Museum of San Jose（玩水区、可以爬的消防车、泡泡屋）、Oakland 的 Chabot Space & Science Center（天文馆节目）、San Mateo Hillsdale Shopping Center 里的 Imagination City（工作日开放的职业角色扮演小城）、San Ramon 的 KidPlex（0 到 8 岁，有幼儿房和过家家区）、旧金山 Polk Street 的 WOW Kids Playground。",
      },
      {
        q: "湾区有哪些跳床乐园和水上乐园？",
        a: "跳床乐园：Presidio Crissy Field 的 House of Air（42 张连体蹦床，还有专给 3 到 6 岁孩子的 The Fort）、Sky Zone Dublin（海绵池和躲避球）、Fremont 的 Sky Zone Trampoline Park（幼儿区）、南 San Jose 的 Altitude Trampoline Park（忍者障碍赛道和儿童区）、Concord 的 Urban Air Adventure Park。水上乐园：北加州最大的 Raging Waters San Jose、Fremont 的 Aqua Adventure Waterpark（漂流河和幼儿戏水区）、Dublin 的 The Wave Waterpark（阵亡将士纪念日到劳动节开放）。",
      },
      {
        q: "湾区有哪些免费的游乐场和亲子活动？",
        a: "湾区免费遛娃去处：Berkeley 的 Tilden Little Farm（带芹菜和生菜喂动物）、Rancho San Antonio Open Space Preserve 里的 Deer Hollow Farm（山羊、绵羊、猪；周一闭园）、Berkeley 的 Adventure Playground（上学期间周末开放，夏天每天开放）、Dolores Park 的 Helen Diller Playground、Moscone Center 楼顶的 Yerba Buena Gardens Playground、Outpost Playground at the Presidio、Hayward 的 Mia's Dream Come True Playground。Muir Beach 的 Slide Ranch 也可以免费自助参观。",
      },
      {
        q: "湾区适合带孩子的动物园有哪些？",
        a: "湾区看动物的好去处：Ocean Beach 附近的 San Francisco Zoo & Gardens（大猩猩、企鹅，还有 Fisher Family Children's Zoo）、Oakland Zoo（坐缆车上 California Trail 看灰熊和狼）、San Jose 的 Happy Hollow Park & Zoo（小型动物园加温和的游乐设施）、San Mateo Coyote Point 的 CuriOdyssey（山猫和河獭展区）、Walnut Creek 的 Lindsay Wildlife Experience（获救的鹰、猫头鹰和蛇）、Berkeley 免费的 Tilden Little Farm、Fremont 的 Ardenwood Historic Farm（维多利亚时代风格的农场，至今仍在运营）。",
      },
      {
        q: "湾区有哪些戏水区和水上乐园？",
        a: "湾区免费戏水区：旧金山 Mission 区的 24th & York Mini Park Splash Pad、Dublin 的 Emerald Glen Park Splash Pad（阵亡将士纪念日到劳动节开放）、Sunnyvale 的 Ortega Park Splash Pad（海盗主题）、Concord 的 Meadow Homes Spray Park（海盗主题，阵亡将士纪念日到 9 月开放）。Castro Valley Splash Park 和 Walnut Creek 的 Larkey Sprayground 需要买票，只在季节内开放。想去正规水上乐园，可以选 Raging Waters San Jose、Fremont 的 Aqua Adventure Waterpark 或 Dublin 的 The Wave Waterpark。开放时间请查看各场馆官网。",
      },
    ],
  },
  eat: {
    en: [
      {
        q: "What are the best kid-friendly restaurants in San Francisco?",
        a: "Kid-friendly San Francisco restaurants include Mel's Drive-In (1950s-style diner with jukeboxes, high chairs, and breakfast all day), Super Duper Burgers (organic burgers, a kid-size mini burger, and high chairs), Giorgio's Pizzeria in the Inner Richmond (kids get pizza dough to play with while they wait), Yank Sing (dim sum from pushcarts), Kura Revolving Sushi Bar (conveyor-belt sushi with capsule-toy prizes), and Zazie in Cole Valley (Wednesday Kid's Night with free mac & cheese or ice cream for kids).",
      },
      {
        q: "What family-friendly restaurants in the Bay Area have kids' menus and play areas?",
        a: "Bay Area restaurants that go beyond a kids' menu include Arthur Mac's Tap & Snack in Oakland (outdoor play area with toy cars), Headlands Brewing's Westbrae Biergarten in Berkeley (a big sandbox), Benihana in Cupertino (teppanyaki chefs cooking at the table), The Old Spaghetti Factory in downtown San Jose (eat inside a real trolley car), Lazy Dog Restaurant & Bar in San Jose (kids' menu with real dishes and coloring activities), and Hobee's (kids eat free on Wednesdays 8am to 2pm).",
      },
      {
        q: "Where can I take toddlers and babies to eat in the Bay Area?",
        a: "Toddler-friendly Bay Area spots include Rigolo Cafe in San Francisco's Laurel Heights (play area with a play kitchen, chalkboard, and books), Shalala Ramen in Japantown (room for strollers, high chairs, and kid-size bowls), Denica's Real Food Kitchen in Castro Valley, Walnut Creek, and Dublin (a train table for kids), and Taqueria Talavera in Berkeley (right next to a tot lot). An early dinner seating usually means shorter waits.",
      },
      {
        q: "Are there family-friendly restaurants in Oakland and the East Bay?",
        a: "Family favorites in Oakland and the East Bay include Homeroom in Oakland (a restaurant devoted to mac and cheese), Fentons Creamery in Oakland (ice cream parlor since 1894, featured in Pixar's Up), Cactus Taqueria on Solano Ave and in Rockridge (tiny bean-and-cheese burritos on the kids' menu), Ramen Shop in Rockridge (a dedicated kid's ramen), Legendary Palace in Oakland Chinatown (dim sum from pushcarts), and Arthur Mac's Tap & Snack near MacArthur BART (outdoor play area).",
      },
    ],
    zh: [
      {
        q: "旧金山有哪些亲子餐厅推荐？",
        a: "旧金山亲子餐厅推荐：Mel's Drive-In（50 年代风格餐车餐厅，有点唱机和儿童椅，全天供应早餐）、Super Duper Burgers（有机汉堡，有儿童迷你汉堡和儿童椅）、Inner Richmond 的 Giorgio's Pizzeria（等餐时给孩子一团面团玩）、Yank Sing（推车点心）、Kura Revolving Sushi Bar（回转寿司，集盘子换扭蛋玩具）、Cole Valley 的 Zazie（周三儿童之夜，孩子免费吃芝士通心粉或冰淇淋）。",
      },
      {
        q: "湾区有儿童菜单和游乐区的家庭餐厅有哪些？",
        a: "湾区不只有儿童菜单的亲子餐厅：Oakland 的 Arthur Mac's Tap & Snack（户外游乐区，有玩具车）、Berkeley 的 Headlands Brewing Westbrae Biergarten（大沙坑）、Cupertino 的 Benihana（厨师在桌边表演铁板烧）、San Jose 市中心的 The Old Spaghetti Factory（可以坐在真的老电车里吃饭）、San Jose 的 Lazy Dog Restaurant & Bar（儿童菜单是正经菜，还有涂色活动）、Hobee's（周三 8am-2pm 儿童免费）。",
      },
      {
        q: "湾区带宝宝和幼儿可以去哪些餐厅吃饭？",
        a: "湾区适合带宝宝和幼儿的餐厅：旧金山 Laurel Heights 的 Rigolo Cafe（有玩具厨房、黑板和绘本的游戏区）、日本城的 Shalala Ramen（空间宽敞能放推车，有儿童椅和儿童碗）、Castro Valley / Walnut Creek / Dublin 的 Denica's Real Food Kitchen（有儿童火车桌）、Berkeley 的 Taqueria Talavera（紧挨幼儿游乐场）。早点去吃晚饭通常不用排队。",
      },
      {
        q: "奥克兰和东湾有哪些亲子餐厅？",
        a: "奥克兰和东湾亲子餐厅推荐：Oakland 的 Homeroom（芝士通心粉专门店）、Oakland 的 Fentons Creamery（1894 年开业的冰淇淋店，出现在皮克斯电影《飞屋环游记》里）、Solano Ave 和 Rockridge 的 Cactus Taqueria（儿童菜单有迷你豆子芝士卷饼）、Rockridge 的 Ramen Shop（有专门的儿童拉面）、Oakland 唐人街的 Legendary Palace（推车点心）、MacArthur BART 附近的 Arthur Mac's Tap & Snack（户外游乐区）。",
      },
    ],
  },
  learn: {
    en: [
      {
        q: "What music classes are available for Bay Area kids?",
        a: "Bay Area music options include Music Together (parent-child classes for babies through kindergartners, with locations across the Bay Area), Blue Bear School of Music at Fort Mason in San Francisco (the Little Bears program runs from 4 months to 5 years), Crowden Music Center in Berkeley (Suzuki strings from age 3), Opus 1 Music Studio in Mountain View (group classes from age 3), Veksler Academy of Music & Dance in Sunnyvale and Milpitas (piano from age 3.5), and Notes Music Academy in Oakland (one-on-one lessons). Many offer a trial class.",
      },
      {
        q: "What coding and STEM programs are available for Bay Area kids?",
        a: "Bay Area coding and STEM options include Code Ninjas in Cupertino (kids build video games, moving from Scratch to JavaScript), theCoderSchool (ages 7 to 18, with locations in Palo Alto, Cupertino, Fremont, San Jose, Berkeley, and San Mateo), Breakout Mentors in Palo Alto (one-on-one mentoring by Stanford and UC Berkeley students), TechKnowHow Kids (LEGO robotics for ages 5 to 12), Young Engineers LEGO Learning Center in Sunnyvale, The Tech Interactive in San Jose (design roller coasters, code robots), and Bay Area Discovery Museum in Sausalito (daily Maker Labs).",
      },
      {
        q: "Where are the Chinese schools and language immersion programs in the Bay Area?",
        a: "Chinese options include BACS Bay Area Chinese School in Cupertino (weekend Mandarin and Cantonese classes plus calligraphy, painting, and dance), Hanwen School in Berkeley (Mandarin after-school and Saturday programs, with heritage and non-heritage tracks), Mandarin Academy in Cupertino (K-5 Mandarin immersion), and Shu Ren International School in Berkeley (IB Mandarin immersion, 100% Mandarin in Pre-K). For Spanish, try KSS Immersion Preschools (ages 2 to 6, campuses including Berkeley and Walnut Creek) or Let's Play in Spanish in Campbell. San Jose Public Library offers story times in English and Chinese.",
      },
      {
        q: "What art classes can kids take in the Bay Area?",
        a: "Kids' art options include MOCHA - Museum of Children's Art in Old Oakland (open studios and Saturday drop-in sessions), San Francisco Children's Art Center at Fort Mason (ages 22 months to 10 years; painting, clay, printmaking), Junior Center of Art and Science on Lake Merritt in Oakland (ages 6 to 13, drop-in hours Tuesday to Saturday), the free Randall Museum in Corona Heights (art studios and woodworking classes), The Crucible in Oakland (glass blowing, blacksmithing, and woodworking for ages 8 to 18), and Color Me Mine San Jose (walk-in pottery painting).",
      },
    ],
    zh: [
      {
        q: "湾区有哪些适合孩子的音乐课？",
        a: "湾区音乐课程推荐：Music Together（亲子音乐课，适合婴儿到幼儿园年龄，湾区多处上课点）、旧金山 Fort Mason 的 Blue Bear School of Music（Little Bears 项目面向 4 个月到 5 岁）、Berkeley 的 Crowden Music Center（Suzuki 弦乐 3 岁起）、Mountain View 的 Opus 1 Music Studio（小组课 3 岁起）、Sunnyvale 和 Milpitas 的 Veksler Academy of Music & Dance（钢琴 3.5 岁起）、Oakland 的 Notes Music Academy（一对一课程）。很多机构都提供试听课。",
      },
      {
        q: "湾区有哪些编程和 STEM 课程适合孩子？",
        a: "湾区编程和 STEM 课程推荐：Cupertino 的 Code Ninjas（孩子们自己做电子游戏，从 Scratch 进阶到 JavaScript）、theCoderSchool（7 到 18 岁，在 Palo Alto、Cupertino、Fremont、San Jose、Berkeley、San Mateo 等地有分校）、Palo Alto 的 Breakout Mentors（由 Stanford 和 UC Berkeley 学生一对一辅导）、TechKnowHow Kids（LEGO 机器人课，5 到 12 岁）、Sunnyvale 的 Young Engineers LEGO Learning Center、San Jose 的 The Tech Interactive（设计过山车、给机器人编程）、Sausalito 的 Bay Area Discovery Museum（每天开放 Maker Lab）。",
      },
      {
        q: "湾区有哪些中文学校和沉浸式语言课程？",
        a: "中文课程推荐：Cupertino 的 BACS Bay Area Chinese School（周末普通话和粤语课，另有书法、绘画和舞蹈）、Berkeley 的 Hanwen School（普通话课后班和周六班，分华裔和非华裔两个方向）、Cupertino 的 Mandarin Academy（K-5 中文沉浸式学校）、Berkeley 的 Shu Ren International School（IB 中文沉浸式，Pre-K 阶段 100% 中文）。学西班牙语可以考虑 KSS Immersion Preschools（2 到 6 岁，校区包括 Berkeley 和 Walnut Creek）或 Campbell 的 Let's Play in Spanish。San Jose Public Library 有中英文故事时间。",
      },
      {
        q: "湾区适合孩子的艺术课有哪些？",
        a: "湾区儿童艺术课推荐：Old Oakland 的 MOCHA - Museum of Children's Art（开放工作室和周六随到随学）、Fort Mason 的 San Francisco Children's Art Center（22 个月到 10 岁，有绘画、陶土、版画）、Oakland Lake Merritt 边的 Junior Center of Art and Science（6 到 13 岁，周二到周六有随到随学时段）、Corona Heights 免费的 Randall Museum（艺术工作室和木工课）、Oakland 的 The Crucible（吹玻璃、打铁、木工，8 到 18 岁）、Color Me Mine San Jose（随到随画的陶瓷彩绘）。",
      },
    ],
  },
  shop: {
    en: [
      {
        q: "What are the best toy stores in the Bay Area?",
        a: "Independent Bay Area toy stores include TANTRUM on Clement Street in San Francisco (also in Mill Valley), Mr. Mopps' Toy Shop in Berkeley (open since 1962, skips TV and movie-licensed toys), Montclair Toyhouse (the oldest independently owned toy store in Oakland), Toy Go Round in Albany (new and recycled toys since 1976), Five Little Monkeys on Burlingame Avenue and in downtown Novato, Cheeky Monkey Toys in downtown Menlo Park, The Wooden Horse in Los Gatos, and Toy Crazy at Marin Country Mart in Larkspur.",
      },
      {
        q: "Where can I find Japanese bookstores and shops for kids in the Bay Area?",
        a: "In San Francisco's Japantown, Kinokuniya Bookstore carries Japanese children's books, manga, stationery, and character goods, with toys, plushies, and Studio Ghibli merchandise upstairs. Maido Fine Stationery & Gifts, on the 2nd floor of Japan Center next to Kinokuniya, sells pens, notebooks, stickers, and erasers imported from Japan, and Amiko Kawaii Goods is an authorized Sanrio and Tokidoki seller. Outside the city, try Daiso in Cupertino and at Serramonte Center in Daly City (craft supplies, stationery, small toys) and Sanrio Cupertino.",
      },
      {
        q: "Where is the IKEA in the Bay Area and is it kid-friendly?",
        a: "The Bay Area IKEA in our guide is IKEA East Palo Alto, on the Peninsula, and it is kid-friendly. Its supervised play area, Smaland, takes potty-trained kids ages 4 to 10 while parents shop. Spots are limited, so sign up early on busy days. In the cafeteria, the affordable Swedish meatballs are a family tradition. Check IKEA's website for current hours before you go.",
      },
      {
        q: "Where are the educational toy and learning supply stores in the Bay Area?",
        a: "Lakeshore Learning Store in San Jose stocks educational toys, STEM toys, games, and classroom supplies, and runs a Saturday craft station from 11am to 3pm with no purchase required. Reach And Teach in San Carlos specializes in multicultural toys and diverse children's books. Toy Crazy in Larkspur focuses on developmental toys and science kits. For craft materials, East Bay Depot for Creative Reuse in Oakland and SCRAP Creative Reuse in San Francisco (the nation's oldest creative reuse center, founded in 1976) sell reused art and craft materials at low prices.",
      },
    ],
    zh: [
      {
        q: "湾区最棒的玩具店有哪些？",
        a: "湾区独立玩具店推荐：旧金山 Clement Street 的 TANTRUM（Mill Valley 也有分店）、Berkeley 的 Mr. Mopps' Toy Shop（1962 年开业，不卖电视和电影授权玩具）、Montclair Toyhouse（Oakland 历史最久的独立玩具店）、Albany 的 Toy Go Round（1976 年开业，卖新玩具和二手回收玩具）、Burlingame Avenue 和 Novato 市中心的 Five Little Monkeys、Menlo Park 市中心的 Cheeky Monkey Toys、Los Gatos 的 The Wooden Horse、Larkspur Marin Country Mart 里的 Toy Crazy。",
      },
      {
        q: "湾区有哪些日本书店和适合孩子的店？",
        a: "旧金山日本城的 Kinokuniya Bookstore 有日文童书、漫画、文具和卡通周边，楼上还有玩具、毛绒公仔和吉卜力周边。Japan Center 二楼、紧挨 Kinokuniya 的 Maido Fine Stationery & Gifts 卖日本进口的笔、笔记本、贴纸和橡皮；Amiko Kawaii Goods 是 Sanrio 和 Tokidoki 的授权经销商。旧金山以外，可以去 Cupertino 和 Daly City Serramonte Center 的 Daiso（手工材料、文具、小玩具），以及 Sanrio Cupertino。",
      },
      {
        q: "湾区 IKEA 在哪？适合带孩子吗？",
        a: "本站收录的湾区 IKEA 是半岛的 IKEA East Palo Alto，很适合带孩子。店内有专人看护的儿童游乐区 Smaland，接收 4 到 10 岁、已会自己上厕所的孩子，大人可以安心逛店。名额有限，人多的日子要早点登记。餐厅里价格实惠的瑞典肉丸是很多家庭的保留节目。出发前请查看 IKEA 官网确认营业时间。",
      },
      {
        q: "湾区有哪些教育玩具和学习用品店？",
        a: "San Jose 的 Lakeshore Learning Store 有教育玩具、STEM 玩具、游戏和教学用品，每周六 11am 到 3pm 有手工台，不购物也能参加。San Carlos 的 Reach And Teach 专卖多元文化玩具和多元包容的童书。Larkspur 的 Toy Crazy 主打益智发展类玩具和科学套装。买手工材料可以去 Oakland 的 East Bay Depot for Creative Reuse 和旧金山的 SCRAP Creative Reuse（1976 年成立，全美历史最久的创意再利用中心），两家都以低价出售回收再利用的美术和手工材料。",
      },
    ],
  },
  explore: {
    en: [
      {
        q: "What are the best Bay Area day trips with kids?",
        a: "Popular family day trips include Monterey Bay Aquarium (kelp forest, sea otters, and the Splash Zone for toddlers; buy tickets online in advance), Santa Cruz Beach Boardwalk (California's oldest surviving amusement park, free admission, pay per ride), Muir Woods National Monument in Mill Valley (parking reservation required), Angel Island State Park (ferry from Tiburon or San Francisco), Roaring Camp Railroads in Felton (steam trains through the redwoods), Point Reyes National Seashore (tide pools, elephant seals, lighthouse), and Gilroy Gardens Family Theme Park (gentle rides for younger kids).",
      },
      {
        q: "Can you visit Muir Woods with kids? What should families know?",
        a: "Yes. Muir Woods National Monument in Mill Valley, about 30 minutes from San Francisco, is an old-growth coastal redwood forest with towering 250-foot trees. The main boardwalk trail is flat and stroller-friendly. A parking reservation is required, so book two or more weeks ahead on recreation.gov. Mornings are less crowded and less foggy. Mount Tamalpais State Park, also in Mill Valley, adds a summit view from the paved, flat 0.7-mile Verna Dunshee Trail.",
      },
      {
        q: "How do families visit Angel Island State Park with kids?",
        a: "Angel Island State Park is a car-free island in San Francisco Bay, reached by ferry from Tiburon or San Francisco. From Tiburon the crossing takes about 10 minutes, and the Angel Island Ferry runs daily in summer and on weekends in winter. On the island, families can bike, hike, or take a tram tour; rent bikes there or bring your own on the ferry. The Perimeter Trail has the best views. Pack a lunch, since food options are limited.",
      },
      {
        q: "Where can I find Half Moon Bay pumpkin patches and seasonal hayrides?",
        a: "Half Moon Bay's pumpkin patches line Highway 92, and the annual Art & Pumpkin Festival draws thousands. Lemos Farm, a working family farm, offers hay rides, pony rides, train rides, and a petting zoo, and is especially popular in pumpkin season. Go on a weekday if you can, because Highway 92 gets extremely congested on fall weekends, and bring cash for some farms. In the East Bay, Three Nunns Farm in Brentwood has pumpkins in October, tractor rides, and a fall corn maze.",
      },
      {
        q: "Where can I ride a steam train with kids in the Bay Area?",
        a: "Tilden Park Steam Trains in Berkeley run real miniature steam engines through the redwoods, a tradition since 1952; pair a ride with Tilden Little Farm nearby. Roaring Camp Railroads in Felton runs historic narrow-gauge steam trains through ancient redwood forests, plus a summer Beach Train to Santa Cruz. Vasona Lake County Park in Los Gatos has the Billy Jones Wildcat Railroad, a miniature steam train that runs on weekends and in summer. Ardenwood Historic Farm in Fremont offers horse-drawn train rides instead.",
      },
      {
        q: "What are the best parks and nature spots for kids in the Bay Area?",
        a: "Family-friendly parks include Muir Woods National Monument in Mill Valley (old-growth redwoods, flat boardwalk trail), Redwood Regional Park in Oakland (Stream Trail with a paved first mile, playground at Canyon Meadow), Point Reyes National Seashore (tide pools, elephant seals, calm Drakes Beach), Shoreline Park at Mountain View (Scow Schooner Playground, pedal boats, flat trails), Rancho San Antonio Open Space Preserve in Cupertino (easy walk to Deer Hollow Farm), and Hidden Villa in Los Altos Hills (organic farm and wilderness preserve). Check each park's website for parking and seasonal closures.",
      },
    ],
    zh: [
      {
        q: "湾区适合带孩子的一日游目的地有哪些？",
        a: "热门亲子一日游：Monterey Bay Aquarium（巨藻林、海獭，还有专为幼儿设计的 Splash Zone；记得提前网上买票）、Santa Cruz Beach Boardwalk（加州现存最古老的游乐园，免费入场、按项目付费）、Mill Valley 的 Muir Woods National Monument（必须预约停车）、Angel Island State Park（从 Tiburon 或旧金山坐渡轮）、Felton 的 Roaring Camp Railroads（穿越红杉林的蒸汽火车）、Point Reyes National Seashore（潮池、象海豹、灯塔）、Gilroy Gardens Family Theme Park（适合小一点孩子的温和游乐设施）。",
      },
      {
        q: "Muir Woods 适合带孩子去吗？需要注意什么？",
        a: "适合。Mill Valley 的 Muir Woods National Monument 距旧金山约 30 分钟车程，是一片原始海岸红杉林，树高达 250 英尺。主栈道步道平坦，适合推婴儿车。必须预约停车，最好提前两周以上在 recreation.gov 预订。早上人少、雾也少。同在 Mill Valley 的 Mount Tamalpais State Park 可以登顶看风景，环绕山顶的 Verna Dunshee Trail 全长 0.7 英里，铺装平坦。",
      },
      {
        q: "怎么带孩子去 Angel Island 州立公园？",
        a: "Angel Island State Park 是旧金山湾里一座禁行汽车的小岛，可从 Tiburon 或旧金山坐渡轮前往。从 Tiburon 出发航程约 10 分钟，Angel Island Ferry 夏季每天运营，冬季只在周末运营。上岛后可以骑车、徒步或坐观光车；自行车可以在岛上租，也可以自带上船。Perimeter Trail 的风景最好。岛上吃的选择不多，记得带午餐。",
      },
      {
        q: "Half Moon Bay 南瓜田和秋季干草车体验在哪？",
        a: "Half Moon Bay 的南瓜田集中在 92 号公路沿线，一年一度的 Art & Pumpkin Festival 会吸引成千上万的游客。Lemos Farm 是一家仍在经营的家庭农场，有干草车、骑小马、小火车和动物触摸区，南瓜季尤其热门。尽量工作日去，因为秋季周末 92 号公路会严重堵车；有些农场最好带现金。东湾 Brentwood 的 Three Nunns Farm 10 月有南瓜，还有拖拉机车和秋季玉米迷宫。",
      },
      {
        q: "湾区哪里能带孩子坐蒸汽小火车？",
        a: "Berkeley 的 Tilden Park Steam Trains 用真正的迷你蒸汽机车载人穿过红杉林，从 1952 年运营至今；坐完可以顺路去附近的 Tilden Little Farm。Felton 的 Roaring Camp Railroads 有穿越古老红杉林的历史窄轨蒸汽火车，夏季还有开往 Santa Cruz 的 Beach Train。Los Gatos 的 Vasona Lake County Park 有 Billy Jones Wildcat Railroad 迷你蒸汽火车，周末和夏季运行。Fremont 的 Ardenwood Historic Farm 则是马拉火车。",
      },
      {
        q: "湾区适合带孩子的公园和自然景点有哪些？",
        a: "亲子友好的公园和自然景点：Mill Valley 的 Muir Woods National Monument（原始红杉林，平坦的栈道步道）、Oakland 的 Redwood Regional Park（Stream Trail 前一英里铺装，Canyon Meadow 有儿童游乐场）、Point Reyes National Seashore（潮池、象海豹、风平浪静的 Drakes Beach）、Shoreline Park at Mountain View（Scow Schooner Playground、脚踏船、平坦步道）、Cupertino 的 Rancho San Antonio Open Space Preserve（轻松步行到 Deer Hollow Farm）、Los Altos Hills 的 Hidden Villa（有机农场兼荒野保护区）。停车和季节性关闭信息请查看各公园官网。",
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
