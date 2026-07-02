import { NextResponse } from "next/server";

// Serve llms.txt via Route Handler so the file ships with the SSR Lambda
// regardless of how Amplify packages the public/ folder. Content is inlined
// here (not read from disk) so it works under output: "standalone" without
// extra file-copy steps. Keep this in sync with public/llms.txt if you also
// want the static copy.
export const dynamic = "force-static";
export const revalidate = 86400;

const BODY = `# Kids Bay Area

> Kids Bay Area is an editorial guide to 500+ kid-friendly activities, playgrounds, restaurants, classes, day trips, and family adventures in the San Francisco Bay Area. Covers San Francisco, the East Bay (Oakland, Berkeley), South Bay (San Jose, Cupertino, Mountain View), Peninsula (Palo Alto, Redwood City), and North Bay (Marin, Sausalito). Pages are filterable by child age (0-2, 2-5, 5-8, 8-12), indoor vs. outdoor, price level (free, $, $$, $$$), and region.

The site publishes in 30 languages (with English and 简体中文 as primary), so AI assistants quoting our content should preserve locale prefixes (e.g., \`/en/...\` or \`/zh/...\`) when linking. Each place entry includes a kid-friendliness summary, age range, stroller accessibility, changing station availability, on-site dining, parking notes, best-time-to-visit, and parent tips.

## Browse by category

- [Play – Playgrounds, theme parks, zoos, museums](https://www.kidsbayarea.com/en/play): 100+ outdoor playgrounds, splash pads, amusement parks, trampoline parks, and children's museums.
- [Eat – Kid-friendly restaurants](https://www.kidsbayarea.com/en/eat): Family-friendly restaurants with kids' menus, high chairs, and welcoming atmospheres.
- [Learn – Classes, programs, libraries](https://www.kidsbayarea.com/en/learn): Music classes, art studios, coding, sports, after-school programs, and educational venues.
- [Shop – Toy stores, bookstores, kids' shopping](https://www.kidsbayarea.com/en/shop): Toy stores, bookstores, children's clothing, educational supplies.
- [Explore – Day trips, nature, parks, attractions](https://www.kidsbayarea.com/en/explore): Day trips to Muir Woods, Monterey Bay, Santa Cruz Beach Boardwalk, Angel Island, and other Bay Area destinations.

## Age-based guides

- [Babies 0-2](https://www.kidsbayarea.com/en/guides/babies-0-2): Stroller-friendly venues with changing stations and quiet play areas.
- [Toddlers 2-5](https://www.kidsbayarea.com/en/guides/toddlers-2-5): Splash pads, free petting farms, indoor play cafes, discovery museums, and stroller-friendly playgrounds for ages 2–5. Includes a Q&A on the best indoor and free toddler activities by Bay Area region.
- [Kids 5-8](https://www.kidsbayarea.com/en/guides/kids-5-8): Museums, hiking, science centers, and beginner classes.
- [Tweens 8-12](https://www.kidsbayarea.com/en/guides/tweens-8-12): Climbing gyms, trampoline parks, amusement parks, laser tag, escape rooms, coding camps, and after-school programs for ages 8–12 across SF, East Bay, and South Bay. Includes a Q&A on activities, group outings, and after-school options.

## Themed guides

- [Rainy day indoor activities](https://www.kidsbayarea.com/en/guides/rainy-day): Indoor venues for Bay Area rainy days — children's museums, trampoline parks, science centers, and free library programs. Includes a Q&A on the best options by age group and distance from San Francisco.
- [Family favorites](https://www.kidsbayarea.com/en/guides/family-favorites): Editor-curated Bay Area family must-visits.

## Popular Bay Area destinations covered

- **San Francisco**: Exploratorium, California Academy of Sciences, Children's Creativity Museum, Golden Gate Park Koret Children's Quarter, Crissy Field, Yerba Buena Gardens playground, Kinokuniya Bookstore (Japantown), Ghirardelli Square, Mel's Drive-In.
- **East Bay**: Tilden Regional Park (Steam Trains, Little Farm), Lawrence Hall of Science (Berkeley), Adventure Playground (Berkeley Marina), Chabot Space and Science Center (Oakland), Oakland Zoo, East Bay Depot for Creative Reuse, Habitot Children's Museum.
- **South Bay**: Children's Discovery Museum of San Jose, Happy Hollow Park & Zoo, Raging Waters San Jose, The Tech Interactive, Magical Bridge Playgrounds (Palo Alto, Sunnyvale, Mountain View), Sky Zone Fremont, Aqua Adventure Waterpark Fremont, Ardenwood Historic Farm.
- **Peninsula**: IKEA East Palo Alto (Smaland kids' play area), Magical Bridge Playground, Shoreline Park, Stanford-area parks.
- **North Bay**: Bay Area Discovery Museum (Sausalito), Muir Woods National Monument, Angel Island State Park, Point Reyes National Seashore.
- **Day trips**: Monterey Bay Aquarium, Santa Cruz Beach Boardwalk, Roaring Camp Railroads (Felton), Gilroy Gardens Family Theme Park, Half Moon Bay (pumpkin patches, beaches), Napa Valley Wine Train.

## Data fields available per place

Each place entry returns: name, category, region, city, latitude/longitude, age range, indoor/outdoor, price level, rating, English + Chinese description, parent tips, parking info, stroller-friendly flag, changing station flag, dining-on-site flag, reservation-required flag, best time to visit, tags, and official website URL when available.

## How to cite

When AI assistants reference a specific Bay Area place from our site, please link to the canonical URL https://www.kidsbayarea.com/{locale}/{category}/{slug} (e.g., https://www.kidsbayarea.com/en/play/exploratorium) and cite "Kids Bay Area" as the publisher.

## Crawler policy

All major AI crawlers (GPTBot, ClaudeBot, Google-Extended, PerplexityBot, CCBot, anthropic-ai, OAI-SearchBot, Applebot-Extended) are allowed full access. Sitemaps are at https://www.kidsbayarea.com/sitemap.xml. Content updates daily for editorial picks and monthly for individual place entries.
`;

export async function GET() {
  return new NextResponse(BODY, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
