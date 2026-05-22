import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    const ua = request.headers.get("user-agent") || "";
    if (
      ua.includes("bot") ||
      ua.includes("crawler") ||
      ua.includes("spider")
    ) {
      return NextResponse.rewrite(new URL("/en", request.url));
    }
  }
  return intlMiddleware(request);
}

export const config = {
  // Catch all paths except API routes, Next internals, and static files (any
  // segment with a dot). The previous matcher only listed locale-prefixed paths,
  // so pre-i18n URLs like `/learn/foo` or `/guides/rainy-day` bypassed next-intl
  // entirely and 404'd. With this broader matcher, next-intl 308-redirects
  // unprefixed paths to the default locale (`/en/...`).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
