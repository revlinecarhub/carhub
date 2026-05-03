"use client";

import { useState, type ReactNode } from "react";
import { Newspaper, Users, Compass } from "lucide-react";

type Tab = "feed" | "following" | "discover";

export function NetworkTabs({
  feed,
  following,
  discover,
}: {
  feed: ReactNode;
  following: ReactNode;
  discover: ReactNode;
}) {
  const [tab, setTab] = useState<Tab>("feed");

  const base = "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition";
  const active = "border-[var(--color-accent)] text-[var(--color-accent)]";
  const inactive = "border-transparent text-[var(--color-muted)] hover:text-[var(--color-fg)]";

  return (
    <div>
      <div className="mb-6 flex gap-2 border-b border-[var(--color-border)] overflow-x-auto">
        <button type="button" onClick={() => setTab("feed")} className={`${base} ${tab === "feed" ? active : inactive}`}>
          <Newspaper className="h-4 w-4" />
          Fil d&apos;actualité
        </button>
        <button type="button" onClick={() => setTab("following")} className={`${base} ${tab === "following" ? active : inactive}`}>
          <Users className="h-4 w-4" />
          Abonnements
        </button>
        <button type="button" onClick={() => setTab("discover")} className={`${base} ${tab === "discover" ? active : inactive}`}>
          <Compass className="h-4 w-4" />
          Découvrir
        </button>
      </div>
      {tab === "feed" ? feed : tab === "following" ? following : discover}
    </div>
  );
}
