import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

// Scroll to quality process section
await page.evaluate(() => {
  const headings = Array.from(document.querySelectorAll('h2'));
  const heading = headings.find(h => h.textContent && h.textContent.includes('OUR QUALITY PROCESS'));
  if (heading) {
    heading.scrollIntoView({ behavior: 'instant', block: 'center' });
  }
});
await page.waitForTimeout;
await page.screenshot({ path: 'e:/012/website/suraj-cleaning/screenshots/quality-process-fixed.png' });
await browser.close();
