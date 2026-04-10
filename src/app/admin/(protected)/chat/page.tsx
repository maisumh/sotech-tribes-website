import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

const PAGE_SIZE = 25

type FilterKey = 'all' | 'reported' | 'blocked'

type ParsedParams = {
  filter: FilterKey
  page: number
}

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
  return qs ? `/admin/chat?${qs}` : '/admin/chat'
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

type RoomRow = {
  id: string
  user1_id: string | null
  user2_id: string | null
  last_message: string | null
  last_message_at: string | null
  blocked_by: string | null
  blocked_at: string | null
  reported_by: string | null
  reported_reason: string | null
  reported_at: string | null
  created_at: string
}

type UserLite = {
  id: string
  name: string | null
  email: string | null
}

export const dynamic = 'force-dynamic'

export default async function ChatRoomsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const raw = await searchParams
  const p = parseSearchParams(raw)

  const from = (p.page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = createAdminClient()

  // Priority-sort: reported rooms first (by reported_at desc),
  // then unreported rooms (by last_message_at desc).
  let query = supabase
    .from('chat_rooms')
    .select(
      'id, user1_id, user2_id, last_message, last_message_at, blocked_by, blocked_at, reported_by, reported_reason, reported_at, created_at',
      { count: 'exact' },
    )
    .order('reported_at', { ascending: false, nullsFirst: false })
    .order('last_message_at', { ascending: false, nullsFirst: false })
    .range(from, to)

  if (p.filter === 'reported') {
    // Data quirk: the mobile app sets reported_reason + reported_at but
    // often leaves reported_by NULL. Check either field.
    query = query.or('reported_by.not.is.null,reported_reason.not.is.null')
  } else if (p.filter === 'blocked') {
    query = query.not('blocked_by', 'is', null)
  }

  const { data: rooms, count, error } = (await query) as {
    data: RoomRow[] | null
    count: number | null
    error: { message: string } | null
  }

  // Batch-fetch users
  const userIds = new Set<string>()
  for (const r of rooms ?? []) {
    if (r.user1_id) userIds.add(r.user1_id)
    if (r.user2_id) userIds.add(r.user2_id)
  }
  const userIdList = Array.from(userIds)
  const { data: users } = userIdList.length
    ? await supabase.from('users').select('id, name, email').in('id', userIdList)
    : { data: [] as UserLite[] }
  const userMap = new Map(
    (users ?? []).map((u) => [u.id, u as UserLite]),
  )

  // Batch-fetch message counts per room
  const roomIds = (rooms ?? []).map((r) => r.id)
  const messageCounts = new Map<string, number>()
  if (roomIds.length) {
    const { data: msgs } = await supabase
      .from('chat_messages')
      .select('room_id')
      .in('room_id', roomIds)
    for (const m of msgs ?? []) {
      messageCounts.set(m.room_id, (messageCounts.get(m.room_id) ?? 0) + 1)
    }
  }

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1
  const hasFilters = p.filter !== 'all'

  return (
    <div>
      <header className="admin-fade-up mb-8 lg:mb-12">
        <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-3 lg:mb-4">
          Moderation
        </div>
        <h1 className="text-[32px] sm:text-[38px] lg:text-[44px] font-extralight leading-[1.05] text-ink">
          Chats
        </h1>
        <p className="mt-2 text-[13px] text-granny font-light">
          {count !== null && count !== undefined
            ? `${count.toLocaleString()} ${count === 1 ? 'room' : 'rooms'}`
            : 'Loading…'}
        </p>
      </header>

      {/* Filter pills */}
      <nav
        aria-label="Room filter"
        className="mb-8 lg:mb-10 flex items-center gap-0 border-b border-granny/25 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-5 px-5 sm:mx-0 sm:px-0"
      >
        {(['all', 'reported', 'blocked'] as FilterKey[]).map((key) => {
          const active = p.filter === key
          const label =
            key === 'all'
              ? 'All rooms'
              : key === 'reported'
              ? 'Reported'
              : 'Blocked'
          return (
            <Link
              key={key}
              href={buildHref(p, { filter: key, page: 1 })}
              className={`relative min-h-[44px] inline-flex items-center px-4 lg:px-5 text-[11px] lg:text-[12px] uppercase tracking-[0.15em] font-light whitespace-nowrap transition-colors ${
                active ? 'text-firefly' : 'text-granny hover:text-ink'
              }`}
            >
              {label}
              {active && (
                <span
                  aria-hidden
                  className="absolute left-0 right-0 -bottom-px h-[2px] bg-casablanca"
                />
              )}
            </Link>
          )
        })}
      </nav>

      {error && (
        <div className="mb-8 border-l-2 border-red-700 bg-red-50 px-4 sm:px-5 py-4 text-[13px] text-red-900 font-light">
          Failed to load chat rooms: {error.message}
        </div>
      )}

      {/* Mobile cards */}
      <div className="lg:hidden">
        {rooms && rooms.length > 0 ? (
          <ul className="admin-stagger border-t border-granny/20">
            {rooms.map((r) => {
              const u1 = r.user1_id ? userMap.get(r.user1_id) : null
              const u2 = r.user2_id ? userMap.get(r.user2_id) : null
              const msgCount = messageCounts.get(r.id) ?? 0
              return (
                <li key={r.id} className="border-b border-granny/15">
                  <Link
                    href={`/admin/chat/${r.id}`}
                    className="admin-lift block py-5 px-1 active:bg-firefly/[0.03]"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {(r.reported_by || r.reported_reason) && !r.blocked_by && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-[3px] bg-red-50 text-red-700 text-[10px] uppercase tracking-[0.15em] font-medium">
                          <span className="block w-1 h-1 rounded-full bg-red-700" />
                          Reported
                        </span>
                      )}
                      {r.blocked_by && (
                        <span className="inline-flex items-center px-2 py-[3px] bg-granny/15 text-granny text-[10px] uppercase tracking-[0.15em] font-medium">
                          Blocked
                        </span>
                      )}
                      <div className="ml-auto text-[10px] uppercase tracking-[0.12em] text-granny/80">
                        {formatDateTime(r.last_message_at)}
                      </div>
                    </div>

                    <div className="text-[14px] text-ink font-light mb-1">
                      {u1?.name || u1?.email || 'Unknown'}
                      <span className="text-granny/40 mx-2">↔</span>
                      {u2?.name || u2?.email || 'Unknown'}
                    </div>

                    {r.last_message && (
                      <div className="text-[13px] text-granny font-light line-clamp-2 italic mb-2">
                        &ldquo;{r.last_message}&rdquo;
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.12em] text-granny/80">
                      <span>{msgCount} messages</span>
                      {r.reported_reason && (
                        <>
                          <span className="text-granny/30">·</span>
                          <span className="normal-case italic text-red-700">
                            {r.reported_reason}
                          </span>
                        </>
                      )}
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="border border-granny/20 py-16 text-center text-granny text-[13px] font-light italic">
            No chat rooms found.
          </div>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block border border-granny/20">
        <table className="w-full text-[13px] font-light">
          <thead>
            <tr className="border-b border-granny/20 bg-offwhite">
              <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium">
                Participants
              </th>
              <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium">
                Last message
              </th>
              <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium">
                Messages
              </th>
              <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium">
                Activity
              </th>
              <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium">
                Flags
              </th>
            </tr>
          </thead>
          <tbody>
            {rooms && rooms.length > 0 ? (
              rooms.map((r) => {
                const u1 = r.user1_id ? userMap.get(r.user1_id) : null
                const u2 = r.user2_id ? userMap.get(r.user2_id) : null
                const msgCount = messageCounts.get(r.id) ?? 0
                return (
                  <tr
                    key={r.id}
                    className="border-b border-granny/15 hover:bg-firefly/[0.03] transition-colors last:border-b-0 align-top"
                  >
                    <td className="px-5 py-4 max-w-[280px]">
                      <Link
                        href={`/admin/chat/${r.id}`}
                        className="text-ink hover:text-firefly transition-colors block truncate"
                      >
                        {u1?.name || u1?.email || 'Unknown'}
                        <span className="text-granny/40 mx-2">↔</span>
                        {u2?.name || u2?.email || 'Unknown'}
                      </Link>
                    </td>
                    <td className="px-5 py-4 max-w-[320px]">
                      {r.last_message ? (
                        <span className="text-granny italic line-clamp-2 text-[12px]">
                          &ldquo;{r.last_message}&rdquo;
                        </span>
                      ) : (
                        <span className="text-granny/50 italic text-[12px]">
                          No messages
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-granny tabular-nums text-[12px]">
                      {msgCount}
                    </td>
                    <td className="px-5 py-4 text-granny tabular-nums text-[12px] whitespace-nowrap">
                      {formatDateTime(r.last_message_at)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {(r.reported_by || r.reported_reason) && !r.blocked_by && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-[3px] bg-red-50 text-red-700 text-[10px] uppercase tracking-[0.15em] font-medium">
                            <span className="block w-1 h-1 rounded-full bg-red-700" />
                            Reported
                          </span>
                        )}
                        {r.blocked_by && (
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
                <td
                  colSpan={5}
                  className="px-5 py-16 text-center text-granny text-[13px]"
                >
                  No chat rooms found.
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
