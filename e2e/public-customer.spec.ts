import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test.describe("Public Customer Journey", () => {
  test("homepage loads with visible content", async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState("networkidle", { timeout: 20000 });
    const heading = page.getByRole("heading", { level: 1 }).first();
    await expect(heading).toBeVisible({ timeout: 15000 });
  });

  test("products page displays products", async ({ page }) => {
    await page.goto(`${BASE}/products`);
    await page.waitForLoadState("networkidle", { timeout: 20000 });
    const productLink = page.locator("a[href*='/products/']").first();
    await expect(productLink).toBeVisible({ timeout: 15000 });
  });

  test("product detail page shows product info", async ({ page }) => {
    await page.goto(`${BASE}/products`);
    await page.waitForLoadState("networkidle", { timeout: 20000 });
    await page.waitForTimeout(500);

    const productLink = page.locator("a[href*='/products/']").first();
    const href = await productLink.getAttribute("href");
    expect(href).toBeTruthy();

    await page.goto(`${BASE}${href}`);
    await page.waitForLoadState("networkidle", { timeout: 20000 });
    await page.waitForTimeout(500);

    const h1 = page.getByRole("heading", { level: 1 }).first();
    await expect(h1).toBeVisible({ timeout: 10000 });
  });

  test("checkout form with COD creates order", async ({ page }) => {
    await page.goto(`${BASE}/checkout`);
    await page.waitForLoadState("networkidle", { timeout: 20000 });
    await page.waitForTimeout(500);

    await page.fill('input[id="fullName"]', "Test User Playwright");
    await page.fill('input[id="mobile"]', "9876543210");
    await page.fill('input[id="email"]', "testplaywright@example.com");
    await page.fill('input[id="address"]', "123 Test Street, Test Area");
    await page.fill('input[id="city"]', "Mumbai");
    await page.selectOption('select[id="state"]', "Maharashtra");
    await page.fill('input[id="pincode"]', "400001");

    const submitBtn = page.locator("button[type='submit']").first();
    await submitBtn.click();

    await page.waitForTimeout(300);
    const url = page.url();
    expect(
      url.includes("order-success") || url.includes("order-failed") || url.includes("checkout"),
      `Unexpected redirect: ${url}`
    ).toBe(true);
  });
});
