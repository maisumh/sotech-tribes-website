import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { MintInviteForm } from '@/components/admin/rollout/MintInviteForm'
import { InviteRevokeButton } from '@/components/admin/rollout/InviteRevokeButton'

/**
 * Invite codes — the only way anyone gets in while the master lock is on.
 *
 * `invites` predates the rollout gate (it's the v1 F&F table) and was extended
 * with max_uses / use_count / expires_at / revoked / area_id / circle_id.
 * **`max_uses IS NULL` means UNLIMITED**, not single-use — rendered explicitly
 * below, because that ambiguity already caused a bug before launch.
 */

export const dynamic = 'force-dynamic'

type InviteRow = {
  id: string
  code: string
  label: string | null
  max_uses: number | null
  use_count: number
  expires_at: string | null
  revoked: boolean
  status: string
  created_at: string
}

function fmt(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/** Why a code would be refused right now, or null if it's usable. */
function deadReason(i: InviteRow): string | null {
  if (i.revoked) return 'revoked'
  if (i.expires_at && new Date(i.expires_at).getTime() < Date.now()) return 'expired'
  if (i.max_uses !== null && i.use_count >= i.max_uses) return 'used up'
  return null
}

export default async function InvitesPage() {
  const supabase = createAdminClient()

  const [invitesRes, redemptionsRes] = await Promise.all([
    supabase
      .from('invites')
      .select('id, code, label, max_uses, use_count, expires_at, revoked, status, created_at')
      .order('created_at', { ascending: false })
      .limit(200),
    supabase.from('v2_invite_redemptions').select('invite_id'),
  ])

  const invites = (invitesRes.data ?? []) as InviteRow[]
  const redemptions = (redemptionsRes.data ?? []) as { invite_id: string }[]
  const redeemedBy = new Map<string, number>()
  for (const r of redemptions) {
    redeemedBy.set(r.invite_id, (redeemedBy.get(r.invite_id) ?? 0) + 1)
  }

  const live = invites.filter((i) => deadReason(i) === null)

  return (
    <div>
      <header className="admin-fade-up mb-8 lg:mb-12">
        <Link
          href="/admin/rollout"
          className="admin-lift inline-block text-[10px] uppercase tracking-[0.22em] text-granny hover:text-firefly transition-colors mb-3 lg:mb-4"
        >
          ← Rollout
        </Link>
        <h1 className="text-[32px] sm:text-[38px] lg:text-[44px] font-extralight leading-[1.05] text-ink">
          Invite codes
        </h1>
        <p className="mt-2 text-[13px] text-granny font-light max-w-2xl">
          {live.length} usable of {invites.length}. An invite is checked{' '}
          <strong className="font-medium">before</strong> ZIP, so it admits someone anywhere —
          that&rsquo;s deliberate, and it&rsquo;s how a community joins regardless of which ZIPs are open.
        </p>
      </header>

      <MintInviteForm />

      <h2 className="text-[11px] uppercase tracking-[0.22em] text-granny mb-4">All codes</h2>

      {invitesRes.error && (
        <div className="mb-8 border-l-2 border-red-700 bg-red-50 px-4 py-4 text-[13px] text-red-900 font-light">
          Failed to load invites: {invitesRes.error.message}
        </div>
      )}

      {invites.length === 0 ? (
        <div className="border border-granny/20 py-16 text-center text-granny text-[13px] font-light italic">
          No codes yet. While the master lock is on, nobody can join without one.
        </div>
      ) : (
        <ul className="admin-stagger divide-y divide-granny/15 border-y border-granny/15">
          {invites.map((i) => {
            const dead = deadReason(i)
            const uses =
              i.max_uses === null
                ? `${i.use_count} used · unlimited`
                : `${i.use_count} / ${i.max_uses} used`
            return (
              <li key={i.id} className="py-4 px-1 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[15px] text-ink font-medium tracking-wide">{i.code}</span>
                    {i.max_uses === null && !dead && (
                      <span className="px-2 py-[2px] bg-casablanca/20 text-casablanca-dark text-[9px] uppercase tracking-[0.15em]">
                        unlimited
                      </span>
                    )}
                    {dead && (
                      <span className="px-2 py-[2px] bg-granny/15 text-granny text-[9px] uppercase tracking-[0.15em]">
                        {dead}
                      </span>
                    )}
                    {!dead && (
                      <span className="px-2 py-[2px] bg-firefly/10 text-firefly text-[9px] uppercase tracking-[0.15em]">
                        usable
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-[11px] text-granny truncate">
                    {i.label ? `${i.label} · ` : ''}
                    {uses} · {redeemedBy.get(i.id) ?? 0} redemption
                    {(redeemedBy.get(i.id) ?? 0) === 1 ? '' : 's'} · expires{' '}
                    {i.expires_at ? fmt(i.expires_at) : 'never'} · minted {fmt(i.created_at)}
                  </div>
                </div>
                <InviteRevokeButton code={i.code} revoked={i.revoked} />
              </li>
            )
          })}
        </ul>
      )}

      <p className="mt-8 pt-6 border-t border-granny/15 text-[11px] text-granny font-light italic max-w-3xl">
        Revoking stops future redemptions only — anyone the code already admitted stays admitted,
        because admission is monotonic server-side. Every mint and revoke is written to the admin
        audit log.
      </p>
    </div>
  )
}
