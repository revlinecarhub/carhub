"use client";

import dynamic from "next/dynamic";

export const EventLocationPickerWrapper = dynamic(
  () => import("./EventLocationPicker").then((m) => m.EventLocationPicker),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-80 items-center justify-center text-[var(--color-muted)]">
        Chargement carte…
      </div>
    ),
  }
);
