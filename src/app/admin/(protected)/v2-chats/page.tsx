import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

const PAGE_SIZE = 25

type FilterKey = 'all' | 'reported' | 'blocked'

type ParsedParams = { filter: FilterKey; page: number }

function parseSearchParams(raw: Record<string, string | undefined>): ParsedParams {
  const filter: FilterKey =
    raw.filter === 'reported' || raw.filter === 'blocked' ? raw.filter : 'all'
  const page = Math.max(1, parseInt(raw.page ?? '1', 10) || 1)
  return { filter, page }
}

function buildHref(current: ParsedParams, override: Partial<ParsedParams>): string {
  const merged = { ...current, ...override }
  const p = new URLSearchParams()
  if (merged.filter !== 'all') p.set('filter', merged.filter)
  if (merged.page !== 1) p.set('page', String(merged.page))
  const qs = p.toString()
  return qs ? `/admin/v2-chats?${qs}` : '/admin/v2-chats'
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

const STATUS_LABEL: Record<string, string> = {
  in_conversation: 'In conversation',
  exchanged: 'Exchanged',
  rejected: 'Rejected',
}

type ChatRow = {
  id: string
  user_a_id: string | null
  user_b_id: string | null
  last_message_preview: string | null
  last_message_at: string | null
  status: string
  blocked_by: string | null
  reported_by: string | null
  reported_reason: string | null
  reported_at: string | null
  created_at: string
}

type UserLite = { id: string; name: string | null; email: string | null }

export const dynamic = 'force-dynamic'

export default async function V2ChatsPage({
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
    .from('v2_chats')
    .select(
      'id, user_a_id, user_b_id, last_message_preview, last_message_at, status, blocked_by, reported_by, reported_reason, reported_at, created_at',
      { count: 'exact' },
    )
    .order('reported_at', { ascending: false, nullsFirst: false })
    .order('last_message_at', { ascending: false, nullsFirst: false })
    .range(from, to)

  if (p.filter === 'reported') {
    query = query.or('reported_by.not.is.null,reported_reason.not.is.null')
  } else if (p.filter === 'blocked') {
    query = query.not('blocked_by', 'is', null)
  }

  const { data: chats, count, error } = (await query) as {
    data: ChatRow[] | null
    count: number | null
    error: { message: string } | null
  }

  const userIds = new Set<string>()
  for (const c of chats ?? []) {
    if (c.user_a_id) userIds.add(c.user_a_id)
    if (c.user_b_id) userIds.add(c.user_b_id)
  }
  const { data: users } = userIds.size
    ? await supabase.from('users').select('id, name, email').in('id', Array.from(userIds))
    : { data: [] as UserLite[] }
  const userMap = new Map((users ?? []).map((u) => [u.id, u as UserLite]))

  const chatIds = (chats ?? []).map((c) => c.id)
  const messageCounts = new Map<string, number>()
  if (chatIds.length) {
    const { data: msgs } = await supabase
      .from('v2_chat_messages')
      .select('chat_id')
      .in('chat_id', chatIds)
    for (const m of msgs ?? []) {
      messageCounts.set(m.chat_id, (messageCounts.get(m.chat_id) ?? 0) + 1)
    }
  }

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1

  return (
    <div>
      <header className="admin-fade-up mb-8 lg:mb-12">
        <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-3 lg:mb-4">
          Moderation · v2
        </div>
        <h1 className="text-[32px] sm:text-[38px] lg:text-[44px] font-extralight leading-[1.05] text-ink">
          v2 Chats
        </h1>
        <p className="mt-2 text-[13px] text-granny font-light">
          {count !== null && count !== undefined
            ? `${count.toLocaleString()} ${count === 1 ? 'conversation' : 'conversations'}`
            : 'Loading…'}
        </p>
      </header>

      <nav
        aria-label="Chat filter"
        className="mb-8 lg:mb-10 flex items-center gap-0 border-b border-granny/25 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-5 px-5 sm:mx-0 sm:px-0"
      >
        {(['all', 'reported', 'blocked'] as FilterKey[]).map((key) => {
          const active = p.filter === key
          const label = key === 'all' ? 'All chats' : key === 'reported' ? 'Reported' : 'Blocked'
          return (
            <Link
              key={key}
              href={buildHref(p, { filter: key, page: 1 })}
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
          Failed to load chats: {error.message}
        </div>
      )}

      {/* Mobile cards */}
      <div className="lg:hidden">
        {chats && chats.length > 0 ? (
          <ul className="admin-stagger border-t border-granny/20">
            {chats.map((c) => {
              const ua = c.user_a_id ? userMap.get(c.user_a_id) : null
              const ub = c.user_b_id ? userMap.get(c.user_b_id) : null
              const msgCount = messageCounts.get(c.id) ?? 0
              const isReported = !!(c.reported_by || c.reported_reason)
              return (
                <li key={c.id} className="border-b border-granny/15">
                  <Link href={`/admin/v2-chats/${c.id}`} className="admin-lift block py-5 px-1 active:bg-firefly/[0.03]">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {isReported && !c.blocked_by && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-[3px] bg-red-50 text-red-700 text-[10px] uppercase tracking-[0.15em] font-medium">
                          <span className="block w-1 h-1 rounded-full bg-red-700" />
                          Reported
                        </span>
                      )}
                      {c.blocked_by && (
                        <span className="inline-flex items-center px-2 py-[3px] bg-granny/15 text-granny text-[10px] uppercase tracking-[0.15em] font-medium">
                          Blocked
                        </span>
                      )}
                      <div className="ml-auto text-[10px] uppercase tracking-[0.12em] text-granny/80">
                        {formatDateTime(c.last_message_at)}
                      </div>
                    </div>
                    <div className="text-[14px] text-ink font-light mb-1">
                      {ua?.name || ua?.email || 'Unknown'}
                      <span className="text-granny/40 mx-2">↔</span>
                      {ub?.name || ub?.email || 'Unknown'}
                    </div>
                    {c.last_message_preview && (
                      <div className="text-[13px] text-granny font-light line-clamp-2 italic mb-2">
                        &ldquo;{c.last_message_preview}&rdquo;
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.12em] text-granny/80">
                      <span>{msgCount} messages</span>
                      <span className="text-granny/30">·</span>
                      <span>{STATUS_LABEL[c.status] ?? c.status}</span>
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
              <Th>Participants</Th>
              <Th>Last message</Th>
              <Th>Status</Th>
              <Th>Messages</Th>
              <Th>Activity</Th>
              <Th>Flags</Th>
            </tr>
          </thead>
          <tbody>
            {chats && chats.length > 0 ? (
              chats.map((c) => {
                const ua = c.user_a_id ? userMap.get(c.user_a_id) : null
                const ub = c.user_b_id ? userMap.get(c.user_b_id) : null
                const msgCount = messageCounts.get(c.id) ?? 0
                const isReported = !!(c.reported_by || c.reported_reason)
                return (
                  <tr key={c.id} className="border-b border-granny/15 hover:bg-firefly/[0.03] transition-colors last:border-b-0 align-top">
                    <td className="px-5 py-4 max-w-[260px]">
                      <Link href={`/admin/v2-chats/${c.id}`} className="text-ink hover:text-firefly transition-colors block truncate">
                        {ua?.name || ua?.email || 'Unknown'}
                        <span className="text-granny/40 mx-2">↔</span>
                        {ub?.name || ub?.email || 'Unknown'}
                      </Link>
                    </td>
                    <td className="px-5 py-4 max-w-[300px]">
                      {c.last_message_preview ? (
                        <span className="text-granny italic line-clamp-2 text-[12px]">&ldquo;{c.last_message_preview}&rdquo;</span>
                      ) : (
                        <span className="text-granny/50 italic text-[12px]">No messages</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-granny text-[12px] whitespace-nowrap">
                      {STATUS_LABEL[c.status] ?? c.status}
                    </td>
                    <td className="px-5 py-4 text-granny tabular-nums text-[12px]">{msgCount}</td>
                    <td className="px-5 py-4 text-granny tabular-nums text-[12px] whitespace-nowrap">
                      {formatDateTime(c.last_message_at)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {isReported && !c.blocked_by && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-[3px] bg-red-50 text-red-700 text-[10px] uppercase tracking-[0.15em] font-medium">
                            <span className="block w-1 h-1 rounded-full bg-red-700" />
                            Reported
                          </span>
                        )}
                        {c.blocked_by && (
                          <span className="inline-flex items-center px-2 py-[3px] bg-granny/15 text-granny text-[10px] uppercase tracking-[0.15em] font-medium">
                            Blocked
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-granny text-[13px]">
                  No chats found.
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

function EmptyState() {
  return (
    <div className="border border-granny/20 py-16 text-center text-granny text-[13px] font-light italic">
      No chats found.
    </div>
  )
}
