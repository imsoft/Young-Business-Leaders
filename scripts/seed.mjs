// Datos de ejemplo. Uso: node scripts/seed.mjs  (lee .env.local)
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
const env = Object.fromEntries(readFileSync(".env.local","utf8").split("\n").filter(l=>l.includes("=")).map(l=>{const i=l.indexOf("=");return [l.slice(0,i).trim(), l.slice(i+1).trim()];}));
const s = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {auth:{persistSession:false}});

// Ejemplo de evento próximo. Los eventos pasados viven en el archivo de trayectoria (carteles).
const events = [
  { slug:"reunion-mensual-noviembre", title:"Reunión mensual de miembros", summary:"Networking y avances de los proyectos de la comunidad.", description:"Espacio exclusivo para miembros aprobados. Trae tu proyecto y tus preguntas.", starts_at:"2026-11-14T18:30:00-06:00", ends_at:"2026-11-14T21:00:00-06:00", location:"CCJEJ", address:"Guadalajara, Jalisco", is_public:false, published:true },
];
// Los álbumes y sus fotos los publica scripts/photos-import.mjs
const albums = [];
const sponsors = [{ name:"CCJEJ", website:"https://instagram.com/ccjejac", tier:"fundador", sort_order:1 }];

for (const [table, rows, key] of [["events",events,"slug"],["gallery_albums",albums,"slug"],["sponsors",sponsors,null]]) {
  if (rows.length === 0) continue;
  const { error } = key ? await s.from(table).upsert(rows, { onConflict: key, ignoreDuplicates: true }) : await s.from(table).insert(rows);
  console.log(table, error ? "ERROR " + error.message : `ok (${rows.length})`);
}
