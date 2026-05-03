"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { RatingStars } from "./RatingStars";
import { addCommentAction } from "@/app/comments/actions";

export function CommentForm({ carId, slug }: { carId: string; slug: string }) {
  const [body, setBody] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!body.trim()) return;
        startTransition(async () => {
          const res = await addCommentAction({
            carId,
            slug,
            body,
            rating: rating ?? undefined,
          });
          if (res?.error) toast.error(res.error);
          else {
            toast.success("Commentaire publié");
            setBody("");
            setRating(null);
          }
        });
      }}
      className="space-y-3"
    >
      <div className="flex items-center gap-3">
        <span className="text-xs uppercase tracking-wider text-[var(--color-muted)]">Note (optionnelle)</span>
        <RatingStars value={rating} onChange={setRating} />
      </div>
      <textarea
        rows={3}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Ton commentaire…"
        required
        maxLength={2000}
        className="w-full rounded border border-[var(--color-border)] bg-[var(--color-card)] p-3 text-sm"
      />
      <button
        type="submit"
        disabled={pending || !body.trim()}
        className="rounded bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold disabled:opacity-50"
      >
        {pending ? "Publication…" : "Publier"}
      </button>
    </form>
  );
}
