import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export async function getProfileByUserId(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getProfileByUsername(username: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .ilike("username", username)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function usernameExists(username: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .ilike("username", username)
    .maybeSingle();
  if (error) throw error;
  return data != null;
}

export async function updateProfile(userId: string, input: ProfileUpdate): Promise<Profile> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(input)
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getProfileStats(userId: string): Promise<{
  cars_count: number;
  views_count: number;
  likes_count: number;
}> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profile_stats")
    .select("*")
    .eq("owner_id", userId)
    .maybeSingle();
  if (error) throw error;
  return {
    cars_count: data?.cars_count ?? 0,
    views_count: data?.views_count ?? 0,
    likes_count: data?.likes_count ?? 0,
  };
}

export async function isAdmin(userId: string | null | undefined): Promise<boolean> {
  if (!userId) return false;
  const profile = await getProfileByUserId(userId);
  return !!profile?.is_admin;
}
