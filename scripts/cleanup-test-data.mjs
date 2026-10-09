// Borra las cuentas y registros de prueba. Uso: node scripts/cleanup-test-data.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
const env = Object.fromEntries(readFileSync(".env.local","utf8").split("\n").filter(l=>l.includes("=")).map(l=>{const i=l.indexOf("=");return [l.slice(0,i).trim(), l.slice(i+1).trim()];}));
const s = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {auth:{persistSession:false}});

// Usuarios de prueba: borrar el usuario de auth elimina en cascada perfil, registros y avatar
const { data: list } = await s.auth.admin.listUsers({ perPage: 200 });
for (const u of list.users.filter((x) => x.email?.endsWith("@ybl.test"))) {
  const { data: files } = await s.storage.from("avatars").list(u.id);
  if (files?.length) await s.storage.from("avatars").remove(files.map((f) => `${u.id}/${f.name}`));
  const { error } = await s.auth.admin.deleteUser(u.id);
  console.log("usuario", u.email, error ? "ERROR " + error.message : "borrado");
}

// Registros de invitados y mensajes de contacto con correos de prueba
const reg = await s.from("event_registrations").delete().ilike("guest_email", "%@ybl.test").select("id");
console.log("registros de invitado borrados:", reg.data?.length ?? 0);
const msg = await s.from("contact_messages").delete().ilike("email", "%@ybl.test").select("id");
console.log("mensajes de contacto borrados:", msg.data?.length ?? 0);
