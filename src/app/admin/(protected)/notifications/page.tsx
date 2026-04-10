import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

const PAGE_SIZE = 25

type SourceFilter = 'all' | 'admin' | 'system'

type ParsedParams = {
  source: SourceFilter
  order: 'asc' | 'desc'
  page: number
}

function parseSearchParams(raw: Record<string, string | undefined>): ParsedParams {
  const source: SourceFilter =
    raw.source === 'admin' || raw.source === 'system' ? raw.source : 'all'
  const order: 'asc' | 'desc' = raw.order === 'asc' ? 'asc' : 'desc'
  const page = Math.max(1, parseInt(raw.page ?? '1', 10) || 1)
  return { source, order, page }
}

function buildHref(current: ParsedParams, override: Partial<ParsedParams>): string {
  const merged = { ...current, ...override }
  const p = new URLSearchParams()
  if (merged.source !== 'all') p.set('source', merged.source)
  if (merged.order !== 'desc') p.set('order', merged.order)
  if (merged.page !== 1) p.set('page', String(merged.page))
  const qs = p.toString()
  return qs ? `/admin/notifications?${qs}` : '/admin/notifications'
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

type NotificationRow = {
  id: string
  user_id: string | null
  title: string
  body: string
  created_by: string | null
  created_at: string
}

type UserLite = {
  id: string
  name: string | null
  email: string | null
}

export const dynamic = 'force-dynamic'

export default async function NotificationsPage({
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
    .from('notifications')
    .select('id, user_id, title, body, created_by, created_at', { count: 'exact' })
    .order('created_at', { ascending: p.order === 'asc' })
    .range(from, to)

  if (p.source === 'admin') {
    query = query.not('created_by', 'is', null)
  } else if (p.source === 'system') {
    query = query.is('created_by', null)
  }

  const { data: notifications, count, error } = (await query) as {
    data: NotificationRow[] | null
    count: number | null
    error: { message: string } | null
  }

  // Resolve both recipient and sender users
  const userIds = new Set<string>()
  for (const n of notifications ?? []) {
    if (n.user_id) userIds.add(n.user_id)
    if (n.created_by) userIds.add(n.created_by)
  }
  const userIdList = Array.from(userIds)
  const { data: users } = userIdList.length
    ? await supabase.from('users').select('id, name, email').in('id', userIdList)
    : { data: [] as UserLite[] }
  const userMap = new Map((users ?? []).map((u) => [u.id, u as UserLite]))

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1
  const hasFilters = p.source !== 'all'

  return (
    <div>
      <header className="mb-8 lg:mb-12">
        <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-3 lg:mb-4">
          System
        </div>
        <h1 className="text-[32px] sm:text-[38px] lg:text-[44px] font-extralight leading-[1.05] text-ink">
          Notifications
        </h1>
        <p className="mt-2 text-[13px] text-granny font-light">
          {count !== null && count !== undefined
            ? `${count.toLocaleString()} ${count === 1 ? 'notification' : 'notifications'}`
            : 'Loading…'}
        </p>
      </header>

      {/* Filters */}
      <form
        method="GET"
        action="/admin/notifications"
        className="mb-8 lg:mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-6 pb-6 lg:pb-8 border-b border-granny/20"
      >
        <div>
          <label
            htmlFor="source"
            className="block text-[10px] uppercase tracking-[0.22em] text-granny mb-2"
          >
            Source
          </label>
          <select
            id="source"
            name="source"
            defaultValue={p.source}
            className="w-full sm:w-auto min-h-[44px] border-0 border-b border-granny/40 bg-transparent pb-2 pr-6 text-[15px] lg:text-[14px] font-light text-ink focus:outline-none focus:border-firefly appearance-none cursor-pointer"
          >
            <option value="all">All</option>
            <option value="admin">Admin broadcasts</option>
            <option value="system">System only</option>
          </select>
        </div>

        <div className="flex items-center gap-4 sm:self-end">
          <button
            type="submit"
            className="min-h-[44px] bg-firefly text-offwhite px-6 py-[9px] text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-ink active:bg-ink transition-colors"
          >
            Apply
          </button>
          {hasFilters && (
            <Link
              href="/admin/notifications"
              className="min-h-[44px] inline-flex items-center text-[11px] uppercase tracking-[0.22em] text-granny hover:text-ink active:text-ink transition-colors"
            >
              Clear
            </Link>
          )}
        </div>
      </form>

      {error && (
        <div className="mb-8 border-l-2 border-red-700 bg-red-50 px-4 sm:px-5 py-4 text-[13px] text-red-900 font-light">
          Failed to load notifications: {error.message}
        </div>
      )}

      {/* Mobile cards */}
      <div className="lg:hidden">
        {notifications && notifications.length > 0 ? (
          <ul className="border-t border-granny/20">
            {notifications.map((n) => {
              const recipient = n.user_id ? userMap.get(n.user_id) : null
              const sender = n.created_by ? userMap.get(n.created_by) : null
              return (
                <li key={n.id} className="border-b border-granny/15 py-5 px-1">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] text-ink font-light break-words">
                        {n.title}
                      </div>
                    </div>
                    {sender ? (
                      <span className="shrink-0 inline-flex items-center px-2 py-[3px] bg-casablanca/15 text-casablanca-dark text-[9px] uppercase tracking-[0.15em] font-medium">
                        Admin
                      </span>
                    ) : (
                      <span className="shrink-0 inline-flex items-center px-2 py-[3px] bg-granny/10 text-granny text-[9px] uppercase tracking-[0.15em] font-medium">
                        System
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-granny font-light line-clamp-2 mb-2 break-words">
                    {n.body}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.12em] text-granny/80">
                    <span>
                      To:{' '}
                      {recipient ? (
                        <Link
                          href={`/admin/users/${recipient.id}`}
                          className="text-granny hover:text-firefly transition-colors normal-case"
                        >
                          {recipient.name || recipient.email || 'Unknown'}
                        </Link>
                      ) : (
                        <span className="italic">Unknown</span>
                      )}
                    </span>
                    <span className="text-granny/30">·</span>
                    <span>{formatDateTime(n.created_at)}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="border border-granny/20 py-16 text-center text-granny text-[13px] font-light italic">
            No notifications found.
          </div>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block border border-granny/20">
        <table className="w-full text-[13px] font-light">
          <thead>
            <tr className="border-b border-granny/20 bg-offwhite">
              <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium">
                <Link
                  href={buildHref(p, {
                    order: p.order === 'desc' ? 'asc' : 'desc',
                    page: 1,
                  })}
                  className="inline-flex items-center gap-2 text-firefly hover:text-ink transition-colors"
                >
                  Sent
                  <span className="text-casablanca-dark text-[9px]">
                    {p.order === 'desc' ? '↓' : '↑'}
                  </span>
                </Link>
              </th>
              <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium">
                Title
              </th>
              <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium">
                Body
              </th>
              <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium">
                Recipient
              </th>
              <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium">
                Source
              </th>
            </tr>
          </thead>
          <tbody>
            {notifications && notifications.length > 0 ? (
              notifications.map((n) => {
                const recipient = n.user_id ? userMap.get(n.user_id) : null
                return (
                  <tr
                    key={n.id}
                    className="border-b border-granny/15 hover:bg-firefly/[0.03] transition-colors last:border-b-0 align-top"
                  >
                    <td className="px-5 py-4 text-granny tabular-nums text-[12px] whitespace-nowrap">
                      {formatDateTime(n.created_at)}
                    </td>
                    <td className="px-5 py-4 text-ink max-w-[240px] truncate">
                      {n.title}
                    </td>
                    <td className="px-5 py-4 text-granny max-w-[320px] line-clamp-2">
                      {n.body}
                    </td>
                    <td className="px-5 py-4 max-w-[180px] truncate">
                      {recipient ? (
                        <Link
                          href={`/admin/users/${recipient.id}`}
                          className="text-ink hover:text-firefly transition-colors block truncate"
                        >
                          {recipient.name || recipient.email || 'Unknown'}
                        </Link>
                      ) : (
                        <span className="text-granny italic">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {n.created_by ? (
                        <span className="inline-flex items-center px-2 py-[3px] bg-casablanca/15 text-casablanca-dark text-[10px] uppercase tracking-[0.15em] font-medium">
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-[3px] bg-granny/10 text-granny text-[10px] uppercase tracking-[0.15em]">
                          System
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-16 text-center text-granny text-[13px]"
                >
                  No notifications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {count !== null && count !== undefined && count > PAGE_SIZE && (
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-[12px] font-light">
          <div className="text-granny uppercase tracking-[0.15em] text-[10px]">
            Page {p.page} of {totalPages} · {count.toLocaleString()} total
          </div>
          <div className="flex items-center gap-2">
            {p.page > 1 && (
              <Link
                href={buildHref(p, { page: p.page - 1 })}
                className="min-h-[44px] flex-1 sm:flex-none inline-flex items-center justify-center px-4 border border-granny/30 text-ink hover:border-firefly hover:text-firefly active:border-firefly active:text-firefly transition-colors uppercase tracking-[0.15em] text-[10px]"
              >
                ← Prev
              </Link>
            )}
            {p.page < totalPages && (
              <Link
                href={buildHref(p, { page: p.page + 1 })}
                className="min-h-[44px] flex-1 sm:flex-none inline-flex items-center justify-center px-4 border border-granny/30 text-ink hover:border-firefly hover:text-firefly active:border-firefly active:text-firefly transition-colors uppercase tracking-[0.15em] text-[10px]"
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
