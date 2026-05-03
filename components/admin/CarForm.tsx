"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImageUploader, type UploadedImage } from "./ImageUploader";
import { VideoUploader, type VideoValue } from "./VideoUploader";
import { carburantValues, situationValues } from "@/lib/schemas/car";
import { cleanupOrphansAction } from "@/app/cars/cleanup-actions";

type Initial = {
  id?: string;
  marque?: string;
  modele?: string;
  type?: string;
  annee?: number | null;
  pays_constructeur?: string;
  exemplaires_produits?: number | null;
  phase_generation?: string;
  carburant?: string;
  config_moteur?: string;
  cylindree_cm3?: number | null;
  puissance_ch?: number | null;
  roues_motrices?: string;
  boite_vitesse?: string;
  nb_vitesses?: number | null;
  alimentation?: string;
  position_moteur?: string;
  situation?: string;
  video_url?: string;
  video_public_id?: string;
  cover_image_url?: string;
  car_images?: UploadedImage[];
};

type Props = {
  initial?: Initial;
  onSubmit: (data: {
    car: Record<string, unknown>;
    images: (UploadedImage & { position: number })[];
    cover_image_url: string | null;
    video: VideoValue;
    orphan_image_public_ids: string[];
    orphan_video_public_ids: string[];
  }) => Promise<void>;
};

const INPUT_CLASS = "w-full rounded border border-[var(--color-border)] bg-[var(--color-card)] p-2 text-sm";
const LABEL_CLASS = "mb-1 block text-xs uppercase tracking-wider text-[var(--color-muted)]";

export function CarForm({ initial = {}, onSubmit }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [images, setImages] = useState<UploadedImage[]>(initial.car_images ?? []);
  const [video, setVideo] = useState<VideoValue>({
    url: initial.video_url ?? null,
    public_id: initial.video_public_id ?? null,
  });
  const [imagesUploading, setImagesUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const uploading = imagesUploading || videoUploading;
  const [orphanImageIds, setOrphanImageIds] = useState<string[]>([]);
  const [orphanVideoIds, setOrphanVideoIds] = useState<string[]>([]);

  const initialImageIds = new Set((initial.car_images ?? []).map((i) => i.cloudinary_public_id));
  const initialVideoId = initial.video_public_id ?? null;

  async function handleCancel() {
    // All public_ids uploaded this session that won't be persisted
    const newImageIds = images
      .map((i) => i.cloudinary_public_id)
      .filter((id) => !initialImageIds.has(id));
    const allOrphanImages = [...orphanImageIds, ...newImageIds];

    const newVideoIds: string[] = [...orphanVideoIds];
    if (video.public_id && video.public_id !== initialVideoId) {
      newVideoIds.push(video.public_id);
    }

    if (allOrphanImages.length || newVideoIds.length) {
      try {
        await cleanupOrphansAction({
          image_public_ids: allOrphanImages,
          video_public_ids: newVideoIds,
        });
      } catch {
        // ignore — user just cancels, best effort cleanup
      }
    }
    router.back();
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const car: Record<string, unknown> = {};
        for (const [k, v] of fd.entries()) {
          if (v === "" || v == null) continue;
          car[k] = v;
        }

        if (images.length === 0) {
          toast.error("Au moins une image requise");
          return;
        }

        startTransition(async () => {
          try {
            await onSubmit({
              car,
              images: images.map((img, i) => ({ ...img, position: i })),
              cover_image_url: images[0]?.cloudinary_url ?? null,
              video,
              orphan_image_public_ids: orphanImageIds,
              orphan_video_public_ids: orphanVideoIds,
            });
            toast.success("Enregistré");
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Erreur";
            // Next.js redirect throws NEXT_REDIRECT — show success + propagate
            if (msg.includes("NEXT_REDIRECT")) {
              toast.success("Enregistré");
              throw err;
            }
            toast.error(msg);
          }
        });
      }}
      className="space-y-8"
    >
      <section>
        <h2 className="mb-4 font-serif text-xl" style={{ fontFamily: "var(--font-playfair)" }}>Informations générales</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL_CLASS}>Marque *</label>
            <input name="marque" required defaultValue={initial.marque ?? ""} className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Modèle *</label>
            <input name="modele" required defaultValue={initial.modele ?? ""} className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Type</label>
            <input name="type" defaultValue={initial.type ?? ""} className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Année</label>
            <input name="annee" type="number" defaultValue={initial.annee ?? ""} className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Pays constructeur *</label>
            <input name="pays_constructeur" required defaultValue={initial.pays_constructeur ?? ""} className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Exemplaires produits</label>
            <input name="exemplaires_produits" type="number" defaultValue={initial.exemplaires_produits ?? ""} className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Phase / Génération</label>
            <input name="phase_generation" defaultValue={initial.phase_generation ?? ""} className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Situation (où la photo)</label>
            <select name="situation" defaultValue={initial.situation ?? ""} className={INPUT_CLASS}>
              <option value="">—</option>
              {situationValues.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-serif text-xl" style={{ fontFamily: "var(--font-playfair)" }}>Motorisation</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL_CLASS}>Carburant *</label>
            <select name="carburant" required defaultValue={initial.carburant ?? "essence"} className={INPUT_CLASS}>
              {carburantValues.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL_CLASS}>Configuration moteur</label>
            <input name="config_moteur" defaultValue={initial.config_moteur ?? ""} className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Cylindrée (cm³)</label>
            <input name="cylindree_cm3" type="number" defaultValue={initial.cylindree_cm3 ?? ""} className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Puissance (ch)</label>
            <input name="puissance_ch" type="number" defaultValue={initial.puissance_ch ?? ""} className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Roues motrices</label>
            <input name="roues_motrices" defaultValue={initial.roues_motrices ?? ""} className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Boîte de vitesse</label>
            <input name="boite_vitesse" defaultValue={initial.boite_vitesse ?? ""} className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Nombre de vitesses</label>
            <input name="nb_vitesses" type="number" defaultValue={initial.nb_vitesses ?? ""} className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Alimentation</label>
            <input name="alimentation" defaultValue={initial.alimentation ?? ""} className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Position du moteur</label>
            <input name="position_moteur" defaultValue={initial.position_moteur ?? ""} className={INPUT_CLASS} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-serif text-xl" style={{ fontFamily: "var(--font-playfair)" }}>Médias</h2>
        <div className="space-y-6">
          <div>
            <label className={LABEL_CLASS}>Vidéo (max 100 MB)</label>
            <VideoUploader
              value={video}
              onChange={setVideo}
              onUploadingChange={setVideoUploading}
              onUploadOrphaned={(id) => setOrphanVideoIds((p) => [...p, id])}
              initialPublicId={initial.video_public_id ?? null}
            />
          </div>
          <ImageUploader
            initial={images}
            onChange={setImages}
            onUploadingChange={setImagesUploading}
            onUploadOrphaned={(id) => setOrphanImageIds((p) => [...p, id])}
          />
        </div>
      </section>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending || uploading}
          className="rounded bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold disabled:opacity-50"
        >
          {pending ? "Enregistrement…" : uploading ? "Upload en cours…" : "Enregistrer"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={pending || uploading}
          className="rounded border border-[var(--color-border)] px-6 py-3 text-sm disabled:opacity-50"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
