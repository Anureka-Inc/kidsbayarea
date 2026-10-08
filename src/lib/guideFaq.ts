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
    headingZh: "常见问题",
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
    zh: [],
  },
  "birthday-party": {
    headingEn: "Kids Birthday Party FAQ",
    headingZh: "常见问题",
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
    zh: [],
  },
  "free": {
    headingEn: "Free Things to Do with Kids FAQ",
    headingZh: "常见问题",
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
    zh: [],
  },
  "family-favorites": {
    headingEn: "Bay Area Family Attractions FAQ",
    headingZh: "常见问题",
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
    zh: [],
  },
  "babies-0-2": {
    headingEn: "Baby Activities FAQ",
    headingZh: "常见问题",
    en: [
      {
        q: "What are the best activities for babies (0–2) in the Bay Area?",
        a: "Top Bay Area activities for babies and young toddlers (ages 0–2) include the Bay Area Discovery Museum in Sausalito (indoor and outdoor sensory exhibits designed for the youngest visitors), Tilden Little Farm in Berkeley (free, open 365 days a year — great for babies who love animals), the Koret Children's Quarter playground in Golden Gate Park, Yerba Buena Gardens Children's Garden in San Francisco, and public library baby story-time programs throughout the Bay Area. Check each venue's website for current hours and scheduling.",
      },
      {
        q: "Which Bay Area venues are stroller-friendly for families with babies?",
        a: "Stroller-friendly Bay Area venues for babies include Crissy Field in San Francisco (flat paved path along the waterfront), the Main Trail loop at Muir Woods National Monument (1-mile flat paved path through redwoods), Shoreline Park in Mountain View (wide paved trails around the lake), Yerba Buena Gardens in San Francisco, and most indoor venues including the Bay Area Discovery Museum in Sausalito and the Exploratorium at Pier 15 in San Francisco. Venues with stroller parking at the entrance include the Exploratorium and the Children's Creativity Museum in San Francisco.",
      },
      {
        q: "Are there free activities for babies and infants in the Bay Area?",
        a: "Yes. Free activities for Bay Area babies include Tilden Little Farm petting farm in Berkeley (open 365 days a year, free admission), public library baby rhyme times and infant story-times (available at San Francisco Public Library's Fisher Children's Center, Santa Clara County Library, and Oakland Public Library), all municipal playgrounds including Magical Bridge Playgrounds in Palo Alto and Mountain View, Crissy Field and Baker Beach in San Francisco, and free outdoor spaces like Shoreline Park in Mountain View and Oyster Point Marina Park in South San Francisco.",
      },
      {
        q: "What indoor play spaces in the Bay Area are good for babies under 2?",
        a: "The best Bay Area indoor play spaces for babies under 2 include the Bay Area Discovery Museum in Sausalito (indoor exhibits for very young children), La Petite Playhouse in Redwood City (soft-play area for infants and toddlers), and the Children's Discovery Museum of San Jose (infant and toddler-friendly exhibits). Many YMCA branches across the Bay Area also offer infant and parent-and-me swim classes. Check each venue's website for current hours and age guidelines.",
      },
    ],
    zh: [],
  },
  "field-trips": {
    headingEn: "Bay Area Field Trip FAQ",
    headingZh: "常见问题",
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
    zh: [],
  },
  "fall": {
    headingEn: "Bay Area Fall & Pumpkin Patch FAQ",
    headingZh: "常见问题",
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
    zh: [],
  },
  "museums": {
    headingEn: "Bay Area Children's Museums FAQ",
    headingZh: "常见问题",
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
    zh: [],
  },
  "indoor-playgrounds": {
    headingEn: "Indoor Playgrounds FAQ",
    headingZh: "常见问题",
    en: [
      {
        q: "What are the best indoor playgrounds in the Bay Area?",
        a: "Top Bay Area indoor playgrounds include WOW Kids Playground in San Jose (large multi-level soft-play structure), Lemon Tree Play Cafe in San Jose (indoor play space with a cafe for parents), KidTopia in Fremont (indoor play center for younger children), La Petite Playhouse in Redwood City (open play and toddler-focused structure), and the Exploratorium at Pier 15 in San Francisco (250+ hands-on science play exhibits). For trampoline-style indoor play, Sky Zone Trampoline Park in Fremont and Sky Zone Dublin and House of Air at the Presidio in San Francisco are top picks. Check each venue's website for current hours and admission.",
      },
      {
        q: "Which indoor play spaces in the Bay Area are best for toddlers and younger children?",
        a: "The best Bay Area indoor play spaces for toddlers include the Bay Area Discovery Museum in Sausalito (bilingual indoor exhibits and outdoor tide pools), La Petite Playhouse in Redwood City (soft play, age 0–8), WOW Kids Playground in San Jose (dedicated toddler zone), Lemon Tree Play Cafe in San Jose (cafe for parents, safe soft-play for young children), and KidTopia in Fremont. Children's Discovery Museum of San Jose also has a toddler-friendly section. Check each venue's website for current hours and age guidelines.",
      },
      {
        q: "Are there free or low-cost indoor play options for kids in the Bay Area?",
        a: "Free and low-cost Bay Area indoor play options include public library story times and drop-in play mornings (San Francisco, Oakland, Santa Clara County library systems), the Randall Museum in San Francisco (free general admission), East Bay Depot for Creative Reuse in Oakland (donation-based art supplies and play), and free family art Saturdays at the de Young Museum in Golden Gate Park. Many community recreation centers run subsidized drop-in gym and open-play sessions for toddlers and school-age kids — check city parks and recreation departments for local schedules.",
      },
      {
        q: "What indoor play and trampoline parks are in the South Bay near San Jose?",
        a: "South Bay indoor play venues near San Jose include WOW Kids Playground (San Jose), Lemon Tree Play Cafe (San Jose), KidTopia (Fremont), Altitude Trampoline Park San Jose, and the Children's Discovery Museum of San Jose. For STEM and science-based indoor play, The Tech Interactive in downtown San Jose offers hands-on robotics, AI, and design exhibits for kids of all ages. Check each venue's website for current hours and admission.",
      },
    ],
    zh: [],
  },
  "kids-5-8": {
    headingEn: "Kids 5\u20138 Activities FAQ",
    headingZh: "常见问题",
    en: [
      {
        q: "What are the best indoor activities for kids ages 5–8 in the Bay Area?",
        a: "Top indoor Bay Area activities for kids ages 5–8 include the Exploratorium at Pier 15 in San Francisco (250+ hands-on science exhibits), Children's Discovery Museum of San Jose (three floors of interactive exhibits), The Tech Interactive in San Jose (robotics, AI, and design-challenge labs), Lawrence Hall of Science in Berkeley (hilltop science center with hands-on exhibits and outdoor science park), Bay Area Discovery Museum in Sausalito (bilingual indoor and outdoor play areas), and Children's Creativity Museum in San Francisco (arts, technology, and animation studios). Check each venue's website for current hours and admission.",
      },
      {
        q: "What outdoor adventures are good for kids ages 5–8 in the Bay Area?",
        a: "Outdoor Bay Area adventures for kids 5–8 include the Tilden Park Steam Trains in Berkeley (Redwood Valley Railway), Tilden Little Farm (free petting farm, open daily), Adventure Playground at the Berkeley Marina (build-your-own structure using scrap lumber — unique to the region), hiking the easy trails at Muir Woods National Monument (1-mile Main Trail loop, stroller-accessible), the Shoreline Park trails in Mountain View, and the Oakland Zoo in Knowland Park. Magical Bridge Playgrounds in Palo Alto, Sunnyvale, and Mountain View are designed for all abilities.",
      },
      {
        q: "What STEM classes and programs are available for 5–8 year olds in the Bay Area?",
        a: "Bay Area STEM programs for kids ages 5–8 include Code Ninjas (Cupertino, North San Jose, Fremont — beginner coding), Galileo Innovation Camps (multiple Bay Area locations), iD Tech beginner coding courses (Stanford campus), Lawrence Hall of Science after-school clubs (Berkeley), and hands-on workshops at The Tech Interactive (San Jose). Many public library systems — including San Francisco, Santa Clara County, and Oakland — run free STEM Saturdays and maker programs for this age group.",
      },
      {
        q: "Where can kids ages 5–8 take art and music classes in the Bay Area?",
        a: "Bay Area art and music programs for kids 5–8 include Music Together studios (Palo Alto, Menlo Park, Sunnyvale, and East Bay locations), Studio4Art (San Jose), Color Me Mine ceramic painting studios (multiple Bay Area locations), the de Young Museum's family art Saturdays in Golden Gate Park (free), SFMOMA family workshops, and the Asian Art Museum's kids' programs in San Francisco. The Randall Museum in San Francisco also offers hands-on nature, arts, and science classes for this age group.",
      },
    ],
    zh: [],
  },
  "toddlers-2-5": {
    headingEn: "Toddler Activities FAQ",
    headingZh: "常见问题",
    en: [
      {
        q: "What are the best toddler activities in the Bay Area?",
        a: "Top Bay Area activities for toddlers (ages 2–5) include Bay Area Discovery Museum in Sausalito (outdoor tide pools and hands-on exhibits), Children's Fairyland in Oakland (pint-sized amusement park), Tilden Little Farm in Berkeley (free petting farm, open daily), La Petite Playhouse in Redwood City (large indoor play structure), and splash pads at Castro Valley Splash Park and Larkey Sprayground in Walnut Creek. Check each venue's website for current hours and admission.",
      },
      {
        q: "Where can toddlers play indoors in the Bay Area?",
        a: "Indoor toddler play spaces in the Bay Area include Bay Area Discovery Museum (Sausalito — indoor and outdoor areas), La Petite Playhouse (Redwood City), WOW Kids Playground (San Jose), Lemon Tree Play Cafe (San Jose), Imagination City (San Jose), and KidTopia (San Jose). Many community recreation centers also offer toddler open-play and drop-in gym sessions — check local schedules.",
      },
      {
        q: "Are there free activities for toddlers in the Bay Area?",
        a: "Yes. Free toddler-friendly activities in the Bay Area include Tilden Little Farm in Berkeley (free, open 365 days a year — bring celery and lettuce for the goats), all municipal playgrounds and inclusive Magical Bridge Playgrounds (Palo Alto, Sunnyvale, Mountain View), seasonal splash pads at 24th & York Mini Park in San Francisco and Castro Valley Splash Park, and free public library story-times throughout Santa Clara County, San Francisco, and the East Bay.",
      },
      {
        q: "What stroller-friendly activities are available for toddlers in San Francisco?",
        a: "Stroller-friendly San Francisco toddler activities include the Koret Children's Quarter playground in Golden Gate Park (flat paved paths), Yerba Buena Gardens Playground and Children's Garden, Crissy Field lawn areas, 24th & York Mini Park splash pad in the Mission, Children's Creativity Museum near Union Square, and the Exploratorium at Pier 15 (wide aisles, stroller parking at the entrance). Most Bay Area Discovery Museum trails in Sausalito are also stroller-accessible.",
      },
    ],
    zh: [],
  },
  "tweens-8-12": {
    headingEn: "Tweens Activities FAQ",
    headingZh: "常见问题",
    en: [
      {
        q: "What are the best activities for tweens (ages 8–12) in the Bay Area?",
        a: "Top Bay Area activities for tweens include rock climbing at Berkeley Ironworks, Movement (Belmont, San Francisco, Sunnyvale), or Diablo Rock Gym; trampoline parks at Sky Zone Fremont and Dublin and House of Air at the Presidio; amusement parks at California's Great America (Santa Clara); laser tag at Laser Tagging Inc.; and adventure-park arcade experiences at Round1 in San Jose, Concord, and Hayward. For outdoor adventures, hiking Mount Diablo State Park or exploring Redwood Regional Park (Oakland) fits tweens well.",
      },
      {
        q: "What after-school programs and classes are available for 8–12 year olds in the Bay Area?",
        a: "Bay Area after-school programs for tweens include coding and STEM camps at iD Tech (Stanford campus), Code Ninjas (Cupertino, North San Jose, Fremont), and Galileo camps. Martial arts is offered widely, including programs in Berkeley and San Jose. For sports, fencing at Halberstadt Fencers Club (San Francisco) and climbing at Berkeley Ironworks both have structured youth tracks. The Tech Interactive (San Jose) runs ongoing design challenges and weekend workshops for this age group.",
      },
      {
        q: "Where can tweens go with friends in the Bay Area?",
        a: "Tween-friendly Bay Area group outings include bowling at Lucky Strike Alameda or Lucky Strike San Francisco; mini-golf at Stagecoach Greens (San Francisco) or Urban Putt San Jose; arcade-style entertainment at Round1 (San Jose, Concord, Hayward); and ice skating at Nazareth Ice Oasis (Fremont), Snoopy's Home Ice (Santa Rosa), or Oakland Ice Center. For outdoors, Roaring Camp Railroads in Felton and the Santa Cruz Beach Boardwalk (free admission, pay-per-ride) are popular tween destinations.",
      },
    ],
    zh: [],
  },
  "rainy-day": {
    headingEn: "Rainy Day Activities FAQ",
    headingZh: "常见问题",
    en: [
      {
        q: "What are the best rainy day activities for kids in the Bay Area?",
        a: "Top Bay Area rainy-day activities for kids include the Exploratorium in San Francisco (hands-on science), the Children's Discovery Museum of San Jose, the Bay Area Discovery Museum in Sausalito (great for younger children), the Children's Creativity Museum in San Francisco, The Tech Interactive in San Jose, and Chabot Space and Science Center in Oakland. For active kids, Sky Zone trampoline parks in Fremont and Dublin are indoors year-round. Check each venue's website for current hours and admission.",
      },
      {
        q: "Are there free indoor activities for kids on rainy days in the Bay Area?",
        a: "Yes. Free or low-cost rainy-day options include public library story times and kids' programs (such as the San Francisco, Santa Clara County, and Oakland public library systems), the East Bay Depot for Creative Reuse in Oakland, and the Randall Museum in San Francisco. Hours and admission vary by location and season — check each venue's website for current details.",
      },
      {
        q: "Where can toddlers go on rainy days in the Bay Area?",
        a: "The best rainy-day spots for Bay Area toddlers are the Bay Area Discovery Museum in Sausalito, the Children's Discovery Museum of San Jose, La Petite Playhouse in Redwood City, and Little Gym locations in Palo Alto, San Jose, and Danville. Many community recreation centers also offer indoor family swim times — check local schedules.",
      },
      {
        q: "What indoor play spaces near San Francisco are good on rainy days?",
        a: "Indoor play spaces near San Francisco include the Exploratorium and the Children's Creativity Museum, both in San Francisco. A short drive away, the Bay Area Discovery Museum in Sausalito and Chabot Space and Science Center in Oakland offer indoor exhibits. Check each venue's website for current hours and tickets.",
      },
    ],
    zh: [],
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
