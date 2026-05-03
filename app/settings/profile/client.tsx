"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AvatarUploader, type AvatarValue } from "@/components/profile/AvatarUploader";
import { socialPlatformValues, type SocialLink } from "@/lib/schemas/profile";
import { updateProfileAction } from "./actions";

const INPUT_CLASS = "w-full rounded border border-[var(--color-border)] bg-[var(--color-card)] p-2 text-sm";
const LABEL_CLASS = "mb-1 block text-xs uppercase tracking-wider text-[var(--color-muted)]";

type Initial = {
  username: string;
  bio: string;
  club_association: string;
  type_voiture_prefere: string;
  social_links: SocialLink[];
  avatar: AvatarValue;
};

export function ProfileSettingsForm({ initial }: { initial: Initial }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [avatar, setAvatar] = useState<AvatarValue>(initial.avatar);
  const [links, setLinks] = useState<SocialLink[]>(initial.social_links);

  function addLink() {
    if (links.length >= 5) return;
    setLinks([...links, { platform: "website", url: "" }]);
  }
  function removeLink(i: number) {
    setLinks(links.filter((_, idx) => idx !== i));
  }
  function updateLink(i: number, patch: Partial<SocialLink>) {
    setLinks(links.map((l, idx) => idx === i ? { ...l, ...patch } : l));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const payload = {
          username: String(fd.get("username") ?? ""),
          bio: String(fd.get("bio") ?? ""),
          club_association: String(fd.get("club_association") ?? ""),
          type_voiture_prefere: String(fd.get("type_voiture_prefere") ?? ""),
          social_links: links.filter((l) => l.url),
          avatar_url: avatar.url ?? "",
          avatar_public_id: avatar.public_id ?? "",
        };
        startTransition(async () => {
          try {
            const res = await updateProfileAction(payload);
            if (res?.error) {
              toast.error(res.error);
            } else {
              toast.success("Profil enregistré");
              router.push(`/u/${payload.username}`);
            }
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Erreur");
          }
        });
      }}
      className="space-y-8"
    >
      <section>
        <h2 className="mb-4 font-serif text-xl" style={{ fontFamily: "var(--font-playfair)" }}>Avatar</h2>
        <AvatarUploader value={avatar} onChange={setAvatar} />
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-xl" style={{ fontFamily: "var(--font-playfair)" }}>Infos</h2>
        <div>
          <label className={LABEL_CLASS}>Pseudo *</label>
          <input name="username" required defaultValue={initial.username} className={INPUT_CLASS} />
        </div>
        <div>
          <label className={LABEL_CLASS}>Bio</label>
          <textarea name="bio" rows={3} defaultValue={initial.bio} className={INPUT_CLASS} />
        </div>
        <div>
          <label className={LABEL_CLASS}>Club / association</label>
          <input name="club_association" defaultValue={initial.club_association} className={INPUT_CLASS} />
        </div>
        <div>
          <label className={LABEL_CLASS}>Type voiture préférée</label>
          <input name="type_voiture_prefere" defaultValue={initial.type_voiture_prefere} className={INPUT_CLASS} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl" style={{ fontFamily: "var(--font-playfair)" }}>Réseaux sociaux</h2>
        {links.map((l, i) => (
          <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
            <select
              value={l.platform}
              onChange={(e) => updateLink(i, { platform: e.target.value as SocialLink["platform"] })}
              className="w-full shrink-0 rounded border border-[var(--color-border)] bg-[var(--color-card)] p-2 text-sm sm:w-40"
            >
              {socialPlatformValues.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <input
              type="url"
              placeholder="https://exemple.com"
              value={l.url}
              onChange={(e) => updateLink(i, { url: e.target.value })}
              className="min-w-0 flex-1 rounded border border-[var(--color-border)] bg-[var(--color-card)] p-2 text-sm"
            />
            <button
              type="button"
              onClick={() => removeLink(i)}
              className="shrink-0 rounded border border-[var(--color-border)] px-3 text-sm text-red-500 hover:border-red-500"
              aria-label="Supprimer ce lien"
            >
              ✕
            </button>
          </div>
        ))}
        {links.length < 5 && (
          <button type="button" onClick={addLink} className="text-sm text-[var(--color-accent)] hover:underline">
            + Ajouter un lien
          </button>
        )}
      </section>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold disabled:opacity-50"
      >
        {pending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
