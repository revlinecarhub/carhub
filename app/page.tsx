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
    <div className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-12 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-accent)]">
          Collection Automobile
        </p>
        <h1
          className="mt-3 font-serif text-6xl md:text-8xl text-white"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          REVLINE
        </h1>
        <p className="mt-4 text-base text-[var(--color-muted)]">
          Explorez, partagez et commentez les plus belles voitures de la collection.
        </p>
      </header>

      <div className="mb-8">
        <CarToolbar marques={marques} pays={pays} />
      </div>

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
