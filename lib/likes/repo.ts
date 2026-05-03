import { createClient } from "@/lib/supabase/server";

export async function getLikeCount(carId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("car_likes")
    .select("*", { count: "exact", head: true })
    .eq("car_id", carId);
  if (error) throw error;
  return count ?? 0;
}

export async function userHasLiked(carId: string, userId: string | null | undefined): Promise<boolean> {
  if (!userId) return false;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("car_likes")
    .select("car_id")
    .eq("car_id", carId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data != null;
}

export async function addLike(carId: string, userId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("car_likes")
    .insert({ car_id: carId, user_id: userId });
  if (error && error.code !== "23505") throw error;
}

export async function removeLike(carId: string, userId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("car_likes")
    .delete()
    .eq("car_id", carId)
    .eq("user_id", userId);
  if (error) throw error;
}
