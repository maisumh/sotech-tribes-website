"use client";

import { STORE } from "@/lib/store";
import { track } from "@/lib/analytics";

/**
 * App Store + Google Play download badges.
 *
 * Drawn as inline SVG rather than shipping Apple/Google's badge PNGs: no extra
 * network request, crisp at any size, and it inherits the page's own type. The
 * layout follows each store's badge convention (small line over a large
 * wordmark) so it still reads as the thing people expect to tap.
 *
 * Every badge fires `download_click` with the platform and the section it was
 * clicked from — that is the site's primary conversion event now that the CTA
 * is "get the app" rather than "join the waitlist".
 */

function AppleBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-xl bg-black text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/25 ${compact ? "gap-2 px-4 py-2" : "gap-3 px-5 py-2.5"}`}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className={`shrink-0 ${compact ? "h-5 w-5" : "h-7 w-7"}`} aria-hidden="true">
        <path d="M17.05 12.536c-.026-2.63 2.148-3.895 2.246-3.956-1.222-1.788-3.125-2.033-3.804-2.06-1.62-.164-3.16.954-3.98.954-.82 0-2.086-.93-3.43-.905-1.765.026-3.39 1.026-4.297 2.606-1.832 3.177-.468 7.883 1.315 10.46.87 1.262 1.908 2.68 3.27 2.63 1.312-.053 1.808-.85 3.396-.85 1.588 0 2.033.85 3.42.824 1.412-.026 2.306-1.287 3.17-2.553.998-1.464 1.41-2.88 1.435-2.953-.031-.014-2.755-1.058-2.782-4.197zM14.47 4.64c.724-.878 1.212-2.098 1.079-3.313-1.043.042-2.306.695-3.054 1.571-.671.777-1.259 2.019-1.101 3.211 1.164.09 2.352-.591 3.076-1.469z" />
      </svg>
      <span className="text-left leading-none">
        <span className={`block font-normal tracking-wide ${compact ? "text-[0.5rem]" : "text-[0.6rem]"}`}>Download on the</span>
        <span className={`block font-semibold leading-tight ${compact ? "text-sm" : "text-lg"}`}>App Store</span>
      </span>
    </span>
  );
}

function PlayBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-xl bg-black text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/25 ${compact ? "gap-2 px-4 py-2" : "gap-3 px-5 py-2.5"}`}
    >
      <svg viewBox="0 0 24 24" className={`shrink-0 ${compact ? "h-5 w-5" : "h-7 w-7"}`} aria-hidden="true">
        <path d="M3.6 1.84a1.5 1.5 0 0 0-.44 1.06v18.2c0 .4.16.78.44 1.06l.06.06L13.8 12.1v-.24L3.66 1.78l-.06.06z" fill="#00D3FF" />
        <path d="M17.18 15.52l-3.38-3.4v-.24l3.38-3.4.08.05 4.01 2.28c1.14.65 1.14 1.71 0 2.36l-4.01 2.28-.08.07z" fill="#FFC107" />
        <path d="M17.26 15.45l-3.46-3.47L3.6 22.16c.38.4 1 .45 1.7.06l11.96-6.77" fill="#FF3A44" />
        <path d="M17.26 8.51L5.3 1.75c-.7-.4-1.32-.35-1.7.05l10.2 10.18 3.46-3.47z" fill="#00C853" />
      </svg>
      <span className="text-left leading-none">
        <span className={`block font-normal tracking-wide ${compact ? "text-[0.5rem]" : "text-[0.6rem]"}`}>GET IT ON</span>
        <span className={`block font-semibold leading-tight ${compact ? "text-sm" : "text-lg"}`}>Google Play</span>
      </span>
    </span>
  );
}

export default function StoreBadges({
  /** Where on the page this pair sits — travels with the GA4 event. */
  location,
  className = "",
  align = "start",
  compact = false,
}: {
  location: string;
  className?: string;
  align?: "start" | "center";
  /** Smaller pair for the footer, so it doesn't read as a second primary CTA. */
  compact?: boolean;
}) {
  const justify = align === "center" ? "justify-center" : "justify-center sm:justify-start";

  return (
    <div className={`flex flex-wrap items-center gap-3 ${justify} ${className}`}>
      <a
        href={STORE.ios}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download Tribes on the App Store"
        onClick={() => track("download_click", { platform: "ios", location })}
        className="rounded-xl focus-visible:outline-2 focus-visible:outline-casablanca focus-visible:outline-offset-2"
      >
        <AppleBadge compact={compact} />
      </a>
      <a
        href={STORE.android}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get Tribes on Google Play"
        onClick={() => track("download_click", { platform: "android", location })}
        className="rounded-xl focus-visible:outline-2 focus-visible:outline-casablanca focus-visible:outline-offset-2"
      >
        <PlayBadge compact={compact} />
      </a>
    </div>
  );
}
