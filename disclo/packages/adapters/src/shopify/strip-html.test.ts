import { describe, expect, it } from "vitest";
import { stripHtml } from "./strip-html.js";

describe("stripHtml", () => {
  it("removes tags and collapses whitespace", () => {
    expect(stripHtml("<p>Hello <b>world</b></p>")).toBe("Hello world");
  });

  it("strips script and style blocks", () => {
    expect(
      stripHtml('<script>alert(1)</script><p>x</p><style>.a{}</style>'),
    ).toBe("x");
  });

  it("returns empty for nullish", () => {
    expect(stripHtml(null)).toBe("");
    expect(stripHtml(undefined)).toBe("");
  });
});
