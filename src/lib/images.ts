import "server-only";
import sharp from "sharp";

export type ProcessedImage = { data: Buffer; width: number; height: number; contentType: string; ext: string };

/**
 * Normaliza una imagen subida: aplica la orientación EXIF, limita el lado largo,
 * quita metadatos (incluida ubicación) y la convierte a WebP.
 * Devuelve null si el formato no se puede leer (p. ej. HEIC).
 */
export async function processUpload(
  file: File,
  { max = 2000, square = false, quality = 80 }: { max?: number; square?: boolean; quality?: number } = {},
): Promise<ProcessedImage | null> {
  const input = Buffer.from(await file.arrayBuffer());
  // Los SVG (logos) se quedan como están: rasterizarlos les quita nitidez.
  if (file.type === "image/svg+xml") {
    return { data: input, width: 0, height: 0, contentType: file.type, ext: "svg" };
  }
  try {
    const pipeline = sharp(input, { failOn: "error" }).rotate();
    const resized = square
      ? pipeline.resize({ width: max, height: max, fit: "cover", position: "attention" })
      : pipeline.resize({ width: max, height: max, fit: "inside", withoutEnlargement: true });
    const { data, info } = await resized.webp({ quality }).toBuffer({ resolveWithObject: true });
    return { data, width: info.width, height: info.height, contentType: "image/webp", ext: "webp" };
  } catch {
    return null;
  }
}

/** Nombre de archivo con dimensiones al final; `dimsFromUrl` las lee después. */
export function uploadName(img: ProcessedImage) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return img.width ? `${id}-${img.width}x${img.height}.${img.ext}` : `${id}.${img.ext}`;
}

export const UNSUPPORTED_IMAGE = "No pudimos leer la imagen. Usa JPG, PNG o WebP.";
