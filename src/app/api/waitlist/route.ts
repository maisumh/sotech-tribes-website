import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(320),
  zip: z.string().trim().regex(/^\d{5}(-\d{4})?$/),
  role: z.enum(["neighbor", "partner", "both"]),
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
      { error: "Please fill in all fields correctly." },
      { status: 400 }
    );
  }

  const { name, email, zip, role } = parsed.data;

  // TODO: Wire up to GoHighLevel Contacts API (or Supabase, or SendGrid) to
  // actually persist this waitlist signup. Current state: request is validated
  // and logged server-side so the form works end-to-end for App Store / demo
  // review. When wiring to GHL, use the v2 API:
  //
  //   POST https://services.leadconnectorhq.com/contacts/
  //   Authorization: Bearer <LOCATION_TOKEN>
  //   Version: 2021-07-28
  //   { firstName, email, postalCode, tags: ["waitlist", role], customFields: [...] }
  //
  // Store the token in .env.local as GHL_LOCATION_TOKEN and read it via
  // process.env.GHL_LOCATION_TOKEN here.
  console.log("[waitlist] inbound signup", {
    at: new Date().toISOString(),
    name,
    email,
    zip,
    role,
  });

  return NextResponse.json({ ok: true });
}
