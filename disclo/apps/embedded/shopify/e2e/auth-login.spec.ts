import { expect, test } from "@playwright/test";

test.describe("Auth login route", () => {
  test("login page loads with shop field", async ({ page }) => {
    await page.goto("/auth/login");

    await expect(page.getByLabel(/shop domain/i)).toBeVisible();
  });
});
