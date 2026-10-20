import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : null))
  // z.url() acepta cualquier esquema (javascript:, data:…): solo permitimos http(s).
  .pipe(z.url({ protocol: /^https?$/, error: "Debe ser un enlace que empiece con https://" }).nullable());

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Máximo ${max} caracteres`)
    .optional()
    .transform((v) => (v ? v : null));

export const handleSchema = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v.replace(/^@/, "") : null))
  .pipe(z.string().regex(/^[\w.-]{1,60}$/, "Usuario inválido").nullable());

export const profileSchema = z.object({
  full_name: z.string().trim().min(2, "Escribe tu nombre").max(80),
  headline: optionalText(100),
  bio: optionalText(600),
  industry: optionalText(60),
  city: optionalText(60),
  instagram: handleSchema,
  linkedin: optionalUrl,
  website: optionalUrl,
});

const emptyToNull = z
  .string()
  .optional()
  .transform((v) => (v ? v : null));

/** Acepta "@usuario", "usuario" o el enlace completo del perfil y deja solo el usuario. */
export function socialHandle(value: unknown, host: string) {
  if (typeof value !== "string") return null;
  let v = value.trim();
  if (!v) return null;
  const re = new RegExp(`^(?:https?://)?(?:www\\.)?${host.replace(".", "\\.")}/@?`, "i");
  v = v.replace(re, "").replace(/^@+/, "").split(/[/?#]/)[0];
  return v || null;
}

/** Acepta "facebook.com/x" o el enlace completo; siempre devuelve https://. */
export function socialUrl(value: unknown) {
  if (typeof value !== "string") return null;
  const v = value.trim();
  if (!v) return null;
  return /^https?:\/\//i.test(v) ? v.replace(/^http:/i, "https:") : `https://${v}`;
}

const handleField = (host: string, max: number) =>
  z
    .string()
    .optional()
    .transform((v) => socialHandle(v, host))
    .pipe(z.string().regex(new RegExp(`^[A-Za-z0-9._]{1,${max}}$`), "Usuario inválido").nullable());

const domainUrlField = (domain: RegExp, label: string) =>
  z
    .string()
    .optional()
    .transform(socialUrl)
    .pipe(
      z
        .string()
        .max(300)
        .refine((u) => { try { return domain.test(new URL(u).hostname); } catch { return false; } }, `Debe ser un enlace de ${label}`)
        .nullable(),
    );

export const ventureSchema = z.object({
  name: z.string().trim().min(1, "Escribe el nombre").max(80),
  tagline: optionalText(140),
  role: emptyToNull.pipe(z.enum(["fundador", "cofundador", "socio", "equipo", "inversionista"]).nullable()),
  stage: emptyToNull.pipe(z.enum(["idea", "validando", "operando", "creciendo"]).nullable()),
  industry: optionalText(60),
  website: optionalUrl,
  contact_phone: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : null))
    .pipe(z.string().regex(/^\+?[0-9 ()-]{7,20}$/, "Escribe solo números, con lada si quieres (ej. 33 1234 5678)").nullable()),
  contact_whatsapp: z
    .string()
    .optional()
    .transform((v) => v === "on" || v === "true"),
  contact_email: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v.trim().toLowerCase() : null))
    .pipe(z.email("Correo inválido").max(254).nullable()),
  instagram: handleField("instagram.com", 30),
  tiktok: handleField("tiktok.com", 24),
  facebook: domainUrlField(/(^|\.)(facebook|fb)\.com$/i, "Facebook"),
  linkedin: domainUrlField(/(^|\.)linkedin\.com$/i, "LinkedIn"),
});

/** Enlace de WhatsApp a partir del teléfono; a números de 10 dígitos les agrega la lada de México. */
export function whatsappLink(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits.length === 10 ? `52${digits}` : digits}`;
}

export const registerSchema = z
  .object({
    full_name: z.string().trim().min(2, "Escribe tu nombre").max(80),
    email: z.email("Correo inválido"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Las contraseñas no coinciden",
    path: ["confirm"],
  });

export const resetRequestSchema = z.object({ email: z.email("Correo inválido") });

export const newPasswordSchema = z
  .object({ password: z.string().min(8, "Mínimo 8 caracteres").max(72, "Máximo 72 caracteres"), confirm: z.string() })
  .refine((d) => d.password === d.confirm, { message: "Las contraseñas no coinciden", path: ["confirm"] });

export const loginSchema = z.object({
  email: z.email("Correo inválido"),
  password: z.string().min(1, "Escribe tu contraseña"),
});

export const guestRegistrationSchema = z.object({
  event_id: z.uuid(),
  guest_name: z.string().trim().min(2, "Escribe tu nombre").max(80),
  guest_email: z.email("Correo inválido"),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Escribe tu nombre").max(80),
  email: z.email("Correo inválido"),
  message: z.string().trim().min(10, "Cuéntanos un poco más").max(2000),
  // honeypot anti-spam: debe venir vacío
  company: z.string().max(0).optional(),
});

export const eventSchema = z
  .object({
    title: z.string().trim().min(3, "Título muy corto").max(120),
    slug: z.string().trim().regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
    summary: optionalText(200),
    description: optionalText(5000),
    starts_at: z.string().min(1, "Falta la fecha de inicio"),
    ends_at: z.string().optional().transform((v) => (v ? v : null)),
    location: optionalText(120),
    address: optionalText(200),
    capacity: z
      .string()
      .optional()
      .transform((v) => (v ? Number(v) : null))
      .pipe(z.number().int().positive().nullable()),
    is_public: z.boolean(),
    published: z.boolean(),
  })
  .refine((d) => !d.ends_at || d.ends_at > d.starts_at, {
    message: "El fin debe ser después del inicio",
    path: ["ends_at"],
  });

export const albumSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z.string().trim().regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  description: optionalText(500),
  event_date: z.string().optional().transform((v) => (v ? v : null)),
  sort_order: z.coerce.number().int().default(0),
  published: z.boolean(),
});

export const sponsorSchema = z.object({
  name: z.string().trim().min(2).max(80),
  website: optionalUrl,
  tier: z.enum(["fundador", "patrocinador", "aliado"]),
  sort_order: z.coerce.number().int().default(0),
  active: z.boolean(),
});

export type FieldErrors = Record<string, string | undefined>;

/** Convierte el error de zod a { campo: mensaje } para los formularios. */
export function fieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "_");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export function formBool(v: FormDataEntryValue | null) {
  return v === "on" || v === "true" || v === "1";
}
