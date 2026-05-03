import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3, "Pseudo trop court (min 3)")
  .max(30, "Pseudo trop long (max 30)")
  .regex(/^[a-zA-Z0-9_]+$/, "Lettres, chiffres et _ uniquement");

export const socialPlatformValues = [
  "instagram",
  "twitter",
  "facebook",
  "youtube",
  "tiktok",
  "website",
  "other",
] as const;

export const socialLinkSchema = z.object({
  platform: z.enum(socialPlatformValues),
  url: z.string().url(),
});

export const profileSchema = z.object({
  username: usernameSchema,
  bio: z.string().max(500).optional(),
  club_association: z.string().max(100).optional(),
  type_voiture_prefere: z.string().max(100).optional(),
  social_links: z.array(socialLinkSchema).max(5).optional(),
  avatar_url: z.string().url().optional().or(z.literal("")),
  avatar_public_id: z.string().optional().or(z.literal("")),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
