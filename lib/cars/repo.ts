import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

type Car = Database["public"]["Tables"]["cars"]["Row"];
type CarInsert = Database["public"]["Tables"]["cars"]["Insert"];
type CarUpdate = Database["public"]["Tables"]["cars"]["Update"];
type CarImage = Database["public"]["Tables"]["car_images"]["Row"];

export type CarWithImages = Car & { car_images: CarImage[] };

export type ListFilters = {
  marque?: string;
  modele?: string;
  type?: string;
  carburant?: string;
  annee?: number;
  pays_constructeur?: string;
  situation?: string;
  q?: string;
};

export async function listCars(filters: ListFilters = {}): Promise<CarWithImages[]> {
  const supabase = await createClient();
  let query = supabase
    .from("cars")
    .select("*, car_images(*)")
    .order("created_at", { ascending: false });

  if (filters.marque) query = query.eq("marque", filters.marque);
  if (filters.modele) query = query.ilike("modele", `%${filters.modele}%`);
  if (filters.type) query = query.ilike("type", `%${filters.type}%`);
  if (filters.carburant) query = query.eq("carburant", filters.carburant);
  if (filters.annee) query = query.eq("annee", filters.annee);
  if (filters.pays_constructeur)
    query = query.eq("pays_constructeur", filters.pays_constructeur);
  if (filters.situation) query = query.eq("situation", filters.situation);
  if (filters.q) {
    query = query.or(
      `marque.ilike.%${filters.q}%,modele.ilike.%${filters.q}%`
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as CarWithImages[];
}

export async function getCarBySlug(slug: string): Promise<CarWithImages | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cars")
    .select("*, car_images(*)")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  // Sort images by position
  const car = data as CarWithImages;
  car.car_images.sort((a, b) => a.position - b.position);
  return car;
}

export async function getCarById(id: string): Promise<CarWithImages | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cars")
    .select("*, car_images(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return (data as CarWithImages) ?? null;
}

export async function slugExists(slug: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cars")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data != null;
}

export async function insertCar(input: CarInsert): Promise<Car> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cars")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCar(id: string, input: CarUpdate): Promise<Car> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cars")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCar(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("cars").delete().eq("id", id);
  if (error) throw error;
}

export async function insertCarImages(
  carId: string,
  images: { cloudinary_url: string; cloudinary_public_id: string; position: number }[]
): Promise<void> {
  if (images.length === 0) return;
  const supabase = await createClient();
  const { error } = await supabase.from("car_images").insert(
    images.map((img) => ({ ...img, car_id: carId }))
  );
  if (error) throw error;
}

export async function deleteCarImages(carId: string): Promise<CarImage[]> {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("car_images")
    .select("*")
    .eq("car_id", carId);

  const { error } = await supabase
    .from("car_images")
    .delete()
    .eq("car_id", carId);
  if (error) throw error;
  return existing ?? [];
}

export async function distinctMarques(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cars")
    .select("marque")
    .order("marque");
  if (error) throw error;
  const set = new Set((data ?? []).map((r) => r.marque));
  return Array.from(set);
}

export async function listCarsByOwners(ownerIds: string[]): Promise<CarWithImages[]> {
  if (ownerIds.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cars")
    .select("*, car_images(*)")
    .in("owner_id", ownerIds)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as CarWithImages[];
}

export async function listCarsByOwner(ownerId: string): Promise<CarWithImages[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cars")
    .select("*, car_images(*)")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as CarWithImages[];
}

export async function distinctPays(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cars")
    .select("pays_constructeur")
    .order("pays_constructeur");
  if (error) throw error;
  const set = new Set((data ?? []).map((r) => r.pays_constructeur));
  return Array.from(set);
}
