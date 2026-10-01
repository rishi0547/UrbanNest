/**
 * Shared URL and image utilities for profile operations.
 * Usable in both Server Components and Client Components.
 */

export function isValidImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  // If it contains HTML tags or whitespace, it cannot be a valid single URL
  if (/<[a-z][\s\S]*>/i.test(trimmed) || /\s/.test(trimmed)) return false;
  // Must start with http://, https://, or /
  if (
    !trimmed.startsWith("http://") &&
    !trimmed.startsWith("https://") &&
    !trimmed.startsWith("/")
  ) {
    return false;
  }
  try {
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      const parsed = new URL(trimmed);
      return Boolean(parsed.hostname);
    }
    return true;
  } catch {
    return false;
  }
}

export function extractUrlIfHtml(input: string): string {
  if (!input) return "";
  if (input.includes("<") && input.includes(">")) {
    const match = input.match(/(?:src|href)=["']([^"']+)["']/i);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return input;
}
