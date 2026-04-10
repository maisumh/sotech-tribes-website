import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

const PAGE_SIZE = 25

const SORTABLE_COLUMNS = {
  created_at: 'Posted',
  title: 'Title',
  status: 'Status',
} as const

type SortKey = keyof typeof SORTABLE_COLUMNS
type TypeFilter = 'all' | 'want' | 'have'
type StatusFilter = 'all' | 'open' | 'closed' | 'matched'
type DeletedFilter = 'hide' | 'show' | 'only'

type ParsedParams = {
  q: string
  type: TypeFilter
  status: StatusFilter
  deleted: DeletedFilter
  sort: SortKey
  order: 'asc' | 'desc'
  page: number
}

function parseSearchParams(raw: Record<string, string | undefined>): ParsedParams {
  const q = (raw.q ?? '').trim()
  const type: TypeFilter =
    raw.type === 'want' || raw.type === 'have' ? raw.type : 'all'
  const status: StatusFilter =
    raw.status === 'open' || raw.status === 'closed' || raw.status === 'matched'
      ? raw.status
      : 'all'
  const deleted: DeletedFilter =
    raw.deleted === 'show' || raw.deleted === 'only' ? raw.deleted : 'hide'
  const sort: SortKey =
    raw.sort && raw.sort in SORTABLE_COLUMNS ? (raw.sort as SortKey) : 'created_at'
  const order: 'asc' | 'desc' = raw.order === 'asc' ? 'asc' : 'desc'
  const page = Math.max(1, parseInt(raw.page ?? '1', 10) || 1)
  return { q, type, status, deleted, sort, order, page }
}

function buildHref(current: ParsedParams, override: Partial<ParsedParams>): string {
  const merged = { ...current, ...override }
  const p = new URLSearchParams()
  if (merged.q) p.set('q', merged.q)
  if (merged.type !== 'all') p.set('type', merged.type)
  if (merged.status !== 'all') p.set('status', merged.status)
  if (merged.deleted !== 'hide') p.set('deleted', merged.deleted)
  if (merged.sort !== 'created_at') p.set('sort', merged.sort)
  if (merged.order !== 'desc') p.set('order', merged.order)
  if (merged.page !== 1) p.set('page', String(merged.page))
  const qs = p.toString()
  return qs ? `/admin/want-have?${qs}` : '/admin/want-have'
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

type WantHaveRow = {
  id: number
  user_id: string | null
  title: string | null
  description: string | null
  category: string | null
  is_want: boolean
  status: 'open' | 'closed' | 'matched' | null
  is_deleted: boolean | null
  created_at: string
}

type UserLite = {
  id: string
  name: string | null
  email: string | null
}

export const dynamic = 'force-dynamic'

export default async function WantHavePage({
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
    .from('want_have')
    .select(
      'id, user_id, title, description, category, is_want, status, is_deleted, created_at',
      { count: 'exact' },
    )
    .order(p.sort, { ascending: p.order === 'asc' })
    .range(from, to)

  if (p.q) {
    query = query.or(`title.ilike.%${p.q}%,description.ilike.%${p.q}%`)
  }
  if (p.type !== 'all') {
    query = query.eq('is_want', p.type === 'want')
  }
  if (p.status !== 'all') {
    query = query.eq('status', p.status)
  }
  if (p.deleted === 'hide') {
    query = query.eq('is_deleted', false)
  } else if (p.deleted === 'only') {
    query = query.eq('is_deleted', true)
  }
  // deleted === 'show' means no filter — return both

  const { data: rows, count, error } = (await query) as {
    data: WantHaveRow[] | null
    count: number | null
    error: { message: string } | null
  }

  // Batch-fetch the posting users
  const userIds = Array.from(
    new Set((rows ?? []).map((r) => r.user_id).filter((x): x is string => !!x)),
  )
  const { data: users } = userIds.length
    ? await supabase.from('users').select('id, name, email').in('id', userIds)
    : { data: [] as UserLite[] }
  const userMap = new Map(
    (users ?? []).map((u) => [u.id, u as UserLite]),
  )

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1
  const hasFilters =
    p.q || p.type !== 'all' || p.status !== 'all' || p.deleted !== 'hide'

  return (
    <div>
      {/* Header */}
      <header className="admin-fade-up mb-8 lg:mb-12">
        <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-3 lg:mb-4">
          Community
        </div>
        <h1 className="text-[32px] sm:text-[38px] lg:text-[44px] font-extralight leading-[1.05] text-ink">
          Wants &amp; Haves
        </h1>
        <p className="mt-2 text-[13px] text-granny font-light">
          {count !== null && count !== undefined
            ? `${count.toLocaleString()} ${count === 1 ? 'entry' : 'entries'}`
            : 'Loading…'}
        </p>
      </header>

      {/* Filters */}
      <form
        method="GET"
        action="/admin/want-have"
        className="mb-8 lg:mb-10 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-end sm:gap-6 pb-6 lg:pb-8 border-b border-granny/20"
      >
        <div className="flex-1 sm:min-w-[240px]">
          <label
            htmlFor="q"
            className="block text-[10px] uppercase tracking-[0.22em] text-granny mb-2"
          >
            Search
          </label>
          <input
            id="q"
            name="q"
            type="text"
            defaultValue={p.q}
            placeholder="Title or description…"
            className="w-full min-h-[44px] border-0 border-b border-granny/40 bg-transparent pb-2 text-[15px] lg:text-[14px] font-light text-ink placeholder:text-granny/50 focus:outline-none focus:border-firefly transition-colors"
          />
        </div>

        <div className="flex gap-5 sm:gap-6 flex-wrap">
          <div className="flex-1 sm:flex-none">
            <label
              htmlFor="type"
              className="block text-[10px] uppercase tracking-[0.22em] text-granny mb-2"
            >
              Type
            </label>
            <select
              id="type"
              name="type"
              defaultValue={p.type}
              className="w-full sm:w-auto min-h-[44px] border-0 border-b border-granny/40 bg-transparent pb-2 pr-6 text-[15px] lg:text-[14px] font-light text-ink focus:outline-none focus:border-firefly appearance-none cursor-pointer"
            >
              <option value="all">All</option>
              <option value="want">Wants</option>
              <option value="have">Haves</option>
            </select>
          </div>

          <div className="flex-1 sm:flex-none">
            <label
              htmlFor="status"
              className="block text-[10px] uppercase tracking-[0.22em] text-granny mb-2"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={p.status}
              className="w-full sm:w-auto min-h-[44px] border-0 border-b border-granny/40 bg-transparent pb-2 pr-6 text-[15px] lg:text-[14px] font-light text-ink focus:outline-none focus:border-firefly appearance-none cursor-pointer"
            >
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="matched">Matched</option>
            </select>
          </div>

          <div className="flex-1 sm:flex-none">
            <label
              htmlFor="deleted"
              className="block text-[10px] uppercase tracking-[0.22em] text-granny mb-2"
            >
              Deleted
            </label>
            <select
              id="deleted"
              name="deleted"
              defaultValue={p.deleted}
              className="w-full sm:w-auto min-h-[44px] border-0 border-b border-granny/40 bg-transparent pb-2 pr-6 text-[15px] lg:text-[14px] font-light text-ink focus:outline-none focus:border-firefly appearance-none cursor-pointer"
            >
              <option value="hide">Hide</option>
              <option value="show">Show both</option>
              <option value="only">Only deleted</option>
            </select>
          </div>
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
              href="/admin/want-have"
              className="min-h-[44px] inline-flex items-center text-[11px] uppercase tracking-[0.22em] text-granny hover:text-ink active:text-ink transition-colors"
            >
              Clear
            </Link>
          )}
        </div>
      </form>

      {error && (
        <div className="mb-8 border-l-2 border-red-700 bg-red-50 px-4 sm:px-5 py-4 text-[13px] text-red-900 font-light">
          Failed to load entries: {error.message}
        </div>
      )}

      {/* Mobile: card list */}
      <div className="lg:hidden">
        {rows && rows.length > 0 ? (
          <ul className="admin-stagger border-t border-granny/20">
            {rows.map((row) => {
              const user = row.user_id ? userMap.get(row.user_id) : null
              return (
                <li key={row.id} className="border-b border-granny/15">
                  <Link
                    href={`/admin/want-have/${row.id}`}
                    className="admin-lift block py-5 px-1 active:bg-firefly/[0.03]"
                  >
                    <div className="flex items-start gap-3">
                      <TypePill isWant={row.is_want} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[15px] text-ink font-light break-words">
                          {row.title || (
                            <span className="text-granny italic">Untitled</span>
                          )}
                        </div>
                        {row.description && (
                          <div className="mt-1 text-[13px] text-granny font-light line-clamp-2">
                            {row.description}
                          </div>
                        )}
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.12em] text-granny/80">
                          {user ? (
                            <span>{user.name || user.email || 'Unknown'}</span>
                          ) : (
                            <span className="italic">Unknown user</span>
                          )}
                          <span className="text-granny/30">·</span>
                          <StatusTag status={row.status} />
                          {row.category && (
                            <>
                              <span className="text-granny/30">·</span>
                              <span>{row.category}</span>
                            </>
                          )}
                          <span className="text-granny/30">·</span>
                          <span>{formatShortDate(row.created_at)}</span>
                          {row.is_deleted && (
                            <>
                              <span className="text-granny/30">·</span>
                              <span className="text-red-700">Deleted</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="border border-granny/20 py-16 text-center text-granny text-[13px] font-light italic">
            No entries match these filters.
          </div>
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden lg:block border border-granny/20">
        <table className="w-full text-[13px] font-light">
          <thead>
            <tr className="border-b border-granny/20 bg-offwhite">
              {(Object.keys(SORTABLE_COLUMNS) as SortKey[]).map((key) => {
                const active = p.sort === key
                const nextOrder = active && p.order === 'desc' ? 'asc' : 'desc'
                return (
                  <th
                    key={key}
                    className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium"
                  >
                    <Link
                      href={buildHref(p, { sort: key, order: nextOrder, page: 1 })}
                      className={`inline-flex items-center gap-2 hover:text-ink transition-colors ${
                        active ? 'text-firefly' : ''
                      }`}
                    >
                      {SORTABLE_COLUMNS[key]}
                      {active && (
                        <span className="text-casablanca-dark text-[9px]">
                          {p.order === 'desc' ? '↓' : '↑'}
                        </span>
                      )}
                    </Link>
                  </th>
                )
              })}
              <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium">
                Type
              </th>
              <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium">
                User
              </th>
              <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium">
                Flags
              </th>
            </tr>
          </thead>
          <tbody>
            {rows && rows.length > 0 ? (
              rows.map((row) => {
                const user = row.user_id ? userMap.get(row.user_id) : null
                return (
                  <tr
                    key={row.id}
                    className="border-b border-granny/15 hover:bg-firefly/[0.03] transition-colors last:border-b-0"
                  >
                    <td className="px-5 py-4 text-granny tabular-nums text-[12px] whitespace-nowrap">
                      {formatShortDate(row.created_at)}
                    </td>
                    <td className="px-5 py-4 max-w-[360px]">
                      <Link
                        href={`/admin/want-have/${row.id}`}
                        className="text-ink hover:text-firefly transition-colors line-clamp-1"
                      >
                        {row.title || (
                          <span className="text-granny italic">Untitled</span>
                        )}
                      </Link>
                      {row.description && (
                        <div className="mt-0.5 text-[12px] text-granny line-clamp-1">
                          {row.description}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <StatusTag status={row.status} />
                    </td>
                    <td className="px-5 py-4">
                      <TypePill isWant={row.is_want} />
                    </td>
                    <td className="px-5 py-4 text-granny text-[12px] max-w-[200px] truncate">
                      {user ? (
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="hover:text-firefly transition-colors"
                        >
                          {user.name || user.email || 'Unknown'}
                        </Link>
                      ) : (
                        <span className="italic">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {row.is_deleted && (
                        <span className="inline-flex items-center px-2 py-[3px] bg-red-50 text-red-700 text-[10px] uppercase tracking-[0.15em]">
                          Deleted
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-16 text-center text-granny text-[13px]"
                >
                  No entries match these filters.
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

function TypePill({ isWant }: { isWant: boolean }) {
  if (isWant) {
    return (
      <span className="shrink-0 inline-flex items-center px-2 py-[3px] bg-firefly/10 text-firefly text-[10px] uppercase tracking-[0.15em] font-medium">
        Want
      </span>
    )
  }
  return (
    <span className="shrink-0 inline-flex items-center px-2 py-[3px] bg-casablanca/15 text-casablanca-dark text-[10px] uppercase tracking-[0.15em] font-medium">
      Have
    </span>
  )
}

function StatusTag({
  status,
}: {
  status: 'open' | 'closed' | 'matched' | null
}) {
  if (!status) {
    return <span className="text-granny/50 italic text-[10px]">—</span>
  }
  return (
    <span className="uppercase tracking-[0.12em] text-[10px]">{status}</span>
  )
}
