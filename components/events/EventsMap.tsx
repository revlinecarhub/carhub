"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { EventWithOwner } from "@/lib/events/repo";

// Fix default marker icons (Leaflet expects URL paths that bundlers break)
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

function FitBounds({ events }: { events: EventWithOwner[] }) {
  const map = useMap();
  useEffect(() => {
    if (events.length === 0) return;
    const bounds = L.latLngBounds(events.map((e) => [e.lat, e.lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
  }, [events, map]);
  return null;
}

export function EventsMap({ events }: { events: EventWithOwner[] }) {
  // Default center: France
  const center: [number, number] = events.length > 0 ? [events[0].lat, events[0].lng] : [46.5, 2.5];

  return (
    <div className="h-[500px] w-full overflow-hidden rounded-lg border border-[var(--color-border)]">
      <MapContainer center={center} zoom={6} className="h-full w-full" scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds events={events} />
        {events.map((e) => (
          <Marker key={e.id} position={[e.lat, e.lng]}>
            <Popup>
              <div className="space-y-1 text-sm">
                <div className="font-semibold">{e.title}</div>
                <div className="text-xs text-gray-600">{e.location_name}</div>
                <div className="text-xs">
                  {new Date(e.event_date).toLocaleString("fr-FR", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </div>
                {e.owner && (
                  <div className="text-xs">
                    Par <Link href={`/u/${e.owner.username}`}>@{e.owner.username}</Link>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
