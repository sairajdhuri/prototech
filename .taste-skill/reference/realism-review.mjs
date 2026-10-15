import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import sharp from 'sharp';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];
try {
  const originalHeader = JSON.parse(await fs.readFile('.taste-skill/reference/header-before.json', 'utf8'));
  for (const width of process.argv[2] ? [Number(process.argv[2])] : [1440, 768, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.text().includes('static fallback')) console.log(message.text()); });
    await page.goto('http://localhost:3000');
    await page.locator('.webgl-ready').waitFor({ timeout: 30000 });
    await page.locator('.pcb-studio-backdrop').evaluate(image => image.decode());
    if (width === 1440) assert.equal(await page.locator('.site-header').evaluate(element => element.outerHTML), originalHeader.html);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.screenshot({ path: `.taste-skill/reference/realism-hero-${width}.png` });
    await page.locator('.pcb-scroll-hint').click();
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `.taste-skill/reference/realism-chapter-${width}.png` });
    if (width === 1440) {
      await page.addStyleTag({ content: 'html, body, .home-page, .pcb-hero, .pcb-chapter {background:transparent!important} .pcb-studio-backdrop, .pcb-hero-copy, .pcb-hero-bottom, .pcb-visual figcaption, .pcb-layer-key {visibility:hidden}' });
      for (const name of ['finished', 'stack']) {
        if (name === 'stack') await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        await page.waitForTimeout(1200);
        const clip = await page.locator('.pcb-canvas').boundingBox();
        await sharp(await page.screenshot({ clip, omitBackground: true })).trim().png().toFile(`public/media/pcb-${name}-poster.png`);
      }
    }
    await page.close();
    console.log(`Reviewed ${width}px`);
  }
  assert.deepEqual(errors, []);
  console.log('No overflow or page errors. Navbar unchanged. Posters refreshed.');
} finally { await browser.close(); }
