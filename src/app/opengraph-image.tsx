import { OG_SIZE, OG_TYPE, pageCard } from "@/lib/og/card";

export const alt = "Young Business Leaders MX: comunidad de jóvenes emprendedores en Jalisco";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return pageCard({ eyebrow: "Jóvenes emprendedores · Jalisco", title: "Emprendiendo hacia el éxito empresarial", subtitle: "Conferencias, talleres, networking y visitas a empresas" });
}
