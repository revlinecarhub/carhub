"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Trophy, Calendar, Users, Mail, Info,
  User as UserIcon, Car, Shield,
  type LucideIcon,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const ICONS: Record<string, LucideIcon> = {
  home: Home,
  trophy: Trophy,
  calendar: Calendar,
  users: Users,
  mail: Mail,
  info: Info,
  user: UserIcon,
  car: Car,
  shield: Shield,
};

export type NavItem = { name: string; url: string; icon: keyof typeof ICONS };

export function MainNav({
  items,
  label,
}: {
  items: NavItem[];
  label?: string;
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => {
          const Icon = ICONS[item.icon];
          const active = pathname === item.url;
          return (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                isActive={active}
                tooltip={item.name}
                render={
                  <Link href={item.url}>
                    <Icon />
                    <span>{item.name}</span>
                  </Link>
                }
              />
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
