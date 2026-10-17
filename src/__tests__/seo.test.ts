import { describe, expect, it } from "vitest";
import { eventJsonLd, organizationJsonLd } from "@/lib/seo";
import type { Event } from "@/lib/types";

const base: Event = {
  id: "1", slug: "taller", title: "Taller </script><script>alert(1)</script>", summary: "Resumen", description: null,
  starts_at: "2026-11-14T18:30:00-06:00", ends_at: null, location: "MIND", address: null, cover_url: null,
  capacity: null, is_public: true, published: true, created_by: null, created_at: "", updated_at: "",
};

describe("datos estructurados", () => {
  it("evento público trae oferta gratuita, lugar y URL absoluta", () => {
    const ld = eventJsonLd(base) as unknown as { "@type": string; url: string; offers: unknown; location: unknown; image: string[] };
    expect(ld["@type"]).toBe("Event");
    expect(ld.url).toMatch(/^https?:\/\/[^/]+\/eventos\/taller$/);
    expect(ld.offers).toMatchObject({ price: 0, priceCurrency: "MXN" });
    expect(ld.location).toMatchObject({ "@type": "Place", name: "MIND" });
    expect(ld.image[0]).toMatch(/\/opengraph-image$/);
  });
  it("evento solo para miembros no anuncia oferta", () => {
    expect((eventJsonLd({ ...base, is_public: false }) as Record<string, unknown>).offers).toBeUndefined();
  });
  it("organización usa logo PNG absoluto", () => {
    expect(organizationJsonLd().logo).toMatch(/^https?:\/\/.+\/brand\/ybl-logo-512\.png$/);
  });
});
