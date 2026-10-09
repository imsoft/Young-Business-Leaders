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
