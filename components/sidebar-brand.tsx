"use client";

import Link from "next/link";
import { Car } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export function SidebarBrand() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Link
      href="/"
      className="flex items-center gap-2 px-2 py-1.5 font-serif text-xl tracking-wide"
      style={{ fontFamily: "var(--font-playfair)" }}
    >
      <Car className="h-5 w-5 shrink-0 text-[var(--color-accent)]" />
      {!collapsed && (
        <span>
          RevLine <span className="text-[var(--color-accent)]">Hub</span>
        </span>
      )}
    </Link>
  );
}
