"use client";

import { CarForm } from "@/components/admin/CarForm";
import { updateCarAction } from "@/app/cars/actions";

type Initial = NonNullable<Parameters<typeof CarForm>[0]["initial"]> & { id: string };

export function EditClient({ initial }: { initial: Initial }) {
  return (
    <CarForm
      initial={initial}
      onSubmit={async ({ car, images, cover_image_url, video, orphan_image_public_ids, orphan_video_public_ids }) => {
        await updateCarAction({
          id: initial.id,
          car: car as Parameters<typeof updateCarAction>[0]["car"],
          images,
          cover_image_url,
          video,
          orphan_image_public_ids,
          orphan_video_public_ids,
        });
      }}
    />
  );
}
