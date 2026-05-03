"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signupSchema } from "@/lib/schemas/auth";
import { usernameExists, updateProfile } from "@/lib/profiles/repo";

export async function signupEmailAction(formData: FormData) {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    username: formData.get("username"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }

  if (await usernameExists(parsed.data.username)) {
    return { error: "Pseudo déjà utilisé" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) return { error: error.message };
  if (!data.user) return { error: "Inscription échouée" };

  try {
    await updateProfile(data.user.id, { username: parsed.data.username });
  } catch {
    return { error: "Pseudo déjà utilisé (réessaie)" };
  }

  redirect("/");
}
