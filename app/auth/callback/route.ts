import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const rawNext = url.searchParams.get("next") ?? "/";

  // Don't bounce user back to auth pages after successful login
  const isAuthPage = rawNext === "/login" || rawNext === "/signup" || rawNext.startsWith("/auth/");
  const next = isAuthPage ? "/" : rawNext;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url)
      );
    }
  }

  return NextResponse.redirect(
    new URL(next.startsWith("/") ? next : "/", request.url)
  );
}
