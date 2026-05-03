import { Camera, MessageCircle, Globe, Music2, PlaySquare } from "lucide-react";
import type { SocialLink } from "@/lib/schemas/profile";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Camera,
  twitter: MessageCircle,
  facebook: Globe,
  youtube: PlaySquare,
  tiktok: Music2,
  website: Globe,
  other: Globe,
};

export function SocialLinksList({ links }: { links: SocialLink[] }) {
  if (!links || links.length === 0) return null;
  return (
    <ul className="flex flex-wrap items-center gap-3">
      {links.map((l, i) => {
        const Icon = ICONS[l.platform] ?? Globe;
        return (
          <li key={i}>
            <a
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)]"
            >
              <Icon className="h-4 w-4" />
              {l.platform}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
