"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Trophy, Users, Calendar } from "lucide-react";

type Item = { href: string; label: string; Icon: React.ComponentType<{ className?: string }>; loggedOnly?: boolean };

const ITEMS: Item[] = [
  { href: "/", label: "Classeur", Icon: BookOpen },
  { href: "/top", label: "Top", Icon: Trophy },
  { href: "/network", label: "Réseau", Icon: Users, loggedOnly: true },
  { href: "/events", label: "Évènements", Icon: Calendar },
];

export function TopNavLinks({ isLogged }: { isLogged: boolean }) {
  const pathname = usePathname();
  const items = ITEMS.filter((i) => !i.loggedOnly || isLogged);

  return (
    <nav className="flex flex-1 items-center justify-center gap-1">
      {items.map(({ href, label, Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            title={label}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition md:px-4 ${
              active
                ? "bg-[var(--color-card)] text-[var(--color-fg)]"
                : "text-[var(--color-muted)] hover:text-[var(--color-fg)]"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="hidden md:inline">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
