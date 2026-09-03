import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto("http://localhost:5173/rstudiowithtensorflow/", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const facts = page.locator(".fact-card");
const n = await facts.count();
console.log("fact cards:", n);
for (let i = 0; i < n; i++) {
  await facts.nth(i).scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await facts.nth(i).screenshot({ path: `/tmp/spacing-check/fact-${i}.png` });
}
await browser.close();
