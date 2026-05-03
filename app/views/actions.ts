"use server";

import { trackView } from "@/lib/views/track";

export async function trackViewAction(carId: string) {
  await trackView(carId);
}
