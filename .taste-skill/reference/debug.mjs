import { chromium } from 'playwright';
const browser = await chromium.launch({channel: 'chrome', headless: true});
try {
  const page = await browser.newPage({viewport: {width:1440,height:900}});
  page.on('console', message => {if (message.type() === 'warning' || message.type() === 'error') console.log(message.type(), message.text());});
  page.on('pageerror', error => console.log(error.message));
  await page.goto('http://localhost:3000');
  await page.locator('.webgl-ready').waitFor({timeout:30000});
  for (const y of [0,300,660]) {
    await page.evaluate(y => scrollTo({top:y,behavior:'instant'}),y);
    await page.waitForTimeout(1600);
    console.log(JSON.stringify(await page.evaluate(() => ({y:scrollY,ready:!!document.querySelector('.webgl-ready'),lost:document.querySelector('canvas')?.getContext('webgl2')?.isContextLost(),status:document.querySelector('.pcb-assembly-status')?.textContent,track:document.querySelector('.pcb-visual-track')?.getBoundingClientRect().toJSON(),visual:document.querySelector('.pcb-visual')?.getBoundingClientRect().toJSON(),canvas:document.querySelector('.pcb-canvas')?.getBoundingClientRect().toJSON()}))));
    await page.screenshot({path:`.taste-skill/reference/debug-${y}.png`});
  }
} finally {await browser.close();}
