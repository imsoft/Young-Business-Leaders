import "server-only";

export type OutgoingEmail = { to: string; subject: string; html: string; text: string };

/**
 * Envía un correo por la API de Resend. Sin RESEND_API_KEY (desarrollo) no envía nada.
 * Nunca lanza: un correo fallido no debe romper el registro o la aprobación.
 */
export async function sendEmail(email: OutgoingEmail): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info(`[email] RESEND_API_KEY no configurada; se omite "${email.subject}"`);
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? "Young Business Leaders <no-reply@yblmx.org>",
        reply_to: "hola@yblmx.org",
        to: [email.to],
        subject: email.subject,
        html: email.html,
        text: email.text,
      }),
    });
    if (!res.ok) console.error(`[email] Resend respondió ${res.status} para "${email.subject}"`);
    return res.ok;
  } catch (error) {
    console.error("[email] error al enviar", error);
    return false;
  }
}
