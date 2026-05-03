"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { signupEmailAction } from "./actions";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="mb-8 font-serif text-3xl" style={{ fontFamily: "var(--font-playfair)" }}>
        Inscription
      </h1>

      <GoogleSignInButton label="Continuer avec Google" />

      <div className="my-6 flex items-center gap-3 text-xs text-[var(--color-muted)]">
        <div className="h-px flex-1 bg-[var(--color-border)]" />
        OU
        <div className="h-px flex-1 bg-[var(--color-border)]" />
      </div>

      <form
        action={(formData) => {
          setError(null);
          startTransition(async () => {
            const res = await signupEmailAction(formData);
            if (res?.error) setError(res.error);
          });
        }}
        className="space-y-4"
      >
        <input
          name="username"
          placeholder="Pseudo (3-30 chars, lettres/chiffres/_)"
          required
          minLength={3}
          maxLength={30}
          pattern="[a-zA-Z0-9_]+"
          className="w-full rounded border border-[var(--color-border)] bg-[var(--color-card)] p-3"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full rounded border border-[var(--color-border)] bg-[var(--color-card)] p-3"
        />
        <input
          name="password"
          type="password"
          placeholder="Mot de passe (min 8)"
          required
          minLength={8}
          className="w-full rounded border border-[var(--color-border)] bg-[var(--color-card)] p-3"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded bg-[var(--color-accent)] p-3 font-semibold disabled:opacity-50"
        >
          {pending ? "Création…" : "Créer mon compte"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
        Déjà inscrit ?{" "}
        <Link href="/login" className="text-[var(--color-accent)] hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
