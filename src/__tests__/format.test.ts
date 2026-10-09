import { describe, expect, it } from "vitest";
import { dateChip, formatEventDate, formatEventTime, initials, isoToLocalDateTime, localDateTimeToIso } from "@/lib/format";
import { slugify } from "@/lib/slug";

describe("formato de fechas en hora de Guadalajara", () => {
  const iso = "2026-09-12T02:00:00.000Z"; // 11 sep 20:00 en MX (UTC-6)
  it("muestra la fecha local", () => {
    expect(formatEventDate(iso)).toMatch(/viernes, 11 de septiembre/);
    expect(formatEventTime(iso)).toMatch(/8:00/);
  });
  it("genera el chip de fecha", () => {
    expect(dateChip(iso)).toEqual({ day: "11", month: "sep" });
  });
  it("convierte ida y vuelta con datetime-local", () => {
    expect(localDateTimeToIso("2026-09-11T20:00")).toBe("2026-09-11T20:00:00-06:00");
    expect(localDateTimeToIso("")).toBeNull();
    expect(isoToLocalDateTime(iso)).toBe("2026-09-11T20:00");
    expect(isoToLocalDateTime(null)).toBe("");
  });
});

describe("initials", () => {
  it("toma hasta dos iniciales", () => {
    expect(initials("Brandon Uriel García")).toBe("BU");
    expect(initials("ana")).toBe("A");
    expect(initials("")).toBe("");
  });
});

describe("slugify", () => {
  it("quita acentos y símbolos", () => {
    expect(slugify("Jalisco al Grito 2026 ¡Ya!")).toBe("jalisco-al-grito-2026-ya");
    expect(slugify("  Conf #2: La receta del triunfo ")).toBe("conf-2-la-receta-del-triunfo");
  });
});
