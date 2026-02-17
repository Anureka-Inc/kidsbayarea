"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Star,
  MapPin,
  Clock,
  DollarSign,
  ChevronRight,
  ExternalLink,
  Car,
  Lightbulb,
  Baby,
  UtensilsCrossed,
  CalendarCheck,
  Share2,
  Copy,
  Check,
  Home,
  Tag,
  Sun,
  Accessibility,
} from "lucide-react";
import type { Place, Category } from "@/data/places";
import { getSimilarPlaces, categoryNames, regionNames } from "@/data/places";
import PlaceCard from "@/components/PlaceCard";

const MapInner = dynamic(() => import("@/components/MapInner"), { ssr: false });

const categoryColors: Record<Category, string> = {
  play: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  eat: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  learn: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  shop: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  explore: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

const venueLabels: Record<string, { en: string; zh: string }> = {
  indoor: { en: "Indoor", zh: "室内" },
  outdoor: { en: "Outdoor", zh: "户外" },
  both: { en: "Indoor & Outdoor", zh: "室内外均可" },
};

interface PlaceDetailProps {
  place: Place;
}

export default function PlaceDetail({ place }: PlaceDetailProps) {
  const t = useTranslations("placeDetail");
  const locale = useLocale();
  const [linkCopied, setLinkCopied] = useState(false);

  const desc = locale === "zh" ? place.description.zh : place.description.en;
  const categoryLabel =
    locale === "zh"
      ? categoryNames[place.category]?.zh
      : categoryNames[place.category]?.en;
  const regionLabel =
    locale === "zh"
      ? regionNames[place.region]?.zh
      : regionNames[place.region]?.en;
  const venueLabel =
    locale === "zh"
      ? venueLabels[place.indoorOutdoor]?.zh
      : venueLabels[place.indoorOutdoor]?.en;
  const ageLabel = place.ageRange.includes("all")
    ? "All Ages"
    : place.ageRange.join(", ");

  const similarPlaces = getSimilarPlaces(place, 4);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // fallback - do nothing
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: place.name,
          text: desc,
          url: window.location.href,
        });
      } catch {
        // user cancelled or not supported
      }
    } else {
      handleCopyLink();
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: place.name,
    description: desc,
    address: {
      "@type": "PostalAddress",
      addressLocality: place.city,
      addressRegion: "CA",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: place.lat,
      longitude: place.lng,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: place.rating,
      bestRating: 5,
    },
    ...(place.website ? { url: place.website } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          <Link
            href="/"
            className="transition-colors hover:text-teal-600 dark:hover:text-teal-400"
          >
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <Link
            href={`/${place.category}`}
            className="capitalize transition-colors hover:text-teal-600 dark:hover:text-teal-400"
          >
            {categoryLabel}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate text-gray-900 dark:text-white">
            {place.name}
          </span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              {place.name}
            </h1>
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Share2 className="h-4 w-4" />
                {t("share")}
              </button>
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {linkCopied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {linkCopied ? t("linkCopied") : t("copyLink")}
              </button>
            </div>
          </div>

          {/* Category badge, region, city, rating */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${categoryColors[place.category]}`}
            >
              {categoryLabel}
            </span>
            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4" />
              {place.city}, {regionLabel}
            </span>
            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                {place.rating}
              </span>
              <span className="text-gray-400">/5</span>
            </span>
          </div>
        </div>

        {/* Description */}
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
            {t("about")}
          </h2>
          <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
            {desc}
          </p>
        </section>

        {/* Info Grid */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {t("info")}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Age Range */}
            <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-teal-500" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {t("ageRange")}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {ageLabel}
                </p>
              </div>
            </div>

            {/* Indoor/Outdoor */}
            <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
              <Sun className="mt-0.5 h-5 w-5 shrink-0 text-teal-500" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {t("indoorOutdoor")}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {venueLabel}
                </p>
              </div>
            </div>

            {/* Price Level */}
            <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
              <DollarSign className="mt-0.5 h-5 w-5 shrink-0 text-teal-500" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {t("priceLevel")}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {place.priceLevel === "free"
                    ? locale === "zh"
                      ? "免费"
                      : "Free"
                    : place.priceLevel}
                </p>
              </div>
            </div>

            {/* Best Time */}
            <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
              <CalendarCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-500" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {t("bestTime")}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {place.bestTime}
                </p>
              </div>
            </div>

            {/* Parking */}
            <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50 sm:col-span-2">
              <Car className="mt-0.5 h-5 w-5 shrink-0 text-teal-500" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {t("parking")}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {place.parking}
                </p>
              </div>
            </div>

            {/* Tips */}
            <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50 sm:col-span-2">
              <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {t("tips")}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {place.tips}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Boolean Badges */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-3">
            <BooleanBadge
              value={place.strollerFriendly}
              label={t("strollerFriendly")}
              icon={<Baby className="h-4 w-4" />}
            />
            <BooleanBadge
              value={place.changingStation}
              label={t("changingStation")}
              icon={<Accessibility className="h-4 w-4" />}
            />
            <BooleanBadge
              value={place.diningOnSite}
              label={t("diningOnSite")}
              icon={<UtensilsCrossed className="h-4 w-4" />}
            />
            <BooleanBadge
              value={place.needsReservation}
              label={t("needsReservation")}
              icon={<CalendarCheck className="h-4 w-4" />}
              invertColor
            />
          </div>
        </section>

        {/* Tags */}
        {place.tags.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <Tag className="h-5 w-5" />
              {t("tags")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {place.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-teal-50 px-3 py-1 text-sm text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Website Link */}
        {place.website && (
          <section className="mb-8">
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
            >
              <ExternalLink className="h-4 w-4" />
              {t("website")}
            </a>
          </section>
        )}

        {/* Map */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {t("location")}
          </h2>
          <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
            <MapInner
              places={[place]}
              filteredCategory={place.category}
            />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="mr-1 inline h-4 w-4" />
              {place.city}, {regionLabel}
            </span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 transition-colors hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
            >
              {t("getDirections")}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>

        {/* Similar Places */}
        {similarPlaces.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              {t("similarPlaces")}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {similarPlaces.map((p) => (
                <PlaceCard key={p.slug} place={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

function BooleanBadge({
  value,
  label,
  icon,
  invertColor = false,
}: {
  value: boolean;
  label: string;
  icon: React.ReactNode;
  invertColor?: boolean;
}) {
  const positive = invertColor ? !value : value;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${
        positive
          ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500"
      }`}
    >
      {icon}
      {label}
      {value ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <span className="text-xs opacity-60">--</span>
      )}
    </span>
  );
}
