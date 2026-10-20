// Datos de ejemplo. Uso: node scripts/seed.mjs  (lee .env.local)
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
const env = Object.fromEntries(readFileSync(".env.local","utf8").split("\n").filter(l=>l.includes("=")).map(l=>{const i=l.indexOf("=");return [l.slice(0,i).trim(), l.slice(i+1).trim()];}));
const s = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {auth:{persistSession:false}});

// Sin eventos de ejemplo: los eventos reales se crean desde /admin/eventos.
const events = [];
// Los álbumes y sus fotos los publica scripts/photos-import.mjs
const albums = [];
const sponsors = [{ name:"CCJEJ", website:"https://instagram.com/ccjejac", tier:"fundador", sort_order:1 }];

for (const [table, rows, key] of [["events",events,"slug"],["gallery_albums",albums,"slug"],["sponsors",sponsors,null]]) {
  if (rows.length === 0) continue;
  const { error } = key ? await s.from(table).upsert(rows, { onConflict: key, ignoreDuplicates: true }) : await s.from(table).insert(rows);
  console.log(table, error ? "ERROR " + error.message : `ok (${rows.length})`);
}
