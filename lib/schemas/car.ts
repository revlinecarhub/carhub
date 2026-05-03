import { z } from "zod";

export const carburantValues = [
  "essence",
  "diesel",
  "hybride",
  "electrique",
] as const;

export const rouesMotricesValues = [
  "propulsion",
  "traction",
  "4x4",
] as const;

export const boiteVitesseValues = [
  "manuelle",
  "auto",
  "sequentielle",
] as const;

export const positionMoteurValues = [
  "avant",
  "central",
  "arriere",
  "arrière",
] as const;

export const situationValues = [
  "rassemblement",
  "car_spotting",
  "evenement",
] as const;

export const carInputSchema = z.object({
  marque: z.string().min(1, "Marque obligatoire"),
  modele: z.string().min(1, "Modèle obligatoire"),
  type: z.string().optional(),
  annee: z.coerce.number().int().min(1900).max(2100).optional(),
  pays_constructeur: z.string().min(1, "Pays constructeur obligatoire"),
  exemplaires_produits: z.coerce.number().int().nonnegative().optional(),
  phase_generation: z.string().optional(),

  carburant: z.enum(carburantValues),
  config_moteur: z.string().optional(),
  cylindree_cm3: z.coerce.number().int().nonnegative().optional(),
  puissance_ch: z.coerce.number().int().nonnegative().optional(),
  roues_motrices: z.string().optional(),
  boite_vitesse: z.string().optional(),
  nb_vitesses: z.coerce.number().int().nonnegative().optional(),
  alimentation: z.string().optional(),
  position_moteur: z.string().optional(),

  situation: z.enum(situationValues).optional().or(z.literal("")),

  video_url: z.string().url().optional().or(z.literal("")),
});

export type CarInput = z.infer<typeof carInputSchema>;

export const carImageInputSchema = z.object({
  cloudinary_url: z.string().url(),
  cloudinary_public_id: z.string().min(1),
  position: z.number().int().nonnegative(),
});

export type CarImageInput = z.infer<typeof carImageInputSchema>;
