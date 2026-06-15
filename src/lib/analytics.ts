// Google Analytics 4 — measurement ID for the Tribes "trytribes.com" web stream.
// This is a public, browser-safe identifier. It can be overridden per-environment
// via NEXT_PUBLIC_GA_ID, but defaults to the live property so analytics never
// silently breaks if the env var is missing on a deploy.
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-JDM03V14GB";

type GtagValue = string | number | boolean | undefined;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Fire a GA4 event. Safe to call anywhere — no-ops on the server, and when
 * gtag hasn't loaded (e.g. /admin, dev, or an ad-blocker). Keep event names
 * snake_case and params flat so they map cleanly to GA4 custom dimensions.
 */
export function track(event: string, params?: Record<string, GtagValue>): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", event, params ?? {});
}
