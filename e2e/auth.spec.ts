import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

test.describe("Authentication", () => {
  test("admin login with wrong credentials is rejected", async ({ page }) => {
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

  test("admin login with correct credentials succeeds", async ({ page }) => {
    await page.goto(`${BASE}/admin/login`);
    await page.waitForLoadState("networkidle", { timeout: 20000 });
    await page.waitForTimeout(500);

    await page.fill('input[id="username"]', ADMIN_USERNAME);
    await page.fill('input[id="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');

    await page.waitForURL("**/admin", { timeout: 10000 });
    expect(page.url()).toContain("/admin");
  });

  test("protected admin route redirects unauthenticated users", async ({ page }) => {
    await page.goto(`${BASE}/admin/products`);
    await page.waitForLoadState("networkidle", { timeout: 20000 });
    await page.waitForTimeout(500);

    const onLoginPage = page.url().includes("/admin/login");
    expect(onLoginPage).toBe(true);
  });

  test("customer /orders redirects unauthenticated users", async ({ page }) => {
    await page.goto(`${BASE}/orders`);
    await page.waitForLoadState("networkidle", { timeout: 20000 });
    await page.waitForTimeout(500);

    const onSignin = page.url().includes("/signin");
    expect(onSignin).toBe(true);
  });
});
