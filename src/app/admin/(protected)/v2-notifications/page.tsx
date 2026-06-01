import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

const PAGE_SIZE = 30

const TYPE_KEYS = [
  'all',
  'trade_proposal',
  'trade_accepted',
  'trade_declined',
  'trade_countered',
  'trade_cancelled',
  'new_message',
  'new_match',
  'system',
] as const

type TypeKey = (typeof TYPE_KEYS)[number]

type ParsedParams = { type: TypeKey; page: number }

function parseSearchParams(raw: Record<string, string | undefined>): ParsedParams {
  const type = (TYPE_KEYS as readonly string[]).includes(raw.type ?? '')
    ? (raw.type as TypeKey)
    : 'all'
  const page = Math.max(1, parseInt(raw.page ?? '1', 10) || 1)
  return { type, page }
}

function buildHref(current: ParsedParams, override: Partial<ParsedParams>): string {
  const merged = { ...current, ...override }
  const p = new URLSearchParams()
  if (merged.type !== 'all') p.set('type', merged.type)
  if (merged.page !== 1) p.set('page', String(merged.page))
  const qs = p.toString()
  return qs ? `/admin/v2-notifications?${qs}` : '/admin/v2-notifications'
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

function typeLabel(type: string): string {
  return type.replace(/_/g, ' ')
}

type NotificationRow = {
  id: string
  user_id: string
  type: string
  title: string
  body: string | null
  read_at: string | null
  created_at: string
}

type UserLite = { id: string; name: string | null; email: string | null }

export const dynamic = 'force-dynamic'

export default async function V2NotificationsPage({
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
    .from('v2_notifications')
    .select('id, user_id, type, title, body, read_at, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (p.type !== 'all') query = query.eq('type', p.type)

  const { data: items, count, error } = (await query) as {
    data: NotificationRow[] | null
    count: number | null
    error: { message: string } | null
  }

  const userIds = Array.from(new Set((items ?? []).map((i) => i.user_id)))
  const { data: users } = userIds.length
    ? await supabase.from('users').select('id, name, email').in('id', userIds)
    : { data: [] as UserLite[] }
  const userMap = new Map((users ?? []).map((u) => [u.id, u as UserLite]))

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1

  return (
    <div>
      <header className="admin-fade-up mb-8 lg:mb-12">
        <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-3 lg:mb-4">
          System · v2
        </div>
        <h1 className="text-[32px] sm:text-[38px] lg:text-[44px] font-extralight leading-[1.05] text-ink">
          v2 Notifications
        </h1>
        <p className="mt-2 text-[13px] text-granny font-light">
          {count !== null && count !== undefined
            ? `${count.toLocaleString()} ${count === 1 ? 'notification' : 'notifications'}`
            : 'Loading…'}
        </p>
      </header>

      <nav
        aria-label="Notification type filter"
        className="mb-8 lg:mb-10 flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-5 px-5 sm:mx-0 sm:px-0"
      >
        {TYPE_KEYS.map((key) => {
          const active = p.type === key
          return (
            <Link
              key={key}
              href={buildHref(p, { type: key, page: 1 })}
              className={`min-h-[34px] inline-flex items-center px-3 rounded-full text-[10px] uppercase tracking-[0.15em] font-medium whitespace-nowrap transition-colors ${
                active ? 'bg-firefly text-offwhite' : 'bg-firefly/[0.06] text-granny hover:text-firefly'
              }`}
            >
              {key === 'all' ? 'All types' : typeLabel(key)}
            </Link>
          )
        })}
      </nav>

      {error && (
        <div className="mb-8 border-l-2 border-red-700 bg-red-50 px-4 sm:px-5 py-4 text-[13px] text-red-900 font-light">
          Failed to load notifications: {error.message}
        </div>
      )}

      {/* Mobile cards */}
      <div className="lg:hidden">
        {items && items.length > 0 ? (
          <ul className="admin-stagger border-t border-granny/20">
            {items.map((n) => {
              const user = userMap.get(n.user_id)
              return (
                <li key={n.id} className="border-b border-granny/15 py-5 px-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <TypeBadge type={n.type} />
                    {!n.read_at && <span className="w-1.5 h-1.5 rounded-full bg-casablanca" aria-label="Unread" />}
                    <div className="ml-auto text-[10px] uppercase tracking-[0.12em] text-granny/80">
                      {formatDateTime(n.created_at)}
                    </div>
                  </div>
                  <div className="text-[14px] text-ink font-light">{n.title}</div>
                  {n.body && <div className="text-[13px] text-granny font-light mt-1">{n.body}</div>}
                  <div className="mt-2 text-[10px] uppercase tracking-[0.12em] text-granny/70">
                    to {user?.name || user?.email || 'Unknown'}
                  </div>
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
              <Th>Type</Th>
              <Th>Title</Th>
              <Th>Recipient</Th>
              <Th>Read</Th>
              <Th>Sent</Th>
            </tr>
          </thead>
          <tbody>
            {items && items.length > 0 ? (
              items.map((n) => {
                const user = userMap.get(n.user_id)
                return (
                  <tr key={n.id} className="border-b border-granny/15 hover:bg-firefly/[0.03] transition-colors last:border-b-0 align-top">
                    <td className="px-5 py-4">
                      <TypeBadge type={n.type} />
                    </td>
                    <td className="px-5 py-4 max-w-[360px]">
                      <span className="text-ink">{n.title}</span>
                      {n.body && <span className="block text-granny text-[12px] line-clamp-1">{n.body}</span>}
                    </td>
                    <td className="px-5 py-4 max-w-[180px] truncate">
                      {user ? (
                        <Link href={`/admin/users/${user.id}`} className="text-ink hover:text-firefly transition-colors block truncate">
                          {user.name || user.email || 'Unknown'}
                        </Link>
                      ) : (
                        <span className="text-granny italic">Unknown</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-[12px]">
                      {n.read_at ? (
                        <span className="text-granny">Read</span>
                      ) : (
                        <span className="text-casablanca-dark">Unread</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-granny tabular-nums text-[12px] whitespace-nowrap">
                      {formatDateTime(n.created_at)}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center text-granny text-[13px]">
                  No notifications found.
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

function TypeBadge({ type }: { type: string }) {
  const isSystem = type === 'system'
  return (
    <span
      className={`inline-flex items-center px-2 py-[3px] text-[10px] uppercase tracking-[0.12em] font-medium ${
        isSystem ? 'bg-granny/15 text-granny' : 'bg-firefly/10 text-firefly'
      }`}
    >
      {type.replace(/_/g, ' ')}
    </span>
  )
}

function EmptyState() {
  return (
    <div className="border border-granny/20 py-16 text-center text-granny text-[13px] font-light italic">
      No notifications found.
    </div>
  )
}
