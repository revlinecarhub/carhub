import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { User } from "lucide-react";
import type { Database } from "@/lib/supabase/database.types";
import { FollowButton } from "./FollowButton";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function ProfileMiniCard({
  profile,
  initialFollowing,
}: {
  profile: Profile;
  initialFollowing: boolean;
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
      <Link
        href={`/u/${profile.username}`}
        className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[var(--color-bg)]"
      >
        {profile.avatar_url ? (
          <CldImage src={profile.avatar_url} alt={profile.username} fill sizes="56px" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--color-muted)]">
            <User className="h-7 w-7" />
          </div>
        )}
      </Link>
      <div className="flex-1 min-w-0">
        <Link
          href={`/u/${profile.username}`}
          className="block truncate font-semibold hover:text-[var(--color-accent)]"
        >
          @{profile.username}
        </Link>
        {profile.bio && (
          <p className="truncate text-sm text-[var(--color-muted)]">{profile.bio}</p>
        )}
      </div>
      <FollowButton followeeId={profile.id} initialFollowing={initialFollowing} />
    </div>
  );
}
