import { Car as CarIcon } from "lucide-react";
import { listCars, distinctMarques, distinctPays } from "@/lib/cars/repo";
import { CarCard } from "@/components/CarCard";
import { CarToolbar } from "@/components/CarToolbar";

type SearchParams = Promise<{
  marque?: string;
  modele?: string;
  type?: string;
  annee?: string;
  carburant?: string;
  pays_constructeur?: string;
  situation?: string;
  q?: string;
}>;

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const filters = {
    marque: sp.marque,
    modele: sp.modele,
    type: sp.type,
    carburant: sp.carburant,
    annee: sp.annee ? Number(sp.annee) : undefined,
    pays_constructeur: sp.pays_constructeur,
    situation: sp.situation,
    q: sp.q,
  };
  const [cars, marques, pays] = await Promise.all([
    listCars(filters),
    distinctMarques(),
    distinctPays(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="mb-12 text-center">
        <div className="mb-4 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
          <span className="h-px w-12 bg-[var(--color-accent)]/40" />
          Collection Automobile
          <span className="h-px w-12 bg-[var(--color-accent)]/40" />
        </div>
        <h1
          className="font-serif text-7xl md:text-9xl text-white tracking-wider"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          REVLINE
        </h1>
        <p className="mt-6 text-base text-[var(--color-muted)]">
          Explorez, partagez et commentez les plus belles voitures de la collection.
        </p>
      </header>

      <div className="mb-6">
        <CarToolbar marques={marques} pays={pays} />
      </div>

      <p className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--color-muted)]">
        <CarIcon className="h-4 w-4" />
        {cars.length} véhicule{cars.length > 1 ? "s" : ""} trouvé{cars.length > 1 ? "s" : ""}
      </p>

      {cars.length === 0 ? (
        <p className="text-[var(--color-muted)]">Aucune voiture trouvée.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((c) => (
            <CarCard key={c.id} car={c} />
          ))}
        </div>
      )}
    </div>
  );
}
