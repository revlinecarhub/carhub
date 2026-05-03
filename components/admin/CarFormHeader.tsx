import { Car } from "lucide-react";

export function CarFormHeader({
  mode = "create",
}: {
  mode?: "create" | "edit";
}) {
  const title = mode === "edit" ? "Modifier le véhicule" : "Ajouter un véhicule";
  const subtitle =
    mode === "edit"
      ? "Mets à jour les informations du véhicule."
      : "Complétez les informations du véhicule pour l'ajouter au classeur.";

  return (
    <header className="mb-8 text-center">
      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--color-accent)]/15 ring-1 ring-[var(--color-accent)]/30">
        <Car className="h-7 w-7 text-[var(--color-accent)]" />
      </div>
      <h1
        className="font-serif text-4xl text-[var(--color-fg)]"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {title}
      </h1>
      <p className="mt-2 text-sm text-[var(--color-muted)]">{subtitle}</p>
    </header>
  );
}
