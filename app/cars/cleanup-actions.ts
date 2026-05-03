"use server";

import { createClient } from "@/lib/supabase/server";
import { destroyImages, destroyVideo } from "@/lib/cloudinary/admin";

export async function cleanupOrphansAction(input: {
  image_public_ids: string[];
  video_public_ids: string[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return; // silent: nothing to clean if no session

  await destroyImages(input.image_public_ids);
  for (const id of input.video_public_ids) {
    await destroyVideo(id);
  }
}
