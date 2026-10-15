import {chromium} from 'playwright';
const browser=await chromium.launch({channel:'chrome',headless:true});
const p=await browser.newPage({viewport:{width:1440,height:1000}});
await p.goto('http://localhost:3000');await p.locator('.webgl-ready').waitFor();await p.locator('.pcb-chapter').scrollIntoViewIfNeeded();await p.waitForTimeout(1000);
console.log(await p.evaluate(()=>Object.fromEntries(['.pcb-experience','.pcb-visual-track','.pcb-visual','.pcb-model','.pcb-chapter','.pcb-chapter-specs'].map(s=>{const b=document.querySelector(s).getBoundingClientRect();return[s,{top:b.top,height:b.height,bottom:b.bottom}]}))));
await p.setViewportSize({width:390,height:844});await p.evaluate(()=>window.scrollTo({top:850,behavior:'instant'}));await p.waitForTimeout(1000);await p.screenshot({path:'.taste-skill/pcb/mobile-chapter-top.png'});
console.log('mobile:',await p.evaluate(()=>Object.fromEntries(['.pcb-experience','.pcb-visual-track','.pcb-visual','.pcb-model','.pcb-chapter','.pcb-chapter-copy','.pcb-chapter-specs'].map(s=>{const b=document.querySelector(s).getBoundingClientRect();return[s,{top:b.top,height:b.height,bottom:b.bottom}]}))));
await browser.close();
