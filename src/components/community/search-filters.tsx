"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useRef, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/forms/field";
import { cn } from "@/lib/utils";

type SelectFilter = { key: string; label: string; options: readonly { value: string; label: string }[] };

/** Búsqueda + selects que escriben en la URL (?q=…&clave=…) para que los filtros se puedan compartir. */
export function SearchFilters({ basePath, placeholder, selects }: { basePath: string; placeholder: string; selects: SelectFilter[] }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [pending, start] = useTransition();
  const timer = useRef<number | undefined>(undefined);

  function update(key: string, value: string) {
    const next = new URLSearchParams(sp.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    start(() => router.replace(`${basePath}${next.size ? `?${next.toString()}` : ""}`));
  }

  return (
    <div
      className={cn("grid gap-3", selects.length === 2 ? "sm:grid-cols-[1fr_200px_180px]" : "sm:grid-cols-[1fr_220px]")}
      data-pending={pending || undefined}
    >
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          defaultValue={sp.get("q") ?? ""}
          className="pl-8"
          onChange={(e) => {
            const v = e.currentTarget.value;
            window.clearTimeout(timer.current);
            timer.current = window.setTimeout(() => update("q", v), 300);
          }}
        />
      </div>
      {selects.map((s) => (
        <NativeSelect key={s.key} defaultValue={sp.get(s.key) ?? ""} onChange={(e) => update(s.key, e.currentTarget.value)} aria-label={s.label}>
          <option value="">{s.label}</option>
          {s.options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </NativeSelect>
      ))}
    </div>
  );
}
