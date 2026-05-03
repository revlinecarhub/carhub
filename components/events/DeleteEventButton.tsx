"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { deleteEventAction } from "@/app/events/actions";

export function DeleteEventButton({ id, label }: { id: string; label: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (!confirm(`Supprimer ${label} ?`)) return;
        startTransition(async () => {
          try {
            await deleteEventAction(id);
            toast.success("Événement supprimé");
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
