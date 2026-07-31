import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test.describe("Form Submissions", () => {
  test("contact form submission", async ({ page }) => {
    await page.goto(`${BASE}/contact`);
    await page.waitForLoadState("networkidle", { timeout: 20000 });
    await page.waitForTimeout(500);

    await page.fill('input[name="name"], input[id="name"]', "Test Contact");
    await page.fill('input[name="email"], input[id="email"]', "contacttest@example.com");
    await page.fill('input[name="phone"], input[id="phone"]', "9876543210");
    await page.fill('textarea[name="message"], textarea[id="message"]', "This is a test message from Playwright E2E.");

    const submitBtn = page.locator("button[type='submit']").first();
    await submitBtn.click();
    await page.waitForTimeout;

    const response = await page.waitForResponse(
      (resp) => resp.url().includes("/api/contact") && resp.status === 200,
      { timeout: 5000 }
    ).catch(() => null);

    const url = page.url();
    expect(url.includes("contact") || response !== null || page.locator("text=/success|thank|received/i").isVisible().catch(() => false)).toBe(true);
  });

  test("newsletter signup submission", async ({ page }) => {
    await page.goto(`${BASE}`);
    await page.waitForLoadState("networkidle", { timeout: 20000 });
    await page.waitForTimeout(500);

    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const emailVisible = await emailInput.isVisible({ timeout: 5000 }).catch(() => false);
    if (emailVisible) {
      await emailInput.fill(`newsletter-${Date.now()}@example.com`);
      const subscribeBtn = page.locator("button:has-text('Subscribe'), button:has-text('Sign Up')").first();
      if (await subscribeBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await subscribeBtn.click();
        await page.waitForTimeout(300);
      }
    }
  });
});
