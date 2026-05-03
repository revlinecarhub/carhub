"use client";

import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { Calendar, Fuel, Gauge, Heart } from "lucide-react";
import type { CarWithImages } from "@/lib/cars/repo";

export function CarCardView({
  car,
  ownerUsername,
  likeCount,
}: {
  car: CarWithImages;
  ownerUsername: string | null;
  likeCount: number;
}) {
  const cover = car.cover_image_url ?? car.car_images[0]?.cloudinary_url ?? null;

  return (
    <Link
      href={`/cars/${car.slug}`}
      className="group block overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] transition hover:border-[var(--color-accent)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-black">
        {cover ? (
          <CldImage
            src={cover}
            alt={`${car.marque} ${car.modele}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--color-muted)]">
            Aucune image
          </div>
        )}
        {car.type && (
          <span className="absolute left-3 top-3 rounded bg-[var(--color-accent)] px-2.5 py-1 text-xs font-semibold text-white">
            {car.type}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-serif text-xl text-[var(--color-fg)]" style={{ fontFamily: "var(--font-playfair)" }}>
          {car.marque} {car.modele}
        </h3>
        {car.pays_constructeur && (
          <p className="mt-1 text-sm text-[var(--color-muted)]">{car.pays_constructeur}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          {car.annee && (
            <span className="inline-flex items-center gap-1 text-[var(--color-muted)]">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-[var(--color-fg)]">{car.annee}</span>
            </span>
          )}
          {car.carburant && (
            <span className="inline-flex items-center gap-1 text-[var(--color-muted)]">
              <Fuel className="h-3.5 w-3.5" />
              <span className="text-[var(--color-fg)] capitalize">{car.carburant}</span>
            </span>
          )}
          {car.config_moteur && (
            <span className="text-xs font-bold uppercase text-[var(--color-accent)]">
              {car.config_moteur}
            </span>
          )}
          {car.puissance_ch && (
            <span className="inline-flex items-center gap-1 font-semibold text-[var(--color-accent)]">
              <Gauge className="h-3.5 w-3.5" />
              {car.puissance_ch} ch
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-3 text-xs">
          <div className="flex items-center gap-3 text-[var(--color-muted)]">
            <span className="inline-flex items-center gap-1">
              <Heart className="h-3.5 w-3.5 text-[var(--color-accent)]" />
              {likeCount}
            </span>
          </div>
          {ownerUsername && (
            <span className="text-[var(--color-accent)]">{ownerUsername}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
