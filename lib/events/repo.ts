import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type Event = Database["public"]["Tables"]["events"]["Row"];
type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
type EventUpdate = Database["public"]["Tables"]["events"]["Update"];

export type EventWithOwner = Event & {
  owner: { username: string; avatar_url: string | null } | null;
};

export async function listAllEvents(): Promise<EventWithOwner[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*, owner:profiles!events_owner_id_fkey(username, avatar_url)")
    .order("event_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as EventWithOwner[];
}

export async function listActiveEvents(): Promise<EventWithOwner[]> {
  const supabase = await createClient();
  const now = new Date().toISOString();
  // Active = end_date >= now (if set) OR start_date >= now (if no end_date)
  const { data, error } = await supabase
    .from("events")
    .select("*, owner:profiles!events_owner_id_fkey(username, avatar_url)")
    .or(`event_end_date.gte.${now},and(event_end_date.is.null,event_date.gte.${now})`)
    .order("event_date", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as EventWithOwner[];
}

export async function listEventsByOwner(ownerId: string): Promise<Event[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("owner_id", ownerId)
    .order("event_date", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getEventById(id: string): Promise<EventWithOwner | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*, owner:profiles!events_owner_id_fkey(username, avatar_url)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as EventWithOwner) ?? null;
}

export async function insertEvent(input: EventInsert): Promise<Event> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("events").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateEvent(id: string, input: EventUpdate): Promise<Event> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteEvent(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw error;
}
