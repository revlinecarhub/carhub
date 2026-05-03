"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserPlus, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { toggleFollowAction } from "@/app/follows/actions";

export function FollowButton({
  followeeId,
  initialFollowing,
}: {
  followeeId: string;
  initialFollowing: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [following, setFollowing] = useState(initialFollowing);
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const res = await toggleFollowAction(followeeId);
          if (res?.error === "login required") {
            router.push(`/login?next=${encodeURIComponent(pathname)}`);
            toast.info("Connecte-toi pour t'abonner");
            return;
          }
          if (res?.ok) setFollowing(res.following);
        });
      }}
      className={`inline-flex items-center gap-2 rounded border px-3 py-1.5 text-sm transition ${
        following
          ? "border-[var(--color-border)] text-[var(--color-muted)] hover:text-red-500"
          : "border-[var(--color-accent)] bg-[var(--color-accent)] text-white hover:opacity-90"
      } disabled:opacity-50`}
    >
      {following ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
      {following ? "Abonné" : "Suivre"}
    </button>
  );
}
