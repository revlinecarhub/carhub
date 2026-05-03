import { z } from "zod";

export const commentSchema = z.object({
  body: z.string().min(1, "Commentaire vide").max(2000, "Trop long (max 2000)"),
  rating: z.number().int().min(1).max(5).optional(),
});

export type CommentInput = z.infer<typeof commentSchema>;
