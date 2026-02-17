"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "./FavoritesProvider";

interface FavoriteButtonProps {
  slug: string;
  className?: string;
}

export default function FavoriteButton({
  slug,
  className = "",
}: FavoriteButtonProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorited = isFavorite(slug);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(slug);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      className={`group/fav inline-flex items-center justify-center rounded-full p-1.5 transition-all duration-200 hover:scale-110 active:scale-95 ${
        favorited
          ? "text-rose-500 dark:text-rose-400"
          : "text-gray-300 hover:text-rose-400 dark:text-gray-600 dark:hover:text-rose-400"
      } ${className}`}
    >
      <Heart
        className={`h-4.5 w-4.5 transition-all duration-200 ${
          favorited ? "fill-rose-500 dark:fill-rose-400" : "fill-transparent"
        }`}
      />
    </button>
  );
}
