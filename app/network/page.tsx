import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { listFollowing, getFollowingIds, discoverProfiles } from "@/lib/follows/repo";
import { listCarsByOwners } from "@/lib/cars/repo";
import { CarCard } from "@/components/CarCard";
import { ProfileMiniCard } from "@/components/network/ProfileMiniCard";
import { NetworkTabs } from "@/components/network/NetworkTabs";

export default async function NetworkPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/network");

  const [following, discover, followingIds] = await Promise.all([
    listFollowing(user.id),
    discoverProfiles(user.id),
    getFollowingIds(user.id),
  ]);

  const feedCars = await listCarsByOwners(followingIds);

  const feedSection =
    feedCars.length === 0 ? (
      <p className="text-sm text-[var(--color-muted)]">
        Aucune voiture dans ton fil. Suis des utilisateurs depuis l&apos;onglet{" "}
        <span className="text-[var(--color-accent)]">Découvrir</span> pour voir leurs publications.
      </p>
    ) : (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {feedCars.map((c) => <CarCard key={c.id} car={c} />)}
      </div>
    );

  const followingSection =
    following.length === 0 ? (
      <p className="text-sm text-[var(--color-muted)]">Tu ne suis personne pour l&apos;instant.</p>
    ) : (
      <ul className="space-y-3">
        {following.map((p) => (
          <li key={p.id}>
            <ProfileMiniCard profile={p} initialFollowing={true} />
          </li>
        ))}
      </ul>
    );

  const discoverSection =
    discover.length === 0 ? (
      <p className="text-sm text-[var(--color-muted)]">Aucun nouveau profil à découvrir.</p>
    ) : (
      <ul className="space-y-3">
        {discover.map((p) => (
          <li key={p.id}>
            <ProfileMiniCard profile={p} initialFollowing={false} />
          </li>
        ))}
      </ul>
    );

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-12 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-accent)]">
          Communauté
        </p>
        <h1 className="mt-3 font-serif text-5xl md:text-6xl text-white" style={{ fontFamily: "var(--font-playfair)" }}>
          Réseau
        </h1>
      </header>

      <NetworkTabs feed={feedSection} following={followingSection} discover={discoverSection} />
    </div>
  );
}
