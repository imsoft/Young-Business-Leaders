"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/forms/field";
import { INDUSTRIES } from "@/lib/constants";
import { useTransition } from "react";

export function DirectoryFilters() {
  const router = useRouter();
  const sp = useSearchParams();
  const [pending, start] = useTransition();

  function update(key: string, value: string) {
    const next = new URLSearchParams(sp.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    start(() => router.replace(`/comunidad?${next.toString()}`));
  }

  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_220px]" data-pending={pending || undefined}>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por nombre, empresa o ciudad"
          defaultValue={sp.get("q") ?? ""}
          className="pl-8"
          onChange={(e) => {
            const v = e.currentTarget.value;
            window.clearTimeout((window as unknown as { _t?: number })._t);
            (window as unknown as { _t?: number })._t = window.setTimeout(() => update("q", v), 300);
          }}
        />
      </div>
      <NativeSelect defaultValue={sp.get("industria") ?? ""} onChange={(e) => update("industria", e.currentTarget.value)} aria-label="Industria">
        <option value="">Todas las industrias</option>
        {INDUSTRIES.map((i) => (
          <option key={i} value={i}>{i}</option>
        ))}
      </NativeSelect>
    </div>
  );
}
