import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  await page.goto('http://127.0.0.1:3101');
  await page.locator('.webgl-ready').waitFor({ timeout: 30000 });
  const previous = JSON.parse(await fs.readFile('.taste-skill/reference/header-before.json', 'utf8'));
  assert.equal(await page.locator('.site-header').evaluate(element => element.outerHTML), previous.html, 'Navigation markup must remain unchanged');
  for (const width of [1440, 768, 390, 360]) {
    await page.setViewportSize({ width, height: width > 1000 ? 900 : 844 });
    await page.goto('http://127.0.0.1:3101');
    await page.locator('.webgl-ready').waitFor({timeout:30000});
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(1200);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Overflow at ${width}px`);
    console.log(JSON.stringify({ width, headings: await page.locator('.pcb-experience h1, .pcb-experience h2, .pcb-experience h3').evaluateAll(elements => elements.map(element => ({ text: element.textContent, lines: element.getBoundingClientRect().height / parseFloat(getComputedStyle(element).lineHeight) }))) }));
    await page.screenshot({ path: `.taste-skill/reference/hero-${width}.png` });
    await page.locator('.pcb-scroll-hint').click();
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `.taste-skill/reference/chapter-${width}.png` });
  }
  console.log('Navbar unchanged. Responsive screenshots saved.');
} finally { await browser.close(); }
