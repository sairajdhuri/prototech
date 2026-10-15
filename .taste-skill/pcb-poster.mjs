import { chromium } from 'playwright';
import sharp from 'sharp';
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
const page=await browser.newPage({viewport:{width:1440,height:1000}});
await page.goto('http://localhost:3000',{waitUntil:'networkidle'});
await page.locator('.webgl-ready').waitFor({timeout:30000});
await page.addStyleTag({content:'html, body, .pcb-hero { background: transparent !important; }'});
const frame=await page.locator('.pcb-canvas').screenshot({omitBackground:true});
await sharp(frame).trim().webp({quality:92}).toFile('public/media/pcb-isometric.webp');
console.log(await sharp('public/media/pcb-isometric.webp').metadata());
} finally {await browser.close();}
