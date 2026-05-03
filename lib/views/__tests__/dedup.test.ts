import { describe, it, expect } from "vitest";
import { computeViewKey } from "../dedup";

describe("computeViewKey", () => {
  it("produces stable hash for same inputs", async () => {
    const a = await computeViewKey("user-1", "car-1", "2026-05-02");
    const b = await computeViewKey("user-1", "car-1", "2026-05-02");
    expect(a).toBe(b);
  });
  it("differs by viewer", async () => {
    const a = await computeViewKey("user-1", "car-1", "2026-05-02");
    const b = await computeViewKey("user-2", "car-1", "2026-05-02");
    expect(a).not.toBe(b);
  });
  it("differs by date", async () => {
    const a = await computeViewKey("user-1", "car-1", "2026-05-02");
    const b = await computeViewKey("user-1", "car-1", "2026-05-03");
    expect(a).not.toBe(b);
  });
  it("differs by car", async () => {
    const a = await computeViewKey("user-1", "car-1", "2026-05-02");
    const b = await computeViewKey("user-1", "car-2", "2026-05-02");
    expect(a).not.toBe(b);
  });
  it("returns 64-char hex (sha256)", async () => {
    const k = await computeViewKey("u", "c", "d");
    expect(k).toMatch(/^[0-9a-f]{64}$/);
  });
});
