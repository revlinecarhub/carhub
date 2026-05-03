"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { deleteCarAction } from "@/app/cars/actions";

export function DeleteCarButton({ id, label }: { id: string; label: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (!confirm(`Supprimer ${label} ?`)) return;
        startTransition(async () => {
          try {
            await deleteCarAction(id);
            toast.success("Voiture supprimée");
          } catch (e) {
            toast.error(e instanceof Error ? e.message : "Erreur");
          }
        });
      }}
      disabled={pending}
      className="text-sm text-red-500 hover:underline disabled:opacity-50"
    >
      {pending ? "…" : "Supprimer"}
    </button>
  );
}
