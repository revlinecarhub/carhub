import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCarBySlug } from "@/lib/cars/repo";
import { EditClient } from "./client";

type Params = Promise<{ slug: string }>;

export default async function EditCarPage({ params }: { params: Params }) {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/cars/${slug}/edit`);
  if (car.owner_id !== user.id) redirect(`/cars/${slug}`);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 font-serif text-3xl" style={{ fontFamily: "var(--font-playfair)" }}>Éditer {car.marque} {car.modele}</h1>
      <EditClient
        initial={{
          id: car.id,
          marque: car.marque,
          modele: car.modele,
          type: car.type ?? undefined,
          annee: car.annee,
          pays_constructeur: car.pays_constructeur,
          exemplaires_produits: car.exemplaires_produits,
          phase_generation: car.phase_generation ?? undefined,
          carburant: car.carburant,
          config_moteur: car.config_moteur ?? undefined,
          cylindree_cm3: car.cylindree_cm3,
          puissance_ch: car.puissance_ch,
          roues_motrices: car.roues_motrices ?? undefined,
          boite_vitesse: car.boite_vitesse ?? undefined,
          nb_vitesses: car.nb_vitesses,
          alimentation: car.alimentation ?? undefined,
          position_moteur: car.position_moteur ?? undefined,
          situation: car.situation ?? undefined,
          video_url: car.video_url ?? undefined,
          video_public_id: car.video_public_id ?? undefined,
          cover_image_url: car.cover_image_url ?? undefined,
          car_images: car.car_images.map((i) => ({
            cloudinary_url: i.cloudinary_url,
            cloudinary_public_id: i.cloudinary_public_id,
          })),
        }}
      />
    </div>
  );
}
