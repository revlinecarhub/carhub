import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-32 text-center">
      <h1 className="font-serif text-5xl" style={{ fontFamily: "var(--font-playfair)" }}>Voiture introuvable</h1>
      <p className="mt-4 text-[var(--color-muted)]">
        Cette voiture n&apos;existe pas ou a été supprimée.
      </p>
      <Link href="/" className="mt-8 inline-block underline">
        Retour au classeur
      </Link>
    </div>
  );
}
