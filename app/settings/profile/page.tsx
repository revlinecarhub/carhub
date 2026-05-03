import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfileByUserId } from "@/lib/profiles/repo";
import { ProfileSettingsForm } from "./client";
import type { SocialLink } from "@/lib/schemas/profile";

export default async function ProfileSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/settings/profile");

  const profile = await getProfileByUserId(user.id);
  if (!profile) redirect("/");

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-8 font-serif text-3xl" style={{ fontFamily: "var(--font-playfair)" }}>Mon profil</h1>
      <ProfileSettingsForm
        initial={{
          username: profile.username,
          bio: profile.bio ?? "",
          club_association: profile.club_association ?? "",
          type_voiture_prefere: profile.type_voiture_prefere ?? "",
          social_links: (profile.social_links ?? []) as SocialLink[],
          avatar: { url: profile.avatar_url, public_id: profile.avatar_public_id },
        }}
      />
    </div>
  );
}
