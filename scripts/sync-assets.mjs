import fs from 'node:fs/promises';
import path from 'node:path';
import { machines, customers, originalImage } from '../src/lib/company.ts';

const files = ['Capture (1).JPG', ...machines.map(machine => machine.image), ...customers.map(customer => customer.image)];
await fs.mkdir('public/media/original', { recursive: true });
let failures = 0;
const saved = [];
async function download(file, url) {
  const destination = path.join('public/media/original', file);
  try { await fs.access(destination); saved.push(file); console.log(`Already saved: ${file}`); return true; } catch {}
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error(`Image download failed (${response.status})`);
    await fs.writeFile(destination, Buffer.from(await response.arrayBuffer()));
    saved.push(file);
    console.log(`Saved: ${file}`);
    return true;
  } catch (error) { failures++; console.error(`${file}: ${error.message}`); return false; }
}
for (const file of files) await download(file, originalImage(file));

try {
  const response = await fetch('https://protomlb.in/our-products', { signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`Gallery request failed (${response.status})`);
  const html = (await response.text()).replaceAll('\\/', '/').replaceAll('&amp;', '&');
  const matches = html.match(/https:\/\/img1\.wsimg\.com\/isteam\/ip\/68492da2-903b-4178-b641-6c9c1d026062\/[^"'\\<>\s)]+/g) || [];
  const urls = [...new Set(matches.map(url => url.split('/:')[0].split('/%3A')[0]))];
  const products = [];
  for (const url of urls) {
    const file = decodeURIComponent(url.split('/').pop()).replace(/[/\\]/g, '_');
    if (files.includes(file) || !/\.(jpg|jpeg|png|webp)$/i.test(file)) continue;
    if (await download(file, `${url}/:/rs=w:1600,m`)) products.push({ id:`product-${products.length+1}`, name:'PCB product photograph', image:`/media/original/${file}`, kind:'photograph', source:'https://protomlb.in/our-products' });
  }
  if (products.length) await fs.writeFile('public/media/products.json', JSON.stringify(products, null, 2) + '\n');
  else { failures++; console.error('No gallery photographs discovered. Check the original gallery before publishing.'); }
} catch(error) { failures++; console.error(`Product gallery: ${error.message}`); }
await fs.writeFile('public/media/original-assets.json', JSON.stringify(saved, null, 2) + '\n');
if (failures) { console.error(`${failures} downloads failed. Run again with internet access.`); process.exitCode = 1; }
