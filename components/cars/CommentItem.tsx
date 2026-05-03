"use client";

import Link from "next/link";
import { useTransition } from "react";
import { CldImage } from "next-cloudinary";
import { User } from "lucide-react";
import { toast } from "sonner";
import { RatingStars } from "./RatingStars";
import { deleteCommentAction } from "@/app/comments/actions";
import type { CommentWithAuthor } from "@/lib/comments/repo";

export function CommentItem({
  comment,
  slug,
  canDelete,
}: {
  comment: CommentWithAuthor;
  slug: string;
  canDelete: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="border-b border-[var(--color-border)] py-4">
      <div className="flex items-start gap-3">
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-[var(--color-card)]">
          {comment.author?.avatar_url ? (
            <CldImage src={comment.author.avatar_url} alt="" fill sizes="32px" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-[var(--color-muted)]">
              <User className="h-4 w-4" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-3 text-sm">
            <Link
              href={`/u/${comment.author?.username ?? ""}`}
              className="font-semibold hover:text-[var(--color-accent)]"
            >
              @{comment.author?.username ?? "anonyme"}
            </Link>
            {comment.rating != null && <RatingStars value={comment.rating} readonly size="sm" />}
            <span className="text-xs text-[var(--color-muted)]">
              {new Date(comment.created_at).toLocaleDateString("fr-FR")}
            </span>
            {canDelete && (
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  if (!confirm("Supprimer ce commentaire ?")) return;
                  startTransition(async () => {
                    try {
                      await deleteCommentAction(comment.id, slug);
                      toast.success("Supprimé");
                    } catch (e) {
                      toast.error(e instanceof Error ? e.message : "Erreur");
                    }
                  });
                }}
                className="ml-auto text-xs text-red-500 hover:underline"
              >
                Supprimer
              </button>
            )}
          </div>
          <p className="whitespace-pre-wrap text-sm">{comment.body}</p>
        </div>
      </div>
    </div>
  );
}
