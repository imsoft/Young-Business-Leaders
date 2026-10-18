import { OG_SIZE, OG_TYPE, pageCard } from "@/lib/og/card";

export const alt = "Eventos de Young Business Leaders en Guadalajara";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return pageCard({ eyebrow: "Agenda", title: "Eventos para emprendedores en Guadalajara", subtitle: "Conferencias, talleres, networking y visitas a empresas" });
}
