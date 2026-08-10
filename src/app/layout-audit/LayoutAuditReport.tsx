"use client";
import { useEffect, useState } from "react";
const CHECKS = ["OVERLAP", "TOUCH", "ROW-MISALIGN", "UNEVEN-ROW-HEIGHTS", "CONNECTOR-COLLISION", "H-OVERFLOW", "SECTION-BLEED"] as const;
type Check = (typeof CHECKS)[number];
type Finding = { check: Check; detail: string };
type Result = { viewport: string; scannedAt: string; elementCount: number; findings: Finding[] };
const rounded = (value: number) => Math.round(value * 10) / 10;
function runAudit(): Result {
  const viewportWidth = document.documentElement.clientWidth;
  const findings: Finding[] = [];
  const sections = [...document.querySelectorAll<HTMLElement>("main section")];
  if (document.documentElement.scrollWidth > viewportWidth + 1) findings.push({ check: "H-OVERFLOW", detail: `Document is ${document.documentElement.scrollWidth - viewportWidth}px wider than the viewport.` });
  sections.forEach((section, index) => { const rect = section.getBoundingClientRect(); if (rect.left < -1 || rect.right > viewportWidth + 1) findings.push({ check: "SECTION-BLEED", detail: `Section ${index + 1} spans x=${rounded(rect.left)}..${rounded(rect.right)} in a ${viewportWidth}px viewport.` }); });
  for (let index = 0; index < sections.length - 1; index += 1) { const current = sections[index].getBoundingClientRect(); const next = sections[index + 1].getBoundingClientRect(); if (current.bottom > next.top + 1) findings.push({ check: "OVERLAP", detail: `Sections ${index + 1} and ${index + 2} overlap by ${rounded(current.bottom - next.top)}px.` }); }
  [...document.querySelectorAll<HTMLElement>("main [class*='grid']")].forEach((grid, gridIndex) => {
    const children = [...grid.children].filter((child): child is HTMLElement => child instanceof HTMLElement).map((child) => child.getBoundingClientRect()).filter((rect) => rect.width > 0 && rect.height > 0);
    const rows = new Map<number, DOMRect[]>();
    children.forEach((rect) => { const top = Math.round(rect.top); rows.set(top, [...(rows.get(top) ?? []), rect]); });
    rows.forEach((row, rowTop) => { if (row.length < 2) return; const tops = row.map((rect) => rounded(rect.top)); if (Math.max(...tops) - Math.min(...tops) > 1) findings.push({ check: "ROW-MISALIGN", detail: `Grid ${gridIndex + 1}, row ${rowTop}px has misaligned tops.` }); const heights = row.map((rect) => rounded(rect.height)); if (Math.max(...heights) - Math.min(...heights) > 1) findings.push({ check: "UNEVEN-ROW-HEIGHTS", detail: `Grid ${gridIndex + 1}, row ${rowTop}px varies from ${Math.min(...heights)}px to ${Math.max(...heights)}px.` }); const ordered = [...row].sort((a, b) => a.left - b.left); for (let index = 0; index < ordered.length - 1; index += 1) { const gap = ordered[index + 1].left - ordered[index].right; if (gap >= 0 && gap < 6) findings.push({ check: "TOUCH", detail: `Grid ${gridIndex + 1}, row ${rowTop}px has a ${rounded(gap)}px gap.` }); } });
  });
  [...document.querySelectorAll<HTMLElement>("main [data-connector]")].forEach((connector, index) => { const rect = connector.getBoundingClientRect(); const collision = document.elementsFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2).find((element) => element !== connector && !connector.contains(element) && !element.contains(connector)); if (collision) findings.push({ check: "CONNECTOR-COLLISION", detail: `Connector ${index + 1} intersects ${collision.tagName.toLowerCase()}.` }); });
  return { viewport: `${viewportWidth}x${window.innerHeight}`, scannedAt: new Date().toISOString(), elementCount: document.querySelectorAll("main *").length, findings };
}
export function LayoutAuditReport() {
  const [result, setResult] = useState<Result | null>(null);
  useEffect(() => { const audit = () => requestAnimationFrame(() => requestAnimationFrame(() => setResult(runAudit()))); audit(); window.addEventListener("resize", audit); return () => window.removeEventListener("resize", audit); }, []);
  const grouped = new Map<Check, Finding[]>(); CHECKS.forEach((check) => grouped.set(check, [])); result?.findings.forEach((finding) => grouped.get(finding.check)?.push(finding));
  return <aside id="computed-layout-audit" aria-live="polite" className="bg-white px-4 py-10 text-firefly sm:px-8"><div className="mx-auto max-w-6xl rounded-2xl border-2 border-firefly p-5 sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.18em]">Computed geometry audit</p><div className="mt-2 flex flex-wrap items-end justify-between gap-3"><h1 className="text-3xl font-bold sm:text-4xl">{!result ? "RUNNING" : result.findings.length ? "FINDINGS CONFIRMED" : "CLEAN RESULT"}</h1><p className="font-mono text-sm">Viewport: {result?.viewport ?? "measuring…"}</p></div><p className="mt-3 text-sm">Live browser geometry scan of the rendered homepage. {result ? `${result.elementCount} elements inspected at ${result.scannedAt}.` : "Waiting for layout and fonts."}</p><ul className="mt-6 grid gap-3 md:grid-cols-2" aria-label="Layout audit checks">{CHECKS.map((check) => { const entries = grouped.get(check) ?? []; return <li key={check} className="rounded-xl border border-firefly/20 bg-offwhite p-4"><div className="flex items-center justify-between gap-3"><strong className="text-sm">{check}</strong><span className="rounded-full bg-firefly px-3 py-1 text-xs font-bold text-white">{!result ? "PENDING" : entries.length ? `FAIL · ${entries.length}` : "PASS · 0"}</span></div>{entries.map((entry, index) => <p key={index} className="mt-2 text-sm">{entry.detail}</p>)}</li>; })}</ul></div></aside>;
}
