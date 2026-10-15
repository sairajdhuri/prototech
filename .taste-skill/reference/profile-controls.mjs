import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const browser = await chromium.launch({channel:'chrome',headless:true});
const results = [];
try {
  const page = await browser.newPage({viewport:{width:1440,height:900}});
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
  await page.goto(process.argv[3] || 'http://127.0.0.1:3103');
  await page.locator('.webgl-ready').waitFor({timeout:60000});
  for(const type of ['board','machine']) {
    const root = page.locator(type === 'board' ? '.board-options' : '.machine-list [aria-label="Machinery preview"]');
    const buttons = root.locator('button');
    for(const index of [1,2,0]) {
      const button = buttons.nth(index);
      await button.scrollIntoViewIfNeeded(); await page.waitForTimeout(1000);
      const previous = await page.locator(type === 'board' ? '.explorer-image img' : '.machine-feature-caption strong').evaluate(e=>e.getAttribute('alt') || e.textContent);
      await page.evaluate(({type,previous})=>{
        window.__selection = null;
        const target = type === 'board' ? '.explorer-image img' : '.machine-feature-caption strong';
        document.addEventListener('pointerdown', () => {
          const start = performance.now();
          const observer = new MutationObserver(() => {
            const element = document.querySelector(target);
            if (element && (element.getAttribute('alt') || element.textContent) !== previous) {
              window.__selection = performance.now() - start; observer.disconnect();
            }
          });
          observer.observe(document.querySelector(type === 'board' ? '.board-explorer' : '.machine-preview'),{childList:true,subtree:true,attributes:true});
        }, {once:true,capture:true});
      }, {type,previous});
      // Touch-style clicks avoid preselecting a machine through mouseenter.
      await button.dispatchEvent('pointerdown'); await button.dispatchEvent('click');
      await page.waitForFunction(()=>window.__selection !== null);
      results.push({type,index,delayMs:await page.evaluate(()=>window.__selection)});
    }
  }
  console.log(JSON.stringify(results));
  await fs.writeFile(`.taste-skill/reference/controls-${process.argv[2] || 'baseline'}.json`,JSON.stringify(results,null,2));
} finally {await browser.close();}
