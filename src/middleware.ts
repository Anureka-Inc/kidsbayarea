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
  matcher: [
    "/",
    "/(en|zh|es|ja|ko|fr|de|pt|it|ru|ar|hi|th|vi|id|tr|nl|pl|sv|da|nb|fi|cs|he|ms|tl|uk|ro|hu|el)/:path*",
  ],
};
