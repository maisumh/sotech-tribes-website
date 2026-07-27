// ⚠️ SERVER-ONLY. Never import from a client component — this reads a private
// integration token from the environment.
//
// GoHighLevel (LeadConnector) contact sync for the Tribes location.
//
// WHERE THIS SITS IN THE ARCHITECTURE
// Leads live in GHL; users live in Supabase. Someone crosses that boundary when
// they're admitted to the marketplace. So this module only ever writes *leads* —
// waitlist signups and invite recipients — never the authenticated user base.
//
// Code owns the data and the targeting (which contact, which tags); GHL owns the
// message and the send (a workflow triggers on a tag and mails from
// news.trytribes.com). That split is deliberate: the segmentation logic stays
// versioned and testable in this repo, while the copy stays editable by whoever
// owns marketing without a deploy.
//
// FAIL-OPEN BY DESIGN. Supabase is the source of truth for the waitlist
// (public.v2_waitlist). If GHL is down, misconfigured, or the token is revoked,
// the lead is still captured and can be backfilled — so a CRM outage must never
// turn into a lost signup or a 500 for the user. Every function here returns a
// result object instead of throwing.

const API_BASE = "https://services.leadconnectorhq.com";
const API_VERSION = "2021-07-28";

// ⚠️ ENV VARS ARE DELIBERATELY NAMESPACED `TRIBES_GHL_*`, NOT `GHL_*`.
// SoTech operates its own GoHighLevel account, and dev machines commonly export
// generic `GHL_LOCATION_ID` / `GHL_PIT_TOKEN` for it. Next.js gives real
// environment variables precedence over `.env.local`, so a generic name is
// silently overridden by whatever the shell has — which during development here
// meant a Tribes token paired with SoTech's location id (a 403, and only luck
// that it wasn't a matching pair that would have written Tribes' leads into
// SoTech's CRM). Keep the prefix. Do not "simplify" these names.

export type GhlSyncResult =
  | { ok: true; forwarded: true; contactId: string }
  | { ok: true; forwarded: false; reason: string };

export type UpsertContactInput = {
  email: string;
  name?: string | null;
  /** 5-digit ZIP. Written to the standard `postalCode` contact field. */
  zip?: string | null;
  /** Rollout-area slug from v2_areas, or null when the ZIP maps to no area. */
  areaSlug?: string | null;
  /** Extra tags beyond the ones derived from zip/area. */
  tags?: string[];
  source?: string;
};

function splitName(full?: string | null): { firstName?: string; lastName?: string } {
  const n = (full ?? "").trim();
  if (!n) return {};
  const parts = n.split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0] };
  return { firstName: parts.slice(0, -1).join(" "), lastName: parts[parts.length - 1] };
}

/**
 * Tags are the trigger contract with GHL workflows. Keep them stable — renaming
 * one silently stops an automation from firing, with no error anywhere.
 *
 *   waitlist            every waitlist lead (the "you're on the list" trigger)
 *   zip:77531           exact ZIP, for ad-hoc segmentation
 *   area:brazoria-gmz   rollout area, or area:unmapped when no area covers the ZIP
 *   role:neighbor       what they said they're here for
 */
export function waitlistTags(input: {
  zip?: string | null;
  areaSlug?: string | null;
  role?: string | null;
}): string[] {
  const tags = ["waitlist"];
  if (input.zip) tags.push(`zip:${input.zip}`);
  tags.push(`area:${input.areaSlug ?? "unmapped"}`);
  if (input.role) tags.push(`role:${input.role}`);
  return tags;
}

/**
 * Create or update a contact by email.
 *
 * Uses POST /contacts/upsert, which dedupes on email within the location — so a
 * repeat submission updates rather than creating a second contact. Tags are
 * additive on GHL's side; existing tags are never removed.
 *
 * NOTE on ZIP: written to the standard `postalCode` field (a string), NOT to the
 * location's existing `contact.zip_code` custom field, which is NUMERICAL and
 * would mangle leading-zero ZIPs (02134 → 2134). If an existing smart list
 * depends on that custom field, populate it deliberately rather than by default.
 */
export async function upsertContact(
  input: UpsertContactInput
): Promise<GhlSyncResult> {
  const token = process.env.TRIBES_GHL_PIT;
  const locationId = process.env.TRIBES_GHL_LOCATION_ID;

  if (!token || !locationId) {
    return {
      ok: true,
      forwarded: false,
      reason: "TRIBES_GHL_PIT / TRIBES_GHL_LOCATION_ID not set",
    };
  }

  const { firstName, lastName } = splitName(input.name);

  const body: Record<string, unknown> = {
    locationId,
    email: input.email.trim().toLowerCase(),
    ...(firstName ? { firstName } : {}),
    ...(lastName ? { lastName } : {}),
    ...(input.zip ? { postalCode: input.zip } : {}),
    ...(input.tags?.length ? { tags: input.tags } : {}),
    ...(input.source ? { source: input.source } : {}),
  };

  try {
    // Don't let a slow CRM hold the user's request open.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`${API_BASE}/contacts/upsert`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Version: API_VERSION,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[ghl] upsert returned non-2xx", {
        status: res.status,
        // Never log the token; the body can contain the contact's email, which
        // is fine in server logs but keep it bounded.
        detail: detail.slice(0, 300),
      });
      return { ok: true, forwarded: false, reason: `http ${res.status}` };
    }

    const json = (await res.json()) as { contact?: { id?: string } };
    const contactId = json.contact?.id;
    if (!contactId) {
      return { ok: true, forwarded: false, reason: "no contact id in response" };
    }
    return { ok: true, forwarded: true, contactId };
  } catch (err) {
    const reason = err instanceof Error ? err.name : "unknown";
    console.error("[ghl] upsert failed", err);
    return { ok: true, forwarded: false, reason };
  }
}

/**
 * Add tags to an existing contact by id — used when an area opens, so a workflow
 * can trigger on `area-open:<slug>` and send the announcement.
 */
export async function addTags(
  contactId: string,
  tags: string[]
): Promise<GhlSyncResult> {
  const token = process.env.GHL_PIT;
  if (!token) {
    return { ok: true, forwarded: false, reason: "GHL_PIT not set" };
  }
  try {
    const res = await fetch(`${API_BASE}/contacts/${contactId}/tags`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Version: API_VERSION,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tags }),
    });
    if (!res.ok) {
      return { ok: true, forwarded: false, reason: `http ${res.status}` };
    }
    return { ok: true, forwarded: true, contactId };
  } catch (err) {
    console.error("[ghl] addTags failed", err);
    return { ok: true, forwarded: false, reason: "fetch failed" };
  }
}
