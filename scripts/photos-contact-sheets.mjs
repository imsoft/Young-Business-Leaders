// Genera hojas de contacto numeradas para revisar un lote de fotos.
// Uso: node scripts/photos-contact-sheets.mjs <carpeta-origen> <carpeta-salida>
import sharp from "sharp";
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const [src, out] = process.argv.slice(2);
if (!src || !out) throw new Error("Uso: photos-contact-sheets.mjs <src> <out>");
mkdirSync(path.join(out, "tmp"), { recursive: true });

const files = readdirSync(src).filter((f) => /\.(jpe?g|png|heic)$/i.test(f)).sort((a, b) => a.localeCompare(b, "es", { numeric: true }));
const CELL = 300, COLS = 5, ROWS = 4, PER = COLS * ROWS;
const index = [];

async function load(file) {
  const full = path.join(src, file);
  if (!/\.heic$/i.test(file)) return full;
  const tmp = path.join(out, "tmp", file.replace(/\.heic$/i, ".jpg"));
  if (!existsSync(tmp)) execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "90", full, "--out", tmp], { stdio: "ignore" });
  return tmp;
}
function created(file) {
  try {
    const o = execFileSync("sips", ["-g", "creation", path.join(src, file)], { encoding: "utf8" });
    return (o.match(/creation: (.+)/)?.[1] ?? "").trim();
  } catch { return ""; }
}

for (let s = 0; s * PER < files.length; s++) {
  const batch = files.slice(s * PER, (s + 1) * PER);
  const composites = [];
  for (const [i, file] of batch.entries()) {
    const n = s * PER + i + 1;
    const input = await load(file);
    const img = sharp(input).rotate();
    const meta = await sharp(input).rotate().toBuffer({ resolveWithObject: true }).then((r) => r.info);
    index.push({ n, file, w: meta.width, h: meta.height, created: created(file) });
    const thumb = await img.resize(CELL, CELL, { fit: "contain", background: "#222" }).jpeg({ quality: 70 }).toBuffer();
    const label = Buffer.from(`<svg width="${CELL}" height="34"><rect width="64" height="34" fill="#E9A23B"/><text x="32" y="24" font-family="Helvetica" font-size="20" font-weight="700" text-anchor="middle" fill="#111">${n}</text></svg>`);
    const x = (i % COLS) * CELL, y = Math.floor(i / COLS) * CELL;
    composites.push({ input: thumb, left: x, top: y }, { input: label, left: x, top: y });
  }
  await sharp({ create: { width: COLS * CELL, height: ROWS * CELL, channels: 3, background: "#111" } })
    .composite(composites).jpeg({ quality: 72 }).toFile(path.join(out, `sheet-${String(s + 1).padStart(2, "0")}.jpg`));
  console.log("hoja", s + 1, `(${batch.length})`);
}
writeFileSync(path.join(out, "index.json"), JSON.stringify(index, null, 1));
