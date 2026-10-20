import { describe, expect, it } from "vitest";
import {
  contactSchema,
  eventSchema,
  fieldErrors,
  formBool,
  guestRegistrationSchema,
  profileSchema,
  registerSchema,
} from "@/lib/validation";

describe("profileSchema", () => {
  it("normaliza campos vacíos a null y quita la @ de instagram", () => {
    const r = profileSchema.parse({ full_name: "Ana López", instagram: "@ana.lopez", linkedin: "", website: "" });
    expect(r.instagram).toBe("ana.lopez");
    expect(r.linkedin).toBeNull();
    expect(r.website).toBeNull();
    expect(r.bio).toBeNull();
  });

  it("rechaza URLs inválidas", () => {
    const r = profileSchema.safeParse({ full_name: "Ana", website: "no-es-url" });
    expect(r.success).toBe(false);
    if (!r.success) expect(fieldErrors(r.error).website).toBeDefined();
  });
});

describe("registerSchema", () => {
  it("exige que las contraseñas coincidan", () => {
    const r = registerSchema.safeParse({ full_name: "Ana", email: "a@b.mx", password: "12345678", confirm: "87654321" });
    expect(r.success).toBe(false);
    if (!r.success) expect(fieldErrors(r.error).confirm).toMatch(/no coinciden/);
  });
});

describe("eventSchema", () => {
  const base = { title: "Taller", slug: "taller", starts_at: "2026-10-24T10:00", is_public: true, published: false };
  it("acepta un evento mínimo y convierte cupo vacío a null", () => {
    const r = eventSchema.parse({ ...base, capacity: "" });
    expect(r.capacity).toBeNull();
    expect(r.ends_at).toBeNull();
  });
  it("rechaza fin antes del inicio", () => {
    const r = eventSchema.safeParse({ ...base, ends_at: "2026-10-24T09:00" });
    expect(r.success).toBe(false);
  });
  it("rechaza slugs con mayúsculas o espacios", () => {
    expect(eventSchema.safeParse({ ...base, slug: "Mi Evento" }).success).toBe(false);
  });
});

describe("guestRegistrationSchema / contactSchema", () => {
  it("valida uuid y correo", () => {
    expect(guestRegistrationSchema.safeParse({ event_id: "x", guest_name: "Ana", guest_email: "a@b.mx" }).success).toBe(false);
    expect(
      guestRegistrationSchema.safeParse({ event_id: "0b4a3f58-2e2c-4e66-9a1e-0d2f6a1c8f11", guest_name: "Ana", guest_email: "a@b.mx" }).success,
    ).toBe(true);
  });
  it("el honeypot lleno invalida el contacto", () => {
    expect(contactSchema.safeParse({ name: "Ana", email: "a@b.mx", message: "Hola, quiero más información", company: "spam" }).success).toBe(false);
  });
});

describe("formBool", () => {
  it("interpreta on/true/1", () => {
    expect(formBool("on")).toBe(true);
    expect(formBool("true")).toBe(true);
    expect(formBool(null)).toBe(false);
    expect(formBool("off")).toBe(false);
  });
});

import { ventureSchema } from "@/lib/validation";

describe("ventureSchema", () => {
  it("acepta un emprendimiento mínimo y convierte vacíos a null", () => {
    const v = ventureSchema.parse({ name: "Café Origen", tagline: "", role: "", stage: "", industry: "", website: "" });
    expect(v).toEqual({ name: "Café Origen", tagline: null, role: null, stage: null, industry: null, website: null });
  });
  it("valida rol, etapa y URL", () => {
    expect(ventureSchema.safeParse({ name: "X", role: "ceo" }).success).toBe(false);
    expect(ventureSchema.safeParse({ name: "X", stage: "unicornio" }).success).toBe(false);
    expect(ventureSchema.safeParse({ name: "X", website: "javascript:alert(1)" }).success).toBe(false);
    expect(ventureSchema.safeParse({ name: "X", role: "cofundador", stage: "operando", website: "https://cafeorigen.mx" }).success).toBe(true);
  });
  it("exige nombre", () => {
    expect(ventureSchema.safeParse({ name: "   " }).success).toBe(false);
  });
});

describe("URLs de perfil", () => {
  it.each(["javascript:alert(1)", "data:text/html,<b>x</b>", "ftp://x.com", "vbscript:msgbox(1)"])("rechaza %s", (url) => {
    expect(profileSchema.safeParse({ full_name: "Ana", website: url }).success).toBe(false);
    expect(profileSchema.safeParse({ full_name: "Ana", linkedin: url }).success).toBe(false);
  });
  it("acepta http y https", () => {
    expect(profileSchema.safeParse({ full_name: "Ana", website: "https://ana.mx", linkedin: "http://linkedin.com/in/ana" }).success).toBe(true);
  });
});

import { isPlatformDeveloper } from "@/components/community/developer-badge";

describe("badge de desarrollador", () => {
  it("solo aplica al perfil del desarrollador", () => {
    expect(isPlatformDeveloper("d5567511-2179-474e-8937-666402ae131b")).toBe(true);
    expect(isPlatformDeveloper("00000000-0000-0000-0000-000000000000")).toBe(false);
  });
});
