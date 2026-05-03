"use client";

import { useState, useTransition } from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { deleteAccountAction } from "@/app/settings/profile/actions";

export function DeleteAccountSection({ username }: { username: string }) {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <section className="rounded-lg border border-red-500/30 bg-red-500/5 p-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
        <div className="flex-1 space-y-2">
          <h2 className="font-serif text-xl text-red-500" style={{ fontFamily: "var(--font-playfair)" }}>
            Zone dangereuse
          </h2>
          <p className="text-sm text-[var(--color-muted)]">
            Supprimer définitivement ton compte. Toutes tes voitures, événements,
            commentaires, likes et photos seront perdus. <strong>Action irréversible.</strong>
          </p>

          {!open ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-3 rounded border border-red-500 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-500 hover:text-white"
            >
              Supprimer mon compte
            </button>
          ) : (
            <div className="mt-4 space-y-3 rounded border border-red-500/40 bg-[var(--color-bg)] p-4">
              <p className="text-sm">
                Tape ton pseudo <strong className="text-red-500">@{username}</strong> pour confirmer:
              </p>
              <input
                type="text"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
                placeholder={username}
                disabled={pending}
                className="w-full rounded border border-[var(--color-border)] bg-[var(--color-card)] p-2 text-sm"
              />
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={pending || confirm.trim().toLowerCase() !== username.toLowerCase()}
                  onClick={() => {
                    startTransition(async () => {
                      try {
                        const res = await deleteAccountAction(confirm);
                        if (res?.error) toast.error(res.error);
                      } catch (err) {
                        const msg = err instanceof Error ? err.message : "Erreur";
                        if (msg.includes("NEXT_REDIRECT")) {
                          toast.success("Compte supprimé");
                          throw err;
                        }
                        toast.error(msg);
                      }
                    });
                  }}
                  className="rounded bg-red-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {pending ? "Suppression…" : "Supprimer définitivement"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setConfirm("");
                  }}
                  disabled={pending}
                  className="rounded border border-[var(--color-border)] px-4 py-2 text-sm disabled:opacity-50"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
