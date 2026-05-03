type SlugInput = {
  marque: string;
  modele: string;
  annee?: number | null;
};

export function generateSlug(input: SlugInput): string {
  const parts = [input.marque, input.modele];
  if (input.annee != null) parts.push(String(input.annee));

  return parts
    .join(" ")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function ensureUniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>
): Promise<string> {
  if (!(await exists(base))) return base;

  let i = 2;
  while (await exists(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}
