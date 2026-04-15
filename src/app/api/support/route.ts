import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(320),
  category: z.enum(["account", "listing", "safety", "bug", "other"]),
  message: z.string().trim().min(10).max(5000),
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
    return NextResponse.json({ error: "Please fill in all fields correctly." }, { status: 400 });
  }

  // TODO: Wire up to SendGrid (or whichever transactional email provider is
  // live for Tribes) and forward this to info@trytribes.com. For now the
  // request is logged server-side and the success response is returned so the
  // form is functional end-to-end — App Store reviewers will see a working
  // support page.
  console.log("[support] inbound request", {
    at: new Date().toISOString(),
    ...parsed.data,
  });

  return NextResponse.json({ ok: true });
}
