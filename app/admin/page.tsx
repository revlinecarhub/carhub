import Link from "next/link";
import { listCars } from "@/lib/cars/repo";
import { listAllEvents } from "@/lib/events/repo";
import { DeleteCarButton } from "@/components/admin/DeleteCarButton";
import { DeleteEventButton } from "@/components/events/DeleteEventButton";

export default async function AdminDashboard() {
  const [cars, events] = await Promise.all([listCars(), listAllEvents()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 space-y-12">
      <div>
        <h1 className="mb-2 font-serif text-3xl" style={{ fontFamily: "var(--font-playfair)" }}>
          Modération
        </h1>
        <p className="text-sm text-[var(--color-muted)]">
          Supprime les contenus inappropriés. Tu ne peux pas éditer le contenu d&apos;autrui.
        </p>
      </div>

      {/* Voitures */}
      <section>
        <h2 className="mb-4 font-serif text-2xl" style={{ fontFamily: "var(--font-playfair)" }}>
          Voitures ({cars.length})
        </h2>
        {cars.length === 0 ? (
          <p className="text-[var(--color-muted)]">Aucune voiture.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-muted)]">
                <tr>
                  <th className="px-4 py-3">Voiture</th>
                  <th className="px-4 py-3">Année</th>
                  <th className="px-4 py-3">Carburant</th>
                  <th className="px-4 py-3">Photos</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {cars.map((c) => (
                  <tr key={c.id} className="border-b border-[var(--color-border)] last:border-b-0">
                    <td className="px-4 py-3">
                      <Link href={`/cars/${c.slug}`} className="hover:text-[var(--color-accent)]">
                        {c.marque} {c.modele}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{c.annee ?? "—"}</td>
                    <td className="px-4 py-3 capitalize">{c.carburant}</td>
                    <td className="px-4 py-3">{c.car_images.length}</td>
                    <td className="px-4 py-3 text-right">
                      <DeleteCarButton id={c.id} label={`${c.marque} ${c.modele}`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Événements */}
      <section>
        <h2 className="mb-4 font-serif text-2xl" style={{ fontFamily: "var(--font-playfair)" }}>
          Événements ({events.length})
        </h2>
        {events.length === 0 ? (
          <p className="text-[var(--color-muted)]">Aucun événement.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-muted)]">
                <tr>
                  <th className="px-4 py-3">Titre</th>
                  <th className="px-4 py-3">Lieu</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Auteur</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => {
                  const past = new Date(e.event_date) < new Date();
                  return (
                    <tr key={e.id} className="border-b border-[var(--color-border)] last:border-b-0">
                      <td className="px-4 py-3">
                        <span className="font-medium">{e.title}</span>
                        {past && (
                          <span className="ml-2 rounded bg-[var(--color-bg)] px-2 py-0.5 text-xs text-[var(--color-muted)]">
                            Passé
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[var(--color-muted)]">{e.location_name}</td>
                      <td className="px-4 py-3 text-[var(--color-muted)]">
                        {new Date(e.event_date).toLocaleString("fr-FR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        {e.owner ? (
                          <Link
                            href={`/u/${e.owner.username}`}
                            className="text-[var(--color-accent)] hover:underline"
                          >
                            @{e.owner.username}
                          </Link>
                        ) : (
                          <span className="text-[var(--color-muted)]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DeleteEventButton id={e.id} label={e.title} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
