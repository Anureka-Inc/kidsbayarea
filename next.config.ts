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
