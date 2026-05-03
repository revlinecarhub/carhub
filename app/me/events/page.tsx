import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { listEventsByOwner } from "@/lib/events/repo";
import { DeleteEventButton } from "@/components/events/DeleteEventButton";

export default async function MyEventsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/me/events");

  const events = await listEventsByOwner(user.id);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl" style={{ fontFamily: "var(--font-playfair)" }}>Mes événements</h1>
        <Link
          href="/events/new"
          className="rounded bg-[var(--color-accent-button)] px-4 py-2 text-sm font-semibold text-white"
        >
          + Créer un événement
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="text-[var(--color-muted)]">
          Tu n&apos;as encore créé aucun événement.{" "}
          <Link href="/events/new" className="text-[var(--color-accent)] underline">
            En créer un
          </Link>
        </p>
      ) : (
        <ul className="space-y-3">
          {events.map((e) => {
            const past = new Date(e.event_date) < new Date();
            return (
              <li
                key={e.id}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--color-fg)]">{e.title}</span>
                      {past && (
                        <span className="rounded bg-[var(--color-bg)] px-2 py-0.5 text-xs text-[var(--color-muted)]">
                          Passé
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-sm text-[var(--color-muted)]">
                      {e.location_name}
                    </div>
                    <div className="text-sm text-[var(--color-muted)]">
                      {new Date(e.event_date).toLocaleString("fr-FR", {
                        dateStyle: "long",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2 text-sm">
                    <Link
                      href={`/events/${e.id}/edit`}
                      className="text-[var(--color-muted)] hover:text-[var(--color-fg)]"
                    >
                      Éditer
                    </Link>
                    <DeleteEventButton id={e.id} label={e.title} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
