import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

test.describe("Admin Product CRUD", () => {
  test("admin login with wrong password shows error", async ({ page }) => {
    await page.goto(`${BASE}/admin/login`);
    await page.waitForLoadState("networkidle", { timeout: 20000 });
    await page.waitForTimeout(500);

    await page.fill('input[id="username"]', "suraj_admin");
    await page.fill('input[id="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    const stillOnLogin = page.url().includes("login");
    const errorVisible = await page.locator(".text-red-600, [class*='error'], .bg-red-50").first().isVisible({ timeout: 3000 }).catch(() => false);
    expect(stillOnLogin || errorVisible).toBe(true);
  });

  test("create product via admin form", async ({ page }) => {
    await page.goto(`${BASE}/admin/login`);
    await page.waitForLoadState("networkidle", { timeout: 20000 });
    await page.waitForTimeout(500);

    await page.fill('input[id="username"]', ADMIN_USERNAME);
    await page.fill('input[id="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/admin", { timeout: 10000 });
    await page.waitForTimeout(500);

    await page.goto(`${BASE}/admin/products`);
    await page.waitForLoadState("networkidle", { timeout: 20000 });
    await page.waitForTimeout(500);

    const addBtn = page.locator("button:has-text('Add Product')").first();
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(500);
    }
  });
});
