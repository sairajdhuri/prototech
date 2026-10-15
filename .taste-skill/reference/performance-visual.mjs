import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser = await chromium.launch({channel:'chrome',headless:true});
try {
  const page = await browser.newPage();
  const baseline = JSON.parse(await fs.readFile('.taste-skill/reference/header-before.json','utf8'));
  for(const width of [1440,390]) {
    await page.setViewportSize({width,height:900});
    await page.goto('http://127.0.0.1:3104');
    await page.locator('.webgl-ready').waitFor({timeout:30000});
    await page.waitForTimeout(800);
    if(width===1440) assert.equal(await page.locator('.site-header').evaluate(e=>e.outerHTML),baseline.html);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await page.screenshot({path:`.taste-skill/reference/performance-hero-${width}.png`});
  }
} finally {await browser.close();}
