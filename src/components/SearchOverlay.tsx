"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Search, X, MapPin, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { searchPlaces, type Place, type Category } from "@/data/places";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const categoryLabels: Record<Category, string> = {
  play: "Play",
  eat: "Eat",
  learn: "Learn",
  shop: "Shop",
  explore: "Explore",
};

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const t = useTranslations("search");
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    if (query.length < 2) return [];
    return searchPlaces(query);
  }, [query]);

  // Group results by category
  const grouped = useMemo(() => {
    const map = new Map<Category, Place[]>();
    for (const place of results) {
      const existing = map.get(place.category) || [];
      existing.push(place);
      map.set(place.category, existing);
    }
    return map;
  }, [results]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Close on Escape and lock body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-white/95 backdrop-blur-xl dark:bg-gray-950/95">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Search className="h-5 w-5 shrink-0 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("placeholder")}
            className="flex-1 bg-transparent text-lg text-gray-900 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500"
          />
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label={t("close")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6">
          {query.length >= 2 && results.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              {t("noResults", { query })}
            </p>
          )}

          {query.length >= 2 && results.length > 0 && (
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              {t("results", { count: results.length })}
            </p>
          )}

          {Array.from(grouped.entries()).map(([category, places]) => (
            <div key={category} className="mb-6">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {categoryLabels[category]}
              </h3>
              <ul className="space-y-1">
                {places.map((place) => (
                  <li key={place.slug}>
                    <Link
                      href={`/${place.category}`}
                      onClick={onClose}
                      className="flex items-center gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-teal-50 dark:hover:bg-teal-950/30"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {place.name}
                        </p>
                        <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-3.5 w-3.5" />
                          {place.city}
                          <span className="flex items-center gap-0.5">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {place.rating}
                          </span>
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">&rarr;</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
