import { createClient } from "@/lib/supabase/server";
import type { CarWithImages } from "@/lib/cars/repo";
import { getProfileByUserId } from "@/lib/profiles/repo";
import { CarCardView } from "./CarCardView";

async function getOwnerUsername(ownerId: string): Promise<string | null> {
  const profile = await getProfileByUserId(ownerId);
  return profile?.username ?? null;
}

async function getLikeCount(carId: string): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("car_likes")
    .select("*", { count: "exact", head: true })
    .eq("car_id", carId);
  return count ?? 0;
}

export async function CarCard({ car }: { car: CarWithImages }) {
  const [ownerUsername, likeCount] = await Promise.all([
    getOwnerUsername(car.owner_id),
    getLikeCount(car.id),
  ]);

  return <CarCardView car={car} ownerUsername={ownerUsername} likeCount={likeCount} />;
}
