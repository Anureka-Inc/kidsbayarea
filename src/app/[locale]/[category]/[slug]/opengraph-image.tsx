import { ImageResponse } from "next/og";
import { getPlaceBySlug, categoryNames, regionNames, type Category } from "@/data/places";

// Per-place OG image rendered on-demand and cached for 24h. Social-share CTR
// jumps dramatically when the preview shows the actual place name + region
// rather than the generic site card. We use the node runtime (not edge)
// because Amplify SSR Lambda support for edge is inconsistent; node also lets
// us read place data synchronously without an extra HTTP roundtrip.
//
// Style notes:
// - Pure CSS, no remote fonts (system-ui ships everywhere ImageResponse runs).
// - Category drives gradient → instantly recognizable in feeds.
// - 1200x630 is the canonical OG/X large-card size; keep all content
//   inside a ~80px safe margin so Slack/iMessage previews don't crop text.

export const alt = "Kids Bay Area place card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 86400;

const categoryGradient: Record<Category, string> = {
  play: "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
  eat: "linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%)",
  learn: "linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)",
  shop: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)",
  explore: "linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #2dd4bf 100%)",
};

const categoryEmoji: Record<Category, string> = {
  play: "🛝",
  eat: "🍽️",
  learn: "📚",
  shop: "🛍️",
  explore: "🗺️",
};

export default async function PlaceOGImage({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  const { locale, category, slug } = await params;
  const place = getPlaceBySlug(category, slug);

  // Fallback to the site-level card when the slug is unknown — avoids a 500
  // when crawlers probe stale URLs from the sitemap during deploys.
  if (!place) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
            color: "white",
            fontFamily: "system-ui",
          }}
        >
          <div style={{ fontSize: 72, fontWeight: 700 }}>Kids Bay Area</div>
        </div>
      ),
      { ...size },
    );
  }

  const isZh = locale === "zh";
  const categoryLabel = isZh ? categoryNames[place.category]?.zh : categoryNames[place.category]?.en;
  const regionLabel = isZh ? regionNames[place.region]?.zh : regionNames[place.region]?.en;
  const ageLabel = place.ageRange.includes("all")
    ? (isZh ? "全年龄" : "All Ages")
    : `${isZh ? "适合" : "Ages"} ${place.ageRange.join(", ")}`;

  const badges: string[] = [];
  if (place.priceLevel === "free") badges.push(isZh ? "免费" : "Free");
  if (place.strollerFriendly) badges.push(isZh ? "推车友好" : "Stroller-friendly");
  if (place.changingStation) badges.push(isZh ? "母婴室" : "Changing station");
  if (place.indoorOutdoor === "indoor") badges.push(isZh ? "室内" : "Indoor");
  if (place.indoorOutdoor === "outdoor") badges.push(isZh ? "户外" : "Outdoor");

  const stars = "★".repeat(Math.round(place.rating)) + "☆".repeat(5 - Math.round(place.rating));

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: categoryGradient[place.category],
          color: "white",
          fontFamily: "system-ui",
          padding: "80px 80px 70px",
          position: "relative",
        }}
      >
        {/* Top row: category pill + brand */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: "rgba(255,255,255,0.22)",
              padding: "10px 22px",
              borderRadius: 999,
              fontSize: 26,
              fontWeight: 600,
            }}
          >
            <span style={{ fontSize: 32 }}>{categoryEmoji[place.category]}</span>
            <span>{categoryLabel}</span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 600, opacity: 0.92, letterSpacing: 0.4 }}>
            kidsbayarea.com
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", marginTop: 24 }}>
          {/* Place name — limited to ~2 lines via line clamp */}
          <div
            style={{
              fontSize: place.name.length > 36 ? 64 : 80,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -0.5,
              marginBottom: 20,
            }}
          >
            {place.name}
          </div>

          {/* Location + age + rating row */}
          <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 30, opacity: 0.96, marginBottom: 18 }}>
            <span>📍 {place.city}, {regionLabel}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 28, opacity: 0.94, marginBottom: 26 }}>
            <span style={{ color: "#fde68a" }}>{stars}</span>
            <span>•</span>
            <span>{ageLabel}</span>
          </div>

          {/* Amenity badges */}
          {badges.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {badges.slice(0, 4).map((b) => (
                <div
                  key={b}
                  style={{
                    background: "rgba(255,255,255,0.18)",
                    padding: "8px 18px",
                    borderRadius: 999,
                    fontSize: 22,
                    fontWeight: 500,
                  }}
                >
                  {b}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom: kid-friendly tagline */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            fontWeight: 600,
            opacity: 0.95,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.25)",
          }}
        >
          <span>{isZh ? "湾区遛娃指南" : "Kid-Friendly Guide · Tips · Visit Info"}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
