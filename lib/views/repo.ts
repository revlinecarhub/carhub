import { createClient } from "@/lib/supabase/server";

export async function getViewCount(carId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("car_views")
    .select("*", { count: "exact", head: true })
    .eq("car_id", carId);
  if (error) throw error;
  return count ?? 0;
}

export async function recordView(carId: string, viewKey: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("car_views")
    .insert({ car_id: carId, view_key: viewKey });
  if (error && error.code !== "23505") throw error;
}
