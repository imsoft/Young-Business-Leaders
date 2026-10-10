import { describe, expect, it } from "vitest";
import { dimsFromUrl, marqueePhotos, posterLabel, posters, siteMedia, trajectoryStats, type Poster } from "@/lib/media";

describe("dimsFromUrl", () => {
  it("lee las dimensiones del nombre del archivo", () => {
    expect(dimsFromUrl("https://x.supabase.co/storage/v1/object/public/media/albums/a/01-ab12cd34-2000x1333.webp")).toEqual({ width: 2000, height: 1333 });
    expect(dimsFromUrl("https://x/media/events/1791-abc123-1600x900.webp?v=2")).toEqual({ width: 1600, height: 900 });
  });
  it("devuelve null si el nombre no las trae", () => {
    expect(dimsFromUrl("https://x/media/albums/a/foto.jpg")).toBeNull();
    expect(dimsFromUrl("https://x/media/albums/2026-10x12/foto.webp")).toBeNull();
  });
});

describe("trayectoria", () => {
  const p = (type: Poster["type"], number: number | null): Poster => ({ type, number, title: "t", slug: `${type}-${number}`, src: "/x.webp", width: 1, height: 1, blur: "" });
  it("cuenta una vez las conferencias con dos carteles y suma los talleres sin número", () => {
    const stats = trajectoryStats([p("conferencia", 5), p("conferencia", 5), p("conferencia", 6), p("taller", 1), p("taller", null)]);
    expect(stats.find((s) => s.type === "conferencia")?.count).toBe(2);
    expect(stats.find((s) => s.type === "taller")?.count).toBe(2);
    expect(stats.find((s) => s.type === "visita")?.count).toBe(0);
  });
  it("etiqueta con y sin número", () => {
    expect(posterLabel({ type: "conferencia", number: 13 })).toBe("Conferencia #13");
    expect(posterLabel({ type: "taller", number: null })).toBe("Taller");
  });
});

describe("manifiesto de imágenes", () => {
  it("cada imagen trae ruta local, dimensiones y placeholder", () => {
    const all = [...Object.values(siteMedia), ...posters];
    expect(all.length).toBeGreaterThan(0);
    for (const img of all) {
      expect(img.src).toMatch(/^\/media\/(site|posters)\/[a-z0-9-]+\.webp$/);
      expect(img.width).toBeGreaterThan(0);
      expect(img.height).toBeGreaterThan(0);
      expect(img.blur).toMatch(/^data:image\/webp;base64,/);
    }
    expect(siteMedia.hero).toBeDefined();
    expect(marqueePhotos.length).toBeGreaterThanOrEqual(6);
  });
  it("los slugs de carteles no se repiten", () => {
    expect(new Set(posters.map((x) => x.slug)).size).toBe(posters.length);
  });
});
