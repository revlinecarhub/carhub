"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { createEventAction } from "../actions";
import { EventLocationPickerWrapper as EventLocationPicker } from "@/components/events/EventLocationPickerWrapper";
import { DateTimePicker } from "@/components/events/DateTimePicker";

const INPUT_CLASS = "w-full rounded border border-[var(--color-border)] bg-[var(--color-card)] p-3 text-sm";
const LABEL_CLASS = "mb-1 block text-xs uppercase tracking-wider text-[var(--color-muted)]";

type NominatimResult = {
  lat: string;
  lon: string;
  display_name: string;
};

export default function NewEventPage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [eventDate, setEventDate] = useState<string>("");
  const [locationQuery, setLocationQuery] = useState<string>("");
  const [locationName, setLocationName] = useState<string>("");
  const [searching, setSearching] = useState(false);

  async function searchLocation() {
    const q = locationQuery.trim();
    if (!q) {
      toast.error("Tape un lieu à rechercher");
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&addressdetails=0`,
        { headers: { Accept: "application/json" } }
      );
      if (!res.ok) throw new Error("Erreur réseau");
      const data: NominatimResult[] = await res.json();
      if (data.length === 0) {
        toast.error("Lieu introuvable");
        return;
      }
      const r = data[0];
      setLat(parseFloat(r.lat));
      setLng(parseFloat(r.lon));
      setLocationName(r.display_name);
      toast.success("Lieu trouvé");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur recherche");
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 font-serif text-3xl" style={{ fontFamily: "var(--font-playfair)" }}>
        Nouvel événement
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (lat == null || lng == null) {
            toast.error("Recherche un lieu ou clique sur la carte");
            return;
          }
          if (!locationName) {
            toast.error("Lieu manquant");
            return;
          }
          if (!eventDate) {
            toast.error("Choisis une date");
            return;
          }
          const fd = new FormData(e.currentTarget);
          const payload = {
            title: String(fd.get("title") ?? ""),
            description: String(fd.get("description") ?? ""),
            location_name: locationName,
            event_date: eventDate,
            lat,
            lng,
          };
          startTransition(async () => {
            try {
              const res = await createEventAction(payload);
              if (res?.error) toast.error(res.error);
            } catch (err) {
              const msg = err instanceof Error ? err.message : "Erreur";
              if (msg.includes("NEXT_REDIRECT")) {
                toast.success("Événement créé");
                throw err;
              }
              toast.error(msg);
            }
          });
        }}
        className="space-y-6"
      >
        <div>
          <label className={LABEL_CLASS}>Titre *</label>
          <input name="title" required maxLength={120} className={INPUT_CLASS} />
        </div>
        <div>
          <label className={LABEL_CLASS}>Description</label>
          <textarea name="description" rows={3} maxLength={2000} className={INPUT_CLASS} />
        </div>

        <div>
          <label className={LABEL_CLASS}>Lieu * (ex: Mortefontaine, France)</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  searchLocation();
                }
              }}
              maxLength={200}
              placeholder="Tape un lieu et appuie sur Entrée…"
              className={`${INPUT_CLASS} flex-1`}
            />
            <button
              type="button"
              onClick={searchLocation}
              disabled={searching}
              className="inline-flex items-center gap-1.5 rounded border border-[var(--color-accent)] bg-[var(--color-accent)] px-4 text-sm font-semibold text-white disabled:opacity-50"
            >
              <Search className="h-4 w-4" />
              {searching ? "…" : "Rechercher"}
            </button>
          </div>
          {locationName && (
            <p className="mt-2 text-xs text-[var(--color-muted)]">
              Sélectionné: <span className="text-[var(--color-fg)]">{locationName}</span>
            </p>
          )}
        </div>

        <div>
          <label className={LABEL_CLASS}>Date et heure *</label>
          <DateTimePicker name="event_date" value={eventDate} onChange={setEventDate} />
        </div>

        <div>
          <label className={LABEL_CLASS}>
            Position
            {lat != null && lng != null && (
              <span className="ml-2 text-[var(--color-fg)]">
                ({lat.toFixed(4)}, {lng.toFixed(4)})
              </span>
            )}
          </label>
          <EventLocationPicker
            lat={lat}
            lng={lng}
            onChange={(la, ln) => {
              setLat(la);
              setLng(ln);
            }}
          />
          <p className="mt-2 text-xs text-[var(--color-muted)]">
            Tu peux ajuster le pin en cliquant sur la carte.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={pending}
            className="rounded bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold disabled:opacity-50"
          >
            {pending ? "Création…" : "Créer"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={pending}
            className="rounded border border-[var(--color-border)] px-6 py-3 text-sm disabled:opacity-50"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
