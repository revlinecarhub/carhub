"use client";

import { Star } from "lucide-react";

export function RatingStars({
  value,
  onChange,
  readonly = false,
  size = "md",
}: {
  value: number | null;
  onChange?: (v: number | null) => void;
  readonly?: boolean;
  size?: "sm" | "md";
}) {
  const px = size === "sm" ? "h-3 w-3" : "h-5 w-5";
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(value === n ? null : n)}
          className={readonly ? "cursor-default" : "hover:scale-110"}
          aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
        >
          <Star
            className={`${px} ${
              value != null && n <= value
                ? "fill-yellow-400 text-yellow-400"
                : "text-[var(--color-muted)]"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
