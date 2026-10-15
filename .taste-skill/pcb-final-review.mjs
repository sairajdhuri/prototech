import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
await fs.mkdir('.taste-skill/pcb-final',{recursive:true});
const page=await browser.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
for (const width of [1440,768,390,360]) {
 await page.setViewportSize({width,height:width>1000?1000:844});
 await page.goto('http://localhost:3100',{waitUntil:'networkidle'});
 await page.locator('.webgl-ready').waitFor({timeout:30000});
 console.log(JSON.stringify({width,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),headings:await page.locator('.pcb-experience h1, .pcb-experience h2, .pcb-experience h3').evaluateAll(es=>es.map(e=>({text:e.textContent,lines:e.getBoundingClientRect().height/parseFloat(getComputedStyle(e).lineHeight)})))}));
 await page.screenshot({path:`.taste-skill/pcb-final/hero-${width}.png`});
 if(width===390) {for(const y of [250,450,650,780,1000]){await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(1000);await page.screenshot({path:`.taste-skill/pcb-final/mobile-scroll-${y}.png`});}}
 await page.locator('.pcb-scroll-hint').click();await page.waitForTimeout(1300);await page.screenshot({path:`.taste-skill/pcb-final/layers-${width}.png`});
 await page.locator('.pcb-quote').scrollIntoViewIfNeeded();await page.waitForTimeout(900);await page.screenshot({path:`.taste-skill/pcb-final/quote-${width}.png`});
}
const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
await nojs.goto('http://localhost:3100');console.log('No JS fallback:',await nojs.locator('.pcb-fallback').isVisible());
console.log('Page errors:',JSON.stringify(errors));
}finally{await browser.close();}

