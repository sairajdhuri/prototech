import assert from "node:assert/strict";
import sharp from "sharp";

const size = 1024;
const mark = await sharp("public/media/original/logo.webp").ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < mark.data.length; i += 4) {
  // Preserve the supplied symbol's antialiasing while removing its white ground.
  const coverage = 255 - Math.min(...mark.data.subarray(i, i + 3));
  mark.data[i] = mark.data[i + 1] = mark.data[i + 2] = 255;
  mark.data[i + 3] = Math.round(mark.data[i + 3] * coverage / 255);
}
const symbol = await sharp(mark.data, { raw: mark.info }).resize(70, 59).png().toBuffer();
// Keep the actual company symbol clear of routing and component footprints.
const clear = Buffer.from('<svg width="1024" height="1024"><rect x="825" y="800" width="110" height="105" fill="#073b2c"/></svg>');
const source = await sharp("public/media/pcb-surface-v2.webp").resize(size, size).removeAlpha().raw().toBuffer();
const mask = await sharp(source, { raw: { width: size, height: size, channels: 3 } }).composite([{ input: clear }, { input: symbol, left: 845, top: 815 }]).removeAlpha().raw().toBuffer();
const finish = Buffer.alloc(mask.length);
for (let i = 0; i < mask.length; i += 3) {
  // Deterministic grain gives the solder mask a material finish without another asset.
  const grain = (mask[i] + mask[i + 1] + mask[i + 2]) / 3;
  const metallic = mask[i] > mask[i + 1] * 1.15;
  finish[i] = metallic ? 180 : grain * 0.25;
  finish[i + 1] = metallic ? 56 : 115 + grain * 0.2;
  finish[i + 2] = metallic ? 235 : 0;
}
await sharp(mask, { raw: { width: size, height: size, channels: 3 } }).webp({ quality: 87 }).toFile("public/media/pcb-mask-v3.webp");
await sharp(finish, { raw: { width: size, height: size, channels: 3 } }).webp({ quality: 90 }).toFile("public/media/pcb-finish-v3.webp");
for (const core of [false, true]) {
  const pixels = Buffer.from(source);
  const substrate = core ? [225, 211, 176] : [182, 99, 47];
  const traces = core ? [164, 118, 62] : [95, 43, 18];
  for (let i = 0; i < pixels.length; i += 3) {
    const r = source[i], g = source[i + 1], b = source[i + 2];
    const color = r > g * 1.15 && r > b * 1.4 ? traces : substrate;
    const grain = (r + g + b) / 765;
    for (let c = 0; c < 3; c++) pixels[i + c] = color[c] + grain * 28;
  }
  await sharp(pixels, { raw: { width: size, height: size, channels: 3 } }).resize(768).webp({ quality: 85 }).toFile(`public/media/pcb-${core ? "core" : "copper"}-v3.webp`);
}
assert.equal(mask.length, size * size * 3);
assert.equal((await sharp("public/media/pcb-finish-v3.webp").metadata()).channels, 3);
console.log("Baked PCB materials. Browser pixel processing is no longer needed.");
