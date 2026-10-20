import { afterEach, describe, expect, it, vi } from "vitest";
import { eventRegistrationEmail, googleCalendarUrl, memberApprovedEmail } from "@/lib/email/messages";
import { esc } from "@/lib/email/layout.mjs";
import { newPasswordSchema } from "@/lib/validation";
import type { Event } from "@/lib/types";

const event: Event = {
  id: "1", slug: "taller-ventas", title: "Taller <b>Ventas</b>", summary: "Aprende a vender", description: null,
  starts_at: "2026-11-20T18:00:00-06:00", ends_at: "2026-11-20T20:00:00-06:00", location: "MIND", address: "Av. Faro 2350",
  cover_url: null, capacity: null, is_public: true, published: true, created_by: null, created_at: "", updated_at: "",
};

describe("correos de la app", () => {
  it("escapa el nombre y el título que vienen de usuarios", () => {
    const m = eventRegistrationEmail(event, `Ana <img src=x onerror=alert(1)>`, "ana@correo.com");
    expect(m.html).not.toContain("<img src=x");
    expect(m.html).toContain("Ana &lt;img src=x onerror=alert(1)&gt;");
    expect(m.html).toContain("Taller &lt;b&gt;Ventas&lt;/b&gt;");
    expect(m.subject).toBe("Registro confirmado: Taller <b>Ventas</b>");
    expect(m.text).toContain("Viernes, 20 de noviembre");
  });
  it("arma el enlace de Google Calendar en UTC", () => {
    const u = new URL(googleCalendarUrl(event));
    expect(u.searchParams.get("dates")).toBe("20261121T000000Z/20261121T020000Z");
    expect(u.searchParams.get("location")).toBe("MIND, Av. Faro 2350");
    expect(u.searchParams.get("details")).toContain("/eventos/taller-ventas");
  });
  it("sin hora de fin asume 2 horas", () => {
    const u = new URL(googleCalendarUrl({ ...event, ends_at: null }));
    expect(u.searchParams.get("dates")).toBe("20261121T000000Z/20261121T020000Z");
  });
  it("el correo de aprobación lleva a la comunidad", () => {
    const m = memberApprovedEmail(null, "x@correo.com");
    expect(m.html).toContain("/comunidad");
    expect(m.html).toContain("Hola,");
    expect(m.to).toBe("x@correo.com");
  });
  it("esc cubre comillas", () => {
    expect(esc(`"a" & 'b'`)).toBe("&quot;a&quot; &amp; &#39;b&#39;");
  });
});

describe("sendEmail", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });
  it("sin RESEND_API_KEY no llama a la API", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const f = vi.fn();
    vi.stubGlobal("fetch", f);
    vi.spyOn(console, "info").mockImplementation(() => {});
    const { sendEmail } = await import("@/lib/email/send");
    expect(await sendEmail({ to: "a@b.mx", subject: "s", html: "h", text: "t" })).toBe(false);
    expect(f).not.toHaveBeenCalled();
  });
  it("con llave manda remitente, respuesta y versión de texto", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    const f = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", f);
    const { sendEmail } = await import("@/lib/email/send");
    expect(await sendEmail({ to: "a@b.mx", subject: "s", html: "h", text: "t" })).toBe(true);
    const body = JSON.parse(((f.mock.calls[0] as unknown as [string, RequestInit])[1].body) as string);
    expect(body).toMatchObject({ from: "Young Business Leaders <no-reply@yblmx.org>", reply_to: "hola@yblmx.org", to: ["a@b.mx"], text: "t" });
  });
  it("un error de red no lanza", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("offline"); }));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { sendEmail } = await import("@/lib/email/send");
    expect(await sendEmail({ to: "a@b.mx", subject: "s", html: "h", text: "t" })).toBe(false);
  });
});

describe("nueva contraseña", () => {
  it("exige 8 caracteres y que coincidan", () => {
    expect(newPasswordSchema.safeParse({ password: "corta", confirm: "corta" }).success).toBe(false);
    expect(newPasswordSchema.safeParse({ password: "larga-y-segura", confirm: "otra-distinta" }).success).toBe(false);
    expect(newPasswordSchema.safeParse({ password: "larga-y-segura", confirm: "larga-y-segura" }).success).toBe(true);
  });
});
