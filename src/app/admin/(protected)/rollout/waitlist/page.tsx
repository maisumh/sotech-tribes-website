import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { GrantAdmissionButton } from '@/components/admin/rollout/GrantAdmissionButton'

/**
 * Every waitlist lead, filterable.
 *
 * `user_id` is nullable by design: a null means an account-less signup from the
 * website form (`/api/waitlist`), which is why the source column matters — those
 * people can only ever be reached by email, never by push or in-app.
 */

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 40

const STATUS_KEYS = ['all', 'waiting', 'notified', 'converted'] as const
type StatusKey = (typeof STATUS_KEYS)[number]

const SOURCE_KEYS = ['all', 'app', 'web'] as const
type SourceKey = (typeof SOURCE_KEYS)[number]

type Parsed = { status: StatusKey; source: SourceKey; page: number }

function parseParams(raw: Record<string, string | undefined>): Parsed {
  return {
    status: (STATUS_KEYS as readonly string[]).includes(raw.status ?? '')
      ? (raw.status as StatusKey)
      : 'all',
    source: (SOURCE_KEYS as readonly string[]).includes(raw.source ?? '')
      ? (raw.source as SourceKey)
      : 'all',
    page: Math.max(1, parseInt(raw.page ?? '1', 10) || 1),
  }
}

function buildHref(cur: Parsed, override: Partial<Parsed>): string {
  const m = { ...cur, ...override }
  const p = new URLSearchParams()
  if (m.status !== 'all') p.set('status', m.status)
  if (m.source !== 'all') p.set('source', m.source)
  if (m.page !== 1) p.set('page', String(m.page))
  const qs = p.toString()
  return qs ? `/admin/rollout/waitlist?${qs}` : '/admin/rollout/waitlist'
}

function fmt(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

type Row = {
  id: string
  email: string
  name: string | null
  zip: string | null
  status: string
  source: string | null
  user_id: string | null
  area_id: string | null
  created_at: string
}

export default async function WaitlistPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const p = parseParams(await searchParams)
  const supabase = createAdminClient()

  const from = (p.page - 1) * PAGE_SIZE
  let query = supabase
    .from('v2_waitlist')
    .select('id, email, name, zip, status, source, user_id, area_id, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + PAGE_SIZE - 1)

  if (p.status !== 'all') query = query.eq('status', p.status)
  if (p.source !== 'all') query = query.eq('source', p.source)

  const { data, count, error } = (await query) as {
    data: Row[] | null
    count: number | null
    error: { message: string } | null
  }

  const rows = data ?? []
  const areaIds = Array.from(new Set(rows.map((r) => r.area_id).filter((v): v is string => !!v)))
  const { data: areas } = areaIds.length
    ? await supabase.from('v2_areas').select('id, name').in('id', areaIds)
    : { data: [] as { id: string; name: string }[] }
  const areaMap = new Map((areas ?? []).map((a) => [a.id, a.name]))

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1

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
          Waitlist leads
        </h1>
        <p className="mt-2 text-[13px] text-granny font-light">
          {count !== null && count !== undefined ? `${count.toLocaleString()} total` : 'Loading…'}
        </p>
      </header>

      {/* Filters */}
      <nav
        aria-label="Status filter"
        className="mb-4 flex items-center gap-0 border-b border-granny/25 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-5 px-5 sm:mx-0 sm:px-0"
      >
        {STATUS_KEYS.map((k) => {
          const active = p.status === k
          return (
            <Link
              key={k}
              href={buildHref(p, { status: k, page: 1 })}
              className={`relative min-h-[44px] inline-flex items-center px-4 lg:px-5 text-[11px] lg:text-[12px] uppercase tracking-[0.15em] font-light whitespace-nowrap transition-colors ${
                active ? 'text-firefly' : 'text-granny hover:text-ink'
              }`}
            >
              {k === 'all' ? 'All' : k}
              {active && <span aria-hidden className="absolute left-0 right-0 -bottom-px h-[2px] bg-casablanca" />}
            </Link>
          )
        })}
      </nav>

      <div className="mb-8 lg:mb-10 flex items-center gap-2">
        {SOURCE_KEYS.map((s) => (
          <Link
            key={s}
            href={buildHref(p, { source: s, page: 1 })}
            className={`min-h-[34px] inline-flex items-center px-3 rounded-full text-[10px] uppercase tracking-[0.15em] font-medium transition-colors ${
              p.source === s ? 'bg-firefly text-offwhite' : 'bg-firefly/[0.06] text-granny hover:text-firefly'
            }`}
          >
            {s === 'all' ? 'All sources' : s}
          </Link>
        ))}
      </div>

      {error && (
        <div className="mb-8 border-l-2 border-red-700 bg-red-50 px-4 sm:px-5 py-4 text-[13px] text-red-900 font-light">
          Failed to load leads: {error.message}
        </div>
      )}

      {rows.length === 0 ? (
        <div className="border border-granny/20 py-16 text-center text-granny text-[13px] font-light italic">
          No leads match these filters.
        </div>
      ) : (
        <ul className="admin-stagger divide-y divide-granny/15 border-y border-granny/15">
          {rows.map((r) => (
            <li key={r.id} className="py-4 px-1 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[15px] text-ink font-light truncate">
                    {r.name || r.email}
                  </span>
                  {r.user_id === null && (
                    <span className="px-2 py-[2px] bg-granny/15 text-granny text-[9px] uppercase tracking-[0.15em]">
                      no account
                    </span>
                  )}
                  <span
                    className={`px-2 py-[2px] text-[9px] uppercase tracking-[0.15em] ${
                      r.status === 'waiting'
                        ? 'bg-casablanca/20 text-casablanca-dark'
                        : 'bg-firefly/10 text-firefly'
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-granny truncate">
                  {r.email} · {r.zip ?? 'no zip'} ·{' '}
                  {r.area_id ? (areaMap.get(r.area_id) ?? 'unknown area') : 'unmapped'} ·{' '}
                  {r.source ?? 'unknown'} · {fmt(r.created_at)}
                </div>
              </div>
              {r.user_id && r.status === 'waiting' && (
                <GrantAdmissionButton userId={r.user_id} />
              )}
            </li>
          ))}
        </ul>
      )}

      {count !== null && count !== undefined && count > PAGE_SIZE && (
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-[12px] font-light">
          <div className="text-granny uppercase tracking-[0.15em] text-[10px]">
            Page {p.page} of {totalPages} · {count.toLocaleString()} total
          </div>
          <div className="flex items-center gap-2">
            {p.page > 1 && (
              <Link
                href={buildHref(p, { page: p.page - 1 })}
                className="min-h-[44px] flex-1 sm:flex-none inline-flex items-center justify-center px-4 border border-granny/30 text-ink hover:border-firefly hover:text-firefly transition-colors uppercase tracking-[0.15em] text-[10px]"
              >
                ← Prev
              </Link>
            )}
            {p.page < totalPages && (
              <Link
                href={buildHref(p, { page: p.page + 1 })}
                className="min-h-[44px] flex-1 sm:flex-none inline-flex items-center justify-center px-4 border border-granny/30 text-ink hover:border-firefly hover:text-firefly transition-colors uppercase tracking-[0.15em] text-[10px]"
              >
                Next →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
