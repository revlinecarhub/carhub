import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export async function isFollowing(followerId: string, followeeId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("follower_id", followerId)
    .eq("followee_id", followeeId)
    .maybeSingle();
  if (error) throw error;
  return data != null;
}

export async function follow(followerId: string, followeeId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("follows")
    .insert({ follower_id: followerId, followee_id: followeeId });
  if (error && error.code !== "23505") throw error;
}

export async function unfollow(followerId: string, followeeId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", followerId)
    .eq("followee_id", followeeId);
  if (error) throw error;
}

export async function listFollowing(userId: string): Promise<Profile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("follows")
    .select("followee:profiles!follows_followee_id_fkey(*)")
    .eq("follower_id", userId);
  if (error) throw error;
  return ((data ?? []).map((r) => (r as unknown as { followee: Profile }).followee)).filter(Boolean);
}

export async function getFollowingIds(userId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("follows")
    .select("followee_id")
    .eq("follower_id", userId);
  if (error) throw error;
  return (data ?? []).map((r) => r.followee_id);
}

export async function discoverProfiles(userId: string): Promise<Profile[]> {
  const followingIds = await getFollowingIds(userId);
  const exclude = [userId, ...followingIds];
  const supabase = await createClient();
  let q = supabase.from("profiles").select("*").order("created_at", { ascending: false });
  if (exclude.length > 0) {
    q = q.not("id", "in", `(${exclude.map((id) => `"${id}"`).join(",")})`);
  }
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}
