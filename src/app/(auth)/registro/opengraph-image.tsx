import { OG_SIZE, OG_TYPE, pageCard } from "@/lib/og/card";

export const alt = "Únete a Young Business Leaders";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return pageCard({ eyebrow: "Únete", title: "Únete a la comunidad de jóvenes emprendedores" });
}
