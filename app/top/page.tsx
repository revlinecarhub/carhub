import { Eye, Heart } from "lucide-react";
import { getTopLiked, getTopViewed, type TopLikedCar, type TopViewedCar } from "@/lib/cars/top";
import { TopCarRow } from "@/components/top/TopCarRow";
import { TopTabs } from "@/components/top/TopTabs";

export default async function TopPage() {
  const [topLiked, topViewed] = await Promise.all([
    getTopLiked(10),
    getTopViewed(10),
  ]);

  const likedSection =
    topLiked.length === 0 ? (
      <p className="text-sm text-[var(--color-muted)]">Aucun like pour l&apos;instant.</p>
    ) : (
      <ol className="space-y-3">
        {topLiked.map((c: TopLikedCar, i) => (
          <li key={c.id}>
            <TopCarRow
              car={c}
              rank={i + 1}
              stat={
                <div className="inline-flex items-center gap-1">
                  <Heart className="h-4 w-4 fill-[var(--color-accent)] text-[var(--color-accent)]" />
                  <span className="font-semibold text-[var(--color-fg)]">{c.like_count}</span>
                </div>
              }
            />
          </li>
        ))}
      </ol>
    );

  const viewedSection =
    topViewed.length === 0 ? (
      <p className="text-sm text-[var(--color-muted)]">Aucune vue pour l&apos;instant.</p>
    ) : (
      <ol className="space-y-3">
        {topViewed.map((c: TopViewedCar, i) => (
          <li key={c.id}>
            <TopCarRow
              car={c}
              rank={i + 1}
              stat={
                <div className="inline-flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span className="font-semibold text-[var(--color-fg)]">{c.view_count}</span>
                </div>
              }
            />
          </li>
        ))}
      </ol>
    );

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-12 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-accent)]">
          Classement du mois
        </p>
        <h1 className="mt-3 font-serif text-5xl md:text-6xl text-white" style={{ fontFamily: "var(--font-playfair)" }}>
          Top Voitures
        </h1>
        <p className="mt-4 text-base text-[var(--color-muted)]">
          Les plus likées et les plus consultées des 30 derniers jours.
        </p>
      </header>

      <TopTabs liked={likedSection} viewed={viewedSection} />
    </div>
  );
}
