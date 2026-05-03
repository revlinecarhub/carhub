"use client";

import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { Trophy } from "lucide-react";

const RANK_COLORS = ["text-yellow-400", "text-gray-300", "text-amber-700"];

function RankBadge({ rank }: { rank: number }) {
  const color = RANK_COLORS[rank - 1] ?? "text-[var(--color-muted)]";
  return (
    <div className="flex w-10 shrink-0 items-center justify-center">
      {rank <= 3 ? (
        <div className="flex flex-col items-center">
          <Trophy className={`h-5 w-5 ${color}`} />
          <span className={`text-xs font-bold ${color}`}>#{rank}</span>
        </div>
      ) : (
        <span className="text-lg font-bold text-[var(--color-muted)]">#{rank}</span>
      )}
    </div>
  );
}

export function TopCarRow({
  car,
  rank,
  stat,
}: {
  car: { slug: string; marque: string; modele: string; annee: number | null; cover_image_url: string | null };
  rank: number;
  stat: React.ReactNode;
}) {
  return (
    <Link
      href={`/cars/${car.slug}`}
      className="flex items-center gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-3 transition hover:border-[var(--color-accent)]"
    >
      <RankBadge rank={rank} />
      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded bg-black">
        {car.cover_image_url ? (
          <CldImage
            src={car.cover_image_url}
            alt={`${car.marque} ${car.modele}`}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-serif text-base truncate" style={{ fontFamily: "var(--font-playfair)" }}>
          {car.marque} <span className="text-[var(--color-muted)]">{car.modele}</span>
        </div>
        {car.annee && (
          <div className="text-xs text-[var(--color-muted)]">{car.annee}</div>
        )}
      </div>
      <div className="text-right text-sm">{stat}</div>
    </Link>
  );
}
