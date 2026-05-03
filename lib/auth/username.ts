export function baseFromEmail(email: string): string {
  const local = email.split("@")[0].toLowerCase();
  const cleaned = local.replace(/[^a-z0-9_]/g, "_");
  return cleaned.length < 3 ? `${cleaned}_user` : cleaned;
}

export async function ensureUniqueUsername(
  base: string,
  exists: (username: string) => Promise<boolean>
): Promise<string> {
  if (!(await exists(base))) return base;
  let i = 2;
  while (await exists(`${base}_${i}`)) i++;
  return `${base}_${i}`;
}
