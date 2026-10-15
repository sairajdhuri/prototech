import {chromium} from 'playwright';
const b=await chromium.launch({channel:'chrome',headless:true});
try {const p=await b.newPage({viewport:{width:1440,height:1000}});await p.goto('http://localhost:3000');await p.locator('.webgl-ready').waitFor({timeout:30000});await p.getByRole('link',{name:'Explore capabilities',exact:true}).click();await p.waitForURL('**/capabilities');await p.goBack();await p.locator('.webgl-ready').waitFor({timeout:30000});console.log('Return canvas count:',await p.locator('canvas').count());}finally{await b.close();}
