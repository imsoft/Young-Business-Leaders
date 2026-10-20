import { openGraphFor } from "@/lib/og/page-metadata";
import type { Metadata } from "next";
import { Mail, MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/site/brand-icons";
import { Section, SectionHeading } from "@/components/site/section";
import { ContactForm } from "@/components/site/contact-form";
import { SponsorsStrip } from "@/components/site/sponsors-strip";
import { CONTACT_EMAIL, INSTAGRAM_URL, WHATSAPP_URL } from "@/lib/constants";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Contacto y patrocinios",
  description:
    "Escríbenos para dar una charla, patrocinar un evento de Young Business Leaders o resolver dudas sobre la comunidad de emprendedores en Jalisco.",
  alternates: { canonical: "/contacto" },
  openGraph: openGraphFor({ path: "/contacto", title: "Contacto y patrocinios · YBL", description: "Escríbenos para dar una charla, patrocinar un evento de Young Business Leaders o resolver dudas sobre la comunidad de emprendedores en Jalisco." }),
};

export default function ContactoPage() {
  return (
    <>
      <Section className="grid gap-12 md:grid-cols-2">
        <div>
          <SectionHeading
            as="h1"
            eyebrow="Contacto"
            title="Hablemos"
            description="¿Quieres dar una charla, patrocinar un evento o tienes dudas sobre la comunidad? Escríbenos."
          />
          <Stagger as="ul" className="space-y-3">
            {WHATSAPP_URL ? (
              <StaggerItem as="li">
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border bg-card p-4 transition hover:border-gold">
                  <MessageCircle className="size-5 text-gold-deep" /> <span className="font-medium">WhatsApp</span>
                </a>
              </StaggerItem>
            ) : null}
            <StaggerItem as="li">
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border bg-card p-4 transition hover:border-gold">
                <InstagramIcon className="size-5 text-gold-deep" /> <span className="font-medium">@ybl.mx</span>
              </a>
            </StaggerItem>
            <StaggerItem as="li">
              <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-3 rounded-2xl border bg-card p-4 transition hover:border-gold">
                <Mail className="size-5 text-gold-deep" /> <span className="font-medium">{CONTACT_EMAIL}</span>
              </a>
            </StaggerItem>
          </Stagger>
        </div>
        <Reveal delay={0.15} className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
          <ContactForm />
        </Reveal>
      </Section>
      <div className="bg-cream">
        <Section className="py-12">
          <SectionHeading align="center" eyebrow="Patrocinadores" title="Quienes hacen posible YBL" description="¿Tu empresa quiere apoyar a jóvenes emprendedores? Escríbenos y te contamos cómo." />
          <Reveal>
            <SponsorsStrip />
          </Reveal>
        </Section>
      </div>
    </>
  );
}
