export async function computeViewKey(
  viewerId: string,
  carId: string,
  isoDate: string
): Promise<string> {
  const data = new TextEncoder().encode(`${viewerId}:${carId}:${isoDate}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
