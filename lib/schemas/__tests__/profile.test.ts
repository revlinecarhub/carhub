import { describe, it, expect } from "vitest";
import { profileSchema, usernameSchema } from "../profile";

describe("usernameSchema", () => {
  it("accepts valid handles", () => {
    expect(usernameSchema.parse("ethan_rl")).toBe("ethan_rl");
    expect(usernameSchema.parse("Abc_123")).toBe("Abc_123");
  });
  it("rejects too short", () => {
    expect(() => usernameSchema.parse("ab")).toThrow();
  });
  it("rejects invalid chars", () => {
    expect(() => usernameSchema.parse("with space")).toThrow();
    expect(() => usernameSchema.parse("with-dash")).toThrow();
    expect(() => usernameSchema.parse("éric")).toThrow();
  });
  it("rejects too long", () => {
    expect(() => usernameSchema.parse("a".repeat(31))).toThrow();
  });
});

describe("profileSchema", () => {
  it("accepts minimal", () => {
    expect(profileSchema.parse({ username: "ethan_rl" })).toMatchObject({ username: "ethan_rl" });
  });
  it("accepts full", () => {
    const full = {
      username: "ethan_rl",
      bio: "Passionné voitures",
      club_association: "Porsche Club FR",
      type_voiture_prefere: "Sportives allemandes",
      social_links: [{ platform: "instagram" as const, url: "https://instagram.com/ethan" }],
    };
    expect(profileSchema.parse(full)).toMatchObject(full);
  });
  it("rejects more than 5 social links", () => {
    const links = Array.from({ length: 6 }, (_, i) => ({
      platform: "website" as const,
      url: `https://x${i}.com`,
    }));
    expect(() =>
      profileSchema.parse({ username: "ethan_rl", social_links: links })
    ).toThrow();
  });
  it("rejects invalid social URL", () => {
    expect(() =>
      profileSchema.parse({
        username: "ethan_rl",
        social_links: [{ platform: "website", url: "not a url" }],
      })
    ).toThrow();
  });
});
