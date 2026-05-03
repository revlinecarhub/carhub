import Link from "next/link";
import { listCars } from "@/lib/cars/repo";
import { DeleteCarButton } from "@/components/admin/DeleteCarButton";

export default async function AdminDashboard() {
  const cars = await listCars();

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl" style={{ fontFamily: "var(--font-playfair)" }}>Modération — toutes les voitures</h1>
      {cars.length === 0 ? (
        <p className="text-[var(--color-muted)]">
          Aucune voiture.{" "}
          <Link href="/cars/new" className="text-[var(--color-accent)] underline">
            En ajouter une
          </Link>
        </p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--color-border)] text-[var(--color-muted)]">
            <tr>
              <th className="py-3">Voiture</th>
              <th>Année</th>
              <th>Carburant</th>
              <th>Photos</th>
              <th></th>
            </tr>
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
                <td>{c.carburant}</td>
                <td>{c.car_images.length}</td>
                <td className="space-x-4 text-right">
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
