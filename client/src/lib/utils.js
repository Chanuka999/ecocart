import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Normalize image sources to absolute URLs.
 * - If value is already an http(s) URL, return as-is
 * - If value starts with '/', prefix with window.location.origin
 * - If value is a simple filename or relative path, prefix with origin + '/'
 * - Otherwise return null
 */
export function normalizeImageSrc(src) {
  if (!src) return null;
  try {
    const s = String(src).trim();
    if (!s) return null;
    if (/^https?:\/\//i.test(s)) return s;
    if (s.startsWith("/")) return window.location.origin + s;
    if (!s.includes("://")) return window.location.origin + "/" + s;
    return s;
  } catch {
    return null;
  }
}
