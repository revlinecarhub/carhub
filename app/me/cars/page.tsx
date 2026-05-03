import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { listCarsByOwner } from "@/lib/cars/repo";
import { DeleteCarButton } from "@/components/admin/DeleteCarButton";

export default async function MyCarsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/me/cars");

  const cars = await listCarsByOwner(user.id);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl" style={{ fontFamily: "var(--font-playfair)" }}>Mes voitures</h1>
        <Link
          href="/cars/new"
          className="rounded bg-[var(--color-accent-button)] px-4 py-2 text-sm font-semibold text-white"
        >
          + Ajouter
        </Link>
      </div>
      {cars.length === 0 ? (
        <p className="text-[var(--color-muted)]">
          Tu n'as encore publié aucune voiture.{" "}
          <Link href="/cars/new" className="text-[var(--color-accent)] underline">En ajouter une</Link>
        </p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--color-border)] text-[var(--color-muted)]">
            <tr><th className="py-3">Voiture</th><th>Année</th><th>Photos</th><th></th></tr>
          </thead>
          <tbody>
            {cars.map((c) => (
              <tr key={c.id} className="border-b border-[var(--color-border)]">
                <td className="py-3">
                  <Link href={`/cars/${c.slug}`} className="hover:text-[var(--color-accent)]">
                    {c.marque} {c.modele}
                  </Link>
                </td>
                <td>{c.annee ?? "—"}</td>
                <td>{c.car_images.length}</td>
                <td className="space-x-4 text-right">
                  <Link href={`/cars/${c.slug}/edit`} className="text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)]">Éditer</Link>
                  <DeleteCarButton id={c.id} label={`${c.marque} ${c.modele}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
