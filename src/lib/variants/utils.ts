import { variantSearchFilters } from "./types";

export function parseVariantSearchParams(searchParams: URLSearchParams): variantSearchFilters {
  return {
    pid: Number(searchParams.get("pid")) || undefined,
    color: searchParams.get("color") || undefined,
    size: searchParams.get("size") || undefined,
  };
}
