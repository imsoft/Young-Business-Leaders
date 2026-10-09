// Datos de ejemplo. Uso: node scripts/seed.mjs  (lee .env.local)
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
const env = Object.fromEntries(readFileSync(".env.local","utf8").split("\n").filter(l=>l.includes("=")).map(l=>{const i=l.indexOf("=");return [l.slice(0,i).trim(), l.slice(i+1).trim()];}));
const s = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {auth:{persistSession:false}});

const events = [
  { slug:"jalisco-al-grito-2026", title:"Jalisco al Grito 2026", summary:"Tacos, tequila, lucha libre, música y comunidad.", description:"Jóvenes que conectan un Jalisco más grande. Una noche para celebrar lo nuestro y conocer a otros emprendedores.", starts_at:"2026-09-11T20:00:00-06:00", ends_at:"2026-09-12T01:00:00-06:00", location:"Aguamarina 2580A", address:"La Florida, Zapopan", is_public:true, published:true },
  { slug:"finanzas-para-dummies", title:"Finanzas para Dummies", summary:"Taller práctico de finanzas personales y de negocio para emprendedores.", description:"Aprende a leer tus números, separar finanzas personales de las del negocio y proyectar tu flujo. Sin tecnicismos.", starts_at:"2026-10-24T10:00:00-06:00", ends_at:"2026-10-24T13:00:00-06:00", location:"CCJEJ", address:"Guadalajara, Jalisco", is_public:true, published:true, capacity: 40 },
  { slug:"reunion-mensual-noviembre", title:"Reunión mensual de miembros", summary:"Networking y avances de los proyectos de la comunidad.", description:"Espacio exclusivo para miembros aprobados. Trae tu proyecto y tus preguntas.", starts_at:"2026-11-14T18:30:00-06:00", ends_at:"2026-11-14T21:00:00-06:00", location:"CCJEJ", address:"Guadalajara, Jalisco", is_public:false, published:true },
];
const albums = [
  { slug:"talleres", title:"Talleres", description:"Sesiones prácticas con expertos.", event_date:"2026-05-10", sort_order:1, published:true },
  { slug:"conferencia-2", title:"Conf #2 · La receta del triunfo", description:"Segunda conferencia anual.", event_date:"2026-03-15", sort_order:2, published:true },
  { slug:"conferencia-1", title:"Conf #1 · Shots de éxito", description:"Primera conferencia anual.", event_date:"2025-11-20", sort_order:3, published:true },
  { slug:"reuniones", title:"Reuniones", description:"Nuestras reuniones mensuales.", event_date:"2026-06-01", sort_order:4, published:true },
];
const sponsors = [{ name:"CCJEJ", website:"https://instagram.com/ccjejac", tier:"fundador", sort_order:1 }];

for (const [table, rows, key] of [["events",events,"slug"],["gallery_albums",albums,"slug"],["sponsors",sponsors,null]]) {
  const { error } = key ? await s.from(table).upsert(rows, { onConflict: key, ignoreDuplicates: true }) : await s.from(table).insert(rows);
  console.log(table, error ? "ERROR " + error.message : `ok (${rows.length})`);
}
