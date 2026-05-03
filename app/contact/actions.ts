"use server";

import { z } from "zod";
import { Resend } from "resend";
import { insertMessage } from "@/lib/contact/repo";

const schema = z.object({
  name: z.string().min(1, "Nom obligatoire").max(100),
  email: z.string().email("Email invalide"),
  body: z.string().min(1, "Message vide").max(5000, "Trop long"),
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactAction(formData: FormData) {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }

  // Persist as backup (always)
  try {
    await insertMessage(parsed.data);
  } catch (e) {
    console.error("[contact] DB insert failed", e);
  }

  // Send email via Resend
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? "revlinecarhub@gmail.com";
  if (!apiKey) {
    return { error: "Service email non configuré" };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "RevLine Hub <onboarding@resend.dev>",
      to,
      replyTo: parsed.data.email,
      subject: `[Contact RevLine] ${parsed.data.name}`,
      html: `
        <div style="font-family:sans-serif;line-height:1.5">
          <p><strong>De:</strong> ${escapeHtml(parsed.data.name)} &lt;${escapeHtml(parsed.data.email)}&gt;</p>
          <hr/>
          <p>${escapeHtml(parsed.data.body).replace(/\n/g, "<br/>")}</p>
        </div>
      `,
    });
    if (error) {
      console.error("[contact] Resend error", error);
      return { error: "Erreur envoi email" };
    }
  } catch (e) {
    console.error("[contact] Resend exception", e);
    return { error: "Erreur envoi email" };
  }

  return { ok: true };
}
