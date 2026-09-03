import { chromium } from "playwright";

const OUT = process.env.SHOT_DIR;
const URL = "http://localhost:5173/rstudiowithtensorflow/";
const NAME = process.argv[2] ?? "tinker";
const RE = process.env.SHOT_RE ?? "Can I break my computer";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(500);

// innermost div containing the heading = the card itself
const anchor = process.env.SHOT_TAG ?? "h2";
const heading = page.getByRole("heading", { name: new RegExp(RE) });
const card = page.locator(process.env.SHOT_SCOPE ?? "div").filter({ has: heading }).last();

// robust: clip the page shot to the card's bounding box + margin,
// clamped to the document (surrounding whitespace matters for judging layout)
const M = 32;
await card.scrollIntoViewIfNeeded();
const box = await card.boundingBox();
const dims = await page.evaluate(() => ({
  w: document.documentElement.scrollWidth,
  h: document.documentElement.scrollHeight,
}));
const clip = {
  x: Math.max(0, box.x - M),
  y: Math.max(0, box.y - M),
  width: Math.min(box.width + M * 2, dims.w),
  height: Math.min(box.height + M * 2, dims.h),
};
await page.screenshot({ path: `${OUT}/${NAME}.png`, clip });
console.log("saved", `${OUT}/${NAME}.png`, JSON.stringify(clip));
await browser.close();