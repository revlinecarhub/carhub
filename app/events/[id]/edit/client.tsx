"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { updateEventAction } from "@/app/events/actions";
import { EventLocationPickerWrapper as EventLocationPicker } from "@/components/events/EventLocationPickerWrapper";
import { DateTimePicker } from "@/components/events/DateTimePicker";

const INPUT_CLASS = "w-full rounded border border-[var(--color-border)] bg-[var(--color-card)] p-3 text-sm";
const LABEL_CLASS = "mb-1 block text-xs uppercase tracking-wider text-[var(--color-muted)]";

type Initial = {
  title: string;
  description: string;
  location_name: string;
  lat: number;
  lng: number;
  event_date: string;
};

type NominatimResult = {
  lat: string;
  lon: string;
  display_name: string;
};

export function EditEventClient({ id, initial }: { id: string; initial: Initial }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [lat, setLat] = useState<number | null>(initial.lat);
  const [lng, setLng] = useState<number | null>(initial.lng);
  const [eventDate, setEventDate] = useState<string>(initial.event_date);
  const [locationQuery, setLocationQuery] = useState<string>("");
  const [locationName, setLocationName] = useState<string>(initial.location_name);
  const [searching, setSearching] = useState(false);

  async function searchLocation() {
    const q = locationQuery.trim();
    if (!q) {
      toast.error("Tape un lieu");
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
        { headers: { Accept: "application/json" } }
      );
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
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSearching(false);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (lat == null || lng == null) {
          toast.error("Lieu manquant");
          return;
        }
        if (!eventDate) {
          toast.error("Date manquante");
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
            const res = await updateEventAction(id, payload);
            if (res?.error) toast.error(res.error);
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Erreur";
            if (msg.includes("NEXT_REDIRECT")) {
              toast.success("Enregistré");
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
        <input name="title" required maxLength={120} defaultValue={initial.title} className={INPUT_CLASS} />
      </div>
      <div>
        <label className={LABEL_CLASS}>Description</label>
        <textarea name="description" rows={3} maxLength={2000} defaultValue={initial.description} className={INPUT_CLASS} />
      </div>

      <div>
        <label className={LABEL_CLASS}>Lieu actuel : <span className="text-[var(--color-fg)]">{locationName}</span></label>
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
            placeholder="Changer de lieu… (Entrée)"
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
      </div>

      <div>
        <label className={LABEL_CLASS}>Date et heure *</label>
        <DateTimePicker name="event_date" value={eventDate} onChange={setEventDate} />
      </div>

      <div>
        <label className={LABEL_CLASS}>
          Position {lat != null && lng != null && (
            <span className="ml-2 text-[var(--color-fg)]">({lat.toFixed(4)}, {lng.toFixed(4)})</span>
          )}
        </label>
        <EventLocationPicker lat={lat} lng={lng} onChange={(la, ln) => { setLat(la); setLng(ln); }} />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold disabled:opacity-50"
        >
          {pending ? "Enregistrement…" : "Enregistrer"}
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
  );
}
