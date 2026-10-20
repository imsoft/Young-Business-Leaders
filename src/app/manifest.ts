import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "YBL",
    description: `${SITE_TAGLINE}. Comunidad de jóvenes emprendedores en Jalisco.`,
    lang: "es-MX",
    start_url: "/",
    display: "standalone",
    background_color: "#fffdf8",
    theme_color: "#f7a500",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/ybl-logo-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
