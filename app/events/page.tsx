import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listActiveEvents } from "@/lib/events/repo";
import { EventsMapWrapper as EventsMap } from "@/components/events/EventsMapWrapper";

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const events = await listActiveEvents();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-accent)]">
            Communauté
          </p>
          <h1 className="mt-3 font-serif text-5xl text-white" style={{ fontFamily: "var(--font-playfair)" }}>
            Événements
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Rassemblements, meetings et car spotting à venir.
          </p>
        </div>
        {user && (
          <Link
            href="/events/new"
            className="inline-flex items-center gap-1.5 rounded bg-[var(--color-accent-button)] px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Créer un événement
          </Link>
        )}
      </header>

      <EventsMap events={events} />

      <section className="mt-12">
        <h2 className="mb-4 font-serif text-2xl" style={{ fontFamily: "var(--font-playfair)" }}>
          À venir
        </h2>
        {events.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">Aucun événement à venir.</p>
        ) : (
          <ul className="space-y-3">
            {events.map((e) => (
              <li
                key={e.id}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-[var(--color-fg)]">{e.title}</div>
                    <div className="mt-1 text-sm text-[var(--color-muted)]">
                      {e.location_name} ·{" "}
                      {new Date(e.event_date).toLocaleString("fr-FR", {
                        dateStyle: "long",
                        timeStyle: "short",
                      })}
                    </div>
                    {e.description && (
                      <p className="mt-2 whitespace-pre-wrap text-sm">{e.description}</p>
                    )}
                  </div>
                  {e.owner && (
                    <Link
                      href={`/u/${e.owner.username}`}
                      className="shrink-0 text-xs text-[var(--color-muted)] hover:text-[var(--color-accent)]"
                    >
                      @{e.owner.username}
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
