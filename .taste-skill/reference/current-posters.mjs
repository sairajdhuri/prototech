import { chromium } from "playwright";
import sharp from "sharp";
import fs from "node:fs/promises";
import assert from "node:assert/strict";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const frames = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto("http://localhost:3000");
  await page.locator(".webgl-ready").waitFor({ timeout: 30000 });
  await page.addStyleTag({ content: `
    html, body, .home-page, .pcb-hero, .pcb-chapter { background: transparent !important; }
    body { visibility: hidden; }
    .pcb-visual-track { position: fixed !important; inset: 0 !important; height: 740px !important; }
    .pcb-visual { position: relative !important; top: 0 !important; width: 920px !important; height: 740px !important; min-height: 0 !important; margin: 0 !important; }
    .pcb-model { inset: 0 !important; }
    .pcb-canvas { visibility: visible !important; }
  ` });
  for (const name of ["stack", "finished"]) {
    if (name === "finished") await page.locator(".pcb-chapter").evaluate(element => scrollTo({ top: element.getBoundingClientRect().top + scrollY - 88, behavior: "instant" }));
    await page.waitForTimeout(1500);
    const frame = await page.screenshot({ clip: { x: 0, y: 0, width: 920, height: 740 }, omitBackground: true });
    const metadata = await sharp(frame).metadata();
    assert.equal(metadata.width, 920); assert.equal(metadata.height, 740);
    frames.push([name, await sharp(frame).webp({ quality: 85 }).toBuffer()]);
  }
} finally { await browser.close(); }
for (const [name, frame] of frames) {
  await fs.writeFile(`public/media/pcb-${name}-current.webp`, frame);
  console.log(name, frame.length);
}
