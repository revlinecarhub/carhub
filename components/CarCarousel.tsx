"use client";

import useEmblaCarousel from "embla-carousel-react";
import { CldImage } from "next-cloudinary";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";

type Image = { id: string; cloudinary_url: string };

export function CarCarousel({ images, title }: { images: Image[]; title: string }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (images.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center bg-black text-[var(--color-muted)]">
        Aucune image
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-black" ref={emblaRef}>
      <div className="flex">
        {images.map((img) => (
          <div key={img.id} className="relative h-[60vh] min-w-0 flex-[0_0_100%]">
            <CldImage
              src={img.cloudinary_url}
              alt={title}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Précédent"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 hover:bg-black"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={next}
            aria-label="Suivant"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 hover:bg-black"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
    </div>
  );
}
