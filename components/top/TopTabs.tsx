"use client";

import { useState, type ReactNode } from "react";
import { Heart, Eye } from "lucide-react";

type Props = {
  liked: ReactNode;
  viewed: ReactNode;
};

export function TopTabs({ liked, viewed }: Props) {
  const [tab, setTab] = useState<"liked" | "viewed">("liked");

  const tabBase = "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition";
  const active = "border-[var(--color-accent)] text-[var(--color-accent)]";
  const inactive = "border-transparent text-[var(--color-muted)] hover:text-[var(--color-fg)]";

  return (
    <div>
      <div className="mb-6 flex gap-2 border-b border-[var(--color-border)]">
        <button
          type="button"
          onClick={() => setTab("liked")}
          className={`${tabBase} ${tab === "liked" ? active : inactive}`}
        >
          <Heart className={`h-4 w-4 ${tab === "liked" ? "fill-current" : ""}`} />
          Plus likées
        </button>
        <button
          type="button"
          onClick={() => setTab("viewed")}
          className={`${tabBase} ${tab === "viewed" ? active : inactive}`}
        >
          <Eye className="h-4 w-4" />
          Plus vues
        </button>
      </div>
      {tab === "liked" ? liked : viewed}
    </div>
  );
}
