import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

// Date-range presets for the dashboard.
// Kept module-level (hoisted) so they're not reallocated per render.
const RANGE_PRESETS = {
  '1d': { label: 'Today', days: 1 },
  '7d': { label: '7 days', days: 7 },
  '30d': { label: '30 days', days: 30 },
  '90d': { label: '90 days', days: 90 },
} as const

type RangeKey = keyof typeof RANGE_PRESETS

type DashboardMetrics = {
  new_users: number
  new_wants_haves: number
  matches: number
  offers: number
  offers_accepted: number
  chats_initiated: number
}

function isRangeKey(value: string | undefined): value is RangeKey {
  return value !== undefined && value in RANGE_PRESETS
}

function timeOfDay(): string {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 18) return 'afternoon'
  return 'evening'
}

function formatRangeLabel(from: Date, to: Date): string {
  const fmt = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  return `${fmt.format(from)} — ${fmt.format(to)}`
}

export const dynamic = 'force-dynamic'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>
}) {
  const params = await searchParams
  const range: RangeKey = isRangeKey(params.range) ? params.range : '30d'

  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - RANGE_PRESETS[range].days)

  // IMPORTANT: use the regular server client here (not the admin client).
  // get_admin_dashboard_analytics calls auth.uid() internally and needs the
  // caller's JWT to verify admin role. The service role client has auth.uid()
  // = null and would fail that check.
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_admin_dashboard_analytics', {
    p_from_date: from.toISOString(),
    p_to_date: to.toISOString(),
  })

  const metrics = data as DashboardMetrics | null

  return (
    <div>
      {/* Header: greeting + range selector */}
      <header className="flex flex-col gap-10 mb-16 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-4">
            Dashboard
          </div>
          <h1 className="text-[44px] lg:text-[56px] font-extralight leading-[1.05] text-ink max-w-2xl">
            Good {timeOfDay()}.
            <br />
            Let&rsquo;s see how the community is doing.
          </h1>
        </div>

        <nav
          aria-label="Date range"
          className="flex items-center gap-0 shrink-0 border-b border-granny/25"
        >
          {(Object.keys(RANGE_PRESETS) as RangeKey[]).map((key) => {
            const active = key === range
            return (
              <Link
                key={key}
                href={`/admin?range=${key}`}
                className={`relative px-4 py-3 text-[12px] uppercase tracking-[0.15em] font-light transition-colors duration-200 ${
                  active ? 'text-firefly' : 'text-granny hover:text-ink'
                }`}
              >
                {RANGE_PRESETS[key].label}
                {active && (
                  <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-casablanca" />
                )}
              </Link>
            )
          })}
        </nav>
      </header>

      {error && (
        <div className="mb-10 border-l-2 border-red-700 bg-red-50 px-5 py-4 text-[13px] text-red-900 font-light">
          Failed to load analytics: {error.message}
        </div>
      )}

      {/* Metric grid — hairline gap between cards via bg bleed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-granny/25 border border-granny/25">
        <MetricCard label="New members" value={metrics?.new_users} />
        <MetricCard
          label="Wants & haves posted"
          value={metrics?.new_wants_haves}
        />
        <MetricCard label="Matches created" value={metrics?.matches} />
        <MetricCard label="Offers sent" value={metrics?.offers} />
        <MetricCard
          label="Offers accepted"
          value={metrics?.offers_accepted}
          accent
        />
        <MetricCard label="Chats started" value={metrics?.chats_initiated} />
      </div>

      {/* Footer range label */}
      <div className="mt-10 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-granny/80">
        <span className="block h-px w-8 bg-granny/30" />
        Range: {formatRangeLabel(from, to)}
      </div>

      {/* Context note about reused RPC */}
      <div className="mt-16 max-w-xl text-[12px] text-granny leading-relaxed font-light">
        These metrics are computed live by{' '}
        <code className="font-mono text-[11px] text-firefly">
          get_admin_dashboard_analytics
        </code>
        , a database function shared with the legacy admin. Change the range
        above to recompute.
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  accent = false,
}: {
  label: string
  value: number | undefined
  accent?: boolean
}) {
  const display =
    value === undefined || value === null ? '—' : value.toLocaleString()
  return (
    <div className="bg-offwhite px-8 py-10 relative">
      <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-5">
        {label}
      </div>
      <div className="flex items-baseline gap-3">
        <div
          className={`text-[60px] leading-none font-extralight tabular-nums ${
            accent ? 'text-casablanca-dark' : 'text-firefly'
          }`}
        >
          {display}
        </div>
      </div>
    </div>
  )
}
