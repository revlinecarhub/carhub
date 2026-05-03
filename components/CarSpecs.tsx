import type { CarWithImages } from "@/lib/cars/repo";

const FIELDS: Array<[keyof CarWithImages, string, (v: unknown) => string]> = [
  ["type", "Type", (v) => String(v)],
  ["annee", "Année", (v) => String(v)],
  ["pays_constructeur", "Pays constructeur", (v) => String(v)],
  ["exemplaires_produits", "Exemplaires produits", (v) => String(v)],
  ["phase_generation", "Phase / Génération", (v) => String(v)],
  ["carburant", "Carburant", (v) => String(v)],
  ["config_moteur", "Configuration moteur", (v) => String(v)],
  ["cylindree_cm3", "Cylindrée", (v) => `${v} cm³`],
  ["puissance_ch", "Puissance", (v) => `${v} ch`],
  ["roues_motrices", "Roues motrices", (v) => String(v)],
  ["boite_vitesse", "Boîte de vitesse", (v) => String(v)],
  ["nb_vitesses", "Nombre de vitesses", (v) => String(v)],
  ["alimentation", "Alimentation", (v) => String(v)],
  ["position_moteur", "Position du moteur", (v) => String(v)],
  ["situation", "Situation", (v) => String(v)],
];

export function CarSpecs({ car }: { car: CarWithImages }) {
  const rows = FIELDS
    .map(([key, label, format]) => {
      const v = car[key];
      if (v == null || v === "") return null;
      return [label, format(v)] as const;
    })
    .filter((x): x is readonly [string, string] => x !== null);

  return (
    <dl className="grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-12">
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between border-b border-[var(--color-border)] pb-2">
          <dt className="text-sm uppercase tracking-wider text-[var(--color-muted)]">{label}</dt>
          <dd className="text-sm">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
