// Crea usuarios de prueba (solo desarrollo). Uso: node scripts/seed-test-users.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
const env = Object.fromEntries(readFileSync(".env.local","utf8").split("\n").filter(l=>l.includes("=")).map(l=>{const i=l.indexOf("=");return [l.slice(0,i).trim(), l.slice(i+1).trim()];}));
const s = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {auth:{persistSession:false}});

export const TEST_PASSWORD = "ybl-prueba-2026!";
const users = [
  { email: "admin.prueba@ybl.test", full_name: "Admin de Prueba", status: "approved", is_admin: true, company: "YBL", industry: "Educación", headline: "Coordinación YBL" },
  { email: "miembro.prueba@ybl.test", full_name: "Mariana Prueba", status: "pending", is_admin: false, company: "Café Prueba", industry: "Alimentos y bebidas", headline: "Fundadora de Café Prueba" },
];

for (const u of users) {
  const { data, error } = await s.auth.admin.createUser({ email: u.email, password: TEST_PASSWORD, email_confirm: true, user_metadata: { full_name: u.full_name } });
  let id = data?.user?.id;
  if (error) {
    if (!/already/i.test(error.message)) { console.log(u.email, "ERROR", error.message); continue; }
    const { data: list } = await s.auth.admin.listUsers({ perPage: 200 });
    id = list.users.find((x) => x.email === u.email)?.id;
  }
  const { email, full_name, ...profile } = u;
  const { error: pe } = await s.from("profiles").update({ ...profile, full_name }).eq("id", id);
  console.log(email, pe ? "ERROR " + pe.message : `ok (${profile.status}${profile.is_admin ? ", admin" : ""})`);
}
