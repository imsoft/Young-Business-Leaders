// Sube las plantillas de supabase/templates/ a Supabase Auth con la Management API.
// Solo envía asuntos y plantillas; no toca ningún otro ajuste de Auth.
//
// El token necesita el permiso "Project Settings → Read & Write" (project_admin_write), limitado a este proyecto
// y con la expiración más corta. No lo pegues en chats ni lo guardes en el repo; bórralo al terminar.
// Uso:
//   SUPABASE_ACCESS_TOKEN=sbp_xxx node scripts/push-email-templates.mjs [--dry]
import { readFileSync } from "node:fs";

const token = process.env.SUPABASE_ACCESS_TOKEN;
const dry = process.argv.includes("--dry");
const env = Object.fromEntries(readFileSync(".env.local", "utf8").split("\n").filter((l) => l.includes("=") && !l.startsWith("#")).map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
const ref = new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0];
const subjects = JSON.parse(readFileSync("supabase/templates/subjects.json", "utf8"));
const html = (k) => readFileSync(`supabase/templates/${k}.html`, "utf8");

const core = {};
for (const k of ["confirmation", "invite", "magic_link", "email_change", "recovery", "reauthentication"]) {
  core[`mailer_subjects_${k}`] = subjects[k];
  core[`mailer_templates_${k}_content`] = html(k);
}
const notifications = {
  mailer_notifications_password_changed_enabled: true,
  mailer_subjects_password_changed_notification: subjects.password_changed_notification,
  mailer_templates_password_changed_notification_content: html("password_changed_notification"),
  mailer_notifications_email_changed_enabled: true,
  mailer_subjects_email_changed_notification: subjects.email_changed_notification,
  mailer_templates_email_changed_notification_content: html("email_changed_notification"),
};

async function patch(label, body) {
  if (dry) return console.log(`[dry] ${label}: ${Object.keys(body).length} campos`);
  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/config/auth`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  console.log(`${res.ok ? "ok   " : "ERROR"} ${label} (${res.status})${res.ok ? "" : ": " + (await res.text()).slice(0, 300)}`);
  if (res.status === 403) {
    console.log('  → El token necesita "Project Settings → Read & Write". Crea otro o pega las plantillas a mano.');
    process.exit(1);
  }
  return res.ok;
}

if (!dry && !token) throw new Error("Falta SUPABASE_ACCESS_TOKEN");
await patch("plantillas de autenticación", core);
if (!(await patch("avisos de seguridad", notifications)) && !dry) {
  console.log("Pega los dos avisos de seguridad a mano en Authentication → Emails → Security.");
}
