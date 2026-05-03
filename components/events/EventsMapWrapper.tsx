"use client";

import dynamic from "next/dynamic";

export const EventsMapWrapper = dynamic(
  () => import("./EventsMap").then((m) => m.EventsMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[500px] items-center justify-center text-[var(--color-muted)]">
        Chargement carte…
      </div>
    ),
  }
);
