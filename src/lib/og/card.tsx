import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { ImageResponse } from "next/og";
import { formatEventDate, formatEventTime } from "@/lib/format";
import type { Event, GalleryAlbum } from "@/lib/types";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = "image/png";
/** Tarjetas con foto: en PNG pesan >1 MB y WhatsApp deja de mostrar la vista previa. */
export const OG_PHOTO_TYPE = "image/jpeg";

async function asJpeg(png: ImageResponse) {
  const jpeg = await sharp(Buffer.from(await png.arrayBuffer())).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpeg), {
    headers: { "content-type": OG_PHOTO_TYPE, "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" },
  });
}

const C = { gold: "#E9A23B", goldLight: "#F2B65A", goldDeep: "#D2861F", ink: "#1A1714", white: "#ffffff" };

let fontsPromise: Promise<{ name: string; data: Buffer; weight: 500 | 700 | 800; style: "normal" }[]> | null = null;
function fonts() {
  fontsPromise ??= Promise.all(
    ([500, 700, 800] as const).map(async (weight) => ({
      name: "Jakarta",
      data: await readFile(join(process.cwd(), `assets/fonts/plus-jakarta-sans-latin-${weight}-normal.woff`)),
      weight,
      style: "normal" as const,
    })),
  );
  return fontsPromise;
}

/** Descarga una imagen remota y la entrega como JPEG en data URL (el generador no lee WebP). */
async function asJpegDataUrl(url: string | null, width: number, height: number) {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = await sharp(Buffer.from(await res.arrayBuffer()))
      .resize(width, height, { fit: "cover", position: "attention" })
      .jpeg({ quality: 82 })
      .toBuffer();
    return `data:image/jpeg;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

function Mark({ size, color = C.gold }: { size: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 12h26a9 9 0 0 1 0 18H26" />
      <path d="M26 30h16a11 11 0 0 1 0 22H16" />
    </svg>
  );
}

function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ display: "flex", width: 64, height: 64, borderRadius: 64, background: C.white, alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px rgba(0,0,0,0.15)" }}>
        <Mark size={40} />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 24, fontWeight: 800, letterSpacing: 1, color: dark ? C.white : C.ink }}>
          <span style={{ color: dark ? C.goldLight : C.white, marginRight: 8 }}>YOUNG</span>BUSINESS LEADERS
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: 4, color: dark ? "rgba(255,255,255,0.7)" : "rgba(26,23,20,0.65)" }}>
          JÓVENES EMPRENDEDORES · JALISCO
        </div>
      </div>
    </div>
  );
}

function Pill({ children, dark = false }: { children: string; dark?: boolean }) {
  return (
    <div style={{ display: "flex", padding: "10px 22px", borderRadius: 999, background: dark ? C.gold : C.ink, color: dark ? C.ink : C.white, fontSize: 22, fontWeight: 700 }}>
      {children}
    </div>
  );
}

const goldBackground = {
  background: `linear-gradient(150deg, ${C.goldLight} 0%, ${C.gold} 45%, ${C.goldDeep} 100%)`,
};

function titleSize(text: string, max = 76) {
  if (text.length > 70) return Math.round(max * 0.68);
  if (text.length > 45) return Math.round(max * 0.82);
  return max;
}

/** Páginas fijas: eyebrow + título grande sobre el dorado de la marca. */
export async function pageCard({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return new ImageResponse(
    (
      <div style={{ ...goldBackground, width: "100%", height: "100%", display: "flex", position: "relative", fontFamily: "Jakarta", color: C.ink }}>
        <div style={{ position: "absolute", right: -60, bottom: -90, display: "flex", opacity: 0.16 }}>
          <Mark size={560} color={C.white} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", width: "100%" }}>
          <Brand />
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 900 }}>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 5, color: "rgba(26,23,20,0.7)", marginBottom: 18 }}>{eyebrow.toUpperCase()}</div>
            <div style={{ fontSize: titleSize(title), fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>{title}</div>
            {subtitle ? <div style={{ fontSize: 30, fontWeight: 500, marginTop: 22, color: "rgba(26,23,20,0.8)" }}>{subtitle}</div> : null}
          </div>
          <div style={{ display: "flex" }}>
            <Pill>yblmx.org</Pill>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}

/** Evento: nombre, fecha, hora y lugar; portada a la derecha si existe. */
export async function eventCard(event: Event | null) {
  if (!event) return asJpeg(await pageCard({ eyebrow: "Agenda", title: "Eventos para emprendedores en Guadalajara" }));
  const cover = await asJpegDataUrl(event.cover_url, 440, 630);
  const date = formatEventDate(event.starts_at);
  const time = `${formatEventTime(event.starts_at)}${event.ends_at ? ` – ${formatEventTime(event.ends_at)}` : ""}`;
  const place = [event.location, event.address].filter(Boolean).join(" · ");
  return asJpeg(new ImageResponse(
    (
      <div style={{ ...goldBackground, width: "100%", height: "100%", display: "flex", fontFamily: "Jakarta", color: C.ink }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 64px", flex: 1, position: "relative" }}>
          <Brand />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", marginBottom: 18 }}>
              <div style={{ display: "flex", padding: "8px 18px", borderRadius: 999, background: event.is_public ? "rgba(255,255,255,0.75)" : C.ink, color: event.is_public ? C.ink : C.white, fontSize: 20, fontWeight: 800, letterSpacing: 3 }}>
                {event.is_public ? "EVENTO ABIERTO" : "SOLO MIEMBROS"}
              </div>
            </div>
            <div style={{ fontSize: titleSize(event.title, cover ? 64 : 76), fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>{event.title}</div>
            <div style={{ display: "flex", flexDirection: "column", marginTop: 26, gap: 8, fontSize: 28, fontWeight: 700 }}>
              <div style={{ display: "flex" }}>{date}</div>
              <div style={{ display: "flex", fontWeight: 500 }}>{time}</div>
              {place ? <div style={{ display: "flex", fontWeight: 500, color: "rgba(26,23,20,0.8)" }}>{place}</div> : null}
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <Pill>{event.is_public ? "Regístrate en yblmx.org" : "yblmx.org"}</Pill>
          </div>
        </div>
        {cover ? (
          <div style={{ display: "flex", width: 440, height: "100%", background: C.ink }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} width={440} height={630} style={{ objectFit: "cover" }} alt="" />
          </div>
        ) : null}
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  ));
}

/** Álbum: la foto de portada a todo lo ancho con marco dorado, logo y nombre del álbum. */
export async function albumCard(album: GalleryAlbum | null, photos: number) {
  if (!album) return asJpeg(await pageCard({ eyebrow: "Galería", title: "Momentos de la comunidad YBL" }));
  const cover = await asJpegDataUrl(album.cover_url, 1168, 598);
  return asJpeg(new ImageResponse(
    (
      <div style={{ ...goldBackground, width: "100%", height: "100%", display: "flex", padding: 16, fontFamily: "Jakarta" }}>
        <div style={{ display: "flex", position: "relative", width: "100%", height: "100%", borderRadius: 20, overflow: "hidden", background: C.ink }}>
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} width={1168} height={598} style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }} alt="" />
          ) : null}
          <div style={{ position: "absolute", top: 0, left: 0, width: 1168, height: 598, display: "flex", backgroundImage: "linear-gradient(180deg, rgba(26,23,20,0.55) 0%, rgba(26,23,20,0) 30%, rgba(26,23,20,0) 45%, rgba(26,23,20,0.88) 100%)" }} />
          <div style={{ position: "absolute", top: 0, left: 0, width: 1168, height: 598, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "40px 48px" }}>
            <Brand dark />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 5, color: C.goldLight, marginBottom: 10 }}>
                {`GALERÍA · ${photos} FOTOS`}
              </div>
              <div style={{ fontSize: titleSize(album.title, 68), fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, color: C.white }}>{album.title}</div>
              <div style={{ display: "flex", marginTop: 22 }}>
                <Pill dark>yblmx.org</Pill>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  ));
}
