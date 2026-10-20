// Genera las plantillas de correo de Supabase Auth con la marca YBL.
// Uso: node scripts/build-email-templates.mjs  → supabase/templates/*.html + subjects.json
// Variables de Supabase (Go templates): {{ .SiteURL }}, {{ .TokenHash }}, {{ .Token }}, {{ .Email }}, {{ .NewEmail }}, {{ .Data.full_name }}
import { mkdirSync, writeFileSync } from "node:fs";

import { button, code, layout as baseLayout, p } from "../src/lib/email/layout.mjs";

const SITE = "{{ .SiteURL }}";
const HELLO = `Hola{{ if .Data.full_name }} {{ .Data.full_name }}{{ end }},`;
const layout = (opts) => baseLayout({ ...opts, siteUrl: SITE });

const confirmUrl = (type, next) => `${SITE}/auth/confirm?token_hash={{ .TokenHash }}&type=${type}&next=${next}`;

const NOT_YOU = "Si no fuiste tú, puedes ignorar este correo; nadie podrá usar tu cuenta sin este enlace.";

const templates = {
  confirmation: {
    subject: "Confirma tu correo · Young Business Leaders",
    html: layout({
      preheader: "Un clic para activar tu cuenta en YBL.",
      title: "Confirma tu correo",
      body:
        p(HELLO) +
        p("Gracias por unirte a <strong>Young Business Leaders</strong>. Confirma tu correo para activar tu cuenta y completar tu perfil.") +
        button(confirmUrl("email", "/comunidad/perfil?welcome=1"), "Confirmar mi correo") +
        p(`<br>Después, el equipo de YBL revisará tu solicitud para darte acceso al directorio de miembros.`),
      footnote: "Si no creaste una cuenta en yblmx.org, ignora este correo.",
    }),
  },
  invite: {
    subject: "Te invitaron a Young Business Leaders",
    html: layout({
      preheader: "Tu lugar en la comunidad de jóvenes emprendedores de Jalisco.",
      title: "Te invitaron a la comunidad",
      body:
        p("Hola,") +
        p("El equipo de <strong>Young Business Leaders</strong> te invitó a unirte a la comunidad de jóvenes emprendedores de Jalisco: directorio de miembros, eventos exclusivos y conferencias.") +
        button(confirmUrl("invite", "/comunidad/perfil?welcome=1"), "Aceptar invitación"),
      footnote: "Si no esperabas esta invitación, ignora este correo.",
    }),
  },
  magic_link: {
    subject: "Tu enlace para entrar a YBL",
    html: layout({
      preheader: "Entra a tu cuenta con un clic.",
      title: "Entra a tu cuenta",
      body: p(HELLO) + p("Usa este botón para entrar a tu cuenta de Young Business Leaders.") + button(confirmUrl("email", "/comunidad"), "Entrar a YBL") + p("<br>O escribe este código si te lo piden:") + code("{{ .Token }}"),
      footnote: `El enlace y el código vencen pronto y solo funcionan una vez. ${NOT_YOU}`,
    }),
  },
  email_change: {
    subject: "Confirma tu nuevo correo · YBL",
    html: layout({
      preheader: "Confirma el cambio de correo de tu cuenta.",
      title: "Confirma tu nuevo correo",
      body:
        p(HELLO) +
        p("Pediste cambiar el correo de tu cuenta de <strong>{{ .Email }}</strong> a <strong>{{ .NewEmail }}</strong>. Confirma el cambio con este botón.") +
        button(confirmUrl("email_change", "/comunidad/perfil"), "Confirmar cambio"),
      footnote: "Si no pediste este cambio, ignora este correo y escríbenos a hola@yblmx.org.",
    }),
  },
  recovery: {
    subject: "Recupera el acceso a tu cuenta · YBL",
    html: layout({
      preheader: "Tu enlace para volver a entrar a YBL.",
      title: "Recupera el acceso",
      body: p(HELLO) + p("Recibimos una solicitud para recuperar el acceso a tu cuenta de Young Business Leaders. Usa este botón para elegir una contraseña nueva.") + button(confirmUrl("recovery", "/actualizar-contrasena"), "Elegir contraseña nueva"),
      footnote: `El enlace vence pronto y solo funciona una vez. ${NOT_YOU}`,
    }),
  },
  reauthentication: {
    subject: "Tu código de verificación · YBL",
    html: layout({
      preheader: "Usa este código para confirmar que eres tú.",
      title: "Confirma que eres tú",
      body: p(HELLO) + p("Escribe este código para continuar con la acción que estabas haciendo en tu cuenta:") + code("{{ .Token }}"),
      footnote: "El código vence pronto. Si no lo pediste, alguien podría estar intentando entrar a tu cuenta: cambia tu contraseña y escríbenos a hola@yblmx.org.",
    }),
  },
  password_changed_notification: {
    subject: "Tu contraseña cambió · YBL",
    html: layout({
      preheader: "Aviso de seguridad de tu cuenta.",
      title: "Tu contraseña cambió",
      body: p(HELLO) + p("Te avisamos que la contraseña de tu cuenta de Young Business Leaders (<strong>{{ .Email }}</strong>) acaba de cambiar."),
      footnote: "Si no fuiste tú, escríbenos de inmediato a hola@yblmx.org para proteger tu cuenta.",
    }),
  },
  email_changed_notification: {
    subject: "El correo de tu cuenta cambió · YBL",
    html: layout({
      preheader: "Aviso de seguridad de tu cuenta.",
      title: "El correo de tu cuenta cambió",
      body: p(HELLO) + p("Te avisamos que el correo de acceso de tu cuenta de Young Business Leaders cambió. A partir de ahora entrarás con <strong>{{ .Email }}</strong>."),
      footnote: "Si no fuiste tú, escríbenos de inmediato a hola@yblmx.org para proteger tu cuenta.",
    }),
  },
};

mkdirSync("supabase/templates", { recursive: true });
const subjects = {};
for (const [key, t] of Object.entries(templates)) {
  writeFileSync(`supabase/templates/${key}.html`, t.html);
  subjects[key] = t.subject;
}
writeFileSync("supabase/templates/subjects.json", JSON.stringify(subjects, null, 2) + "\n");
console.log(`${Object.keys(templates).length} plantillas en supabase/templates/`);
