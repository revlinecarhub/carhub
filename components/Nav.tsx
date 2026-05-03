import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProfileByUserId } from "@/lib/profiles/repo";
import { UserMenu } from "./UserMenu";

export async function Nav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const profile = user ? await getProfileByUserId(user.id) : null;

  return (
    <header className="relative z-40 border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-2xl tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>
          RevLine <span className="text-[var(--color-accent)]">Hub</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="hover:text-[var(--color-accent)]">Voitures</Link>
          <Link href="/top" className="hover:text-[var(--color-accent)]">Top</Link>
          <Link href="/events" className="hover:text-[var(--color-accent)]">Événements</Link>
          {profile && (
            <Link href="/network" className="hover:text-[var(--color-accent)]">Réseau</Link>
          )}
          {profile && (
            <Link
              href="/cars/new"
              className="inline-flex items-center gap-1.5 rounded bg-[var(--color-accent-button)] px-3 py-1.5 text-white hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Ajouter
            </Link>
          )}
          {profile ? (
            <UserMenu
              username={profile.username}
              avatarUrl={profile.avatar_url}
              isAdmin={profile.is_admin}
            />
          ) : (
            <>
              <Link href="/login" className="text-[var(--color-muted)] hover:text-[var(--color-fg)]">Connexion</Link>
              <Link
                href="/signup"
                className="rounded border border-[var(--color-accent)] px-3 py-1.5 text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white"
              >
                Inscription
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
