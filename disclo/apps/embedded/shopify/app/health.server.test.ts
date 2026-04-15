import type { LoaderFunctionArgs } from "@remix-run/node";
import { describe, expect, it } from "vitest";

import { loader } from "./routes/health.js";

describe("GET /health", () => {
  it("returns 200 and plain ok", async () => {
    const args: LoaderFunctionArgs = {
      request: new Request("http://127.0.0.1/health"),
      context: {},
      params: {},
    };
    const res = await loader(args);

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/plain");
    expect(await res.text()).toBe("ok");
  });
});
