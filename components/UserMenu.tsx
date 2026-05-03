"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { CldImage } from "next-cloudinary";
import { User } from "lucide-react";
import { logoutAction } from "@/app/login/actions";

type Props = {
  username: string;
  avatarUrl: string | null;
  isAdmin: boolean;
};

export function UserMenu({ username, avatarUrl, isAdmin }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative h-9 w-9 overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-card)]"
      >
        {avatarUrl ? (
          <CldImage src={avatarUrl} alt={username} fill sizes="36px" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--color-muted)]">
            <User className="h-5 w-5" />
          </div>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-52 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] py-1 text-sm shadow-lg">
          <div className="border-b border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-muted)]">
            @{username}
          </div>
          <Link href={`/u/${username}`} className="block px-3 py-2 hover:bg-[var(--color-bg)]">Mon profil</Link>
          <Link href="/me/cars" className="block px-3 py-2 hover:bg-[var(--color-bg)]">Mes voitures</Link>
          <Link href="/me/events" className="block px-3 py-2 hover:bg-[var(--color-bg)]">Mes événements</Link>
          {isAdmin && (
            <Link href="/admin" className="block px-3 py-2 hover:bg-[var(--color-bg)]">Modération</Link>
          )}
          <form action={logoutAction}>
            <button type="submit" className="w-full px-3 py-2 text-left hover:bg-[var(--color-bg)]">
              Déconnexion
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
