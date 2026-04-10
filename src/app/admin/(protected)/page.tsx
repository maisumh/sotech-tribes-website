import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

// Date-range presets for the dashboard.
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
  const resolved = await searchParams
  const range: RangeKey = isRangeKey(resolved.range) ? resolved.range : '30d'

  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - RANGE_PRESETS[range].days)

  // Regular server client — RPC checks auth.uid() internally.
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_admin_dashboard_analytics', {
    p_from_date: from.toISOString(),
    p_to_date: to.toISOString(),
  })

  const metrics = data as DashboardMetrics | null

  return (
    <div>
      {/* Header */}
      <header className="mb-10 lg:mb-16">
        <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-3 lg:mb-4">
          Dashboard
        </div>
        <h1 className="text-[30px] sm:text-[38px] lg:text-[52px] xl:text-[56px] font-extralight leading-[1.08] text-ink max-w-3xl">
          Good {timeOfDay()}.
          <br />
          Let&rsquo;s see how the community is doing.
        </h1>
      </header>

      {/* Range selector — horizontally scrollable on mobile */}
      <nav
        aria-label="Date range"
        className="mb-8 lg:mb-12 -mx-5 sm:mx-0 px-5 sm:px-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-b border-granny/25"
      >
        <div className="inline-flex items-center gap-0 min-w-max">
          {(Object.keys(RANGE_PRESETS) as RangeKey[]).map((key) => {
            const active = key === range
            return (
              <Link
                key={key}
                href={`/admin?range=${key}`}
                className={`relative px-4 lg:px-5 min-h-[44px] inline-flex items-center text-[11px] lg:text-[12px] uppercase tracking-[0.15em] font-light transition-colors duration-200 whitespace-nowrap ${
                  active ? 'text-firefly' : 'text-granny hover:text-ink active:text-ink'
                }`}
              >
                {RANGE_PRESETS[key].label}
                {active && (
                  <span
                    aria-hidden
                    className="absolute left-0 right-0 -bottom-px h-[2px] bg-casablanca"
                  />
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {error && (
        <div className="mb-8 border-l-2 border-red-700 bg-red-50 px-4 sm:px-5 py-4 text-[13px] text-red-900 font-light">
          Failed to load analytics: {error.message}
        </div>
      )}

      {/* Metric grid — 1 col mobile, 2 col sm, 3 col lg. Hairline gap via bg bleed. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-granny/25 border border-granny/25">
        <MetricCard label="New members" value={metrics?.new_users} />
        <MetricCard label="Wants & haves posted" value={metrics?.new_wants_haves} />
        <MetricCard label="Matches created" value={metrics?.matches} />
        <MetricCard label="Offers sent" value={metrics?.offers} />
        <MetricCard label="Offers accepted" value={metrics?.offers_accepted} accent />
        <MetricCard label="Chats started" value={metrics?.chats_initiated} />
      </div>

      {/* Range footer */}
      <div className="mt-8 lg:mt-10 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-granny/80">
        <span aria-hidden className="block h-px w-8 bg-granny/30" />
        Range: {formatRangeLabel(from, to)}
      </div>

      <p className="mt-12 lg:mt-16 max-w-xl text-[12px] text-granny leading-relaxed font-light">
        These metrics are computed live by{' '}
        <code className="font-mono text-[11px] text-firefly">
          get_admin_dashboard_analytics
        </code>
        , a database function shared with the legacy admin. Change the range
        above to recompute.
      </p>
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
    <div className="bg-offwhite px-6 sm:px-7 py-8 sm:py-9 lg:px-8 lg:py-10">
      <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-4 lg:mb-5">
        {label}
      </div>
      <div
        className={`text-[44px] sm:text-[48px] lg:text-[60px] leading-none font-extralight tabular-nums ${
          accent ? 'text-casablanca-dark' : 'text-firefly'
        }`}
      >
        {display}
      </div>
    </div>
  )
}
