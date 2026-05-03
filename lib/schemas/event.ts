import { z } from "zod";

export const eventInputSchema = z.object({
  title: z.string().min(1, "Titre obligatoire").max(120),
  description: z.string().max(2000).optional(),
  location_name: z.string().min(1, "Lieu obligatoire").max(200),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  event_date: z.string().min(1, "Date obligatoire"),
});

export type EventInput = z.infer<typeof eventInputSchema>;
