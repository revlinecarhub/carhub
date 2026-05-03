"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Zap, Camera, Lightbulb, Image as ImageIcon, Cog, Flag, Users } from "lucide-react";
import { toast } from "sonner";
import { ImageUploader, type UploadedImage } from "./ImageUploader";
import { VideoUploader, type VideoValue } from "./VideoUploader";
import { carburantValues, situationValues } from "@/lib/schemas/car";
import { cleanupOrphansAction } from "@/app/cars/cleanup-actions";

const TYPES = [
  "Coupé", "Berline", "Cabriolet", "Break", "SUV", "Hatchback",
  "Pickup", "Roadster", "Targa", "Monospace", "Sport", "Autre",
];

const PAYS = [
  "Allemagne", "France", "Italie", "Royaume-Uni", "États-Unis",
  "Japon", "Suède", "Espagne", "Tchéquie", "Corée du Sud", "Chine", "Autre",
];

const CONFIG_MOTEUR = [
  "V4", "V6", "V8", "V10", "V12", "V16", "W12", "W16",
  "Flat-4", "Flat-6", "Inline-3", "Inline-4", "Inline-5", "Inline-6",
  "Rotary", "Electric", "Hybride", "Autre",
];

const ROUES_MOTRICES = ["Propulsion", "Traction", "AWD / 4 roues motrices"];
const BOITE_VITESSE = ["Manuelle", "Automatique", "DCT / DSG", "CVT", "PDK", "Séquentielle"];
const ALIMENTATION = ["Atmosphérique", "Turbo", "Bi-Turbo", "Compresseur", "Hybride", "Électrique"];
const POSITION_MOTEUR = ["Avant", "Central avant", "Central arrière", "Arrière"];

const PHOTO_TIPS = [
  { emoji: "📐", label: "3/4 avant" },
  { emoji: "📐", label: "3/4 arrière" },
  { emoji: "⬆️", label: "Face avant" },
  { emoji: "⬇️", label: "Face arrière" },
  { emoji: "🏷️", label: "Logo / Badge" },
  { emoji: "🪑", label: "Intérieur" },
  { emoji: "⚙️", label: "Jantes / Roues" },
  { emoji: "🚫", label: "Flouter la plaque" },
];

const SITUATIONS = [
  { value: "rassemblement" as const, label: "Rassemblement", Icon: Users },
  { value: "evenement" as const, label: "Évènement", Icon: Cog },
  { value: "car_spotting" as const, label: "Carspotting", Icon: Flag },
];

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

const INPUT = "w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none";
const LABEL = "mb-1.5 block text-sm font-semibold text-[var(--color-fg)]";
const HINT = "ml-1 text-xs font-normal text-[var(--color-muted)]";
const SECTION = "rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6";

type Tab = "info" | "engine" | "media";

export function CarForm({ initial = {}, onSubmit }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState<Tab>("info");
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
  const [situation, setSituation] = useState<string>(initial.situation ?? "");
  const [cylindreeUnit, setCylindreeUnit] = useState<"cm3" | "L">("cm3");
  const [cylindreeValue, setCylindreeValue] = useState<string>(
    initial.cylindree_cm3 != null ? String(initial.cylindree_cm3) : ""
  );

  const initialImageIds = new Set((initial.car_images ?? []).map((i) => i.cloudinary_public_id));
  const initialVideoId = initial.video_public_id ?? null;

  async function handleCancel() {
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
      } catch {}
    }
    router.back();
  }

  const tabBtn = (id: Tab, label: string) => (
    <button
      key={id}
      type="button"
      onClick={() => setTab(id)}
      className={`flex-1 rounded-md px-4 py-2.5 text-sm font-semibold transition ${
        tab === id
          ? "bg-[var(--color-bg)] text-[var(--color-fg)]"
          : "text-[var(--color-muted)] hover:text-[var(--color-fg)]"
      }`}
    >
      {label}
    </button>
  );

  const cylindreeCm3 = (() => {
    const n = Number(cylindreeValue);
    if (!cylindreeValue || Number.isNaN(n)) return "";
    return cylindreeUnit === "L" ? Math.round(n * 1000) : Math.round(n);
  })();

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
        if (situation) car.situation = situation;
        if (cylindreeCm3 !== "") car.cylindree_cm3 = cylindreeCm3;

        if (images.length === 0) {
          toast.error("Au moins une image requise");
          setTab("media");
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
            if (msg.includes("NEXT_REDIRECT")) {
              toast.success("Enregistré");
              throw err;
            }
            toast.error(msg);
          }
        });
      }}
      className="space-y-6"
    >
      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-1">
        {tabBtn("info", "Informations")}
        {tabBtn("engine", "Motorisation")}
        {tabBtn("media", "Photos & Vidéos")}
      </div>

      {/* Tab: Informations */}
      <div className={tab === "info" ? "" : "hidden"}>
        <section className={SECTION}>
          <h2 className="mb-6 inline-flex items-center gap-2 font-serif text-xl text-[var(--color-fg)]" style={{ fontFamily: "var(--font-playfair)" }}>
            <span className="text-[var(--color-accent)]">★</span> Informations générales
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={LABEL}>Marque <span className="text-[var(--color-accent)]">*</span></label>
              <input name="marque" required defaultValue={initial.marque ?? ""} placeholder="ex: Porsche" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Modèle <span className="text-[var(--color-accent)]">*</span></label>
              <input name="modele" required defaultValue={initial.modele ?? ""} placeholder="ex: 911 Carrera" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Type <span className={HINT}>(optionnel)</span></label>
              <select name="type" defaultValue={initial.type ?? ""} className={INPUT}>
                <option value="">Sélectionner</option>
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Année <span className={HINT}>(optionnel)</span></label>
              <input name="annee" type="number" min={1900} max={2100} defaultValue={initial.annee ?? ""} placeholder="ex: 2024" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Pays constructeur <span className="text-[var(--color-accent)]">*</span></label>
              <select name="pays_constructeur" required defaultValue={initial.pays_constructeur ?? ""} className={INPUT}>
                <option value="">Sélectionner</option>
                {PAYS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Exemplaires produits <span className={HINT}>(optionnel)</span></label>
              <input name="exemplaires_produits" type="number" min={0} defaultValue={initial.exemplaires_produits ?? ""} placeholder="ex: 10 000" className={INPUT} />
            </div>
            <div className="sm:col-span-2">
              <label className={LABEL}>Phase / Génération <span className={HINT}>(optionnel)</span></label>
              <input name="phase_generation" defaultValue={initial.phase_generation ?? ""} placeholder="ex: Phase 1, Facelift, MK2..." className={INPUT} />
            </div>
          </div>
        </section>
      </div>

      {/* Tab: Motorisation */}
      <div className={tab === "engine" ? "" : "hidden"}>
        <section className={SECTION}>
          <h2 className="mb-6 inline-flex items-center gap-2 font-serif text-xl text-[var(--color-fg)]" style={{ fontFamily: "var(--font-playfair)" }}>
            <Zap className="h-5 w-5 fill-[var(--color-accent)] text-[var(--color-accent)]" /> Motorisation
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={LABEL}>Type de carburant <span className="text-[var(--color-accent)]">*</span></label>
              <select name="carburant" required defaultValue={initial.carburant ?? ""} className={INPUT}>
                <option value="">Sélectionner</option>
                {carburantValues.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Configuration moteur <span className={HINT}>(optionnel)</span></label>
              <select name="config_moteur" defaultValue={initial.config_moteur ?? ""} className={INPUT}>
                <option value="">Sélectionner</option>
                {CONFIG_MOTEUR.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Cylindrée <span className={HINT}>(optionnel)</span></label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  value={cylindreeValue}
                  onChange={(e) => setCylindreeValue(e.target.value)}
                  placeholder={cylindreeUnit === "L" ? "ex: 4.0" : "ex: 3996"}
                  className="min-w-0 flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none"
                />
                <select
                  value={cylindreeUnit}
                  onChange={(e) => setCylindreeUnit(e.target.value as "cm3" | "L")}
                  className="w-20 shrink-0 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-2.5 text-sm text-[var(--color-fg)] focus:border-[var(--color-accent)] focus:outline-none"
                >
                  <option value="cm3">cm³</option>
                  <option value="L">L</option>
                </select>
              </div>
            </div>
            <div>
              <label className={LABEL}>Puissance (ch) <span className={HINT}>(optionnel)</span></label>
              <input name="puissance_ch" type="number" min={0} defaultValue={initial.puissance_ch ?? ""} placeholder="ex: 510" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Roues motrices <span className={HINT}>(optionnel)</span></label>
              <select name="roues_motrices" defaultValue={initial.roues_motrices ?? ""} className={INPUT}>
                <option value="">Sélectionner</option>
                {ROUES_MOTRICES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Boîte de vitesse <span className={HINT}>(optionnel)</span></label>
              <select name="boite_vitesse" defaultValue={initial.boite_vitesse ?? ""} className={INPUT}>
                <option value="">Sélectionner</option>
                {BOITE_VITESSE.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Nombre de vitesses <span className={HINT}>(optionnel)</span></label>
              <input name="nb_vitesses" type="number" min={0} defaultValue={initial.nb_vitesses ?? ""} placeholder="ex: 6" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Alimentation <span className={HINT}>(optionnel)</span></label>
              <select name="alimentation" defaultValue={initial.alimentation ?? ""} className={INPUT}>
                <option value="">Sélectionner</option>
                {ALIMENTATION.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={LABEL}>Position du moteur <span className={HINT}>(optionnel)</span></label>
              <select name="position_moteur" defaultValue={initial.position_moteur ?? ""} className={INPUT}>
                <option value="">Sélectionner</option>
                {POSITION_MOTEUR.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </section>
      </div>

      {/* Tab: Media */}
      <div className={tab === "media" ? "space-y-6" : "hidden"}>
        {/* Tips */}
        <div className="rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 p-5">
          <div className="mb-3 inline-flex items-center gap-2 font-semibold text-[var(--color-fg)]">
            <Lightbulb className="h-4 w-4 text-[var(--color-accent)]" />
            Conseils pour de belles photos
          </div>
          <div className="flex flex-wrap gap-2">
            {PHOTO_TIPS.map((t) => (
              <span
                key={t.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1 text-xs"
              >
                <span>{t.emoji}</span>
                {t.label}
              </span>
            ))}
          </div>
        </div>

        {/* Situation */}
        <section className={SECTION}>
          <h2 className="mb-5 inline-flex items-center gap-2 font-serif text-xl text-[var(--color-fg)]" style={{ fontFamily: "var(--font-playfair)" }}>
            <Camera className="h-5 w-5 text-[var(--color-accent)]" /> Situation
          </h2>
          <div className="flex flex-wrap gap-3">
            {SITUATIONS.map(({ value, label, Icon }) => {
              const active = situation === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSituation(active ? "" : value)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                    active
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-fg)]"
                      : "border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-fg)]"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-[var(--color-accent)]" : ""}`} />
                  {label}
                </button>
              );
            })}
            {/* Hidden enum sanity check */}
            {!situationValues.includes(situation as (typeof situationValues)[number]) && situation && (
              <span className="text-xs text-red-500">Valeur invalide</span>
            )}
          </div>
        </section>

        {/* Photos & Videos */}
        <section className={SECTION}>
          <h2 className="mb-6 font-serif text-xl text-[var(--color-fg)]" style={{ fontFamily: "var(--font-playfair)" }}>
            Photos & Vidéos
          </h2>
          <div className="space-y-6">
            <div>
              <label className={LABEL}>Photos <span className="text-[var(--color-accent)]">*</span></label>
              <ImageUploader
                initial={images}
                onChange={setImages}
                onUploadingChange={setImagesUploading}
                onUploadOrphaned={(id) => setOrphanImageIds((p) => [...p, id])}
              />
            </div>
            <div>
              <label className={LABEL}>Vidéos <span className={HINT}>(max 100 MB, optionnel)</span></label>
              <VideoUploader
                value={video}
                onChange={setVideo}
                onUploadingChange={setVideoUploading}
                onUploadOrphaned={(id) => setOrphanVideoIds((p) => [...p, id])}
                initialPublicId={initial.video_public_id ?? null}
              />
            </div>
          </div>
        </section>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleCancel}
          disabled={pending || uploading}
          className="rounded-md border border-[var(--color-border)] px-6 py-2.5 text-sm disabled:opacity-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={pending || uploading}
          className="rounded-md bg-[var(--color-accent)] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {pending ? "Enregistrement…" : uploading ? "Upload en cours…" : "Enregistrer"}
        </button>
      </div>

      {/* Hide unused icon imports */}
      <span className="hidden">
        <ImageIcon />
      </span>
    </form>
  );
}
