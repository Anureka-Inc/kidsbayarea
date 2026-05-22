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
};

export default withNextIntl(nextConfig);
