"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { carInputSchema, carImageInputSchema } from "@/lib/schemas/car";
import {
  insertCar,
  insertCarImages,
  updateCar,
  deleteCar,
  deleteCarImages,
  slugExists,
  getCarById,
} from "@/lib/cars/repo";
import { destroyImages, destroyVideo } from "@/lib/cloudinary/admin";
import { generateSlug, ensureUniqueSlug } from "@/lib/slug";
import { isAdmin } from "@/lib/profiles/repo";
import { z } from "zod";

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("login required");
  return user;
}

async function requireOwnerOrAdmin(carId: string) {
  const user = await requireUser();
  const car = await getCarById(carId);
  if (!car) throw new Error("not found");
  if (car.owner_id !== user.id && !(await isAdmin(user.id))) {
    throw new Error("forbidden");
  }
  return { user, car };
}

async function requireOwner(carId: string) {
  const user = await requireUser();
  const car = await getCarById(carId);
  if (!car) throw new Error("not found");
  if (car.owner_id !== user.id) throw new Error("forbidden");
  return { user, car };
}

const videoSchema = z.object({
  url: z.string().url().nullable(),
  public_id: z.string().nullable(),
});

const createSchema = z.object({
  car: carInputSchema,
  images: z.array(carImageInputSchema),
  cover_image_url: z.string().url().nullable(),
  video: videoSchema,
  orphan_image_public_ids: z.array(z.string()).default([]),
  orphan_video_public_ids: z.array(z.string()).default([]),
});

export async function createCarAction(input: z.infer<typeof createSchema>) {
  const user = await requireUser();
  const { car, images, cover_image_url, video, orphan_image_public_ids, orphan_video_public_ids } = createSchema.parse(input);

  const baseSlug = generateSlug({
    marque: car.marque,
    modele: car.modele,
    annee: car.annee,
  });
  const slug = await ensureUniqueSlug(baseSlug, slugExists);

  const inserted = await insertCar({
    ...car,
    slug,
    owner_id: user.id,
    cover_image_url,
    video_url: video.url,
    video_public_id: video.public_id,
    situation: car.situation || null,
  });

  await insertCarImages(inserted.id, images);

  // Cleanup orphaned uploads
  await destroyImages(orphan_image_public_ids);
  for (const id of orphan_video_public_ids) await destroyVideo(id);

  revalidatePath("/");
  revalidatePath("/cars");
  revalidatePath(`/cars/${slug}`);
  redirect(`/cars/${slug}`);
}

const updateSchema = z.object({
  id: z.string().uuid(),
  car: carInputSchema,
  images: z.array(carImageInputSchema),
  cover_image_url: z.string().url().nullable(),
  video: videoSchema,
  orphan_image_public_ids: z.array(z.string()).default([]),
  orphan_video_public_ids: z.array(z.string()).default([]),
});

export async function updateCarAction(input: z.infer<typeof updateSchema>) {
  const { id, car, images, cover_image_url, video, orphan_image_public_ids, orphan_video_public_ids } = updateSchema.parse(input);
  const { car: existing } = await requireOwner(id);

  // If video changed, destroy old Cloudinary asset
  if (existing.video_public_id && existing.video_public_id !== video.public_id) {
    await destroyVideo(existing.video_public_id);
  }

  const oldImages = await deleteCarImages(id);
  const newPublicIds = new Set(images.map((i) => i.cloudinary_public_id));
  const toDestroy = oldImages
    .filter((img) => !newPublicIds.has(img.cloudinary_public_id))
    .map((img) => img.cloudinary_public_id);
  await destroyImages(toDestroy);

  await insertCarImages(id, images);

  await updateCar(id, {
    ...car,
    cover_image_url,
    video_url: video.url,
    video_public_id: video.public_id,
    situation: car.situation || null,
  });

  // Cleanup orphaned uploads from this edit session
  await destroyImages(orphan_image_public_ids);
  for (const vid of orphan_video_public_ids) await destroyVideo(vid);

  revalidatePath("/");
  revalidatePath("/cars");
  revalidatePath(`/cars/${existing.slug}`);
  redirect(`/cars/${existing.slug}`);
}

export async function deleteCarAction(id: string) {
  const { car: existing } = await requireOwnerOrAdmin(id);

  const publicIds = existing.car_images.map((img) => img.cloudinary_public_id);
  await deleteCar(id);
  await destroyImages(publicIds);
  await destroyVideo(existing.video_public_id);

  revalidatePath("/");
  revalidatePath("/cars");
  revalidatePath(`/cars/${existing.slug}`);
}
