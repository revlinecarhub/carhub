"use client";

import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export function SidebarGuestActions() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <div className="flex flex-col gap-2 p-2">
      <Link
        href="/login"
        title="Connexion"
        className="flex items-center gap-2 rounded border border-[var(--color-border)] p-2 text-sm hover:border-[var(--color-fg)]"
      >
        <LogIn className="h-4 w-4 shrink-0" />
        {!collapsed && <span>Connexion</span>}
      </Link>
      <Link
        href="/signup"
        title="Inscription"
        className="flex items-center gap-2 rounded border border-[var(--color-accent)] bg-[var(--color-accent)] p-2 text-sm font-semibold text-white hover:opacity-90"
      >
        <UserPlus className="h-4 w-4 shrink-0" />
        {!collapsed && <span>Inscription</span>}
      </Link>
    </div>
  );
}
