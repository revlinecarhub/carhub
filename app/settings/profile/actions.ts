"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/schemas/profile";
import { getProfileByUserId, updateProfile, usernameExists } from "@/lib/profiles/repo";
import { destroyImages } from "@/lib/cloudinary/admin";

export async function updateProfileAction(input: unknown) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("login required");

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }

  const current = await getProfileByUserId(user.id);
  if (!current) throw new Error("profile missing");

  if (parsed.data.username.toLowerCase() !== current.username.toLowerCase()) {
    if (await usernameExists(parsed.data.username)) {
      return { error: "Pseudo déjà utilisé" };
    }
  }

  const newAvatarUrl = parsed.data.avatar_url || null;
  const newAvatarPublicId = parsed.data.avatar_public_id || null;
  if (
    current.avatar_public_id &&
    current.avatar_public_id !== newAvatarPublicId
  ) {
    await destroyImages([current.avatar_public_id]);
  }

  await updateProfile(user.id, {
    username: parsed.data.username,
    bio: parsed.data.bio || null,
    club_association: parsed.data.club_association || null,
    type_voiture_prefere: parsed.data.type_voiture_prefere || null,
    social_links: parsed.data.social_links ?? [],
    avatar_url: newAvatarUrl,
    avatar_public_id: newAvatarPublicId,
  });

  revalidatePath(`/u/${current.username}`);
  revalidatePath(`/u/${parsed.data.username}`);
  return { ok: true };
}
