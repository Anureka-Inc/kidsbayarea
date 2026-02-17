import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { Star, MapPin, Clock, DollarSign } from "lucide-react";
import type { Place } from "@/data/places";
import FavoriteButton from "./FavoriteButton";

interface PlaceCardProps {
  place: Place;
}

const categoryColors: Record<string, string> = {
  play: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  eat: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  learn: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  shop: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  explore: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

const venueLabels: Record<string, string> = {
  indoor: "Indoor",
  outdoor: "Outdoor",
  both: "Indoor & Outdoor",
};

export default function PlaceCard({ place }: PlaceCardProps) {
  const locale = useLocale();
  const desc = locale === "zh" ? place.description.zh : place.description.en;
  const ageLabel = place.ageRange.includes("all") ? "All Ages" : place.ageRange.join(", ");
  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-300 hover:border-teal-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-teal-600">
      {/* Favorite button - top right */}
      <div className="absolute top-3 right-3 z-10">
        <FavoriteButton slug={place.slug} />
      </div>

      <Link
        href={`/${place.category}/${place.slug}`}
        className="block"
      >
      <div className="p-5">
        {/* Header: name + category badge */}
        <div className="mb-3 flex items-start justify-between gap-2 pr-7">
          <h3 className="line-clamp-1 text-base font-semibold text-gray-900 transition-colors group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400">
            {place.name}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${categoryColors[place.category] || ""}`}
          >
            {place.category}
          </span>
        </div>

        {/* City + Rating */}
        <div className="mb-3 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {place.city}
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {place.rating}
          </span>
        </div>

        {/* Description */}
        <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {desc}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            <Clock className="h-3 w-3" />
            {ageLabel}
          </span>
          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            {venueLabels[place.indoorOutdoor]}
          </span>
          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            <DollarSign className="h-3 w-3" />
            {place.priceLevel}
          </span>
        </div>

        {/* Tags */}
        {place.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {place.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-teal-50 px-2 py-0.5 text-xs text-teal-600 dark:bg-teal-900/30 dark:text-teal-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      </Link>
    </div>
  );
}
