import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEventById } from "@/lib/events/repo";
import { EditEventClient } from "./client";

type Params = Promise<{ id: string }>;

export default async function EditEventPage({ params }: { params: Params }) {
  const { id } = await params;
  const ev = await getEventById(id);
  if (!ev) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/events/${id}/edit`);
  if (ev.owner_id !== user.id) redirect("/events");

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 font-serif text-3xl" style={{ fontFamily: "var(--font-playfair)" }}>
        Éditer {ev.title}
      </h1>
      <EditEventClient
        id={ev.id}
        initial={{
          title: ev.title,
          description: ev.description ?? "",
          location_name: ev.location_name,
          lat: ev.lat,
          lng: ev.lng,
          event_date: ev.event_date,
          event_end_date: ev.event_end_date,
          category: ev.category,
        }}
      />
    </div>
  );
}
