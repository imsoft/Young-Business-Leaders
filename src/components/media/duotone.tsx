import Image from "next/image";
import type { MediaImage } from "@/lib/media";
import { cn } from "@/lib/utils";

/** Foto en escala de grises multiplicada sobre el degradado dorado: textura sin perder la marca. */
export function Duotone({ image, className, eager = false }: { image: MediaImage | undefined; className?: string; eager?: boolean }) {
  if (!image) return null;
  return (
    <Image
      src={image.src}
      alt=""
      fill
      sizes="100vw"
      loading={eager ? "eager" : "lazy"}
      className={cn("object-cover opacity-30 mix-blend-multiply grayscale", className)}
    />
  );
}
