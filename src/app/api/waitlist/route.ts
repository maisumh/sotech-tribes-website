import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import { upsertContact, waitlistTags } from "@/lib/ghl";

/**
 * Public waitlist capture — the web half of the staged geographic rollout.
 *
 * Two writes, in a deliberate order:
 *
 *   1. Supabase `v2_join_waitlist` — THE SOURCE OF TRUTH. Insert-only on
 *      conflict, so a resubmit can never let one person overwrite a stranger's
 *      row. If this fails the lead is genuinely lost, so it is the only step
 *      allowed to fail the request.
 *   2. GoHighLevel contact upsert — the marketing/automation mirror. FAIL-OPEN:
 *      a CRM outage must never cost a signup or show the user an error, because
 *      the row is already safe in Supabase and can be backfilled.
 *
 * The in-app half of this same flow lives in the mobile app: a blocked signup
 * calls `v2_resolve_admission`, which writes an identical `v2_waitlist` row with
 * source='app'. This route is the source='web' path — one step instead of four
 * (download → account → profile screen → wall), which is why it matters for
 * building the demand map before the app-side lock ships.
 *
 * Uses the ANON key, not the service role: `v2_join_waitlist` is granted to
 * `anon` precisely so a public form needs no privileged credential. Do not
 * "upgrade" this to createAdminClient().
 */

const schema = z.object({
  name: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(320),
  zip: z.string().trim().regex(/^\d{5}(-\d{4})?$/),
  role: z.enum(["neighbor", "partner", "both"]),
});

type JoinWaitlistResult = {
  ok: boolean;
  created: boolean;
  area_name: string | null;
  /** Stable identifier from v2_areas — this is what the GHL tag keys on. */
  area_slug: string | null;
  area_status: "open" | "waitlist" | "closed";
  waitlist_count: number;
  threshold: number;
};

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please fill in all fields correctly." },
      { status: 400 }
    );
  }

  const { name, email, zip, role } = parsed.data;
  // The form accepts ZIP+4; the rollout gate keys on ZIP5.
  const zip5 = zip.slice(0, 5);

  // ── 1. Supabase — source of truth ──────────────────────────────────────────
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data, error } = await supabase.rpc("v2_join_waitlist", {
    p_email: email,
    p_zip: zip5,
    p_name: name,
    p_source: "web",
    p_ref: null,
  });

  if (error) {
    console.error("[waitlist] v2_join_waitlist failed", {
      message: error.message,
      code: error.code,
    });
    return NextResponse.json(
      { error: "We couldn't save that. Please try again in a moment." },
      { status: 502 }
    );
  }

  const result = (data ?? null) as JoinWaitlistResult | null;

  // ── 2. GoHighLevel — fail-open mirror ──────────────────────────────────────
  // Use the SLUG the RPC returns, never a slugified display name: `area_name`
  // is editable ("Cupertino, CA" → "Cupertino") and renaming it would silently
  // change the tag and stop the workflow firing. The slug is the contract.
  const areaSlug = result?.area_slug ?? null;

  const sync = await upsertContact({
    email,
    name,
    zip: zip5,
    areaSlug,
    tags: waitlistTags({ zip: zip5, areaSlug, role }),
    source: "trytribes.com waitlist",
  });

  if (!sync.forwarded) {
    console.warn("[waitlist] captured in Supabase but NOT synced to GHL", {
      reason: sync.reason,
      email,
    });
  }

  return NextResponse.json({
    ok: true,
    // Surfaced so the form can eventually say "you're one of 14 near 77531".
    areaStatus: result?.area_status ?? "closed",
    areaName: result?.area_name ?? null,
    waitlistCount: result?.waitlist_count ?? 0,
    threshold: result?.threshold ?? 0,
    synced: sync.forwarded,
  });
}
