import { notFound } from "next/navigation";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { User, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProfileByUsername, getProfileStats } from "@/lib/profiles/repo";
import { listCarsByOwner } from "@/lib/cars/repo";
import { CarCard } from "@/components/CarCard";
import { SocialLinksList } from "@/components/profile/SocialLinksList";
import type { SocialLink } from "@/lib/schemas/profile";

type Params = Promise<{ username: string }>;

export default async function ProfilePage({ params }: { params: Params }) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);
  if (!profile) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = user?.id === profile.id;

  const [stats, cars] = await Promise.all([
    getProfileStats(profile.id),
    listCarsByOwner(profile.id),
  ]);

  const links = (profile.social_links ?? []) as SocialLink[];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-12 flex flex-col items-start gap-6 sm:flex-row">
        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full bg-[var(--color-card)]">
          {profile.avatar_url ? (
            <CldImage src={profile.avatar_url} alt={profile.username} fill sizes="128px" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-[var(--color-muted)]">
              <User className="h-16 w-16" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="font-serif text-4xl" style={{ fontFamily: "var(--font-playfair)" }}>
              <span className="text-[var(--color-muted)]">@</span>{profile.username}
            </h1>
            {isOwner && (
              <Link
                href="/settings/profile"
                className="inline-flex items-center gap-1.5 rounded border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                <Pencil className="h-3.5 w-3.5" />
                Modifier le profil
              </Link>
            )}
          </div>
          {profile.bio && <p className="text-[var(--color-fg)]">{profile.bio}</p>}
          <dl className="space-y-1 text-sm text-[var(--color-muted)]">
            {profile.club_association && (
              <div><dt className="inline">Club: </dt><dd className="inline text-[var(--color-fg)]">{profile.club_association}</dd></div>
            )}
            {profile.type_voiture_prefere && (
              <div><dt className="inline">Préfère: </dt><dd className="inline text-[var(--color-fg)]">{profile.type_voiture_prefere}</dd></div>
            )}
          </dl>
          <SocialLinksList links={links} />
        </div>
      </header>

      <section className="mb-8 flex gap-8 border-y border-[var(--color-border)] py-4 text-sm">
        <div><span className="font-semibold text-[var(--color-fg)]">{stats.cars_count}</span> <span className="text-[var(--color-muted)]">voitures</span></div>
        <div><span className="font-semibold text-[var(--color-fg)]">{stats.views_count}</span> <span className="text-[var(--color-muted)]">vues</span></div>
        <div><span className="font-semibold text-[var(--color-fg)]">{stats.likes_count}</span> <span className="text-[var(--color-muted)]">likes</span></div>
      </section>

      <section>
        <h2 className="mb-6 font-serif text-2xl" style={{ fontFamily: "var(--font-playfair)" }}>Voitures publiées</h2>
        {cars.length === 0 ? (
          <p className="text-[var(--color-muted)]">Aucune voiture publiée.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((c) => <CarCard key={c.id} car={c} />)}
          </div>
        )}
      </section>
    </div>
  );
}
