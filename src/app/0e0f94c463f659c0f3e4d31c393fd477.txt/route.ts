import { NextResponse } from "next/server";

// IndexNow verification key, served via Route Handler so it ships with the SSR
// Lambda regardless of how Amplify packages public/ under output: "standalone"
// (same reason llms.txt is a route handler). IndexNow fetches this URL and
// checks the body equals the key. A static copy also lives at
// public/0e0f94c463f659c0f3e4d31c393fd477.txt.
// Used by infra/seo-cron/safe_actions.py to ping changed URLs after each run.
export const dynamic = "force-static";

const KEY = "0e0f94c463f659c0f3e4d31c393fd477";

export function GET() {
  return new NextResponse(KEY, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
