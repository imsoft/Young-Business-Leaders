export const SITE_NAME = "Young Business Leaders MX";
export const SITE_SHORT = "YBL";
export const SITE_TAGLINE = "Emprendiendo hacia el éxito empresarial";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yblmx.org";
export const INSTAGRAM_URL = "https://instagram.com/ybl.mx";
/** WhatsApp de YBL en formato https://wa.me/52XXXXXXXXXX. Vacío = el botón no se muestra. */
export const WHATSAPP_URL: string | null = null;
export const CONTACT_EMAIL = "hola@yblmx.org"; // Reenvío configurado en Cloudflare Email Routing

export const INDUSTRIES = [
  "Tecnología",
  "Finanzas",
  "Marketing",
  "Retail y e-commerce",
  "Alimentos y bebidas",
  "Salud",
  "Educación",
  "Inmobiliario",
  "Manufactura",
  "Servicios profesionales",
  "Entretenimiento",
  "Otro",
] as const;

export const SPONSOR_TIERS = ["fundador", "patrocinador", "aliado"] as const;

/** Datos del responsable para el aviso de privacidad y los términos. */
export const LEGAL = {
  name: "Young Business Leaders MX",
  short: "YBL",
  location: "Guadalajara, Jalisco, México",
  email: CONTACT_EMAIL,
  updated: "17 de octubre de 2026",
} as const;
