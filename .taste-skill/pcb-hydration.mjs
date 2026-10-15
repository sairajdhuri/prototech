import {chromium} from 'playwright';
const b=await chromium.launch({channel:'chrome',headless:true});const p=await b.newPage({viewport:{width:1440,height:1000}});
p.on('pageerror',e=>console.log('ERROR',e.message));p.on('console',m=>console.log(m.type(),m.text().slice(0,400)));p.on('response',r=>{if(r.url().includes('/_next/')&&(r.status()>=400||r.url().includes('pcb')))console.log('HTTP',r.status(),r.url());});
await p.goto('http://localhost:3000',{waitUntil:'networkidle'});
console.log(await p.evaluate(()=>({root:!!document.querySelector('.pcb-experience'),scripts:[...document.scripts].map(s=>s.src).filter(Boolean),state:document.readyState})));await p.waitForTimeout(10000);console.log('READY',await p.locator('.webgl-ready').count());await p.screenshot({path:'.taste-skill/pcb/hydration-debug.png'});await b.close();
