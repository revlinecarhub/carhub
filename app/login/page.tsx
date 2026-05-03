"use client";

import Link from "next/link";
import { Suspense, useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { loginAction } from "./actions";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const params = useSearchParams();
  const next = params.get("next") ?? "";

  useEffect(() => {
    const e = params.get("error");
    if (e) toast.error(e);
  }, [params]);

  return (
    <form
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          const res = await loginAction(formData);
          if (res?.error) setError(res.error);
        });
      }}
      className="space-y-4"
    >
      <input type="hidden" name="next" value={next} />
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
        placeholder="Mot de passe"
        required
        className="w-full rounded border border-[var(--color-border)] bg-[var(--color-card)] p-3"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-[var(--color-accent)] p-3 font-semibold disabled:opacity-50"
      >
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="mb-8 font-serif text-3xl" style={{ fontFamily: "var(--font-playfair)" }}>
        Connexion
      </h1>

      <GoogleSignInButton label="Se connecter avec Google" intent="login" />

      <div className="my-6 flex items-center gap-3 text-xs text-[var(--color-muted)]">
        <div className="h-px flex-1 bg-[var(--color-border)]" />
        OU
        <div className="h-px flex-1 bg-[var(--color-border)]" />
      </div>

      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>

      <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
        Pas de compte ?{" "}
        <Link href="/signup" className="text-[var(--color-accent)] hover:underline">
          S'inscrire
        </Link>
      </p>
    </div>
  );
}
