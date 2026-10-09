export const SITE_NAME = "Young Business Leaders MX";
export const SITE_SHORT = "YBL";
export const SITE_TAGLINE = "Emprendiendo hacia el éxito empresarial";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const INSTAGRAM_URL = "https://instagram.com/ybl.mx";
export const WHATSAPP_URL = "https://wa.me/523300000000"; // TODO: número real de YBL
export const CONTACT_EMAIL = "hola@ybl.mx"; // TODO: correo real de YBL

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
