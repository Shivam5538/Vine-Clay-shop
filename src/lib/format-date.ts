import { format } from "date-fns";

export function toValidDate(input: Date | string | number): Date {
  if (input instanceof Date) return input;
  return new Date(input);
}

/**
 * Deterministic date formatting utility to prevent SSR / Client hydration mismatches.
 */

export function formatDate(input: Date | string | number, formatStr: string = "M/d/yy"): string {
  try {
    const d = toValidDate(input);
    if (isNaN(d.getTime())) return "";
    return format(d, formatStr);
  } catch {
    return "";
  }
}

export function formatTime(input: Date | string | number, formatStr: string = "h:mm a"): string {
  try {
    const d = toValidDate(input);
    if (isNaN(d.getTime())) return "";
    return format(d, formatStr);
  } catch {
    return "";
  }
}

export function formatTimeWithSeconds(input: Date | string | number, formatStr: string = "h:mm:ss a"): string {
  try {
    const d = toValidDate(input);
    if (isNaN(d.getTime())) return "";
    return format(d, formatStr);
  } catch {
    return "";
  }
}

export function formatDateTime(input: Date | string | number, formatStr: string = "M/d/yy, h:mm a"): string {
  try {
    const d = toValidDate(input);
    if (isNaN(d.getTime())) return "";
    return format(d, formatStr);
  } catch {
    return "";
  }
}

export function getMinutesElapsed(startTime: Date | string | number, nowTime: Date | string | number): number {
  try {
    const start = toValidDate(startTime).getTime();
    const now = toValidDate(nowTime).getTime();
    if (isNaN(start) || isNaN(now)) return 0;
    return Math.max(0, Math.floor((now - start) / (1000 * 60)));
  } catch {
    return 0;
  }
}
