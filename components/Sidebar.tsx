import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/server";
import { getProfileByUserId } from "@/lib/profiles/repo";
import { MainNav, type NavItem } from "@/components/main-nav";
import { NavUser } from "@/components/nav-user";
import { SidebarBrand } from "@/components/sidebar-brand";
import { SidebarGuestActions } from "@/components/sidebar-guest-actions";

const PUBLIC_ITEMS: NavItem[] = [
  { name: "Voitures", url: "/", icon: "home" },
  { name: "Top", url: "/top", icon: "trophy" },
  { name: "Événements", url: "/events", icon: "calendar" },
];

const LOGGED_ITEMS: NavItem[] = [{ name: "Réseau", url: "/network", icon: "users" }];

const FOOTER_ITEMS: NavItem[] = [
  { name: "À propos", url: "/about", icon: "info" },
  { name: "Contact", url: "/contact", icon: "mail" },
];

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const profile = user ? await getProfileByUserId(user.id) : null;

  const navItems = profile ? [...PUBLIC_ITEMS, ...LOGGED_ITEMS] : PUBLIC_ITEMS;

  const accountItems: NavItem[] = profile
    ? [
        { name: "Mon profil", url: `/u/${profile.username}`, icon: "user" },
        { name: "Mes voitures", url: "/me/cars", icon: "car" },
        { name: "Mes événements", url: "/me/events", icon: "calendar" },
        ...(profile.is_admin
          ? [{ name: "Modération", url: "/admin", icon: "shield" as const }]
          : []),
      ]
    : [];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarBrand />
      </SidebarHeader>
      <SidebarContent>
        <MainNav items={navItems} label="Navigation" />
        {profile && <MainNav items={accountItems} label="Mon compte" />}
        <MainNav items={FOOTER_ITEMS} label="Aide" />
      </SidebarContent>
      <SidebarFooter>
        {profile ? (
          <NavUser
            user={{
              username: profile.username,
              avatarUrl: profile.avatar_url,
              isAdmin: profile.is_admin,
            }}
          />
        ) : (
          <SidebarGuestActions />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
