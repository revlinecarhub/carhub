import { describe, it, expect } from "vitest";
import { commentSchema } from "../comment";

describe("commentSchema", () => {
  it("accepts body without rating", () => {
    expect(commentSchema.parse({ body: "hello" })).toMatchObject({ body: "hello" });
  });
  it("accepts body with rating", () => {
    expect(commentSchema.parse({ body: "hi", rating: 4 })).toMatchObject({ body: "hi", rating: 4 });
  });
  it("rejects empty body", () => {
    expect(() => commentSchema.parse({ body: "" })).toThrow();
  });
  it("rejects body > 2000 chars", () => {
    expect(() => commentSchema.parse({ body: "a".repeat(2001) })).toThrow();
  });
  it("rejects rating < 1", () => {
    expect(() => commentSchema.parse({ body: "hi", rating: 0 })).toThrow();
  });
  it("rejects rating > 5", () => {
    expect(() => commentSchema.parse({ body: "hi", rating: 6 })).toThrow();
  });
});
