import { Mail } from "lucide-react";
import { getProfileByUsername } from "@/lib/profiles/repo";
import { createClient } from "@/lib/supabase/server";
import { SocialLinksList } from "@/components/profile/SocialLinksList";
import type { SocialLink } from "@/lib/schemas/profile";
import { ContactForm } from "./client";

const ADMIN_EMAIL = "revlinecarhub@gmail.com";

async function getAdminProfile() {
  const supabase = await createClient();
  const { data: userData } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_admin", true)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  return userData;
}

export default async function ContactPage() {
  const adminProfile = await getAdminProfile();
  const links = (adminProfile?.social_links ?? []) as SocialLink[];

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-12 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-accent)]">
          Nous joindre
        </p>
        <h1 className="mt-3 font-serif text-5xl text-white" style={{ fontFamily: "var(--font-playfair)" }}>
          Contact
        </h1>
        <p className="mt-4 text-base text-[var(--color-muted)]">
          Une question, un retour, une suggestion ? Écris-nous.
        </p>
      </header>

      <div className="grid gap-12 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 font-serif text-2xl" style={{ fontFamily: "var(--font-playfair)" }}>
            Formulaire
          </h2>
          <ContactForm />
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="mb-4 font-serif text-2xl" style={{ fontFamily: "var(--font-playfair)" }}>
              Email
            </h2>
            <a
              href={`mailto:${ADMIN_EMAIL}`}
              className="inline-flex items-center gap-2 text-[var(--color-fg)] hover:text-[var(--color-accent)]"
            >
              <Mail className="h-4 w-4" />
              {ADMIN_EMAIL}
            </a>
          </div>

          {links.length > 0 && (
            <div>
              <h2 className="mb-4 font-serif text-2xl" style={{ fontFamily: "var(--font-playfair)" }}>
                Réseaux
              </h2>
              <SocialLinksList links={links} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
