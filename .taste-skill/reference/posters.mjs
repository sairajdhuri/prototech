import { chromium } from 'playwright';
import sharp from 'sharp';
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  await page.goto('http://127.0.0.1:3101');
  await page.locator('.webgl-ready').waitFor({timeout:30000});
  await page.addStyleTag({content:'html, body, .home-page, .pcb-hero, .pcb-chapter {background:transparent!important} .pcb-hero-copy, .pcb-hero-bottom, .pcb-visual figcaption, .pcb-layer-key {visibility:hidden}'});
  for(const name of ['stack','finished']) {
    if(name==='finished') await page.locator('.pcb-chapter').evaluate(element=>scrollTo({top:element.getBoundingClientRect().top+scrollY-88,behavior:'instant'}));
    await page.waitForTimeout(1500);
    const clip=await page.locator('.pcb-canvas').boundingBox();
    await sharp(await page.screenshot({clip,omitBackground:true})).trim().png().toFile(`public/media/pcb-${name}-poster.png`);
    console.log(`Updated pcb-${name}-poster.png`);
  }
}finally{await browser.close();}
