import { OG_SIZE, OG_TYPE, pageCard } from "@/lib/og/card";

export const alt = "Quiénes somos: Young Business Leaders MX";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return pageCard({ eyebrow: "Nosotros", title: "Jóvenes que conectan un Jalisco más grande" });
}
