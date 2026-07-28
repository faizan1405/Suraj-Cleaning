import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

// Find the quality process section
const section = await page.locator('text=OUR QUALITY PROCESS').locator('..');
if (await section.count() > 0) {
  await section.scrollIntoViewIfNeeded();
}

await page.waitForTimeout;
await page.screenshot({ path: 'e:/012/website/suraj-cleaning/screenshots/quality-process-fixed.png', fullPage: false });

await browser.close();
