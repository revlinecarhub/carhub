"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { toggleLikeAction } from "@/app/likes/actions";

export function LikeButton({
  carId,
  slug,
  initialLiked,
  initialCount,
}: {
  carId: string;
  slug: string;
  initialLiked: boolean;
  initialCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const res = await toggleLikeAction(carId, slug);
          if (res?.error === "login required") {
            router.push(`/login?next=${encodeURIComponent(pathname)}`);
            toast.info("Connecte-toi pour liker");
            return;
          }
          if (res?.ok) {
            setLiked(res.liked);
            setCount((c) => res.liked ? c + 1 : c - 1);
          }
        });
      }}
      className={`inline-flex items-center gap-2 rounded border px-3 py-1.5 text-sm transition ${
        liked
          ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
          : "border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-fg)]"
      } disabled:opacity-50`}
    >
      <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
      <span>{count}</span>
    </button>
  );
}
