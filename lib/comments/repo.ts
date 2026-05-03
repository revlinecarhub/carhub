import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

type Comment = Database["public"]["Tables"]["car_comments"]["Row"];

export type CommentWithAuthor = Comment & {
  author: {
    username: string;
    avatar_url: string | null;
  } | null;
};

export async function listCommentsForCar(carId: string): Promise<CommentWithAuthor[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("car_comments")
    .select("*, author:profiles(username, avatar_url)")
    .eq("car_id", carId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as CommentWithAuthor[];
}

export async function getCommentCount(carId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("car_comments")
    .select("*", { count: "exact", head: true })
    .eq("car_id", carId);
  if (error) throw error;
  return count ?? 0;
}

export async function getAverageRating(carId: string): Promise<{ avg: number; count: number }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("car_comments")
    .select("rating")
    .eq("car_id", carId)
    .not("rating", "is", null);
  if (error) throw error;
  const ratings = (data ?? []).map((r) => r.rating!).filter((r): r is number => r != null);
  if (ratings.length === 0) return { avg: 0, count: 0 };
  return {
    avg: ratings.reduce((a, b) => a + b, 0) / ratings.length,
    count: ratings.length,
  };
}

export async function insertComment(input: {
  car_id: string;
  user_id: string;
  body: string;
  rating?: number | null;
}): Promise<Comment> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("car_comments")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteComment(commentId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("car_comments").delete().eq("id", commentId);
  if (error) throw error;
}

export async function getCommentById(commentId: string): Promise<Comment | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("car_comments")
    .select("*")
    .eq("id", commentId)
    .maybeSingle();
  if (error) throw error;
  return data;
}
