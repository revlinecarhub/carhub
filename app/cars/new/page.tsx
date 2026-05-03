"use client";

import { CarForm } from "@/components/admin/CarForm";
import { createCarAction } from "../actions";

export default function NewCarPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 font-serif text-3xl" style={{ fontFamily: "var(--font-playfair)" }}>Nouvelle voiture</h1>
      <CarForm
        onSubmit={async ({ car, images, cover_image_url, video, orphan_image_public_ids, orphan_video_public_ids }) => {
          await createCarAction({
            car: car as Parameters<typeof createCarAction>[0]["car"],
            images,
            cover_image_url,
            video,
            orphan_image_public_ids,
            orphan_video_public_ids,
          });
        }}
      />
    </div>
  );
}
