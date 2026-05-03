import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("cloudinary", () => ({
  v2: {
    config: vi.fn(),
    utils: {
      api_sign_request: vi.fn(() => "fake-signature"),
    },
  },
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: vi.fn(async () => ({
        data: { user: { email: "admin@example.com" } },
      })),
    },
  })),
}));

beforeEach(() => {
  process.env.ADMIN_EMAIL = "admin@example.com";
  process.env.CLOUDINARY_API_KEY = "key";
  process.env.CLOUDINARY_API_SECRET = "secret";
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "cloud";
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = "revline_signed";
});

describe("POST /api/cloudinary/sign", () => {
  it("returns signature when admin", async () => {
    const { POST } = await import("../route");
    const res = await POST();
    const body = await res.json();
    expect(body.signature).toBe("fake-signature");
    expect(body.apiKey).toBe("key");
    expect(body.cloudName).toBe("cloud");
    expect(body.uploadPreset).toBe("revline_signed");
    expect(typeof body.timestamp).toBe("number");
  });
});
