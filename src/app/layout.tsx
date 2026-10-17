import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Jóvenes emprendedores en Jalisco`,
    template: `%s · YBL`,
  },
  description: `${SITE_TAGLINE}. Comunidad de jóvenes emprendedores en Guadalajara y Jalisco: conferencias, talleres, networking y visitas a empresas.`,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: SITE_NAME,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-MX" data-scroll-behavior="smooth" className={`${jakarta.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
