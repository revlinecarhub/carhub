import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const NEW_USER_THRESHOLD_MS = 10_000;

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const intent = url.searchParams.get("intent") ?? "login";
  const rawNext = url.searchParams.get("next") ?? "/";

  // Don't bounce back to auth pages after successful login
  const isAuthPage =
    rawNext === "/login" || rawNext === "/signup" || rawNext.startsWith("/auth/");
  const next = isAuthPage ? "/" : rawNext;

  if (!code) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url)
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login?error=session", request.url));
  }

  // Detect new account (just created by OAuth flow)
  const createdMs = new Date(user.created_at).getTime();
  const isNewUser = Date.now() - createdMs < NEW_USER_THRESHOLD_MS;

  if (intent === "signup" && !isNewUser) {
    // User tried signup but account already existed → block + force logout
    await supabase.auth.signOut();
    return NextResponse.redirect(
      new URL(
        `/signup?error=${encodeURIComponent("Compte déjà existant. Connecte-toi.")}`,
        request.url
      )
    );
  }

  // intent === "login" + isNewUser → auto-create allowed (Supabase already created the account)
  // intent === "login" + existing → normal login
  // intent === "signup" + isNewUser → normal signup

  return NextResponse.redirect(new URL(next.startsWith("/") ? next : "/", request.url));
}
