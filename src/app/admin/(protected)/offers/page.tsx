import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

const PAGE_SIZE = 25

type StatusFilter = 'all' | 'pending' | 'accepted' | 'rejected'

type ParsedParams = {
  status: StatusFilter
  order: 'asc' | 'desc'
  page: number
}

function parseSearchParams(raw: Record<string, string | undefined>): ParsedParams {
  const status: StatusFilter =
    raw.status === 'pending' ||
    raw.status === 'accepted' ||
    raw.status === 'rejected'
      ? raw.status
      : 'all'
  const order: 'asc' | 'desc' = raw.order === 'asc' ? 'asc' : 'desc'
  const page = Math.max(1, parseInt(raw.page ?? '1', 10) || 1)
  return { status, order, page }
}

function buildHref(current: ParsedParams, override: Partial<ParsedParams>): string {
  const merged = { ...current, ...override }
  const p = new URLSearchParams()
  if (merged.status !== 'all') p.set('status', merged.status)
  if (merged.order !== 'desc') p.set('order', merged.order)
  if (merged.page !== 1) p.set('page', String(merged.page))
  const qs = p.toString()
  return qs ? `/admin/offers?${qs}` : '/admin/offers'
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

type OfferRow = {
  id: string
  match_id: number
  sender_id: string | null
  receiver_id: string | null
  status: 'pending' | 'accepted' | 'rejected' | null
  created_at: string
  updated_at: string
}

type UserLite = {
  id: string
  name: string | null
  email: string | null
}

export const dynamic = 'force-dynamic'

export default async function OffersPage({
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
    .from('offers')
    .select(
      'id, match_id, sender_id, receiver_id, status, created_at, updated_at',
      { count: 'exact' },
    )
    .order('created_at', { ascending: p.order === 'asc' })
    .range(from, to)

  if (p.status !== 'all') {
    query = query.eq('status', p.status)
  }

  const { data: offers, count, error } = (await query) as {
    data: OfferRow[] | null
    count: number | null
    error: { message: string } | null
  }

  // Resolve sender + receiver users in one batch
  const userIds = new Set<string>()
  for (const o of offers ?? []) {
    if (o.sender_id) userIds.add(o.sender_id)
    if (o.receiver_id) userIds.add(o.receiver_id)
  }
  const userIdList = Array.from(userIds)
  const { data: users } = userIdList.length
    ? await supabase.from('users').select('id, name, email').in('id', userIdList)
    : { data: [] as UserLite[] }
  const userMap = new Map(
    (users ?? []).map((u) => [u.id, u as UserLite]),
  )

  // Count history turns per offer
  const offerIds = (offers ?? []).map((o) => o.id)
  const historyCounts = new Map<string, number>()
  if (offerIds.length) {
    const { data: history } = await supabase
      .from('offer_history')
      .select('offer_id')
      .in('offer_id', offerIds)
    for (const h of history ?? []) {
      historyCounts.set(h.offer_id, (historyCounts.get(h.offer_id) ?? 0) + 1)
    }
  }

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1
  const hasFilters = p.status !== 'all'

  return (
    <div>
      <header className="mb-8 lg:mb-12">
        <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-3 lg:mb-4">
          Community
        </div>
        <h1 className="text-[32px] sm:text-[38px] lg:text-[44px] font-extralight leading-[1.05] text-ink">
          Offers
        </h1>
        <p className="mt-2 text-[13px] text-granny font-light">
          {count !== null && count !== undefined
            ? `${count.toLocaleString()} ${count === 1 ? 'offer' : 'offers'}`
            : 'Loading…'}
        </p>
      </header>

      {/* Filters */}
      <form
        method="GET"
        action="/admin/offers"
        className="mb-8 lg:mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-6 pb-6 lg:pb-8 border-b border-granny/20"
      >
        <div>
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
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
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
              href="/admin/offers"
              className="min-h-[44px] inline-flex items-center text-[11px] uppercase tracking-[0.22em] text-granny hover:text-ink active:text-ink transition-colors"
            >
              Clear
            </Link>
          )}
        </div>
      </form>

      {error && (
        <div className="mb-8 border-l-2 border-red-700 bg-red-50 px-4 sm:px-5 py-4 text-[13px] text-red-900 font-light">
          Failed to load offers: {error.message}
        </div>
      )}

      {/* Mobile cards */}
      <div className="lg:hidden">
        {offers && offers.length > 0 ? (
          <ul className="border-t border-granny/20">
            {offers.map((offer) => {
              const sender = offer.sender_id
                ? userMap.get(offer.sender_id)
                : null
              const receiver = offer.receiver_id
                ? userMap.get(offer.receiver_id)
                : null
              const turns = historyCounts.get(offer.id) ?? 0
              return (
                <li key={offer.id} className="border-b border-granny/15 py-5 px-1">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <StatusTag status={offer.status} />
                    <div className="text-[10px] uppercase tracking-[0.12em] text-granny/80 text-right">
                      {formatDateTime(offer.created_at)}
                    </div>
                  </div>
                  <div className="space-y-2 text-[13px] font-light">
                    <UserRow label="From" user={sender} />
                    <UserRow label="To" user={receiver} />
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.15em] text-granny/80">
                    <span>Match #{offer.match_id}</span>
                    <span className="text-granny/30">·</span>
                    <span>{turns} turn{turns === 1 ? '' : 's'}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="border border-granny/20 py-16 text-center text-granny text-[13px] font-light italic">
            No offers found.
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
                Sender
              </th>
              <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium">
                Receiver
              </th>
              <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium">
                Status
              </th>
              <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium">
                Turns
              </th>
              <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium">
                Match
              </th>
            </tr>
          </thead>
          <tbody>
            {offers && offers.length > 0 ? (
              offers.map((offer) => {
                const sender = offer.sender_id ? userMap.get(offer.sender_id) : null
                const receiver = offer.receiver_id ? userMap.get(offer.receiver_id) : null
                const turns = historyCounts.get(offer.id) ?? 0
                return (
                  <tr
                    key={offer.id}
                    className="border-b border-granny/15 hover:bg-firefly/[0.03] transition-colors last:border-b-0"
                  >
                    <td className="px-5 py-4 text-granny tabular-nums text-[12px] whitespace-nowrap">
                      {formatDateTime(offer.created_at)}
                    </td>
                    <td className="px-5 py-4 max-w-[200px] truncate">
                      <UserCell user={sender} />
                    </td>
                    <td className="px-5 py-4 max-w-[200px] truncate">
                      <UserCell user={receiver} />
                    </td>
                    <td className="px-5 py-4">
                      <StatusTag status={offer.status} />
                    </td>
                    <td className="px-5 py-4 text-granny tabular-nums text-[12px]">
                      {turns}
                    </td>
                    <td className="px-5 py-4 text-granny text-[12px] tabular-nums">
                      #{offer.match_id}
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
                  No offers found.
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

function StatusTag({
  status,
}: {
  status: 'pending' | 'accepted' | 'rejected' | null
}) {
  if (!status) {
    return <span className="text-granny/50 italic text-[10px]">—</span>
  }
  const styles: Record<NonNullable<typeof status>, string> = {
    pending: 'bg-granny/15 text-granny',
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
