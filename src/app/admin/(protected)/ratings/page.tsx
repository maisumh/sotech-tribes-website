import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

const PAGE_SIZE = 25

type MaxRate = 'all' | '1' | '2' | '3'

type ParsedParams = {
  maxRate: MaxRate
  order: 'asc' | 'desc'
  page: number
}

function parseSearchParams(raw: Record<string, string | undefined>): ParsedParams {
  const maxRate: MaxRate =
    raw.max === '1' || raw.max === '2' || raw.max === '3' ? raw.max : 'all'
  const order: 'asc' | 'desc' = raw.order === 'asc' ? 'asc' : 'desc'
  const page = Math.max(1, parseInt(raw.page ?? '1', 10) || 1)
  return { maxRate, order, page }
}

function buildHref(current: ParsedParams, override: Partial<ParsedParams>): string {
  const merged = { ...current, ...override }
  const p = new URLSearchParams()
  if (merged.maxRate !== 'all') p.set('max', merged.maxRate)
  if (merged.order !== 'desc') p.set('order', merged.order)
  if (merged.page !== 1) p.set('page', String(merged.page))
  const qs = p.toString()
  return qs ? `/admin/ratings?${qs}` : '/admin/ratings'
}

function formatDateTime(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

type RatingRow = {
  id: number
  ratting_to: string | null
  ratting_by: string | null
  rate: number | null
  comment: string | null
  offer_id: string | null
  created_at: string
}

type UserLite = {
  id: string
  name: string | null
  email: string | null
}

export const dynamic = 'force-dynamic'

export default async function RatingsPage({
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
    .from('user_rattings')
    .select(
      'id, ratting_to, ratting_by, rate, comment, offer_id, created_at',
      { count: 'exact' },
    )
    .order('created_at', { ascending: p.order === 'asc' })
    .range(from, to)

  if (p.maxRate !== 'all') {
    query = query.lte('rate', parseInt(p.maxRate, 10))
  }

  const { data: ratings, count, error } = (await query) as {
    data: RatingRow[] | null
    count: number | null
    error: { message: string } | null
  }

  // Resolve users
  const userIds = new Set<string>()
  for (const r of ratings ?? []) {
    if (r.ratting_to) userIds.add(r.ratting_to)
    if (r.ratting_by) userIds.add(r.ratting_by)
  }
  const userIdList = Array.from(userIds)
  const { data: users } = userIdList.length
    ? await supabase.from('users').select('id, name, email').in('id', userIdList)
    : { data: [] as UserLite[] }
  const userMap = new Map((users ?? []).map((u) => [u.id, u as UserLite]))

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1
  const hasFilters = p.maxRate !== 'all'

  return (
    <div>
      <header className="mb-8 lg:mb-12">
        <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-3 lg:mb-4">
          Moderation
        </div>
        <h1 className="text-[32px] sm:text-[38px] lg:text-[44px] font-extralight leading-[1.05] text-ink">
          Ratings
        </h1>
        <p className="mt-2 text-[13px] text-granny font-light">
          {count !== null && count !== undefined
            ? `${count.toLocaleString()} ${count === 1 ? 'rating' : 'ratings'}`
            : 'Loading…'}
        </p>
      </header>

      {/* Filters */}
      <form
        method="GET"
        action="/admin/ratings"
        className="mb-8 lg:mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-6 pb-6 lg:pb-8 border-b border-granny/20"
      >
        <div>
          <label
            htmlFor="max"
            className="block text-[10px] uppercase tracking-[0.22em] text-granny mb-2"
          >
            Max rating (finds abuse)
          </label>
          <select
            id="max"
            name="max"
            defaultValue={p.maxRate}
            className="w-full sm:w-auto min-h-[44px] border-0 border-b border-granny/40 bg-transparent pb-2 pr-6 text-[15px] lg:text-[14px] font-light text-ink focus:outline-none focus:border-firefly appearance-none cursor-pointer"
          >
            <option value="all">All ratings</option>
            <option value="3">≤ 3 stars</option>
            <option value="2">≤ 2 stars</option>
            <option value="1">≤ 1 star</option>
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
              href="/admin/ratings"
              className="min-h-[44px] inline-flex items-center text-[11px] uppercase tracking-[0.22em] text-granny hover:text-ink active:text-ink transition-colors"
            >
              Clear
            </Link>
          )}
        </div>
      </form>

      {error && (
        <div className="mb-8 border-l-2 border-red-700 bg-red-50 px-4 sm:px-5 py-4 text-[13px] text-red-900 font-light">
          Failed to load ratings: {error.message}
        </div>
      )}

      {/* Mobile cards */}
      <div className="lg:hidden">
        {ratings && ratings.length > 0 ? (
          <ul className="border-t border-granny/20">
            {ratings.map((r) => {
              const rater = r.ratting_by ? userMap.get(r.ratting_by) : null
              const ratee = r.ratting_to ? userMap.get(r.ratting_to) : null
              return (
                <li key={r.id} className="border-b border-granny/15 py-5 px-1">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <StarRating rate={r.rate} />
                    <div className="text-[10px] uppercase tracking-[0.12em] text-granny/80 whitespace-nowrap">
                      {formatDateTime(r.created_at)}
                    </div>
                  </div>
                  <div className="space-y-2 text-[13px] font-light">
                    <UserRow label="From" user={rater} />
                    <UserRow label="To" user={ratee} />
                  </div>
                  {r.comment && (
                    <div className="mt-3 pt-3 border-t border-granny/15 text-[13px] text-ink/80 font-light italic break-words">
                      &ldquo;{r.comment}&rdquo;
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="border border-granny/20 py-16 text-center text-granny text-[13px] font-light italic">
            No ratings found.
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
                From
              </th>
              <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium">
                To
              </th>
              <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium">
                Rating
              </th>
              <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium">
                Comment
              </th>
            </tr>
          </thead>
          <tbody>
            {ratings && ratings.length > 0 ? (
              ratings.map((r) => {
                const rater = r.ratting_by ? userMap.get(r.ratting_by) : null
                const ratee = r.ratting_to ? userMap.get(r.ratting_to) : null
                return (
                  <tr
                    key={r.id}
                    className="border-b border-granny/15 hover:bg-firefly/[0.03] transition-colors last:border-b-0 align-top"
                  >
                    <td className="px-5 py-4 text-granny tabular-nums text-[12px] whitespace-nowrap">
                      {formatDateTime(r.created_at)}
                    </td>
                    <td className="px-5 py-4 max-w-[180px] truncate">
                      <UserCell user={rater} />
                    </td>
                    <td className="px-5 py-4 max-w-[180px] truncate">
                      <UserCell user={ratee} />
                    </td>
                    <td className="px-5 py-4">
                      <StarRating rate={r.rate} />
                    </td>
                    <td className="px-5 py-4 max-w-[360px]">
                      {r.comment ? (
                        <span className="text-[12px] text-ink/80 italic line-clamp-2 break-words">
                          &ldquo;{r.comment}&rdquo;
                        </span>
                      ) : (
                        <span className="text-granny/50 italic text-[12px]">—</span>
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
                  No ratings found.
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

function StarRating({ rate }: { rate: number | null }) {
  if (rate === null) {
    return <span className="text-granny/50 italic text-[11px]">No rating</span>
  }
  const intRate = Math.round(rate)
  const isLow = rate <= 2
  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={`inline-flex ${
          isLow ? 'text-red-700' : 'text-casablanca-dark'
        }`}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`text-[12px] ${
              i <= intRate ? 'opacity-100' : 'opacity-20'
            }`}
          >
            ●
          </span>
        ))}
      </span>
      <span className="tabular-nums text-[11px] text-granny">
        {rate.toFixed(1)}
      </span>
    </div>
  )
}

function UserRow({
  label,
  user,
}: {
  label: string
  user: UserLite | null | undefined
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-[9px] uppercase tracking-[0.18em] text-granny/70 min-w-[36px] mt-0.5">
        {label}
      </div>
      <div className="flex-1 min-w-0">
        <UserCell user={user} />
      </div>
    </div>
  )
}

function UserCell({ user }: { user: UserLite | null | undefined }) {
  if (!user) return <span className="text-granny italic">Unknown</span>
  return (
    <Link
      href={`/admin/users/${user.id}`}
      className="text-ink hover:text-firefly transition-colors block truncate"
    >
      {user.name || user.email || 'Unknown'}
    </Link>
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
