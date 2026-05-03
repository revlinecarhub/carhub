import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type TopLikedCar = Database["public"]["Views"]["top_liked_cars"]["Row"];
export type TopViewedCar = Database["public"]["Views"]["top_viewed_cars"]["Row"];

export async function getTopLiked(limit = 10): Promise<TopLikedCar[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("top_liked_cars")
    .select("*")
    .order("like_count", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getTopViewed(limit = 10): Promise<TopViewedCar[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("top_viewed_cars")
    .select("*")
    .order("view_count", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}
