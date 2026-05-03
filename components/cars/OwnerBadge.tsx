import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { User } from "lucide-react";
import { getProfileByUserId } from "@/lib/profiles/repo";

export async function OwnerBadge({ ownerId }: { ownerId: string }) {
  const profile = await getProfileByUserId(ownerId);
  if (!profile) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
      <span>Publié par</span>
      <Link
        href={`/u/${profile.username}`}
        className="inline-flex items-center gap-1.5 text-[var(--color-fg)] hover:text-[var(--color-accent)]"
      >
        <span className="relative h-5 w-5 overflow-hidden rounded-full bg-[var(--color-card)]">
          {profile.avatar_url ? (
            <CldImage src={profile.avatar_url} alt="" fill sizes="20px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-[var(--color-muted)]">
              <User className="h-3 w-3" />
            </span>
          )}
        </span>
        @{profile.username}
      </Link>
    </div>
  );
}
