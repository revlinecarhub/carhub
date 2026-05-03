import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/profiles/repo";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");
  if (!(await isAdmin(user.id))) redirect("/");

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between border-b border-[var(--color-border)] pb-4">
        <Link href="/admin" className="font-serif text-xl" style={{ fontFamily: "var(--font-playfair)" }}>
          Modération
        </Link>
      </div>
      {children}
    </div>
  );
}
