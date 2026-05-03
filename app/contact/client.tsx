"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { sendContactAction } from "./actions";

const INPUT_CLASS = "w-full rounded border border-[var(--color-border)] bg-[var(--color-card)] p-3 text-sm";
const LABEL_CLASS = "mb-1 block text-xs uppercase tracking-wider text-[var(--color-muted)]";

export function ContactForm() {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-lg border border-[var(--color-accent)] bg-[var(--color-card)] p-6 text-center">
        <p className="font-semibold text-[var(--color-fg)]">Merci !</p>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Ton message a été envoyé. Nous reviendrons vers toi rapidement.
        </p>
      </div>
    );
  }

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const res = await sendContactAction(formData);
          if (res?.error) toast.error(res.error);
          else {
            toast.success("Message envoyé");
            setSent(true);
          }
        });
      }}
      className="space-y-4"
    >
      <div>
        <label className={LABEL_CLASS}>Nom *</label>
        <input name="name" required maxLength={100} className={INPUT_CLASS} />
      </div>
      <div>
        <label className={LABEL_CLASS}>Email *</label>
        <input name="email" type="email" required className={INPUT_CLASS} />
      </div>
      <div>
        <label className={LABEL_CLASS}>Message *</label>
        <textarea name="body" rows={6} required maxLength={5000} className={INPUT_CLASS} />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold disabled:opacity-50"
      >
        {pending ? "Envoi…" : "Envoyer"}
      </button>
    </form>
  );
}
