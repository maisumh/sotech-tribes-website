'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/require-admin'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Rollout-gate operator actions — the staged geographic launch.
 *
 * Backing SQL: `tribes-app/supabase/functions/sql/v2_rollout_gate.sql`.
 * Rules: `tribes-app/INVARIANTS.md` §23. Contract: `docs/admin-backend-contract.md` §16.
 *
 * ⚠️ WHY EVERYTHING HERE USES `createAdminClient()` — this is the OPPOSITE of the
 * usual rule in `docs/admin-architecture.md` ("SECURITY DEFINER RPC → createClient()"),
 * and it is deliberate.
 *
 * The four operator RPCs are `SECURITY DEFINER` but they do **NOT** check the
 * caller's role internally. They are protected purely by GRANT: the migration
 * runs `revoke all ... from public, anon, authenticated` on each and never
 * re-grants, so only the service role can execute them. Calling them with the
 * cookie-session client fails with a permission error, not an auth error.
 *
 * Consequence: `requireAdmin()` is the ONLY authorization gate on these. Never
 * call them from anywhere that hasn't run it first, and never "fix" the RPCs by
 * granting them to `authenticated` — that would hand every logged-in user the
 * ability to open areas and admit themselves.
 *
 * Mutations go through the RPCs, never direct table writes — with ONE exception:
 * `v2_access_config` (the master lock) has no RPC, so it is written directly.
 */

export type RolloutActionState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  /**
   * Set only by admitArea. These are account-less WEB leads that
   * `v2_admit_area` just flipped to `status='notified'` WITHOUT sending
   * anything — the function returns them and expects the caller to mail them.
   * If this list is dropped on the floor those people are unreachable forever,
   * because they will never appear as `waiting` again. Surfaced in the UI.
   */
  webLeadEmails?: string[]
  admittedCount?: number
}

const OK = (message: string, extra: Partial<RolloutActionState> = {}): RolloutActionState => ({
  status: 'success',
  message,
  ...extra,
})
const ERR = (message: string): RolloutActionState => ({ status: 'error', message })

/** Every rollout mutation revalidates the whole section — the views are cross-cutting. */
function revalidateRollout(areaId?: string) {
  revalidatePath('/admin/rollout')
  revalidatePath('/admin/rollout/waitlist')
  if (areaId) revalidatePath(`/admin/rollout/${areaId}`)
}

// ---------------------------------------------------------------------------
// 1. Area status — open / waitlist / closed
// ---------------------------------------------------------------------------

const SetStatusSchema = z.object({
  areaId: z.string().uuid(),
  status: z.enum(['open', 'waitlist', 'closed']),
})

/**
 * Flip an area's status. This is SILENT — it does not promote or notify anyone.
 * Opening an area is deliberately two steps: set status here, then run
 * `admitArea` to actually promote the people waiting on it.
 */
export async function setAreaStatus(
  _prev: RolloutActionState,
  formData: FormData,
): Promise<RolloutActionState> {
  const adminUser = await requireAdmin()

  const parsed = SetStatusSchema.safeParse({
    areaId: formData.get('areaId'),
    status: formData.get('status'),
  })
  if (!parsed.success) return ERR('Invalid input.')
  const { areaId, status } = parsed.data

  const supabase = createAdminClient()

  const { data: before } = await supabase
    .from('v2_areas')
    .select('id, name, slug, status')
    .eq('id', areaId)
    .single()

  if (!before) return ERR('Area not found.')
  if (before.status === status) return { status: 'idle', message: `Already ${status}.` }

  const { error } = await supabase.rpc('v2_set_area_status', {
    p_area_id: areaId,
    p_status: status,
    p_cascade: false,
  })
  if (error) return ERR(error.message)

  await supabase.from('admin_audit_log').insert({
    admin_id: adminUser.id,
    action: 'set_area_status',
    target_table: 'v2_areas',
    target_id: areaId,
    changes: { status: { from: before.status, to: status } },
  })

  revalidateRollout(areaId)
  return OK(
    status === 'open'
      ? `${before.name} is now OPEN. Nobody has been admitted yet — run "Admit waiting users" to promote them.`
      : `${before.name} set to ${status}.`,
  )
}

// ---------------------------------------------------------------------------
// 2. Admit an area's waiting users
// ---------------------------------------------------------------------------

const AdmitSchema = z.object({
  areaId: z.string().uuid(),
  limit: z.coerce.number().int().min(1).max(2000),
  notify: z.coerce.boolean().optional().default(false),
})

/**
 * Promote up to `limit` waitlisted users in this area to admitted.
 *
 * `p_limit` is load-bearing: with notify on, every promoted user gets a
 * `v2_notifications` row, and each of those fires the push webhook. Start small.
 *
 * NOTE on notify: users admitted off the waitlist have NO fcm_token (decision
 * D-C keeps push registration off the lobby), so the push itself is a no-op for
 * them — the row still lands in their in-app notification feed and is waiting
 * when they next open the app. That's the intended behaviour, not a bug.
 */
export async function admitArea(
  _prev: RolloutActionState,
  formData: FormData,
): Promise<RolloutActionState> {
  const adminUser = await requireAdmin()

  const parsed = AdmitSchema.safeParse({
    areaId: formData.get('areaId'),
    limit: formData.get('limit'),
    notify: formData.get('notify') === 'on' || formData.get('notify') === 'true',
  })
  if (!parsed.success) return ERR('Invalid input — check the limit.')
  const { areaId, limit, notify } = parsed.data

  const supabase = createAdminClient()

  const { data, error } = await supabase.rpc('v2_admit_area', {
    p_area_id: areaId,
    p_limit: limit,
    p_notify: notify,
  })
  if (error) return ERR(error.message)

  const result = (data ?? {}) as {
    admitted?: number
    area?: string
    web_lead_emails?: string[]
  }
  const admitted = result.admitted ?? 0
  const webLeads = result.web_lead_emails ?? []

  await supabase.from('admin_audit_log').insert({
    admin_id: adminUser.id,
    action: 'admit_area',
    target_table: 'v2_admissions',
    target_id: areaId,
    changes: {
      admitted: { from: null, to: admitted },
      notify: { from: null, to: notify },
      limit: { from: null, to: limit },
      web_leads_marked_notified: { from: null, to: webLeads.length },
    },
  })

  revalidateRollout(areaId)

  const parts = [`Admitted ${admitted} user${admitted === 1 ? '' : 's'} in ${result.area ?? 'the area'}.`]
  if (webLeads.length > 0) {
    parts.push(
      `${webLeads.length} account-less web lead${webLeads.length === 1 ? '' : 's'} were marked "notified" but NOT emailed — copy the list below and send it, or they are unreachable.`,
    )
  }
  return OK(parts.join(' '), { webLeadEmails: webLeads, admittedCount: admitted })
}

// ---------------------------------------------------------------------------
// 3. Assign ZIPs to an area
// ---------------------------------------------------------------------------

const AssignZipsSchema = z.object({
  areaId: z.string().uuid(),
  zips: z.string().min(1),
  city: z.string().trim().max(120).optional(),
  state: z.string().trim().length(2).optional().or(z.literal('')),
})

/**
 * Map ZIPs to an area. Accepts anything paste-shaped (commas, spaces, newlines)
 * and keeps only 5-digit tokens — the RPC filters to `^[0-9]{5}$` server-side
 * too, so junk is dropped rather than erroring.
 *
 * One ZIP belongs to exactly one area: re-assigning a ZIP MOVES it. The RPC also
 * back-fills any waitlist rows captured before the ZIP was mapped, which is what
 * turns "unmapped" demand into demand attributed to this area.
 */
export async function assignAreaZips(
  _prev: RolloutActionState,
  formData: FormData,
): Promise<RolloutActionState> {
  const adminUser = await requireAdmin()

  const parsed = AssignZipsSchema.safeParse({
    areaId: formData.get('areaId'),
    zips: formData.get('zips'),
    city: formData.get('city') || undefined,
    state: formData.get('state') || undefined,
  })
  if (!parsed.success) return ERR('Invalid input.')
  const { areaId, zips, city, state } = parsed.data

  const tokens = Array.from(new Set(zips.split(/[^0-9]+/).filter((z) => /^[0-9]{5}$/.test(z))))
  if (tokens.length === 0) return ERR('No valid 5-digit ZIP codes found in that input.')

  const supabase = createAdminClient()
  const { data, error } = await supabase.rpc('v2_assign_area_zips', {
    p_area_id: areaId,
    p_zips: tokens,
    p_city: city ?? null,
    p_state: state ? state.toUpperCase() : null,
  })
  if (error) return ERR(error.message)

  await supabase.from('admin_audit_log').insert({
    admin_id: adminUser.id,
    action: 'assign_area_zips',
    target_table: 'v2_area_zips',
    target_id: areaId,
    changes: { zips: { from: null, to: tokens }, count: { from: null, to: data ?? tokens.length } },
  })

  revalidateRollout(areaId)
  return OK(`Mapped ${tokens.length} ZIP${tokens.length === 1 ? '' : 's'} to this area.`)
}

// ---------------------------------------------------------------------------
// 4. Grant one user admission
// ---------------------------------------------------------------------------

const GrantSchema = z.object({
  userId: z.string().uuid(),
  note: z.string().trim().max(500).optional(),
})

/** Manually admit a single user. Monotonic server-side — never demotes. */
export async function grantAdmission(
  _prev: RolloutActionState,
  formData: FormData,
): Promise<RolloutActionState> {
  const adminUser = await requireAdmin()

  const parsed = GrantSchema.safeParse({
    userId: formData.get('userId'),
    note: formData.get('note') || undefined,
  })
  if (!parsed.success) return ERR('Invalid user id.')
  const { userId, note } = parsed.data

  const supabase = createAdminClient()
  const { error } = await supabase.rpc('v2_grant_admission', {
    p_user: userId,
    p_reason: 'manual',
    p_area: null,
    p_note: note ?? null,
  })
  if (error) return ERR(error.message)

  await supabase.from('admin_audit_log').insert({
    admin_id: adminUser.id,
    action: 'grant_admission',
    target_table: 'v2_admissions',
    target_id: userId,
    changes: { status: { from: 'waitlisted', to: 'admitted' }, note: { from: null, to: note ?? null } },
  })

  revalidateRollout()
  return OK('User admitted.')
}

// ---------------------------------------------------------------------------
// 5. The master lock
// ---------------------------------------------------------------------------

const LockSchema = z.object({
  inviteOnly: z.enum(['on', 'off']),
  confirm: z.string().optional(),
})

/**
 * Flip the global `invite_only` master lock.
 *
 * Turning it OFF is the single highest-blast-radius switch in the product: it
 * activates geography for the entire public fleet on both stores at once, so
 * every user whose ZIP falls in an OPEN area is admitted from that moment. It
 * therefore requires typing UNLOCK. Turning it back ON is the safe direction and
 * needs no confirmation.
 *
 * `v2_access_config` is a singleton keyed `id = true` and has no operator RPC,
 * so this is the one direct table write in this file (service role only — RLS is
 * on with no policies).
 */
export async function setMasterLock(
  _prev: RolloutActionState,
  formData: FormData,
): Promise<RolloutActionState> {
  const adminUser = await requireAdmin()

  const parsed = LockSchema.safeParse({
    inviteOnly: formData.get('inviteOnly'),
    confirm: formData.get('confirm') || undefined,
  })
  if (!parsed.success) return ERR('Invalid input.')
  const { inviteOnly, confirm } = parsed.data
  const nextValue = inviteOnly === 'on'

  if (!nextValue && confirm?.trim().toUpperCase() !== 'UNLOCK') {
    return ERR('Type UNLOCK to confirm turning the master lock off.')
  }

  const supabase = createAdminClient()

  const { data: before } = await supabase
    .from('v2_access_config')
    .select('invite_only')
    .eq('id', true)
    .single()

  if (before?.invite_only === nextValue) {
    return { status: 'idle', message: `Master lock is already ${nextValue ? 'ON' : 'OFF'}.` }
  }

  const { error } = await supabase
    .from('v2_access_config')
    .update({ invite_only: nextValue, updated_at: new Date().toISOString() })
    .eq('id', true)
  if (error) return ERR(error.message)

  await supabase.from('admin_audit_log').insert({
    admin_id: adminUser.id,
    action: 'set_invite_only',
    target_table: 'v2_access_config',
    target_id: 'singleton',
    changes: { invite_only: { from: before?.invite_only ?? null, to: nextValue } },
  })

  revalidateRollout()
  return OK(
    nextValue
      ? 'Master lock ON — only invites, circle members and grandfathered users get in.'
      : 'Master lock OFF. Geography is now live: anyone in an OPEN area is admitted on signup.',
  )
}
