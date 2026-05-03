import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];

export async function insertMessage(input: {
  name: string;
  email: string;
  body: string;
}): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert(input);
  if (error) throw error;
}

export async function listMessages(): Promise<ContactMessage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function markAsRead(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ read: true })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteMessage(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) throw error;
}
