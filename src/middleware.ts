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
  // Unprefixed deep links (/guides/foo, /play/bar) → permanent 308 to /en.
  // next-intl would 307 these via Accept-Language detection; a temporary
  // redirect keeps the old URL indexed instead of consolidating onto /en/...
  // "/" still goes through next-intl so visitors get their language.
  const firstSegment = request.nextUrl.pathname.split("/")[1];
  if (
    request.nextUrl.pathname !== "/" &&
    !(routing.locales as readonly string[]).includes(firstSegment)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/${routing.defaultLocale}${request.nextUrl.pathname}`;
    return NextResponse.redirect(url, 308);
  }
  return intlMiddleware(request);
}

export const config = {
  // Catch all paths except API routes, Next internals, and static files (any
  // segment with a dot). The previous matcher only listed locale-prefixed paths,
  // so pre-i18n URLs like `/learn/foo` or `/guides/rainy-day` bypassed next-intl
  // entirely and 404'd. With this broader matcher, unprefixed paths are
  // 308-redirected to the default locale (`/en/...`) above.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
