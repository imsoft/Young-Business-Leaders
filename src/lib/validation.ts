import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : null))
  .pipe(z.url("Debe ser una URL válida").nullable());

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
  company: optionalText(80),
  industry: optionalText(60),
  city: optionalText(60),
  instagram: handleSchema,
  linkedin: optionalUrl,
  website: optionalUrl,
});

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
