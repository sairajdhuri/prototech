import { chromium } from 'playwright';
import sharp from 'sharp';
const browser = await chromium.launch({channel:'chrome',headless:true});
try {
const page = await browser.newPage({reducedMotion:'reduce'});
page.on('console',m=>{if(m.type()==='error')console.log(m.text());});
await page.goto('http://localhost:3000');
await page.locator('.webgl-ready').waitFor({timeout:30000});
await page.addStyleTag({content:'.pcb-canvas, .pcb-hero, .pcb-chapter { background: white; }'});
for(const name of ['before','after']) {
if(name==='after') await page.locator('.pcb-chapter').scrollIntoViewIfNeeded();
await page.locator('.pcb-canvas canvas').screenshot({path:`.taste-skill/reference/reduced-${name}.png`});
console.log(name,JSON.stringify(await page.evaluate(()=>({scroll:scrollY,canvas:document.querySelector('.pcb-canvas').getBoundingClientRect().toJSON(),caption:document.querySelector('figcaption').getBoundingClientRect().toJSON(),key:document.querySelector('.pcb-layer-key').getBoundingClientRect().toJSON()}))));
}
const a=await sharp('.taste-skill/reference/reduced-before.png').removeAlpha().raw().toBuffer({resolveWithObject:true});
const b=await sharp('.taste-skill/reference/reduced-after.png').removeAlpha().raw().toBuffer();
const diff=Buffer.alloc(a.data.length);let minx=9999,miny=9999,maxx=0,maxy=0,count=0;
for(let i=0;i<a.data.length;i+=3)if([0,1,2].some(c=>Math.abs(a.data[i+c]-b[i+c])>12)){const x=(i/3)%a.info.width,y=Math.floor(i/3/a.info.width);minx=Math.min(x,minx);maxx=Math.max(x,maxx);miny=Math.min(y,miny);maxy=Math.max(y,maxy);diff[i]=255;count++;}
await sharp(diff,{raw:{width:a.info.width,height:a.info.height,channels:3}}).png().toFile('.taste-skill/reference/reduced-diff.png');
console.log({minx,miny,maxx,maxy,count,ratio:count/(a.info.width*a.info.height)});
}finally{await browser.close();}
