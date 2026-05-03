import Link from "next/link";
import { Plus, Gauge } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProfileByUserId } from "@/lib/profiles/repo";
import { TopNavLinks } from "./TopNavLinks";
import { TopNavUser } from "./TopNavUser";

export async function TopNav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const profile = user ? await getProfileByUserId(user.id) : null;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]">
            <Gauge className="h-6 w-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <div
              className="font-serif text-lg font-bold leading-none tracking-wider"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              REVLINE
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Collection Automobile
            </div>
          </div>
        </Link>

        <TopNavLinks isLogged={!!profile} />

        <div className="flex items-center gap-2 shrink-0">
          {profile && (
            <Link
              href="/cars/new"
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Ajouter</span>
            </Link>
          )}
          <TopNavUser
            profile={
              profile
                ? {
                    username: profile.username,
                    avatarUrl: profile.avatar_url,
                    isAdmin: profile.is_admin,
                  }
                : null
            }
          />
        </div>
      </div>
    </header>
  );
}
