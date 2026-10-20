// Diseño de correo de YBL compartido por las plantillas de Supabase (scripts/build-email-templates.mjs)
// y los correos que manda la app (src/lib/email/messages.ts). HTML de tablas con estilos en línea.

export const C = { gold: "#F7A500", goldDeep: "#D98C00", ink: "#1A1714", text: "#4A443C", muted: "#8A8276", cream: "#FBF5EA", line: "#EFE6D6" };
const FONT = "'Plus Jakarta Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const LOGO = "https://yblmx.org/brand/ybl-logo-horizontal.png";

/** Escapa texto que viene de usuarios antes de meterlo al HTML. */
export function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

/** @param {string} href @param {string} label */
export function button(href, label) {
  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 8px">
  <tr><td style="border-radius:12px;background:${C.gold}">
    <a href="${href}" target="_blank" style="display:inline-block;padding:14px 28px;font-family:${FONT};font-size:16px;font-weight:700;color:${C.ink};text-decoration:none;border-radius:12px">${label}</a>
  </td></tr>
</table>
<p style="margin:16px 0 0;font-family:${FONT};font-size:12px;line-height:18px;color:${C.muted}">Si el botón no funciona, copia este enlace en tu navegador:<br><a href="${href}" style="color:${C.goldDeep};word-break:break-all">${href}</a></p>`;
}

/** @param {string} token */
export function code(token) {
  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 8px">
  <tr><td style="padding:16px 28px;border-radius:12px;background:${C.cream};border:1px solid ${C.line};font-family:'SFMono-Regular',Menlo,Consolas,monospace;font-size:28px;font-weight:700;letter-spacing:8px;color:${C.ink}">${token}</td></tr>
</table>`;
}

/** @param {string} html */
export const p = (html) => `<p style="margin:0 0 14px;font-family:${FONT};font-size:16px;line-height:26px;color:${C.text}">${html}</p>`;

/** Bloque de datos (fecha, lugar…) como lista de etiqueta/valor. @param {[string, string][]} rows */
export function details(rows) {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 4px;border-radius:14px;background:${C.cream};border:1px solid ${C.line}">
  ${rows
    .map(
      ([k, v]) => `<tr><td style="padding:12px 18px 0;font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${C.muted}">${k}</td></tr>
  <tr><td style="padding:2px 18px 12px;font-family:${FONT};font-size:16px;font-weight:700;color:${C.ink}">${v}</td></tr>`,
    )
    .join("")}
</table>`;
}

/**
 * @param {{ preheader: string, title: string, body: string, footnote?: string, siteUrl: string }} opts
 */
export function layout({ preheader, title, body, footnote, siteUrl }) {
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
      <tr><td style="background:#ffffff;border-radius:20px 20px 0 0;padding:28px 32px 24px;border-bottom:6px solid ${C.gold}">
        <img src="${LOGO}" width="238" height="32" alt="Young Business Leaders by CCJEJ" style="display:block;border:0;height:32px;width:238px">
      </td></tr>
      <tr><td style="background:#ffffff;padding:32px 32px 32px;border-radius:0 0 20px 20px">
        <h1 style="margin:0 0 18px;font-family:${FONT};font-size:26px;line-height:32px;font-weight:800;color:${C.ink}">${title}</h1>
        ${body}
        ${footnote ? `<p style="margin:28px 0 0;padding-top:20px;border-top:1px solid ${C.line};font-family:${FONT};font-size:13px;line-height:20px;color:${C.muted}">${footnote}</p>` : ""}
      </td></tr>
      <tr><td align="center" style="padding:24px 16px 0;font-family:${FONT};font-size:12px;line-height:18px;color:${C.muted}">
        <a href="${siteUrl}" style="color:${C.ink};font-weight:700;text-decoration:none">yblmx.org</a> · Guadalajara, Jalisco<br>
        <a href="${siteUrl}/aviso-de-privacidad" style="color:${C.muted}">Aviso de privacidad</a> · ¿Dudas? <a href="mailto:hola@yblmx.org" style="color:${C.muted}">hola@yblmx.org</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>
`;
}
