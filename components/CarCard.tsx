"use client";

import Link from "next/link";
import { CldImage } from "next-cloudinary";
import type { CarWithImages } from "@/lib/cars/repo";

export function CarCard({ car }: { car: CarWithImages }) {
  const cover = car.cover_image_url ?? car.car_images[0]?.cloudinary_url ?? null;
  return (
    <Link
      href={`/cars/${car.slug}`}
      className="group block overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] transition hover:border-[var(--color-accent)]"
    >
      <div className="aspect-[16/10] relative bg-black">
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
      </div>
      <div className="p-4">
        <h3 className="font-serif text-xl" style={{ fontFamily: "var(--font-playfair)" }}>
          {car.marque} <span className="text-[var(--color-muted)]">{car.modele}</span>
        </h3>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          {[
            car.annee,
            car.pays_constructeur,
            car.puissance_ch ? `${car.puissance_ch} ch` : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
    </Link>
  );
}
