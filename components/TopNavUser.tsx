"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { CldImage } from "next-cloudinary";
import { User, Shield, LogOut, LogIn } from "lucide-react";
import { logoutAction } from "@/app/login/actions";

type Profile = { username: string; avatarUrl: string | null; isAdmin: boolean };

export function TopNavUser({ profile }: { profile: Profile | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!profile) {
    return (
      <Link
        href="/login"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-fg)] hover:text-[var(--color-fg)]"
        aria-label="Connexion"
      >
        <LogIn className="h-4 w-4" />
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative h-9 w-9 overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-card)]"
      >
        {profile.avatarUrl ? (
          <CldImage src={profile.avatarUrl} alt={profile.username} fill sizes="36px" className="object-cover" />
        ) : (
          <span className="flex h-full items-center justify-center text-[var(--color-muted)]">
            <User className="h-4 w-4" />
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] py-1 text-sm shadow-lg">
          <div className="border-b border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-muted)]">
            @{profile.username}
          </div>
          <Link href={`/u/${profile.username}`} className="flex items-center gap-2 px-3 py-2 hover:bg-[var(--color-bg)]">
            <User className="h-4 w-4" /> Mon profil
          </Link>
          {profile.isAdmin && (
            <Link href="/admin" className="flex items-center gap-2 px-3 py-2 hover:bg-[var(--color-bg)]">
              <Shield className="h-4 w-4" /> Modération
            </Link>
          )}
          <form action={logoutAction}>
            <button type="submit" className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-[var(--color-bg)]">
              <LogOut className="h-4 w-4" /> Déconnexion
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
