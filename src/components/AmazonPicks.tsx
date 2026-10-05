"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { ExternalLink } from "lucide-react";
import {
  AMAZON_PARTNER_TAG,
  amazonPickContexts,
} from "@/data/amazonPicks";
import { amazonProducts } from "@/data/amazonProducts";

interface AmazonPicksProps {
  contextKey: string | null;
  /** Where on the page the block sits — sent with GA events to compare placements. */
  placement?: string;
  /** Outer spacing; the block renders nothing on non-EN pages, so callers pass margins here, not on a wrapper. */
  className?: string;
}

type Gtag = (command: "event", name: string, params: Record<string, string | number>) => void;

function track(name: string, params: Record<string, string | number>) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", name, params);
}

// Contextual Amazon product picks: gear a family would actually use for the
// activities on the current page. EN-only (affiliate copy is English-source),
// and renders nothing until AMAZON_PARTNER_TAG is set and the refresh script
// has populated product data for this context.
export default function AmazonPicks({ contextKey, placement = "default", className = "mt-12" }: AmazonPicksProps) {
  const locale = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const ctx = contextKey
    ? amazonPickContexts.find((c) => c.key === contextKey)
    : undefined;
  const data = contextKey ? amazonProducts[contextKey] : undefined;
  const visible = locale === "en" && !!ctx && !!AMAZON_PARTNER_TAG && !!data?.items?.length;

  // GA4: one impression when the block actually scrolls into view, so
  // amazon_click / amazon_picks_view gives a real CTR per context and placement.
  useEffect(() => {
    const el = sectionRef.current;
    if (!visible || !el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          track("amazon_picks_view", { context: contextKey ?? "", placement });
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible, contextKey, placement]);

  if (!visible || !ctx || !data) {
    return null;
  }

  const items = data.items.slice(0, ctx.maxItems ?? 4);

  return (
    <section ref={sectionRef} className={`${className} rounded-2xl border border-amber-100 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20`}>
      <h2 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
        {ctx.headingEn}
      </h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Handpicked for this kind of outing — including a few things families
        usually wish they&apos;d packed.
      </p>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map((item) => (
          <a
            key={item.asin}
            href={item.url}
            target="_blank"
            rel="sponsored nofollow noopener"
            onClick={() =>
              track("amazon_click", {
                context: contextKey ?? "",
                placement,
                asin: item.asin,
                position: items.indexOf(item) + 1,
              })
            }
            className="group flex flex-col rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-amber-300 hover:shadow-md dark:border-gray-600 dark:bg-gray-700"
          >
            <div className="mb-3 flex h-32 items-center justify-center overflow-hidden rounded-lg bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element -- remote Amazon CDN images; next/image would require a next.config.ts remotePatterns change */}
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <p className="mb-2 line-clamp-2 flex-1 text-sm font-medium text-gray-800 group-hover:text-amber-700 dark:text-gray-200 dark:group-hover:text-amber-400">
              {item.title}
            </p>
            {/* Prices are intentionally NOT rendered: product data refreshes
                weekly (seo-cron step 3.5), and Amazon's Associates terms
                require displayed prices to be no more than 24h stale. The
                price stays in the data file — restore rendering only if the
                refresh ever becomes daily. */}
            <p className="flex items-center gap-1 text-sm font-semibold text-teal-700 dark:text-teal-400">
              View on Amazon
              <ExternalLink className="h-3.5 w-3.5" />
            </p>
          </a>
        ))}
      </div>
      <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
        As an Amazon Associate, kidsbayarea.com earns from qualifying
        purchases. Prices and availability shown are as of the last update and
        may change.
      </p>
    </section>
  );
}
