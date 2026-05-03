import { cookies } from "next/headers";
import { computeViewKey, todayIso } from "./dedup";
import { recordView } from "./repo";

const COOKIE_NAME = "rl_v";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

export async function trackView(carId: string): Promise<void> {
  const cookieStore = await cookies();
  let viewerId = cookieStore.get(COOKIE_NAME)?.value;
  if (!viewerId) {
    viewerId = crypto.randomUUID();
    try {
      cookieStore.set(COOKIE_NAME, viewerId, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE,
      });
    } catch {
      return;
    }
  }
  const key = await computeViewKey(viewerId, carId, todayIso());
  await recordView(carId, key);
}
