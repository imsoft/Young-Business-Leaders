// Genera todas las variantes del logo oficial a partir de assets/brand/ybl-logo-source.json.
// Uso: node scripts/build-brand-assets.mjs  (después corre node scripts/generate-icons.mjs)
import { readFileSync, writeFileSync } from "node:fs";

const src = JSON.parse(readFileSync("assets/brand/ybl-logo-source.json", "utf8"));
const { gold, beige } = src.colors;
const { mark, wordmark: w } = src;

const markShapes = (fill = gold, dot = beige) =>
  `<g fill="${fill}">${mark.gold.map((d) => `<path d="${d}"/>`).join("")}</g><circle cx="${mark.dot.cx}" cy="${mark.dot.cy}" r="${mark.dot.r}" fill="${dot}"/>`;

const svg = (vb, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(" ")}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`;

const TITLE = "Young Business Leaders by CCJEJ";

// 1) Símbolo solo
writeFileSync("public/brand/ybl-mark.svg", svg(mark.viewBox, markShapes(), "Young Business Leaders"));

// 2) Logo oficial apilado (como en el PDF): símbolo arriba, texto abajo
function stacked(text) {
  const body =
    `<g transform="translate(159 100)">${markShapes()}</g>` +
    `<path fill="${gold}" d="${w.young}"/><path fill="${text}" d="${w.businessLeaders}"/><path fill="${text}" d="${w.byCcjej}"/>`;
  return svg([62, 92, 278, 220], body, TITLE);
}
writeFileSync("public/brand/ybl-logo.svg", stacked("#000000"));
writeFileSync("public/brand/ybl-logo-white.svg", stacked("#ffffff"));

// 3) Horizontal para encabezados: símbolo a la izquierda (alto = bloque de texto), texto a la derecha
function horizontal(text) {
  const H = 40;
  const s = H / mark.viewBox[3];
  const markW = mark.viewBox[2] * s;
  const gap = 9;
  const x0 = markW + gap;
  const line1 = `translate(${(x0 - w.box.x).toFixed(2)} ${(-w.line1.y0).toFixed(2)})`;
  const line2 = `translate(${(x0 - 173.74).toFixed(2)} ${(H - w.line2.y1).toFixed(2)})`;
  const body =
    `<g transform="scale(${s.toFixed(4)})">${markShapes()}</g>` +
    `<g transform="${line1}"><path fill="${gold}" d="${w.young}"/><path fill="${text}" d="${w.businessLeaders}"/></g>` +
    `<g transform="${line2}"><path fill="${text}" d="${w.byCcjej}"/></g>`;
  return svg([0, 0, +(x0 + w.box.w).toFixed(2), H], body, TITLE);
}
writeFileSync("public/brand/ybl-logo-horizontal.svg", horizontal("#000000"));
writeFileSync("public/brand/ybl-logo-horizontal-white.svg", horizontal("#ffffff"));

// 4) Favicon: símbolo sobre círculo blanco
const pad = 22;
const size = mark.viewBox[3] + pad * 2;
writeFileSync(
  "src/app/icon.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#ffffff"/><g transform="translate(${(size - mark.viewBox[2]) / 2} ${pad})">${markShapes()}</g></svg>\n`,
);

const hz = readFileSync("public/brand/ybl-logo-horizontal.svg", "utf8").match(/viewBox="([^"]+)"/)[1];
console.log("logos generados · horizontal viewBox:", hz);
