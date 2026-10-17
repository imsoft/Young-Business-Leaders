import { afterEach, describe, expect, it, vi } from "vitest";
import { safeNextPath } from "@/lib/safe-redirect";
import { sanitizeSearch } from "@/lib/search";

vi.mock("next/headers", () => ({ headers: async () => new Headers({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" }) }));

describe("safeNextPath", () => {
  it("acepta rutas internas con query y hash", () => {
    expect(safeNextPath("/eventos/taller?x=1#reg")).toBe("/eventos/taller?x=1#reg");
    expect(safeNextPath("/comunidad/perfil")).toBe("/comunidad/perfil");
  });
  it.each(["//evil.com", "/\\evil.com", "\\\\evil.com", "https://evil.com", "javascript:alert(1)", "/%5Cevil.com\\", "", null, 42])(
    "rechaza %s",
    (v) => {
      expect(safeNextPath(v)).toBe("/comunidad");
    },
  );
  it("normaliza recorridos sin salir del dominio", () => {
    expect(safeNextPath("/a/../../evil")).toBe("/evil");
  });
});

describe("sanitizeSearch", () => {
  it("quita la sintaxis de filtros de PostgREST y comodines", () => {
    expect(sanitizeSearch("ana,status.eq.pending)")).toBe("ana status eq pending");
    expect(sanitizeSearch("100%_off")).toBe("100 off");
  });
  it("limita el largo y tolera valores raros", () => {
    expect(sanitizeSearch("x".repeat(200))).toHaveLength(60);
    expect(sanitizeSearch(["a"])).toBe("");
  });
});

describe("verifyTurnstile", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });
  it("sin llave secreta deja pasar (desarrollo)", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    const { verifyTurnstile } = await import("@/lib/turnstile");
    expect(await verifyTurnstile(null)).toBe(true);
  });
  it("con llave exige token y valida con Cloudflare enviando la IP", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secreto");
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ success: true })));
    vi.stubGlobal("fetch", fetchMock);
    const { verifyTurnstile } = await import("@/lib/turnstile");
    expect(await verifyTurnstile(null)).toBe(false);
    expect(await verifyTurnstile("token-ok")).toBe(true);
    const body = (fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body as URLSearchParams;
    expect(body.get("remoteip")).toBe("203.0.113.7");
    expect(body.get("secret")).toBe("secreto");
  });
  it("token rechazado por Cloudflare no pasa", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secreto");
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ success: false }))));
    const { verifyTurnstile } = await import("@/lib/turnstile");
    expect(await verifyTurnstile("token-malo")).toBe(false);
  });
});
