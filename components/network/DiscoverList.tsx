"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import type { Database } from "@/lib/supabase/database.types";
import { ProfileMiniCard } from "./ProfileMiniCard";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function DiscoverList({ profiles }: { profiles: Profile[] }) {
  const [q, setQ] = useState("");

  const needle = q.trim().toLowerCase();
  const filtered = needle
    ? profiles.filter(
        (p) =>
          p.username.toLowerCase().includes(needle) ||
          (p.bio ?? "").toLowerCase().includes(needle) ||
          (p.club_association ?? "").toLowerCase().includes(needle)
      )
    : profiles;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un pseudo, club, bio…"
          className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-card)] py-2.5 pl-10 pr-3 text-sm placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-[var(--color-muted)]">
          {needle ? "Aucun résultat." : "Aucun nouveau profil à découvrir."}
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((p) => (
            <li key={p.id}>
              <ProfileMiniCard profile={p} initialFollowing={false} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
