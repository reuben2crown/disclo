import { expect, test } from "@playwright/test";

test.describe("Health", () => {
  test("GET /health returns ok", async ({ request }) => {
    const res = await request.get("/health");
    expect(res.status()).toBe(200);
    expect((await res.text()).trim()).toBe("ok");
  });
});
