"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { eventInputSchema } from "@/lib/schemas/event";
import { insertEvent, getEventById, deleteEvent, updateEvent } from "@/lib/events/repo";
import { isAdmin } from "@/lib/profiles/repo";

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("login required");
  return user;
}

export async function createEventAction(input: unknown) {
  const user = await requireUser();
  const parsed = eventInputSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }
  await insertEvent({
    owner_id: user.id,
    title: parsed.data.title,
    description: parsed.data.description || null,
    location_name: parsed.data.location_name,
    lat: parsed.data.lat,
    lng: parsed.data.lng,
    event_date: parsed.data.event_date,
  });
  revalidatePath("/events");
  redirect("/events");
}

export async function updateEventAction(id: string, input: unknown) {
  const user = await requireUser();
  const ev = await getEventById(id);
  if (!ev) throw new Error("not found");
  if (ev.owner_id !== user.id) throw new Error("forbidden");

  const parsed = eventInputSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }
  await updateEvent(id, {
    title: parsed.data.title,
    description: parsed.data.description || null,
    location_name: parsed.data.location_name,
    lat: parsed.data.lat,
    lng: parsed.data.lng,
    event_date: parsed.data.event_date,
  });
  revalidatePath("/events");
  revalidatePath("/me/events");
  redirect("/me/events");
}

export async function deleteEventAction(id: string) {
  const user = await requireUser();
  const ev = await getEventById(id);
  if (!ev) throw new Error("not found");
  if (ev.owner_id !== user.id && !(await isAdmin(user.id))) {
    throw new Error("forbidden");
  }
  await deleteEvent(id);
  revalidatePath("/events");
  revalidatePath("/me/events");
}
