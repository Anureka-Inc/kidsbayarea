import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Standalone output bundles the SSR server with only the node_modules it
  // actually imports, into .next/standalone. Without this, Amplify packages
  // the entire .next + full node_modules tree (~3.7GB) and rejects the
  // deploy at the 220MB SSR Lambda limit.
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
      // Duplicate entry removed: Planet Granite SF rebranded to Movement in
      // 2022 and was listed twice. Keep old links/rankings pointing somewhere.
      {
        source: "/:locale/play/planet-granite-sf",
        destination: "/:locale/play/movement-sf",
        permanent: true,
      },
      // Venues Google Places reports CLOSED_PERMANENTLY (place_status.py,
      // 2026-10-05) — removed; old URLs go to their category page.
      { source: "/:locale/eat/bobby-gs-pizzeria", destination: "/:locale/eat", permanent: true },
      { source: "/:locale/eat/champagne-seafood-restaurant", destination: "/:locale/eat", permanent: true },
      { source: "/:locale/eat/house-of-lee-san-rafael", destination: "/:locale/eat", permanent: true },
      { source: "/:locale/eat/legendary-palace", destination: "/:locale/eat", permanent: true },
      { source: "/:locale/eat/mandarin-gourmet", destination: "/:locale/eat", permanent: true },
      { source: "/:locale/eat/rigolo-cafe", destination: "/:locale/eat", permanent: true },
      { source: "/:locale/eat/shalala-ramen", destination: "/:locale/eat", permanent: true },
      { source: "/:locale/eat/sliderbar", destination: "/:locale/eat", permanent: true },
      { source: "/:locale/shop/kids-n-cribs-pleasant-hill", destination: "/:locale/shop", permanent: true },
      { source: "/:locale/shop/natashas-attic-san-jose", destination: "/:locale/shop", permanent: true },
      { source: "/:locale/shop/rockridge-kids-oakland", destination: "/:locale/shop", permanent: true },
      { source: "/:locale/shop/toy-crazy-larkspur", destination: "/:locale/shop", permanent: true },
      { source: "/:locale/eat/pinstripes-walnut-creek", destination: "/:locale/eat", permanent: true },
      { source: "/:locale/eat/tomatina", destination: "/:locale/eat", permanent: true },
      { source: "/:locale/eat/mas-fuego", destination: "/:locale/eat", permanent: true },
      { source: "/:locale/eat/tacolicious", destination: "/:locale/eat", permanent: true },
      // Duplicate entries merged into their twins.
      {
        source: "/:locale/play/tilden-park-little-farm",
        destination: "/:locale/play/tilden-little-farm",
        permanent: true,
      },
      {
        source: "/:locale/play/shoreline-park",
        destination: "/:locale/explore/shoreline-park-mountain-view",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
