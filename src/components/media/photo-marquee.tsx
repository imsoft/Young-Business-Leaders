import Image from "next/image";
import type { MediaImage } from "@/lib/media";

/** Cinta de fotos en movimiento continuo. Se pausa al pasar el mouse y respeta reduced-motion. */
export function PhotoMarquee({ photos }: { photos: MediaImage[] }) {
  if (photos.length === 0) return null;
  return (
    <div className="marquee overflow-hidden" aria-hidden="true">
      <div className="marquee-track flex">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 gap-3 pr-3 sm:gap-4 sm:pr-4">
            {photos.map((p) => (
              <li key={p.src} className="h-36 shrink-0 overflow-hidden rounded-2xl sm:h-48 md:h-56">
                <Image
                  src={p.src}
                  alt=""
                  width={p.width}
                  height={p.height}
                  sizes="(min-width: 768px) 380px, 260px"
                  placeholder="blur"
                  blurDataURL={p.blur}
                  className="h-full w-auto object-cover"
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
