"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Search, X, MapPin, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
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
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

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

  // Flat list for keyboard nav
  const flatResults = useMemo(() => {
    const flat: Place[] = [];
    for (const places of grouped.values()) {
      flat.push(...places);
    }
    return flat;
  }, [grouped]);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(-1);
  }, [results]);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const items = listRef.current.querySelectorAll("[data-search-item]");
    items[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (!flatResults.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < flatResults.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : flatResults.length - 1
        );
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        const place = flatResults[activeIndex];
        onClose();
        router.push(`/${place.category}/${place.slug}`);
      }
    },
    [flatResults, activeIndex, onClose, router]
  );

  // Keyboard events and body scroll lock
  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  let itemIndex = -1;

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-white/95 backdrop-blur-xl dark:bg-gray-950/95"
      role="dialog"
      aria-modal="true"
      aria-label={t("placeholder")}
    >
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Search className="h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={
              activeIndex >= 0 ? `search-item-${activeIndex}` : undefined
            }
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
      <div className="flex-1 overflow-y-auto" ref={listRef}>
        <div className="mx-auto max-w-3xl px-4 py-6" id="search-results" role="listbox">
          {query.length >= 2 && results.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400" role="status">
              {t("noResults", { query })}
            </p>
          )}

          {query.length >= 2 && results.length > 0 && (
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400" role="status" aria-live="polite">
              {t("results", { count: results.length })}
            </p>
          )}

          {Array.from(grouped.entries()).map(([category, places]) => (
            <div key={category} className="mb-6">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {categoryLabels[category]}
              </h3>
              <ul className="space-y-1">
                {places.map((place) => {
                  itemIndex++;
                  const isActive = itemIndex === activeIndex;
                  const currentIdx = itemIndex;
                  return (
                    <li key={place.slug}>
                      <Link
                        id={`search-item-${currentIdx}`}
                        data-search-item
                        role="option"
                        aria-selected={isActive}
                        href={`/${place.category}/${place.slug}`}
                        onClick={onClose}
                        onMouseEnter={() => setActiveIndex(currentIdx)}
                        className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-colors ${
                          isActive
                            ? "bg-teal-50 dark:bg-teal-950/30"
                            : "hover:bg-teal-50 dark:hover:bg-teal-950/30"
                        }`}
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
                        <span className="text-xs text-gray-400" aria-hidden="true">&rarr;</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
