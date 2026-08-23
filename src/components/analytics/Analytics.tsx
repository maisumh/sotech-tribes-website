"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GA_ID, track } from "@/lib/analytics";

/**
 * Site-wide analytics loader.
 *
 * - Loads GA4 only in production and only outside /admin, so the internal staff
 *   tool never reports into the marketing property. (Vercel preview deploys run
 *   as production too, which is what lets us verify events before the DNS cutover.)
 * - Pageviews on first load + client-side route changes are handled by GA4
 *   Enhanced Measurement (history events), so we don't fire page_view manually.
 * - A single delegated click listener instruments every "Get the App" CTA and
 *   outbound link, so we don't have to touch each button component.
 *
 * ⚠️ The primary conversion event changed with the Aug 2026 launch pass:
 *   join_waitlist_click -> get_app_click, plus download_click (fired by
 *   StoreBadges with a platform param). GA4 Key events must be re-marked in
 *   Admin -> Events; the old names stop receiving traffic.
 */
export default function Analytics() {
  const pathname = usePathname();
  const enabled =
    process.env.NODE_ENV === "production" && !pathname?.startsWith("/admin");

  useEffect(() => {
    if (!enabled) return;

    function onClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      const linkText = (anchor.textContent || "").trim().slice(0, 60);

      // App intent — any anchor pointing at the #get-the-app section.
      if (href === "#get-the-app" || href.endsWith("#get-the-app")) {
        track("get_app_click", { location: ctaLocation(anchor), link_text: linkText });
        return;
      }

      // Outbound links — anything leaving the origin.
      try {
        const url = new URL(href, window.location.origin);
        // Store links already report a richer download_click from StoreBadges —
        // counting them twice would inflate outbound and blur the funnel.
        const isStore =
          url.hostname.endsWith("apps.apple.com") ||
          url.hostname.endsWith("play.google.com");
        if (url.origin !== window.location.origin && !isStore) {
          track("outbound_click", { url: url.href, link_text: linkText });
        }
      } catch {
        // relative / hash / mailto link — not outbound, ignore
      }
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [enabled]);

  if (!enabled) return null;
  return <GoogleAnalytics gaId={GA_ID} />;
}

/** Best-effort label for where a CTA lives, from the nearest landmark/section id. */
function ctaLocation(el: Element): string {
  const region = el.closest("section[id], nav, header, footer");
  if (!region) return "page";
  return region.id || region.tagName.toLowerCase();
}
