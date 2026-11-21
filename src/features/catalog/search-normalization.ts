/**
 * Produces a comparison-only key. The source title and author remain untouched.
 */
export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .toLocaleLowerCase("vi")
    .replace(/đ/g, "d")
    .trim()
    .replace(/\s+/g, " ");
}

export function normalizeQueryWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}
