import type { Metadata } from "next";

import Home from "../page";
import { LayoutAuditReport } from "./LayoutAuditReport";

export const metadata: Metadata = {
  title: "Layout Audit | Tribes",
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * A stable, noindex alias of the marketing homepage for automated geometry QA.
 * Keeping the source page shared ensures audits always exercise the exact
 * composition deployed at `/` rather than a test-only approximation.
 */
export default function LayoutAuditPage() {
  return (<>
      <LayoutAuditReport />
      <Home />
    </>);
}
