"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { SlidersHorizontal } from "lucide-react";
import { carburantValues, situationValues } from "@/lib/schemas/car";

const INPUT_CLASS = "w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)] p-2 text-sm";
const LABEL_CLASS = "mb-2 block text-xs uppercase tracking-wider text-[var(--color-muted)]";

const FILTER_KEYS = [
  "marque",
  "modele",
  "type",
  "annee",
  "carburant",
  "pays_constructeur",
  "situation",
] as const;

type Props = {
  marques: string[];
  pays: string[];
};

export function CarToolbar({ marques, pays }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const [searchValue, setSearchValue] = useState(params.get("q") ?? "");
  const hasActiveFilters = FILTER_KEYS.some((k) => !!params.get(k));
  const [open, setOpen] = useState(hasActiveFilters);

  useEffect(() => {
    const id = setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      if (searchValue) next.set("q", searchValue);
      else next.delete("q");
      startTransition(() => router.push(`${pathname}?${next.toString()}`));
    }, 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    startTransition(() => router.push(`${pathname}?${next.toString()}`));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          placeholder="Rechercher marque, modèle…"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="flex-1 rounded border border-[var(--color-border)] bg-[var(--color-card)] p-3 text-sm"
        />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-pressed={open}
          aria-label="Afficher/masquer les filtres"
          className={`flex items-center gap-2 rounded border p-3 text-sm transition ${
            open || hasActiveFilters
              ? "border-[var(--color-accent)] text-[var(--color-accent)]"
              : "border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-fg)]"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filtres</span>
        </button>
      </div>

      {open && (
        <div className="grid gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={LABEL_CLASS}>Marque</label>
            <select
              value={params.get("marque") ?? ""}
              onChange={(e) => update("marque", e.target.value)}
              className={INPUT_CLASS}
            >
              <option value="">Toutes</option>
              {marques.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={LABEL_CLASS}>Modèle</label>
            <input
              type="text"
              placeholder="ex: 911"
              value={params.get("modele") ?? ""}
              onChange={(e) => update("modele", e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>Type</label>
            <input
              type="text"
              placeholder="ex: Coupé"
              value={params.get("type") ?? ""}
              onChange={(e) => update("type", e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>Année</label>
            <input
              type="number"
              min={1900}
              max={2100}
              value={params.get("annee") ?? ""}
              onChange={(e) => update("annee", e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>Carburant</label>
            <select
              value={params.get("carburant") ?? ""}
              onChange={(e) => update("carburant", e.target.value)}
              className={INPUT_CLASS}
            >
              <option value="">Tous</option>
              {carburantValues.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={LABEL_CLASS}>Pays constructeur</label>
            <select
              value={params.get("pays_constructeur") ?? ""}
              onChange={(e) => update("pays_constructeur", e.target.value)}
              className={INPUT_CLASS}
            >
              <option value="">Tous</option>
              {pays.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={LABEL_CLASS}>Situation</label>
            <select
              value={params.get("situation") ?? ""}
              onChange={(e) => update("situation", e.target.value)}
              className={INPUT_CLASS}
            >
              <option value="">Toutes</option>
              {situationValues.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
