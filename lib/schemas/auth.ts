import { z } from "zod";
import { usernameSchema } from "./profile";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Mot de passe min 8 caractères"),
  username: usernameSchema,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
