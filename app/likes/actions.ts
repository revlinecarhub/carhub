"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { addLike, removeLike, userHasLiked } from "@/lib/likes/repo";

export async function toggleLikeAction(carId: string, slug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "login required" };

  const liked = await userHasLiked(carId, user.id);
  if (liked) await removeLike(carId, user.id);
  else await addLike(carId, user.id);

  revalidatePath(`/cars/${slug}`);
  return { ok: true, liked: !liked };
}
