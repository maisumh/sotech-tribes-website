import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

const PAGE_SIZE = 25

type StatusKey = 'open' | 'reviewed' | 'actioned' | 'dismissed' | 'all'
type ContextKey = 'all' | 'listing' | 'profile' | 'chat' | 'other'

type ParsedParams = {
  status: StatusKey
  context: ContextKey
  page: number
}

const STATUS_KEYS: StatusKey[] = ['open', 'reviewed', 'actioned', 'dismissed', 'all']
const CONTEXT_KEYS: ContextKey[] = ['all', 'listing', 'profile', 'chat', 'other']

function parseSearchParams(raw: Record<string, string | undefined>): ParsedParams {
  const status = (STATUS_KEYS as string[]).includes(raw.status ?? '')
    ? (raw.status as StatusKey)
    : 'open'
  const context = (CONTEXT_KEYS as string[]).includes(raw.context ?? '')
    ? (raw.context as ContextKey)
    : 'all'
  const page = Math.max(1, parseInt(raw.page ?? '1', 10) || 1)
  return { status, context, page }
}

function buildHref(current: ParsedParams, override: Partial<ParsedParams>): string {
  const merged = { ...current, ...override }
  const p = new URLSearchParams()
  if (merged.status !== 'open') p.set('status', merged.status)
  if (merged.context !== 'all') p.set('context', merged.context)
  if (merged.page !== 1) p.set('page', String(merged.page))
  const qs = p.toString()
  return qs ? `/admin/reports?${qs}` : '/admin/reports'
}

function formatDateTime(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

type ReportRow = {
  id: string
  reporter_id: string
  reported_user_id: string | null
  reported_listing_id: number | null
  context: string
  reason: string
  status: string
  created_at: string
  reviewed_at: string | null
}

type UserLite = { id: string; name: string | null; email: string | null }

const STATUS_STYLE: Record<string, string> = {
  open: 'bg-red-50 text-red-700',
  reviewed: 'bg-casablanca/20 text-casablanca-dark',
  actioned: 'bg-firefly/10 text-firefly',
  dismissed: 'bg-granny/15 text-granny',
}

export const dynamic = 'force-dynamic'

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const raw = await searchParams
  const p = parseSearchParams(raw)

  const from = (p.page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = createAdminClient()

  let query = supabase
    .from('v2_reports')
    .select(
      'id, reporter_id, reported_user_id, reported_listing_id, context, reason, status, created_at, reviewed_at',
      { count: 'exact' },
    )
    .order('created_at', { ascending: false })
    .range(from, to)

  if (p.status !== 'all') query = query.eq('status', p.status)
  if (p.context !== 'all') query = query.eq('context', p.context)

  const { data: reports, count, error } = (await query) as {
    data: ReportRow[] | null
    count: number | null
    error: { message: string } | null
  }

  // All-time open backlog gauge (independent of the current filter)
  const { count: openCount } = await supabase
    .from('v2_reports')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'open')

  // Batch-fetch users (reporter + reported user) and listings
  const userIds = new Set<string>()
  const listingIds = new Set<number>()
  for (const r of reports ?? []) {
    userIds.add(r.reporter_id)
    if (r.reported_user_id) userIds.add(r.reported_user_id)
    if (r.reported_listing_id) listingIds.add(r.reported_listing_id)
  }
  const [usersRes, listingsRes] = await Promise.all([
    userIds.size
      ? supabase.from('users').select('id, name, email').in('id', Array.from(userIds))
      : Promise.resolve({ data: [] as UserLite[] }),
    listingIds.size
      ? supabase.from('want_have').select('id, title').in('id', Array.from(listingIds))
      : Promise.resolve({ data: [] as { id: number; title: string | null }[] }),
  ])
  const userMap = new Map((usersRes.data ?? []).map((u) => [u.id, u as UserLite]))
  const listingMap = new Map(
    (listingsRes.data ?? []).map((l) => [l.id, l as { id: number; title: string | null }]),
  )

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1

  function targetLabel(r: ReportRow): { text: string; href: string | null } {
    if (r.reported_user_id) {
      const u = userMap.get(r.reported_user_id)
      return {
        text: u?.name || u?.email || 'Unknown user',
        href: `/admin/users/${r.reported_user_id}`,
      }
    }
    if (r.reported_listing_id) {
      const l = listingMap.get(r.reported_listing_id)
      return {
        text: l?.title || `Listing #${r.reported_listing_id}`,
        href: `/admin/want-have/${r.reported_listing_id}`,
      }
    }
    return { text: '—', href: null }
  }

  return (
    <div>
      <header className="admin-fade-up mb-8 lg:mb-12">
        <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-3 lg:mb-4">
          Moderation
        </div>
        <h1 className="text-[32px] sm:text-[38px] lg:text-[44px] font-extralight leading-[1.05] text-ink">
          Reports
        </h1>
        <p className="mt-2 text-[13px] text-granny font-light">
          {openCount ? (
            <span className="text-red-700">
              {openCount.toLocaleString()} open
            </span>
          ) : (
            'No open reports'
          )}
          {count !== null && count !== undefined && (
            <span className="text-granny">
              {' · '}
              {count.toLocaleString()} {p.status === 'all' ? 'total' : p.status}
            </span>
          )}
        </p>
      </header>

      {/* Status filter pills */}
      <nav
        aria-label="Report status filter"
        className="mb-4 flex items-center gap-0 border-b border-granny/25 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-5 px-5 sm:mx-0 sm:px-0"
      >
        {STATUS_KEYS.map((key) => {
          const active = p.status === key
          const label = key === 'all' ? 'All' : key[0].toUpperCase() + key.slice(1)
          return (
            <Link
              key={key}
              href={buildHref(p, { status: key, page: 1 })}
              className={`relative min-h-[44px] inline-flex items-center px-4 lg:px-5 text-[11px] lg:text-[12px] uppercase tracking-[0.15em] font-light whitespace-nowrap transition-colors ${
                active ? 'text-firefly' : 'text-granny hover:text-ink'
              }`}
            >
              {label}
              {active && (
                <span aria-hidden className="absolute left-0 right-0 -bottom-px h-[2px] bg-casablanca" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Context filter pills */}
      <nav
        aria-label="Report context filter"
        className="mb-8 lg:mb-10 flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-5 px-5 sm:mx-0 sm:px-0"
      >
        {CONTEXT_KEYS.map((key) => {
          const active = p.context === key
          return (
            <Link
              key={key}
              href={buildHref(p, { context: key, page: 1 })}
              className={`min-h-[34px] inline-flex items-center px-3 rounded-full text-[10px] uppercase tracking-[0.15em] font-medium whitespace-nowrap transition-colors ${
                active
                  ? 'bg-firefly text-offwhite'
                  : 'bg-firefly/[0.06] text-granny hover:text-firefly'
              }`}
            >
              {key === 'all' ? 'All contexts' : key}
            </Link>
          )
        })}
      </nav>

      {error && (
        <div className="mb-8 border-l-2 border-red-700 bg-red-50 px-4 sm:px-5 py-4 text-[13px] text-red-900 font-light">
          Failed to load reports: {error.message}
        </div>
      )}

      {/* Mobile cards */}
      <div className="lg:hidden">
        {reports && reports.length > 0 ? (
          <ul className="admin-stagger border-t border-granny/20">
            {reports.map((r) => {
              const reporter = userMap.get(r.reporter_id)
              const target = targetLabel(r)
              return (
                <li key={r.id} className="border-b border-granny/15">
                  <Link
                    href={`/admin/reports/${r.id}`}
                    className="admin-lift block py-5 px-1 active:bg-firefly/[0.03]"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <StatusBadge status={r.status} />
                      <span className="px-2 py-[3px] bg-granny/10 text-granny text-[10px] uppercase tracking-[0.15em]">
                        {r.context}
                      </span>
                      <div className="ml-auto text-[10px] uppercase tracking-[0.12em] text-granny/80">
                        {formatDateTime(r.created_at)}
                      </div>
                    </div>
                    <div className="text-[14px] text-ink font-light mb-1">
                      Target: {target.text}
                    </div>
                    <div className="text-[13px] text-granny font-light line-clamp-2 italic mb-1">
                      &ldquo;{r.reason}&rdquo;
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.12em] text-granny/70">
                      by {reporter?.name || reporter?.email || 'Unknown'}
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block border border-granny/20">
        <table className="w-full text-[13px] font-light">
          <thead>
            <tr className="border-b border-granny/20 bg-offwhite">
              <Th>Status</Th>
              <Th>Context</Th>
              <Th>Target</Th>
              <Th>Reason</Th>
              <Th>Reporter</Th>
              <Th>Reported</Th>
            </tr>
          </thead>
          <tbody>
            {reports && reports.length > 0 ? (
              reports.map((r) => {
                const reporter = userMap.get(r.reporter_id)
                const target = targetLabel(r)
                return (
                  <tr
                    key={r.id}
                    className="border-b border-granny/15 hover:bg-firefly/[0.03] transition-colors last:border-b-0 align-top"
                  >
                    <td className="px-5 py-4">
                      <Link href={`/admin/reports/${r.id}`}>
                        <StatusBadge status={r.status} />
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-granny capitalize text-[12px]">{r.context}</td>
                    <td className="px-5 py-4 max-w-[200px]">
                      {target.href ? (
                        <Link href={target.href} className="text-ink hover:text-firefly transition-colors block truncate">
                          {target.text}
                        </Link>
                      ) : (
                        <span className="text-granny/50">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 max-w-[320px]">
                      <Link href={`/admin/reports/${r.id}`} className="text-granny italic line-clamp-2 text-[12px] hover:text-firefly transition-colors">
                        &ldquo;{r.reason}&rdquo;
                      </Link>
                    </td>
                    <td className="px-5 py-4 max-w-[160px] truncate text-granny text-[12px]">
                      {reporter?.name || reporter?.email || 'Unknown'}
                    </td>
                    <td className="px-5 py-4 text-granny tabular-nums text-[12px] whitespace-nowrap">
                      {formatDateTime(r.created_at)}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-granny text-[13px]">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {count !== null && count !== undefined && count > PAGE_SIZE && (
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-[12px] font-light">
          <div className="text-granny uppercase tracking-[0.15em] text-[10px]">
            Page {p.page} of {totalPages} · {count.toLocaleString()} total
          </div>
          <div className="flex items-center gap-2">
            {p.page > 1 && (
              <Link href={buildHref(p, { page: p.page - 1 })} className="min-h-[44px] flex-1 sm:flex-none inline-flex items-center justify-center px-4 border border-granny/30 text-ink hover:border-firefly hover:text-firefly transition-colors uppercase tracking-[0.15em] text-[10px]">
                ← Prev
              </Link>
            )}
            {p.page < totalPages && (
              <Link href={buildHref(p, { page: p.page + 1 })} className="min-h-[44px] flex-1 sm:flex-none inline-flex items-center justify-center px-4 border border-granny/30 text-ink hover:border-firefly hover:text-firefly transition-colors uppercase tracking-[0.15em] text-[10px]">
                Next →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium">
      {children}
    </th>
  )
}

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLE[status] ?? 'bg-granny/15 text-granny'
  return (
    <span className={`inline-flex items-center px-2 py-[3px] text-[10px] uppercase tracking-[0.15em] font-medium ${style}`}>
      {status}
    </span>
  )
}

function EmptyState() {
  return (
    <div className="border border-granny/20 py-16 text-center text-granny text-[13px] font-light italic">
      No reports found.
    </div>
  )
}
