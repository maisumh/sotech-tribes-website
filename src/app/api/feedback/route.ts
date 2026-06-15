import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  firstImpression: z.string().trim().max(2000).optional().default(""),
  easeRating: z.number().int().min(1).max(5),
  tradeMatch: z.enum(["yes", "maybe", "no"]),
  confusion: z.string().trim().max(2000).optional().default(""),
  wantNext: z.string().trim().max(2000).optional().default(""),
  referral: z.enum(["yes", "maybe", "no"]),
  followUp: z.enum(["yes", "no"]),
  followUpEmail: z
    .string()
    .trim()
    .max(320)
    .email()
    .optional()
    .or(z.literal("")),
  otherNotes: z.string().trim().max(4000).optional().default(""),
  meta: z
    .object({
      userId: z.string().trim().max(200).optional(),
      email: z.string().trim().max(320).optional(),
      appVersion: z.string().trim().max(50).optional(),
    })
    .optional()
    .default({}),
});

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
      { error: "Please review your answers and try again." },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Flat shape — easiest mapping for a GHL Workflow Inbound Webhook trigger,
  // each key becomes an addressable field in the workflow / contact update.
  const flat = {
    source: "mvp-feedback",
    submitted_at: new Date().toISOString(),
    user_id: data.meta.userId ?? "",
    user_email: data.meta.email ?? data.followUpEmail ?? "",
    app_version: data.meta.appVersion ?? "",
    first_impression: data.firstImpression,
    ease_rating: data.easeRating,
    trade_match: data.tradeMatch,
    confusion: data.confusion,
    want_next: data.wantNext,
    referral: data.referral,
    follow_up: data.followUp,
    follow_up_email: data.followUpEmail ?? "",
    other_notes: data.otherNotes,
  };

  const webhookUrl = process.env.GHL_FEEDBACK_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn(
      "[feedback] GHL_FEEDBACK_WEBHOOK_URL is not set — accepting submission without forwarding.",
      flat
    );
    return NextResponse.json({ ok: true, forwarded: false });
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(flat),
    });

    if (!res.ok) {
      console.error("[feedback] webhook returned non-2xx", {
        status: res.status,
        statusText: res.statusText,
      });
      return NextResponse.json(
        { error: "We couldn't send that. Please try again in a moment." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("[feedback] webhook fetch failed", err);
    return NextResponse.json(
      { error: "We couldn't send that. Please try again in a moment." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, forwarded: true });
}
