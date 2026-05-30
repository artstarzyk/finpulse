import { test, expect } from "@playwright/test";

test.describe("FinPulse – smoke tests", () => {
  test("homepage loads and shows app title", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("app-title")).toBeVisible();
    await expect(page.getByTestId("app-title")).toHaveText("FinPulse");
  });

  test("homepage shows the subtitle", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText("Real-time market intelligence"),
    ).toBeVisible();
  });

  test("homepage shows the BTC/USD placeholder card", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText("BTC/USD live feed coming soon"),
    ).toBeVisible();
  });
});
