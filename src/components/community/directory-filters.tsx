"use client";

import { SearchFilters } from "@/components/community/search-filters";
import { INDUSTRIES } from "@/lib/constants";

export function DirectoryFilters() {
  return (
    <SearchFilters
      basePath="/comunidad"
      placeholder="Buscar por nombre, empresa o ciudad"
      selects={[{ key: "industria", label: "Todas las industrias", options: INDUSTRIES.map((i) => ({ value: i, label: i })) }]}
    />
  );
}
