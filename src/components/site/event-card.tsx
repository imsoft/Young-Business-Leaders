import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BrandPlaceholder } from "./brand-placeholder";
import { dateChip, formatEventTime } from "@/lib/format";
import type { Event } from "@/lib/types";
import { cn } from "@/lib/utils";

export function EventCard({ event, className }: { event: Event; className?: string }) {
  const chip = dateChip(event.starts_at);
  return (
    <Link
      href={`/eventos/${event.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-lg hover:shadow-gold/10",
        className,
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-[4/3]">
        {event.cover_url ? (
          <Image
            src={event.cover_url}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <BrandPlaceholder className="transition duration-500 group-hover:scale-105" />
        )}
        <div className="absolute top-3 left-3 flex flex-col items-center rounded-xl bg-white px-3 py-1.5 text-ink shadow">
          <span className="font-heading text-xl leading-none font-extrabold">{chip.day}</span>
          <span className="text-[10px] font-bold tracking-widest uppercase">{chip.month}</span>
        </div>
        {!event.is_public ? (
          <Badge className="absolute top-3 right-3 bg-ink text-white">Solo miembros</Badge>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-heading text-lg leading-snug font-bold group-hover:text-gold-deep">{event.title}</h3>
        {event.summary ? <p className="line-clamp-2 text-sm text-muted-foreground">{event.summary}</p> : null}
        <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="size-3.5" /> {formatEventTime(event.starts_at)}
          </span>
          {event.location ? (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" /> {event.location}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
