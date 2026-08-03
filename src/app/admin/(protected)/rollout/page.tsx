import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { MasterLockPanel } from '@/components/admin/rollout/MasterLockPanel'

/**
 * Rollout control room — the staged geographic launch.
 *
 * Answers the two operator questions, in order:
 *   1. "Is the gate on, and what does it currently admit?"  → Access panel
 *   2. "Which area do I open next?"                          → Demand map
 *
 * Reads the two purpose-built views (`v2_area_readiness`, `v2_waitlist_demand`)
 * rather than assembling joins — see `docs/admin-backend-contract.md` §16. Both
 * views are revoked from anon/authenticated, so this needs the service-role
 * client; `requireAdmin()` in the (protected) layout is the gate.
 */

export const dynamic = 'force-dynamic'

type AreaReadiness = {
  id: string
  slug: string
  name: string
  status: 'open' | 'waitlist' | 'closed'
  waitlist_threshold: number | null
  zip_count: number
  residents: number
  open_listings: number
  waitlisted: number
}

type Demand = {
  zip: string | null
  area_id: string | null
  area_name: string | null
  area_status: string
  waitlist_total: number
  app_blocked_signups: number
  web_leads: number
  last_7d: number
  last_30d: number
  first_seen: string | null
}

type AccessConfig = { invite_only: boolean; geo_gate_enabled: boolean }

const STATUS_STYLES: Record<string, string> = {
  open: 'bg-firefly text-offwhite',
  waitlist: 'bg-casablanca/25 text-casablanca-dark',
  closed: 'bg-granny/15 text-granny',
  unmapped: 'bg-red-50 text-red-900',
}

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-[3px] rounded-full text-[9px] uppercase tracking-[0.15em] font-medium ${
        STATUS_STYLES[status] ?? 'bg-granny/15 text-granny'
      }`}
    >
      {status}
    </span>
  )
}

export default async function RolloutPage() {
  const supabase = createAdminClient()

  const [cfgRes, areasRes, demandRes, usersRes, invitesRes] = await Promise.all([
    supabase.from('v2_access_config').select('invite_only, geo_gate_enabled').eq('id', true).single(),
    supabase.from('v2_area_readiness').select('*').order('waitlisted', { ascending: false }),
    supabase.from('v2_waitlist_demand').select('*').order('waitlist_total', { ascending: false }).limit(50),
    supabase.from('users').select('admission_status'),
    supabase.from('invites').select('id, revoked', { count: 'exact', head: true }),
  ])

  const cfg = (cfgRes.data ?? null) as AccessConfig | null
  const areas = (areasRes.data ?? []) as AreaReadiness[]
  const demand = (demandRes.data ?? []) as Demand[]

  const admissionCounts = ((usersRes.data ?? []) as { admission_status: string | null }[]).reduce(
    (acc, u) => {
      const k = u.admission_status ?? 'ungated'
      acc[k] = (acc[k] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const totalWaitlisted = demand.reduce((n, d) => n + d.waitlist_total, 0)
  const unmappedDemand = demand.filter((d) => d.area_status === 'unmapped')
  const openAreas = areas.filter((a) => a.status === 'open').length

  const loadError = cfgRes.error || areasRes.error || demandRes.error

  return (
    <div>
      <header className="admin-fade-up mb-8 lg:mb-12">
        <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-3 lg:mb-4">
          System · Rollout
        </div>
        <h1 className="text-[32px] sm:text-[38px] lg:text-[44px] font-extralight leading-[1.05] text-ink">
          Rollout gate
        </h1>
        <p className="mt-2 text-[13px] text-granny font-light max-w-2xl">
          Tribes opens area by area so nobody signs up into an empty marketplace. Account creation
          is never blocked — what&rsquo;s gated is admission to the marketplace.
        </p>
      </header>

      {loadError && (
        <div className="mb-8 border-l-2 border-red-700 bg-red-50 px-4 sm:px-5 py-4 text-[13px] text-red-900 font-light">
          Failed to load rollout state: {loadError.message}
        </div>
      )}

      {/* Access — the master lock */}
      {cfg && (
        <MasterLockPanel
          inviteOnly={cfg.invite_only}
          geoGateEnabled={cfg.geo_gate_enabled}
          openAreas={openAreas}
        />
      )}

      {/* Headline numbers */}
      <div className="admin-stagger grid grid-cols-2 lg:grid-cols-4 gap-px bg-granny/15 border border-granny/15 mb-10 lg:mb-14">
        {[
          { label: 'Admitted', value: admissionCounts.admitted ?? 0 },
          { label: 'Waitlisted', value: admissionCounts.waitlisted ?? 0 },
          { label: 'Ungated', value: admissionCounts.ungated ?? 0, hint: 'pre-gate signups — fail open' },
          { label: 'Waitlist leads', value: totalWaitlisted, hint: 'incl. account-less web' },
        ].map((s) => (
          <div key={s.label} className="bg-offwhite px-4 py-5">
            <div className="text-[26px] font-extralight text-firefly leading-none">
              {s.value.toLocaleString()}
            </div>
            <div className="mt-2 text-[9px] uppercase tracking-[0.18em] text-granny">{s.label}</div>
            {s.hint && <div className="mt-1 text-[10px] text-granny/70 font-light italic">{s.hint}</div>}
          </div>
        ))}
      </div>

      {/* Areas */}
      <section className="mb-12 lg:mb-16">
        <h2 className="text-[11px] uppercase tracking-[0.22em] text-granny mb-4">Areas</h2>

        {areas.length === 0 ? (
          <div className="border border-granny/20 py-12 text-center text-granny text-[13px] font-light italic">
            No areas defined.
          </div>
        ) : (
          <ul className="admin-stagger divide-y divide-granny/15 border-y border-granny/15">
            {areas.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/admin/rollout/${a.id}`}
                  className="admin-press flex items-center gap-4 py-4 px-1 hover:bg-firefly/[0.03] transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[15px] text-ink font-light truncate">{a.name}</span>
                      <StatusPill status={a.status} />
                    </div>
                    <div className="mt-1 text-[11px] text-granny truncate">
                      {a.slug} · {a.zip_count} ZIP{a.zip_count === 1 ? '' : 's'} · {a.residents}{' '}
                      resident{a.residents === 1 ? '' : 's'} · {a.open_listings} open listing
                      {a.open_listings === 1 ? '' : 's'}
                      {a.zip_count === 0 && (
                        <span className="text-red-800"> · no ZIPs mapped — cannot admit by geography</span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-[20px] font-extralight text-firefly leading-none">
                      {a.waitlisted}
                    </div>
                    <div className="text-[9px] uppercase tracking-[0.15em] text-granny mt-1">
                      waiting
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Demand map */}
      <section>
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
          <h2 className="text-[11px] uppercase tracking-[0.22em] text-granny">
            Demand by ZIP — which area to open next
          </h2>
          <Link
            href="/admin/rollout/waitlist"
            className="admin-lift text-[11px] uppercase tracking-[0.15em] text-firefly hover:text-ink transition-colors"
          >
            All leads →
          </Link>
        </div>

        {unmappedDemand.length > 0 && (
          <div className="mb-5 border-l-2 border-casablanca bg-casablanca/5 px-4 py-3 text-[12px] text-ink font-light">
            <strong className="font-medium">
              {unmappedDemand.reduce((n, d) => n + d.waitlist_total, 0)} people
            </strong>{' '}
            are waiting in {unmappedDemand.length} ZIP{unmappedDemand.length === 1 ? '' : 's'} that
            belong to no area. They can never be admitted by geography until those ZIPs are mapped
            to one.
          </div>
        )}

        {demand.length === 0 ? (
          <div className="border border-granny/20 py-12 text-center text-granny text-[13px] font-light italic">
            No waitlist demand yet.
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <ul className="admin-stagger lg:hidden divide-y divide-granny/15 border-y border-granny/15">
              {demand.map((d) => (
                <li key={`${d.zip}-${d.area_id ?? 'none'}`} className="py-4 px-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[15px] text-ink font-light">{d.zip ?? '—'}</span>
                    <StatusPill status={d.area_status} />
                  </div>
                  <div className="mt-1 text-[11px] text-granny">
                    {d.area_name ?? 'Unmapped'} · {d.waitlist_total} waiting ({d.app_blocked_signups}{' '}
                    app / {d.web_leads} web) · {d.last_7d} in 7d
                  </div>
                </li>
              ))}
            </ul>

            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto border border-granny/15">
              <table className="w-full text-[13px] font-light">
                <thead>
                  <tr className="text-[9px] uppercase tracking-[0.18em] text-granny border-b border-granny/15">
                    <th className="text-left px-4 py-3">ZIP</th>
                    <th className="text-left px-4 py-3">Area</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-right px-4 py-3">Waiting</th>
                    <th className="text-right px-4 py-3">App</th>
                    <th className="text-right px-4 py-3">Web</th>
                    <th className="text-right px-4 py-3">7d</th>
                    <th className="text-right px-4 py-3">30d</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-granny/10">
                  {demand.map((d) => (
                    <tr key={`${d.zip}-${d.area_id ?? 'none'}`} className="hover:bg-firefly/[0.03]">
                      <td className="px-4 py-3 text-ink">{d.zip ?? '—'}</td>
                      <td className="px-4 py-3 text-granny">{d.area_name ?? 'Unmapped'}</td>
                      <td className="px-4 py-3">
                        <StatusPill status={d.area_status} />
                      </td>
                      <td className="px-4 py-3 text-right text-ink font-medium">{d.waitlist_total}</td>
                      <td className="px-4 py-3 text-right text-granny">{d.app_blocked_signups}</td>
                      <td className="px-4 py-3 text-right text-granny">{d.web_leads}</td>
                      <td className="px-4 py-3 text-right text-granny">{d.last_7d}</td>
                      <td className="px-4 py-3 text-right text-granny">{d.last_30d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      <p className="mt-10 pt-6 border-t border-granny/15 text-[11px] text-granny font-light italic max-w-3xl">
        Invites: {invitesRes.count ?? 0} minted. Opening an area is two steps — set it OPEN (silent),
        then admit the people waiting on it. Every action here is written to the admin audit log.
      </p>
    </div>
  )
}
