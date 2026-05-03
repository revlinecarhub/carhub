"use client";

import { CarForm } from "@/components/admin/CarForm";
import { CarFormHeader } from "@/components/admin/CarFormHeader";
import { createCarAction } from "../actions";

export default function NewCarPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <CarFormHeader mode="create" />
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
