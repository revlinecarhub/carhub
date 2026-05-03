import { describe, it, expect } from "vitest";
import { generateSlug, ensureUniqueSlug } from "../slug";

describe("generateSlug", () => {
  it("kebab-cases marque + modele", () => {
    expect(generateSlug({ marque: "Porsche", modele: "911 GT3 RS" }))
      .toBe("porsche-911-gt3-rs");
  });

  it("includes annee when provided", () => {
    expect(
      generateSlug({ marque: "Porsche", modele: "911", annee: 2023 })
    ).toBe("porsche-911-2023");
  });

  it("strips accents and special chars", () => {
    expect(
      generateSlug({ marque: "Citroën", modele: "DS 3 Crossé" })
    ).toBe("citroen-ds-3-crosse");
  });
});

describe("ensureUniqueSlug", () => {
  it("returns base slug if not taken", async () => {
    const exists = async () => false;
    expect(await ensureUniqueSlug("porsche-911", exists)).toBe("porsche-911");
  });

  it("appends -2 on first collision", async () => {
    const taken = new Set(["porsche-911"]);
    const exists = async (s: string) => taken.has(s);
    expect(await ensureUniqueSlug("porsche-911", exists)).toBe("porsche-911-2");
  });

  it("appends incremental suffix on multiple collisions", async () => {
    const taken = new Set(["porsche-911", "porsche-911-2", "porsche-911-3"]);
    const exists = async (s: string) => taken.has(s);
    expect(await ensureUniqueSlug("porsche-911", exists)).toBe("porsche-911-4");
  });
});
