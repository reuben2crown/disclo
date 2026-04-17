import { expect, test } from "@playwright/test";

test.describe("Marketing landing (pre-install)", () => {
  test("shows Disclo heading and product copy", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: /Disclo/i }),
    ).toBeVisible();
    await expect(page.getByText(/AI Content Compliance/i)).toBeVisible();
  });
});
