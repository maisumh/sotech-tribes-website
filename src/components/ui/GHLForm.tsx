"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { track } from "@/lib/analytics";

export default function GHLForm() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // The waitlist form is a cross-origin GHL iframe, so we can't read its submit
  // event from here — GHL records the actual signup server-side. The most we can
  // observe is that the visitor scrolled the form into view (funnel: CTA click ->
  // form view -> GHL submit). Fire once.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          track("waitlist_form_view");
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef}>
      <iframe
        src="https://link.thesocialtech.net/widget/form/p1UulgwUiKagQ46PUkkl"
        style={{ width: "100%", height: "716px", border: "none", borderRadius: "3px" }}
        scrolling="no"
        id="inline-p1UulgwUiKagQ46PUkkl"
        data-layout="{'id':'INLINE'}"
        data-trigger-type="alwaysShow"
        data-trigger-value=""
        data-activation-type="alwaysActivated"
        data-activation-value=""
        data-deactivation-type="neverDeactivate"
        data-deactivation-value=""
        data-form-name="Landing Page"
        data-height="716"
        data-layout-iframe-id="inline-p1UulgwUiKagQ46PUkkl"
        data-form-id="p1UulgwUiKagQ46PUkkl"
        title="Landing Page"
      />
      <Script
        src="https://link.thesocialtech.net/js/form_embed.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
