// Genera favicon.ico, apple-icon.png y el logo PNG para datos estructurados desde src/app/icon.svg.
// Uso: node scripts/generate-icons.mjs
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";

const svg = readFileSync("src/app/icon.svg");
const mark = (size) => sharp(svg, { density: 512 }).resize(size, size).png().toBuffer();

// ICO con imágenes PNG embebidas (formato válido desde Windows Vista y en todos los navegadores).
async function ico(sizes) {
  const pngs = await Promise.all(sizes.map(mark));
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
  let offset = 6 + 16 * sizes.length;
  const entries = sizes.map((s, i) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(s >= 256 ? 0 : s, 0); e.writeUInt8(s >= 256 ? 0 : s, 1);
    e.writeUInt8(0, 2); e.writeUInt8(0, 3); e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
    e.writeUInt32LE(pngs[i].length, 8); e.writeUInt32LE(offset, 12);
    offset += pngs[i].length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...pngs]);
}

// Íconos opacos (iOS no admite transparencia): marca centrada sobre blanco.
async function onWhite(size, pad) {
  const inner = await mark(Math.round(size * (1 - pad * 2)));
  return sharp({ create: { width: size, height: size, channels: 3, background: "#ffffff" } })
    .composite([{ input: inner, gravity: "center" }]).png().toBuffer();
}

writeFileSync("src/app/favicon.ico", await ico([16, 32, 48]));
writeFileSync("src/app/apple-icon.png", await onWhite(180, 0.08));
writeFileSync("public/brand/ybl-logo-512.png", await onWhite(512, 0.06));
writeFileSync("public/brand/icon-192.png", await onWhite(192, 0.08));
console.log("íconos generados");
