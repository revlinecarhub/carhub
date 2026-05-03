import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-32 text-center">
      <h1 className="font-serif text-5xl" style={{ fontFamily: "var(--font-playfair)" }}>Profil introuvable</h1>
      <p className="mt-4 text-[var(--color-muted)]">Ce pseudo n&apos;existe pas.</p>
      <Link href="/" className="mt-8 inline-block underline">Retour à l&apos;accueil</Link>
    </div>
  );
}
