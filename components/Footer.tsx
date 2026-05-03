import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-[var(--color-border)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-[var(--color-muted)] sm:flex-row">
        <p>
          &copy; {year} RevLine Hub
        </p>
        <nav className="flex items-center gap-6">
          <Link href="/about" className="hover:text-[var(--color-fg)]">À propos</Link>
          <Link href="/contact" className="hover:text-[var(--color-fg)]">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
