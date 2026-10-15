import { chromium } from "playwright";
import assert from "node:assert/strict";
import sharp from "sharp";
import fs from "node:fs/promises";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];
try {
  for (const width of [320, 600, 900, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1100 } });
    const errors = []; page.on("pageerror", error => errors.push(error.message));
    let release;
    const ready = new Promise(resolve => { release = resolve; });
    await page.route(/pcb-scene/, async route => { await ready; await route.continue(); });
    await page.goto("http://127.0.0.1:3103");
    await page.locator(".pcb-fallback").evaluate(image => image.decode());
    const posterURL = await page.locator(".pcb-fallback").getAttribute("src");
    assert(posterURL.includes("pcb-stack-current."));
    await page.screenshot({ path: `.taste-skill/reference/first-paint-${width}.png` });
    await page.addStyleTag({ content: ".pcb-model, .pcb-canvas { background: white; }" });
    const poster = await page.locator(".pcb-model").screenshot();
    release();
    await page.locator(".webgl-ready").waitFor({ timeout: 30000 });
    await page.addStyleTag({ content: ".pcb-model, .pcb-canvas { background: white; }" });
    const model = await page.locator(".pcb-model").screenshot();
    await fs.writeFile(`.taste-skill/reference/poster-comparison-${width}.png`, poster);
    await fs.writeFile(`.taste-skill/reference/model-comparison-${width}.png`, model);
    const a = await sharp(poster).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const b = await sharp(model).removeAlpha().raw().toBuffer();
    assert.equal(a.data.length, b.length);
    let changed = 0;
    for (let i = 0; i < b.length; i += 3) if ([0, 1, 2].some(c => Math.abs(a.data[i + c] - b[i + c]) > 20)) changed++;
    const difference = changed / (a.info.width * a.info.height);
    assert(difference < 0.1, `Poster transition differs by ${difference} at ${width}px`);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    assert.deepEqual(errors, []);
    results.push({ width, posterURL, transitionDifference: difference });
    await page.close();
  }
  await fs.writeFile(".taste-skill/reference/loading-review.json", JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results));
} finally { await browser.close(); }
