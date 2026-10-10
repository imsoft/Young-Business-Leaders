// Comprime y publica el lote de fotos descrito en scripts/photos-map.json.
//   - Álbumes  -> Supabase Storage (bucket media) + tablas gallery_albums / gallery_photos
//   - Sitio y carteles -> public/media + src/lib/data/site-media.json
// Uso: node scripts/photos-import.mjs <carpeta-origen> <carpeta-temporal> [--no-upload]
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const [src, work, flag] = process.argv.slice(2);
if (!src || !work) throw new Error("Uso: photos-import.mjs <src> <tmp> [--no-upload]");
const upload = flag !== "--no-upload";
const map = JSON.parse(readFileSync("scripts/photos-map.json", "utf8"));
mkdirSync(path.join(work, "heic"), { recursive: true });

function source(file) {
  const full = path.join(src, file);
  if (!/\.heic$/i.test(file)) return full;
  const tmp = path.join(work, "heic", file.replace(/\.heic$/i, ".jpg"));
  if (!existsSync(tmp)) execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "95", full, "--out", tmp], { stdio: "ignore" });
  return tmp;
}

/** WebP con el lado largo limitado a `max`, orientación EXIF aplicada y sin metadatos. */
async function compress(file, max, quality = 78) {
  const { data, info } = await sharp(source(file))
    .rotate()
    .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
    .webp({ quality, effort: 5 })
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height, hash: createHash("sha1").update(data).digest("hex").slice(0, 8) };
}
async function blur(data) {
  const b = await sharp(data).resize(16).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${b.toString("base64")}`;
}

let bytes = 0;

// ---------- Sitio y carteles (repo) ----------
const manifest = { site: {}, posters: [] };
mkdirSync("public/media/site", { recursive: true });
mkdirSync("public/media/posters", { recursive: true });
for (const [key, { file, max }] of Object.entries(map.site)) {
  const img = await compress(file, max, 76);
  writeFileSync(`public/media/site/${key}.webp`, img.data);
  manifest.site[key] = { src: `/media/site/${key}.webp`, width: img.width, height: img.height, blur: await blur(img.data) };
  bytes += img.data.length;
}
for (const p of map.posters) {
  const img = await compress(p.file, 1400, 84);
  writeFileSync(`public/media/posters/${p.slug}.webp`, img.data);
  manifest.posters.push({ type: p.type, number: p.number, title: p.title, slug: p.slug, src: `/media/posters/${p.slug}.webp`, width: img.width, height: img.height, blur: await blur(img.data) });
  bytes += img.data.length;
}
writeFileSync("src/lib/data/site-media.json", JSON.stringify(manifest, null, 1) + "\n");
console.log(`sitio + carteles: ${Object.keys(manifest.site).length + manifest.posters.length} archivos, ${(bytes / 1e6).toFixed(1)} MB`);

// ---------- Álbumes (Supabase) ----------
if (!upload) process.exit(0);
const env = Object.fromEntries(readFileSync(".env.local", "utf8").split("\n").filter((l) => l.includes("=")).map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
const s = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const bucket = s.storage.from("media");

async function put(key, img) {
  const { error } = await bucket.upload(key, img.data, { contentType: "image/webp", upsert: true, cacheControl: "31536000" });
  if (error) throw new Error(`${key}: ${error.message}`);
  return bucket.getPublicUrl(key).data.publicUrl;
}

let albumBytes = 0;
for (const [order, album] of map.albums.entries()) {
  const folder = `albums/${album.slug}`;
  const rows = [];
  let cover = null;
  const keep = new Set();
  for (const [i, file] of album.files.entries()) {
    const img = await compress(file, 2000);
    const name = `${String(i + 1).padStart(2, "0")}-${img.hash}-${img.width}x${img.height}.webp`;
    const url = await put(`${folder}/${name}`, img);
    keep.add(name);
    rows.push({ url, sort_order: i + 1 });
    albumBytes += img.data.length;
    if (file === album.cover) cover = url;
  }
  // Limpia archivos de corridas anteriores
  const { data: existing } = await bucket.list(folder, { limit: 1000 });
  const stale = (existing ?? []).filter((f) => !keep.has(f.name)).map((f) => `${folder}/${f.name}`);
  if (stale.length) await bucket.remove(stale);

  const { data: row, error } = await s.from("gallery_albums")
    .upsert({ slug: album.slug, title: album.title, description: album.description, event_date: album.event_date, sort_order: order + 1, published: true, cover_url: cover }, { onConflict: "slug" })
    .select("id").single();
  if (error) throw new Error(`${album.slug}: ${error.message}`);
  await s.from("gallery_photos").delete().eq("album_id", row.id);
  const ins = await s.from("gallery_photos").insert(rows.map((r) => ({ ...r, album_id: row.id })));
  if (ins.error) throw new Error(`${album.slug}: ${ins.error.message}`);
  console.log(`álbum ${album.slug}: ${rows.length} fotos`);
}
console.log(`álbumes: ${(albumBytes / 1e6).toFixed(1)} MB en Supabase`);

// Álbumes de ejemplo que ya no aplican (solo si siguen vacíos)
for (const slug of ["conferencia-1", "conferencia-2"]) {
  const { data: a } = await s.from("gallery_albums").select("id, gallery_photos(count)").eq("slug", slug).maybeSingle();
  if (a && (a.gallery_photos?.[0]?.count ?? 0) === 0) {
    await s.from("gallery_albums").delete().eq("id", a.id);
    console.log("álbum de ejemplo eliminado:", slug);
  }
}
