import fs from 'node:fs/promises';
import sharp from 'sharp';

await fs.mkdir('public/media', { recursive: true });
await sharp('public/media/pcb-artwork.png').webp({ quality: 88 }).toFile('public/media/pcb-artwork.webp');
await sharp('public/media/pcb-artwork.png').extract({ left: 300, top: 240, width: 620, height: 620 }).resize(800).webp({ quality: 86 }).toFile('public/media/pcb-detail.webp');
await sharp('public/media/pcb-artwork.png').extract({ left: 800, top: 160, width: 660, height: 780 }).resize(700).webp({ quality: 86 }).toFile('public/media/pcb-edge.webp');

for (const [name, colour] of [['green', '#174c41'], ['black', '#1c2724'], ['blue', '#2a4662']]) {
  let pads = '';
  for (let i = 0; i < 20; i++) {
    pads += `<rect x="${180+i*17}" y="174" width="8" height="20" fill="#cbb582"/><rect x="${180+i*17}" y="306" width="8" height="20" fill="#cbb582"/>`;
    pads += `<path d="M${184+i*17} 174V${80+i*3}L${50+i*16} ${50+i*3}H42M${184+i*17} 326V${380-i*2}L${560-i*5} ${400+i*3}H620" fill="none" stroke="#6d906e" stroke-width="2"/>`;
  }
  let holes = '';
  for (let y = 0; y < 6; y++) for (let x = 0; x < 8; x++) holes += `<circle cx="${258+x*12}" cy="${218+y*12}" r="3" fill="#cbb582"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="540" viewBox="0 0 720 540"><rect width="720" height="540" fill="#e7ebe5"/><g transform="translate(36 28) rotate(-7 320 240)"><path d="M32 20H610L642 52V440H32Z" fill="${colour}"/><g stroke="#cbb582" stroke-width="6" fill="#182823"><circle cx="60" cy="50" r="10"/><circle cx="610" cy="72" r="10"/><circle cx="60" cy="405" r="10"/><circle cx="610" cy="405" r="10"/></g>${pads}<rect x="198" y="198" width="208" height="103" stroke="#bac9b8" stroke-width="2" fill="none"/>${holes}<path d="M74 124H138V168H108V222H70M70 292H130V340H100V380M440 106H570V184H540V240H610" stroke="#6d906e" stroke-width="3" fill="none"/><g fill="#cbb582"><rect x="510" y="280" width="28" height="50"/><rect x="550" y="280" width="28" height="50"/><rect x="510" y="344" width="28" height="50"/><rect x="550" y="344" width="28" height="50"/></g></g></svg>`;
  await fs.writeFile(`public/media/board-${name}.svg`, svg);
}

// Restore portable public registry URLs after installing from the local cache mirror.
const lock = JSON.parse(await fs.readFile('package-lock.json', 'utf8'));
for (const item of Object.values(lock.packages)) {
  if (!item.resolved?.startsWith('http://127.0.0.1:4873/tarball/')) continue;
  const value = item.resolved.replace('http://127.0.0.1:4873/tarball/', '');
  const split = value.lastIndexOf('/');
  const name = value.slice(0, split);
  item.resolved = `https://registry.npmjs.org/${name}/-/${name.split('/').pop()}-${value.slice(split+1)}.tgz`;
}
await fs.writeFile('package-lock.json', JSON.stringify(lock, null, 2) + '\n');
