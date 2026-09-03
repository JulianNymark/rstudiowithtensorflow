import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto("http://localhost:5199/rstudiowithtensorflow/", { waitUntil: "networkidle" });
await page.waitForTimeout(400);
// scroll so a Details summary is mid-viewport with content below it visible (footer-ish)
const details = page.locator("details.ds-details").first();
await details.scrollIntoViewIfNeeded();
await page.mouse.wheel(0, -200); // put summary a bit lower in viewport so stuff below is visible
await page.waitForTimeout(300);
const before = await page.evaluate(() => {
  const s = document.querySelector("details.ds-details summary");
  const r = s.getBoundingClientRect();
  return { scrollY: window.scrollY, summaryTop: r.top, docH: document.documentElement.scrollHeight };
});
await details.locator("summary").click();
await page.waitForTimeout(400);
const after = await page.evaluate(() => {
  const s = document.querySelector("details.ds-details summary");
  const r = s.getBoundingClientRect();
  return { scrollY: window.scrollY, summaryTop: r.top, docH: document.documentElement.scrollHeight };
});
console.log("BEFORE", JSON.stringify(before));
console.log("AFTER ", JSON.stringify(after));
console.log("summary viewport shift:", after.summaryTop - before.summaryTop);
await browser.close();
