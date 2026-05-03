"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { commentSchema } from "@/lib/schemas/comment";
import { insertComment, deleteComment, getCommentById } from "@/lib/comments/repo";
import { isAdmin } from "@/lib/profiles/repo";

export async function addCommentAction(input: {
  carId: string;
  slug: string;
  body: string;
  rating?: number;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "login required" };

  const parsed = commentSchema.safeParse({ body: input.body, rating: input.rating });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalide" };

  await insertComment({
    car_id: input.carId,
    user_id: user.id,
    body: parsed.data.body,
    rating: parsed.data.rating ?? null,
  });

  revalidatePath(`/cars/${input.slug}`);
  return { ok: true };
}

export async function deleteCommentAction(commentId: string, slug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("login required");

  const comment = await getCommentById(commentId);
  if (!comment) throw new Error("not found");
  if (comment.user_id !== user.id && !(await isAdmin(user.id))) {
    throw new Error("forbidden");
  }

  await deleteComment(commentId);
  revalidatePath(`/cars/${slug}`);
}
