import {chromium} from 'playwright';
import sharp from 'sharp';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{const p=await browser.newPage();await p.emulateMedia({reducedMotion:'reduce'});await p.goto('http://localhost:3000');await p.locator('.webgl-ready').waitFor();await p.addStyleTag({content:'.pcb-canvas { background: white; }'});const c=p.locator('.pcb-canvas canvas');await c.screenshot({path:'.taste-skill/pcb/reduce-before.png'});await p.locator('.pcb-chapter').scrollIntoViewIfNeeded();await c.screenshot({path:'.taste-skill/pcb/reduce-after.png'});for(const n of ['before','after'])console.log(n,await sharp(`.taste-skill/pcb/reduce-${n}.png`).metadata());}finally{await browser.close();}
