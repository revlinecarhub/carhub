import { Eye, Star } from "lucide-react";
import { LikeButton } from "./LikeButton";

export function CarMetaBar({
  carId,
  slug,
  viewCount,
  likeCount,
  liked,
  avgRating,
  ratingCount,
}: {
  carId: string;
  slug: string;
  viewCount: number;
  likeCount: number;
  liked: boolean;
  avgRating: number;
  ratingCount: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-muted)]">
      {ratingCount > 0 && (
        <div className="inline-flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-[var(--color-fg)]">{avgRating.toFixed(1)}</span>
          <span>({ratingCount})</span>
        </div>
      )}
      <div className="inline-flex items-center gap-1.5">
        <Eye className="h-4 w-4" />
        <span className="text-[var(--color-fg)]">{viewCount}</span>
        <span>vues</span>
      </div>
      <LikeButton carId={carId} slug={slug} initialLiked={liked} initialCount={likeCount} />
    </div>
  );
}
