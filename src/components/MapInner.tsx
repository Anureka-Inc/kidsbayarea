"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Place, Category } from "@/data/places";

import "leaflet/dist/leaflet.css";

interface MapInnerProps {
  places: Place[];
  filteredCategory: string;
}

const categoryColors: Record<Category, string> = {
  play: "#0d9488",
  eat: "#f59e0b",
  learn: "#3b82f6",
  shop: "#a855f7",
  explore: "#22c55e",
};

function createIcon(category: Category) {
  const color = categoryColors[category] || "#0891b2";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40">
    <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.268 21.732 0 14 0z" fill="${color}"/>
    <circle cx="14" cy="14" r="6" fill="white"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -40],
  });
}

export default function MapInner({ places, filteredCategory }: MapInnerProps) {
  // Fix default marker icons
  useEffect(() => {
    delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  return (
    <MapContainer
      center={[37.55, -122.1]}
      zoom={9}
      className="h-[400px] w-full md:h-[500px]"
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {places.map((place) => (
        <Marker
          key={place.slug}
          position={[place.lat, place.lng]}
          icon={createIcon(place.category)}
        >
          <Popup>
            <div className="min-w-[180px]">
              <p className="text-sm font-semibold">{place.name}</p>
              <p className="text-xs capitalize text-gray-500">
                {place.category} &middot; {place.city}
              </p>
              <p className="mt-1 text-xs">
                {"★".repeat(Math.round(place.rating))}{" "}
                <span className="text-gray-400">{place.rating}</span>
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
