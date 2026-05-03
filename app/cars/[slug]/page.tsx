import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCarBySlug } from "@/lib/cars/repo";
import { getViewCount } from "@/lib/views/repo";
import { getLikeCount, userHasLiked } from "@/lib/likes/repo";
import { getAverageRating } from "@/lib/comments/repo";
import { CarCarousel } from "@/components/CarCarousel";
import { CarSpecs } from "@/components/CarSpecs";
import { CarMetaBar } from "@/components/cars/CarMetaBar";
import { OwnerBadge } from "@/components/cars/OwnerBadge";
import { CommentsSection } from "@/components/cars/CommentsSection";
import { ViewTracker } from "@/components/cars/ViewTracker";

type Params = Promise<{ slug: string }>;

export default async function CarDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [viewCount, likeCount, liked, rating] = await Promise.all([
    getViewCount(car.id),
    getLikeCount(car.id),
    userHasLiked(car.id, user?.id),
    getAverageRating(car.id),
  ]);

  return (
    <article>
      <ViewTracker carId={car.id} />
      <div className="mx-auto max-w-5xl px-6 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)]"
        >
          <ChevronLeft className="h-4 w-4" />
          Retour au classeur
        </Link>
      </div>

      <CarCarousel
        images={car.car_images}
        title={`${car.marque} ${car.modele}`}
      />

      <div className="mx-auto max-w-5xl px-6 py-12 space-y-8">
        <div className="space-y-3">
          <h1 className="font-serif text-5xl md:text-6xl" style={{ fontFamily: "var(--font-playfair)" }}>
            {car.marque} <span className="text-[var(--color-muted)]">{car.modele}</span>
            {car.annee && (
              <span className="ml-3 text-3xl text-[var(--color-accent)]">{car.annee}</span>
            )}
          </h1>
          <CarMetaBar
            carId={car.id}
            slug={car.slug}
            viewCount={viewCount}
            likeCount={likeCount}
            liked={liked}
            avgRating={rating.avg}
            ratingCount={rating.count}
          />
          <OwnerBadge ownerId={car.owner_id} />
        </div>

        <section>
          <h2 className="mb-6 font-serif text-2xl" style={{ fontFamily: "var(--font-playfair)" }}>Caractéristiques</h2>
          <CarSpecs car={car} />
        </section>

        {car.video_url && (
          <section>
            <h2 className="mb-6 font-serif text-2xl" style={{ fontFamily: "var(--font-playfair)" }}>Vidéo</h2>
            <div className="overflow-hidden rounded-lg bg-black">
              <video
                src={car.video_url}
                controls
                playsInline
                className="w-full"
              />
            </div>
          </section>
        )}

        <CommentsSection carId={car.id} slug={car.slug} />
      </div>
    </article>
  );
}
