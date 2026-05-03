"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CarForm } from "@/components/admin/CarForm";
import { deleteCarAction, updateCarAction } from "@/app/cars/actions";

type Initial = NonNullable<Parameters<typeof CarForm>[0]["initial"]>;

export function CarOwnerActions({ id, initial }: { id: string; initial: Initial }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="inline-flex items-center gap-1.5 rounded border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]">
          <Pencil className="h-3.5 w-3.5" />
          Éditer
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] w-[min(95vw,1100px)] max-w-[1100px] overflow-y-auto bg-[var(--color-card)] sm:max-w-[1100px]">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl" style={{ fontFamily: "var(--font-playfair)" }}>
              Éditer la voiture
            </DialogTitle>
          </DialogHeader>
          <CarForm
            initial={initial}
            onSubmit={async ({ car, images, cover_image_url, video, orphan_image_public_ids, orphan_video_public_ids }) => {
              await updateCarAction({
                id,
                car: car as Parameters<typeof updateCarAction>[0]["car"],
                images,
                cover_image_url,
                video,
                orphan_image_public_ids,
                orphan_video_public_ids,
              });
            }}
          />
        </DialogContent>
      </Dialog>

      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm("Supprimer cette voiture définitivement ?")) return;
          startTransition(async () => {
            try {
              await deleteCarAction(id);
              toast.success("Voiture supprimée");
              router.push("/");
              router.refresh();
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Erreur");
            }
          });
        }}
        className="inline-flex items-center gap-1.5 rounded border border-red-500/40 px-3 py-1.5 text-sm text-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50"
      >
        <Trash2 className="h-3.5 w-3.5" />
        {pending ? "…" : "Supprimer"}
      </button>
    </div>
  );
}
