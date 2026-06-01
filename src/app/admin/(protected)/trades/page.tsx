import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

const PAGE_SIZE = 25

type StatusKey = 'all' | 'pending' | 'accepted' | 'countered' | 'completed' | 'rejected' | 'cancelled'

const STATUS_KEYS: StatusKey[] = ['all', 'pending', 'accepted', 'countered', 'completed', 'rejected', 'cancelled']

type ParsedParams = { status: StatusKey; page: number }

function parseSearchParams(raw: Record<string, string | undefined>): ParsedParams {
  const status = (STATUS_KEYS as string[]).includes(raw.status ?? '')
    ? (raw.status as StatusKey)
    : 'all'
  const page = Math.max(1, parseInt(raw.page ?? '1', 10) || 1)
  return { status, page }
}

function buildHref(current: ParsedParams, override: Partial<ParsedParams>): string {
  const merged = { ...current, ...override }
  const p = new URLSearchParams()
  if (merged.status !== 'all') p.set('status', merged.status)
  if (merged.page !== 1) p.set('page', String(merged.page))
  const qs = p.toString()
  return qs ? `/admin/trades?${qs}` : '/admin/trades'
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

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-casablanca/20 text-casablanca-dark',
  accepted: 'bg-firefly/10 text-firefly',
  countered: 'bg-casablanca/20 text-casablanca-dark',
  completed: 'bg-firefly/10 text-firefly',
  rejected: 'bg-granny/15 text-granny',
  cancelled: 'bg-granny/15 text-granny',
}

type TradeRow = {
  id: string
  proposer_id: string
  recipient_id: string
  status: string
  is_help_offer: boolean
  message: string | null
  created_at: string
}

type UserLite = { id: string; name: string | null; email: string | null }

export const dynamic = 'force-dynamic'

export default async function TradesPage({
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
    .from('trade_proposals')
    .select('id, proposer_id, recipient_id, status, is_help_offer, message, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (p.status !== 'all') query = query.eq('status', p.status)

  const { data: trades, count, error } = (await query) as {
    data: TradeRow[] | null
    count: number | null
    error: { message: string } | null
  }

  const userIds = new Set<string>()
  for (const t of trades ?? []) {
    userIds.add(t.proposer_id)
    userIds.add(t.recipient_id)
  }
  const { data: users } = userIds.size
    ? await supabase.from('users').select('id, name, email').in('id', Array.from(userIds))
    : { data: [] as UserLite[] }
  const userMap = new Map((users ?? []).map((u) => [u.id, u as UserLite]))

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1

  return (
    <div>
      <header className="admin-fade-up mb-8 lg:mb-12">
        <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-3 lg:mb-4">
          Community · v2
        </div>
        <h1 className="text-[32px] sm:text-[38px] lg:text-[44px] font-extralight leading-[1.05] text-ink">
          Trades
        </h1>
        <p className="mt-2 text-[13px] text-granny font-light">
          {count !== null && count !== undefined
            ? `${count.toLocaleString()} ${count === 1 ? 'proposal' : 'proposals'}`
            : 'Loading…'}
        </p>
      </header>

      <nav
        aria-label="Trade status filter"
        className="mb-8 lg:mb-10 flex items-center gap-0 border-b border-granny/25 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-5 px-5 sm:mx-0 sm:px-0"
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
              {active && <span aria-hidden className="absolute left-0 right-0 -bottom-px h-[2px] bg-casablanca" />}
            </Link>
          )
        })}
      </nav>

      {error && (
        <div className="mb-8 border-l-2 border-red-700 bg-red-50 px-4 sm:px-5 py-4 text-[13px] text-red-900 font-light">
          Failed to load trades: {error.message}
        </div>
      )}

      {/* Mobile cards */}
      <div className="lg:hidden">
        {trades && trades.length > 0 ? (
          <ul className="admin-stagger border-t border-granny/20">
            {trades.map((t) => {
              const proposer = userMap.get(t.proposer_id)
              const recipient = userMap.get(t.recipient_id)
              return (
                <li key={t.id} className="border-b border-granny/15">
                  <Link href={`/admin/trades/${t.id}`} className="admin-lift block py-5 px-1 active:bg-firefly/[0.03]">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <StatusBadge status={t.status} />
                      {t.is_help_offer && (
                        <span className="px-2 py-[3px] bg-firefly/[0.06] text-firefly text-[10px] uppercase tracking-[0.15em]">
                          Help offer
                        </span>
                      )}
                      <div className="ml-auto text-[10px] uppercase tracking-[0.12em] text-granny/80">
                        {formatDateTime(t.created_at)}
                      </div>
                    </div>
                    <div className="text-[14px] text-ink font-light mb-1">
                      {proposer?.name || proposer?.email || 'Unknown'}
                      <span className="text-granny/40 mx-2">→</span>
                      {recipient?.name || recipient?.email || 'Unknown'}
                    </div>
                    {t.message && (
                      <div className="text-[13px] text-granny font-light line-clamp-2 italic">
                        &ldquo;{t.message}&rdquo;
                      </div>
                    )}
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
              <Th>Proposer</Th>
              <Th>Recipient</Th>
              <Th>Message</Th>
              <Th>Created</Th>
            </tr>
          </thead>
          <tbody>
            {trades && trades.length > 0 ? (
              trades.map((t) => {
                const proposer = userMap.get(t.proposer_id)
                const recipient = userMap.get(t.recipient_id)
                return (
                  <tr key={t.id} className="border-b border-granny/15 hover:bg-firefly/[0.03] transition-colors last:border-b-0 align-top">
                    <td className="px-5 py-4">
                      <Link href={`/admin/trades/${t.id}`}>
                        <StatusBadge status={t.status} />
                      </Link>
                    </td>
                    <td className="px-5 py-4 max-w-[180px] truncate">
                      <UserCell user={proposer} />
                    </td>
                    <td className="px-5 py-4 max-w-[180px] truncate">
                      <UserCell user={recipient} />
                    </td>
                    <td className="px-5 py-4 max-w-[320px]">
                      {t.message ? (
                        <span className="text-granny italic line-clamp-2 text-[12px]">&ldquo;{t.message}&rdquo;</span>
                      ) : (
                        <span className="text-granny/50 italic text-[12px]">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-granny tabular-nums text-[12px] whitespace-nowrap">
                      {formatDateTime(t.created_at)}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center text-granny text-[13px]">
                  No trades found.
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

function UserCell({ user }: { user: UserLite | null | undefined }) {
  if (!user) return <span className="text-granny italic">Unknown</span>
  return (
    <Link href={`/admin/users/${user.id}`} className="text-ink hover:text-firefly transition-colors block truncate">
      {user.name || user.email || 'Unknown'}
    </Link>
  )
}

function EmptyState() {
  return (
    <div className="border border-granny/20 py-16 text-center text-granny text-[13px] font-light italic">
      No trades found.
    </div>
  )
}
