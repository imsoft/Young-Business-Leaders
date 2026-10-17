// Genera las plantillas de correo de Supabase Auth con la marca YBL.
// Uso: node scripts/build-email-templates.mjs  → supabase/templates/*.html + subjects.json
// Variables de Supabase (Go templates): {{ .SiteURL }}, {{ .TokenHash }}, {{ .Token }}, {{ .Email }}, {{ .NewEmail }}, {{ .Data.full_name }}
import { mkdirSync, writeFileSync } from "node:fs";

const C = { gold: "#E9A23B", goldDeep: "#C9801F", ink: "#1A1714", text: "#4A443C", muted: "#8A8276", cream: "#FBF5EA", line: "#EFE6D6" };
const FONT = "'Plus Jakarta Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const SITE = "{{ .SiteURL }}";
const LOGO = "https://yblmx.org/brand/ybl-logo-512.png";
const HELLO = `Hola{{ if .Data.full_name }} {{ .Data.full_name }}{{ end }},`;

const confirmUrl = (type, next) => `${SITE}/auth/confirm?token_hash={{ .TokenHash }}&type=${type}&next=${next}`;

function button(href, label) {
  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 8px">
  <tr><td style="border-radius:12px;background:${C.gold}">
    <a href="${href}" target="_blank" style="display:inline-block;padding:14px 28px;font-family:${FONT};font-size:16px;font-weight:700;color:${C.ink};text-decoration:none;border-radius:12px">${label}</a>
  </td></tr>
</table>
<p style="margin:16px 0 0;font-family:${FONT};font-size:12px;line-height:18px;color:${C.muted}">Si el botón no funciona, copia este enlace en tu navegador:<br><a href="${href}" style="color:${C.goldDeep};word-break:break-all">${href}</a></p>`;
}

function code(token) {
  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 8px">
  <tr><td style="padding:16px 28px;border-radius:12px;background:${C.cream};border:1px solid ${C.line};font-family:'SFMono-Regular',Menlo,Consolas,monospace;font-size:28px;font-weight:700;letter-spacing:8px;color:${C.ink}">${token}</td></tr>
</table>`;
}

const p = (html) => `<p style="margin:0 0 14px;font-family:${FONT};font-size:16px;line-height:26px;color:${C.text}">${html}</p>`;

function layout({ preheader, title, body, footnote }) {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light">
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:${C.cream};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${preheader}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.cream}">
  <tr><td align="center" style="padding:32px 16px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px">
      <tr><td style="background:${C.gold};border-radius:20px 20px 0 0;padding:28px 32px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="vertical-align:middle"><img src="${LOGO}" width="44" height="44" alt="YBL" style="display:block;border-radius:22px;border:0"></td>
          <td style="vertical-align:middle;padding-left:12px;font-family:${FONT};line-height:16px">
            <div style="font-size:14px;font-weight:800;letter-spacing:1px;color:${C.ink}">YOUNG BUSINESS LEADERS</div>
            <div style="font-size:10px;font-weight:700;letter-spacing:2px;color:${C.ink};opacity:.7">JÓVENES EMPRENDEDORES · JALISCO</div>
          </td>
        </tr></table>
      </td></tr>
      <tr><td style="background:#ffffff;padding:36px 32px 32px;border-radius:0 0 20px 20px">
        <h1 style="margin:0 0 18px;font-family:${FONT};font-size:26px;line-height:32px;font-weight:800;color:${C.ink}">${title}</h1>
        ${body}
        ${footnote ? `<p style="margin:28px 0 0;padding-top:20px;border-top:1px solid ${C.line};font-family:${FONT};font-size:13px;line-height:20px;color:${C.muted}">${footnote}</p>` : ""}
      </td></tr>
      <tr><td align="center" style="padding:24px 16px 0;font-family:${FONT};font-size:12px;line-height:18px;color:${C.muted}">
        <a href="${SITE}" style="color:${C.ink};font-weight:700;text-decoration:none">yblmx.org</a> · Guadalajara, Jalisco<br>
        <a href="${SITE}/aviso-de-privacidad" style="color:${C.muted}">Aviso de privacidad</a> · ¿Dudas? <a href="mailto:hola@yblmx.org" style="color:${C.muted}">hola@yblmx.org</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>
`;
}

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
      body: p(HELLO) + p("Recibimos una solicitud para recuperar el acceso a tu cuenta de Young Business Leaders. Usa este botón para entrar.") + button(confirmUrl("recovery", "/comunidad/perfil"), "Entrar a mi cuenta"),
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
