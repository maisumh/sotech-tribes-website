import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

const PAGE_SIZE = 25

type StatusFilter = 'all' | 'pending' | 'offered' | 'accepted' | 'rejected'
type PerfectFilter = 'all' | 'true' | 'false'

type ParsedParams = {
  status: StatusFilter
  perfect: PerfectFilter
  order: 'asc' | 'desc'
  page: number
}

function parseSearchParams(raw: Record<string, string | undefined>): ParsedParams {
  const status: StatusFilter =
    raw.status === 'pending' ||
    raw.status === 'offered' ||
    raw.status === 'accepted' ||
    raw.status === 'rejected'
      ? raw.status
      : 'all'
  const perfect: PerfectFilter =
    raw.perfect === 'true' || raw.perfect === 'false' ? raw.perfect : 'all'
  const order: 'asc' | 'desc' = raw.order === 'asc' ? 'asc' : 'desc'
  const page = Math.max(1, parseInt(raw.page ?? '1', 10) || 1)
  return { status, perfect, order, page }
}

function buildHref(current: ParsedParams, override: Partial<ParsedParams>): string {
  const merged = { ...current, ...override }
  const p = new URLSearchParams()
  if (merged.status !== 'all') p.set('status', merged.status)
  if (merged.perfect !== 'all') p.set('perfect', merged.perfect)
  if (merged.order !== 'desc') p.set('order', merged.order)
  if (merged.page !== 1) p.set('page', String(merged.page))
  const qs = p.toString()
  return qs ? `/admin/matches?${qs}` : '/admin/matches'
}

function formatShortDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

type MatchRow = {
  id: number
  user1_want_id: number | null
  user2_have_id: number | null
  user1_have_id: number | null
  user2_want_id: number | null
  combined_score: number
  is_perfect: boolean
  status: 'pending' | 'offered' | 'accepted' | 'rejected' | null
  created_at: string | null
}

type WantHaveLite = {
  id: number
  user_id: string | null
  title: string | null
  is_want: boolean
}

type UserLite = {
  id: string
  name: string | null
  email: string | null
}

export const dynamic = 'force-dynamic'

export default async function MatchesPage({
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
    .from('want_have_matches')
    .select(
      'id, user1_want_id, user2_have_id, user1_have_id, user2_want_id, combined_score, is_perfect, status, created_at',
      { count: 'exact' },
    )
    .order('created_at', { ascending: p.order === 'asc' })
    .range(from, to)

  if (p.status !== 'all') {
    query = query.eq('status', p.status)
  }
  if (p.perfect !== 'all') {
    query = query.eq('is_perfect', p.perfect === 'true')
  }

  const { data: matches, count, error } = (await query) as {
    data: MatchRow[] | null
    count: number | null
    error: { message: string } | null
  }

  // Collect all want_have IDs referenced by these matches
  const whIds = new Set<number>()
  for (const m of matches ?? []) {
    if (m.user1_want_id) whIds.add(m.user1_want_id)
    if (m.user2_have_id) whIds.add(m.user2_have_id)
    if (m.user1_have_id) whIds.add(m.user1_have_id)
    if (m.user2_want_id) whIds.add(m.user2_want_id)
  }
  const whIdList = Array.from(whIds)

  const { data: wantHaves } = whIdList.length
    ? await supabase
        .from('want_have')
        .select('id, user_id, title, is_want')
        .in('id', whIdList)
    : { data: [] as WantHaveLite[] }

  const whMap = new Map(
    (wantHaves ?? []).map((w) => [w.id, w as WantHaveLite]),
  )

  // Collect user IDs from all want_haves
  const userIds = Array.from(
    new Set(
      (wantHaves ?? [])
        .map((w) => w.user_id)
        .filter((x): x is string => !!x),
    ),
  )

  const { data: users } = userIds.length
    ? await supabase.from('users').select('id, name, email').in('id', userIds)
    : { data: [] as UserLite[] }

  const userMap = new Map((users ?? []).map((u) => [u.id, u as UserLite]))

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1
  const hasFilters = p.status !== 'all' || p.perfect !== 'all'

  return (
    <div>
      <header className="mb-8 lg:mb-12">
        <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-3 lg:mb-4">
          Community
        </div>
        <h1 className="text-[32px] sm:text-[38px] lg:text-[44px] font-extralight leading-[1.05] text-ink">
          Matches
        </h1>
        <p className="mt-2 text-[13px] text-granny font-light">
          {count !== null && count !== undefined
            ? `${count.toLocaleString()} ${count === 1 ? 'match' : 'matches'}`
            : 'Loading…'}
        </p>
      </header>

      {/* Filters */}
      <form
        method="GET"
        action="/admin/matches"
        className="mb-8 lg:mb-10 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-end sm:gap-6 pb-6 lg:pb-8 border-b border-granny/20"
      >
        <div className="flex gap-5 sm:gap-6 flex-wrap">
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
              <option value="pending">Pending</option>
              <option value="offered">Offered</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex-1 sm:flex-none">
            <label
              htmlFor="perfect"
              className="block text-[10px] uppercase tracking-[0.22em] text-granny mb-2"
            >
              Perfect match
            </label>
            <select
              id="perfect"
              name="perfect"
              defaultValue={p.perfect}
              className="w-full sm:w-auto min-h-[44px] border-0 border-b border-granny/40 bg-transparent pb-2 pr-6 text-[15px] lg:text-[14px] font-light text-ink focus:outline-none focus:border-firefly appearance-none cursor-pointer"
            >
              <option value="all">All</option>
              <option value="true">Perfect only</option>
              <option value="false">Not perfect</option>
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
              href="/admin/matches"
              className="min-h-[44px] inline-flex items-center text-[11px] uppercase tracking-[0.22em] text-granny hover:text-ink active:text-ink transition-colors"
            >
              Clear
            </Link>
          )}
        </div>
      </form>

      {error && (
        <div className="mb-8 border-l-2 border-red-700 bg-red-50 px-4 sm:px-5 py-4 text-[13px] text-red-900 font-light">
          Failed to load matches: {error.message}
        </div>
      )}

      {/* Mobile cards */}
      <div className="lg:hidden">
        {matches && matches.length > 0 ? (
          <ul className="border-t border-granny/20">
            {matches.map((m) => {
              const sides = resolveMatchSides(m, whMap, userMap)
              return (
                <li key={m.id} className="border-b border-granny/15 py-5 px-1">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <StatusTag status={m.status} />
                      {m.is_perfect && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-[3px] bg-casablanca/15 text-casablanca-dark text-[10px] uppercase tracking-[0.15em] font-medium">
                          <span className="block w-1 h-1 rounded-full bg-casablanca-dark" />
                          Perfect
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.12em] text-granny/80">
                      {formatShortDate(m.created_at)}
                    </div>
                  </div>
                  <div className="space-y-2 text-[13px] font-light">
                    <MatchSideRow label="Side A" side={sides.a} />
                    <MatchSideRow label="Side B" side={sides.b} />
                  </div>
                  <div className="mt-3 text-[10px] uppercase tracking-[0.15em] text-granny/80">
                    Score: {m.combined_score.toFixed(2)}
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="border border-granny/20 py-16 text-center text-granny text-[13px] font-light italic">
            No matches found.
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
                  Created
                  <span className="text-casablanca-dark text-[9px]">
                    {p.order === 'desc' ? '↓' : '↑'}
                  </span>
                </Link>
              </th>
              <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium">
                Side A
              </th>
              <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium">
                Side B
              </th>
              <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium">
                Score
              </th>
              <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium">
                Status
              </th>
              <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium">
                Perfect
              </th>
            </tr>
          </thead>
          <tbody>
            {matches && matches.length > 0 ? (
              matches.map((m) => {
                const sides = resolveMatchSides(m, whMap, userMap)
                return (
                  <tr
                    key={m.id}
                    className="border-b border-granny/15 hover:bg-firefly/[0.03] transition-colors last:border-b-0 align-top"
                  >
                    <td className="px-5 py-4 text-granny tabular-nums text-[12px] whitespace-nowrap">
                      {formatShortDate(m.created_at)}
                    </td>
                    <td className="px-5 py-4 max-w-[300px]">
                      <MatchSideCell side={sides.a} />
                    </td>
                    <td className="px-5 py-4 max-w-[300px]">
                      <MatchSideCell side={sides.b} />
                    </td>
                    <td className="px-5 py-4 tabular-nums text-[12px] text-ink">
                      {m.combined_score.toFixed(2)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusTag status={m.status} />
                    </td>
                    <td className="px-5 py-4">
                      {m.is_perfect && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-[3px] bg-casablanca/15 text-casablanca-dark text-[10px] uppercase tracking-[0.15em] font-medium">
                          <span className="block w-1 h-1 rounded-full bg-casablanca-dark" />
                          Perfect
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
                  No matches found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {count !== null && count !== undefined && count > PAGE_SIZE && (
        <Pagination
          page={p.page}
          totalPages={totalPages}
          total={count}
          buildHref={(page) => buildHref(p, { page })}
        />
      )}
    </div>
  )
}

type MatchSide = {
  wantWh: WantHaveLite | null
  haveWh: WantHaveLite | null
  user: UserLite | null
}

function resolveMatchSides(
  m: MatchRow,
  whMap: Map<number, WantHaveLite>,
  userMap: Map<string, UserLite>,
): { a: MatchSide; b: MatchSide } {
  const a = {
    wantWh: m.user1_want_id ? whMap.get(m.user1_want_id) ?? null : null,
    haveWh: m.user1_have_id ? whMap.get(m.user1_have_id) ?? null : null,
    user: null as UserLite | null,
  }
  const b = {
    wantWh: m.user2_want_id ? whMap.get(m.user2_want_id) ?? null : null,
    haveWh: m.user2_have_id ? whMap.get(m.user2_have_id) ?? null : null,
    user: null as UserLite | null,
  }
  const aUserId = a.wantWh?.user_id || a.haveWh?.user_id || null
  const bUserId = b.wantWh?.user_id || b.haveWh?.user_id || null
  a.user = aUserId ? userMap.get(aUserId) ?? null : null
  b.user = bUserId ? userMap.get(bUserId) ?? null : null
  return { a, b }
}

function MatchSideRow({ label, side }: { label: string; side: MatchSide }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-[9px] uppercase tracking-[0.18em] text-granny/70 min-w-[48px] mt-1">
        {label}
      </div>
      <div className="flex-1 min-w-0">
        <MatchSideCell side={side} />
      </div>
    </div>
  )
}

function MatchSideCell({ side }: { side: MatchSide }) {
  return (
    <div className="min-w-0">
      {side.user && (
        <Link
          href={`/admin/users/${side.user.id}`}
          className="text-[13px] text-ink hover:text-firefly transition-colors truncate block"
        >
          {side.user.name || side.user.email || 'Unknown'}
        </Link>
      )}
      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-granny">
        {side.wantWh && (
          <Link
            href={`/admin/want-have/${side.wantWh.id}`}
            className="inline-flex items-center gap-1 hover:text-firefly transition-colors"
          >
            <span className="text-[9px] uppercase tracking-[0.15em] text-firefly/70">
              W
            </span>
            <span className="truncate">{side.wantWh.title || 'Untitled'}</span>
          </Link>
        )}
        {side.wantWh && side.haveWh && (
          <span className="text-granny/30">·</span>
        )}
        {side.haveWh && (
          <Link
            href={`/admin/want-have/${side.haveWh.id}`}
            className="inline-flex items-center gap-1 hover:text-firefly transition-colors"
          >
            <span className="text-[9px] uppercase tracking-[0.15em] text-casablanca-dark">
              H
            </span>
            <span className="truncate">{side.haveWh.title || 'Untitled'}</span>
          </Link>
        )}
      </div>
    </div>
  )
}

function StatusTag({
  status,
}: {
  status: 'pending' | 'offered' | 'accepted' | 'rejected' | null
}) {
  if (!status) {
    return <span className="text-granny/50 italic text-[10px]">—</span>
  }
  const styles: Record<NonNullable<typeof status>, string> = {
    pending: 'bg-granny/15 text-granny',
    offered: 'bg-casablanca/15 text-casablanca-dark',
    accepted: 'bg-firefly/10 text-firefly',
    rejected: 'bg-red-50 text-red-700',
  }
  return (
    <span
      className={`inline-flex items-center px-2 py-[3px] text-[10px] uppercase tracking-[0.15em] font-medium ${styles[status]}`}
    >
      {status}
    </span>
  )
}

function Pagination({
  page,
  totalPages,
  total,
  buildHref,
}: {
  page: number
  totalPages: number
  total: number
  buildHref: (page: number) => string
}) {
  return (
    <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-[12px] font-light">
      <div className="text-granny uppercase tracking-[0.15em] text-[10px]">
        Page {page} of {totalPages} · {total.toLocaleString()} total
      </div>
      <div className="flex items-center gap-2">
        {page > 1 && (
          <Link
            href={buildHref(page - 1)}
            className="min-h-[44px] flex-1 sm:flex-none inline-flex items-center justify-center px-4 border border-granny/30 text-ink hover:border-firefly hover:text-firefly active:border-firefly active:text-firefly transition-colors uppercase tracking-[0.15em] text-[10px]"
          >
            ← Prev
          </Link>
        )}
        {page < totalPages && (
          <Link
            href={buildHref(page + 1)}
            className="min-h-[44px] flex-1 sm:flex-none inline-flex items-center justify-center px-4 border border-granny/30 text-ink hover:border-firefly hover:text-firefly active:border-firefly active:text-firefly transition-colors uppercase tracking-[0.15em] text-[10px]"
          >
            Next →
          </Link>
        )}
      </div>
    </div>
  )
}
