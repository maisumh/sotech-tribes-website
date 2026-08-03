import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { AreaControls } from '@/components/admin/rollout/AreaControls'

/** One rollout area: its readiness, its ZIPs, who's waiting, and the operator controls. */

export const dynamic = 'force-dynamic'

type Readiness = {
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

type WaitRow = {
  id: string
  email: string
  name: string | null
  zip: string | null
  status: string
  source: string | null
  user_id: string | null
  created_at: string
}

function fmt(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function AreaDetailPage({
  params,
}: {
  params: Promise<{ areaId: string }>
}) {
  const { areaId } = await params
  const supabase = createAdminClient()

  const { data: area } = (await supabase
    .from('v2_area_readiness')
    .select('*')
    .eq('id', areaId)
    .single()) as { data: Readiness | null }

  if (!area) notFound()

  const [zipsRes, waitRes] = await Promise.all([
    supabase.from('v2_area_zips').select('zip, city, state').eq('area_id', areaId).order('zip'),
    supabase
      .from('v2_waitlist')
      .select('id, email, name, zip, status, source, user_id, created_at')
      .eq('area_id', areaId)
      .order('created_at', { ascending: true })
      .limit(200),
  ])

  const zips = (zipsRes.data ?? []) as { zip: string; city: string | null; state: string | null }[]
  const waiting = (waitRes.data ?? []) as WaitRow[]

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
          {area.name}
        </h1>
        <p className="mt-2 text-[13px] text-granny font-light">
          {area.slug} · status <strong className="font-medium text-ink">{area.status}</strong>
        </p>
      </header>

      <div className="admin-stagger grid grid-cols-2 lg:grid-cols-4 gap-px bg-granny/15 border border-granny/15 mb-10">
        {[
          { label: 'ZIPs mapped', value: area.zip_count },
          { label: 'Residents', value: area.residents },
          { label: 'Open listings', value: area.open_listings },
          { label: 'Waiting', value: area.waitlisted },
        ].map((s) => (
          <div key={s.label} className="bg-offwhite px-4 py-5">
            <div className="text-[26px] font-extralight text-firefly leading-none">
              {s.value.toLocaleString()}
            </div>
            <div className="mt-2 text-[9px] uppercase tracking-[0.18em] text-granny">{s.label}</div>
          </div>
        ))}
      </div>

      {area.open_listings === 0 && area.status !== 'open' && (
        <div className="mb-10 border-l-2 border-casablanca bg-casablanca/5 px-4 py-3 text-[12px] text-ink font-light max-w-3xl">
          There are no open listings in this area yet. Opening it now means the first admitted users
          arrive to an empty marketplace — the exact thing the rollout gate exists to prevent.
        </div>
      )}

      <div className="mb-12">
        <AreaControls
          areaId={area.id}
          areaName={area.name}
          status={area.status}
          waitlisted={area.waitlisted}
          zipCount={area.zip_count}
        />
      </div>

      {/* ZIPs */}
      <section className="mb-12">
        <h2 className="text-[11px] uppercase tracking-[0.22em] text-granny mb-4">
          Mapped ZIPs ({zips.length})
        </h2>
        {zips.length === 0 ? (
          <div className="border border-granny/20 py-10 text-center text-granny text-[13px] font-light italic">
            No ZIPs mapped to this area.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {zips.map((z) => (
              <span
                key={z.zip}
                className="inline-flex items-center px-3 py-1.5 bg-firefly/[0.06] text-[12px] font-light text-ink"
                title={[z.city, z.state].filter(Boolean).join(', ')}
              >
                {z.zip}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Waiting */}
      <section>
        <h2 className="text-[11px] uppercase tracking-[0.22em] text-granny mb-4">
          Leads in this area ({waiting.length}
          {waiting.length === 200 ? '+' : ''})
        </h2>
        {waiting.length === 0 ? (
          <div className="border border-granny/20 py-10 text-center text-granny text-[13px] font-light italic">
            Nobody waiting on this area.
          </div>
        ) : (
          <ul className="admin-stagger divide-y divide-granny/15 border-y border-granny/15">
            {waiting.map((w) => (
              <li key={w.id} className="py-3.5 px-1 flex items-center gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[14px] text-ink font-light truncate">
                      {w.name || w.email}
                    </span>
                    {w.user_id === null && (
                      <span className="px-2 py-[2px] bg-granny/15 text-granny text-[9px] uppercase tracking-[0.15em]">
                        web · no account
                      </span>
                    )}
                    {w.status !== 'waiting' && (
                      <span className="px-2 py-[2px] bg-firefly/10 text-firefly text-[9px] uppercase tracking-[0.15em]">
                        {w.status}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-[11px] text-granny truncate">
                    {w.email} · {w.zip ?? 'no zip'} · {w.source ?? 'unknown'} · {fmt(w.created_at)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
