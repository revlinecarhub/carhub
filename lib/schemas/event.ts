import { z } from "zod";

export const eventCategoryValues = [
  "rassemblement",
  "course",
  "salon",
  "car_spotting",
  "autre",
] as const;

export const eventCategoryLabels: Record<(typeof eventCategoryValues)[number], string> = {
  rassemblement: "Rassemblement",
  course: "Course",
  salon: "Salon",
  car_spotting: "Carspotting",
  autre: "Autre",
};

export const eventInputSchema = z
  .object({
    title: z.string().min(1, "Titre obligatoire").max(120),
    description: z.string().max(2000).optional(),
    location_name: z.string().min(1, "Lieu obligatoire").max(200),
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-180).max(180),
    event_date: z.string().min(1, "Date début obligatoire"),
    event_end_date: z.string().optional().or(z.literal("")),
    category: z.enum(eventCategoryValues).optional().or(z.literal("")),
  })
  .refine(
    (d) =>
      !d.event_end_date ||
      new Date(d.event_end_date) >= new Date(d.event_date),
    { message: "Date fin doit être après début", path: ["event_end_date"] }
  );

export type EventInput = z.infer<typeof eventInputSchema>;
