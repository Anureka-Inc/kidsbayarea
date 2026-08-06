"use client";

import { useLocale } from "next-intl";
import { ExternalLink } from "lucide-react";
import {
  AMAZON_PARTNER_TAG,
  amazonPickContexts,
} from "@/data/amazonPicks";
import { amazonProducts } from "@/data/amazonProducts";

interface AmazonPicksProps {
  contextKey: string;
}

// Contextual Amazon product picks: gear a family would actually use for the
// activities on the current page. EN-only (affiliate copy is English-source),
// and renders nothing until AMAZON_PARTNER_TAG is set and the refresh script
// has populated product data for this context.
export default function AmazonPicks({ contextKey }: AmazonPicksProps) {
  const locale = useLocale();
  const ctx = amazonPickContexts.find((c) => c.key === contextKey);
  const data = amazonProducts[contextKey];

  if (locale !== "en" || !ctx || !AMAZON_PARTNER_TAG || !data?.items?.length) {
    return null;
  }

  const items = data.items.slice(0, ctx.maxItems ?? 4);

  return (
    <section className="mt-12 rounded-2xl border border-amber-100 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20">
      <h2 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
        {ctx.headingEn}
      </h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Handpicked for the activities in this guide — including a few things
        families usually wish they&apos;d packed.
      </p>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map((item) => (
          <a
            key={item.asin}
            href={item.url}
            target="_blank"
            rel="sponsored nofollow noopener"
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
            <p className="flex items-center gap-1 text-sm font-semibold text-gray-900 dark:text-white">
              {item.price ?? "See price"}
              <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
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
