"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { profileSchema } from "@/lib/schemas/profile";
import { getProfileByUserId, updateProfile, usernameExists } from "@/lib/profiles/repo";
import { listCarsByOwner } from "@/lib/cars/repo";
import { destroyImages, destroyVideo } from "@/lib/cloudinary/admin";

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

/**
 * Delete current user's account.
 * - Cleans up Cloudinary assets (avatar + car images + videos)
 * - Deletes auth.users row → cascades profiles, cars, comments, likes, follows, events via FK
 * - Confirms by requiring caller to pass current username
 */
export async function deleteAccountAction(confirmUsername: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non connecté" };

  const profile = await getProfileByUserId(user.id);
  if (!profile) return { error: "Profil introuvable" };

  if (confirmUsername.trim().toLowerCase() !== profile.username.toLowerCase()) {
    return { error: "Pseudo de confirmation incorrect" };
  }

  // Collect Cloudinary assets to clean
  const cars = await listCarsByOwner(user.id);
  const imagePublicIds: string[] = [];
  const videoPublicIds: string[] = [];

  if (profile.avatar_public_id) imagePublicIds.push(profile.avatar_public_id);

  for (const car of cars) {
    for (const img of car.car_images) {
      if (img.cloudinary_public_id) imagePublicIds.push(img.cloudinary_public_id);
    }
    if (car.video_public_id) videoPublicIds.push(car.video_public_id);
  }

  // Best-effort Cloudinary cleanup (don't block on failure)
  try {
    await destroyImages(imagePublicIds);
  } catch (e) {
    console.error("[deleteAccount] Cloudinary images cleanup failed", e);
  }
  try {
    for (const id of videoPublicIds) await destroyVideo(id);
  } catch (e) {
    console.error("[deleteAccount] Cloudinary videos cleanup failed", e);
  }

  // Delete auth user (admin API) → cascades all related rows
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    console.error("[deleteAccount] auth.admin.deleteUser failed", error);
    return { error: "Échec suppression compte: " + error.message };
  }

  // Sign out current session client-side cookies
  await supabase.auth.signOut();

  revalidatePath("/");
  redirect("/?deleted=1");
}
