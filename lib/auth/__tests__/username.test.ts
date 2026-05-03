import { describe, it, expect } from "vitest";
import { ensureUniqueUsername, baseFromEmail } from "../username";

describe("baseFromEmail", () => {
  it("strips after @", () => {
    expect(baseFromEmail("ethan@gmail.com")).toBe("ethan");
  });
  it("lowercases", () => {
    expect(baseFromEmail("Ethan@gmail.com")).toBe("ethan");
  });
  it("replaces invalid chars with _", () => {
    expect(baseFromEmail("ethan.gou@gmail.com")).toBe("ethan_gou");
  });
  it("pads short usernames", () => {
    expect(baseFromEmail("ab@gmail.com")).toBe("ab_user");
  });
});

describe("ensureUniqueUsername", () => {
  it("returns base when not taken", async () => {
    const exists = async () => false;
    expect(await ensureUniqueUsername("ethan", exists)).toBe("ethan");
  });
  it("appends _2 on first collision", async () => {
    const taken = new Set(["ethan"]);
    const exists = async (s: string) => taken.has(s);
    expect(await ensureUniqueUsername("ethan", exists)).toBe("ethan_2");
  });
  it("increments suffix", async () => {
    const taken = new Set(["ethan", "ethan_2", "ethan_3"]);
    const exists = async (s: string) => taken.has(s);
    expect(await ensureUniqueUsername("ethan", exists)).toBe("ethan_4");
  });
});
