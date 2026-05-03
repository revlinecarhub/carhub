"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { follow, unfollow, isFollowing } from "@/lib/follows/repo";

export async function toggleFollowAction(followeeId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "login required" };
  if (user.id === followeeId) return { error: "cannot follow self" };

  const following = await isFollowing(user.id, followeeId);
  if (following) await unfollow(user.id, followeeId);
  else await follow(user.id, followeeId);

  revalidatePath("/network");
  return { ok: true, following: !following };
}
