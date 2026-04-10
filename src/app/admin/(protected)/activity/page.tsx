import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const PAGE_SIZE = 25

const EVENT_TYPES = [
  'all',
  'want_added',
  'have_added',
  'match_created',
  'offer_sent',
  'chat_started',
  'first_message_sent',
  'offer_accepted',
  'offer_rejected',
  'counter_offer_sent',
] as const

type EventType = (typeof EVENT_TYPES)[number]

type ParsedParams = {
  eventType: EventType
  page: number
}

function parseSearchParams(raw: Record<string, string | undefined>): ParsedParams {
  const eventType: EventType = (EVENT_TYPES as readonly string[]).includes(
    raw.type ?? '',
  )
    ? (raw.type as EventType)
    : 'all'
  const page = Math.max(1, parseInt(raw.page ?? '1', 10) || 1)
  return { eventType, page }
}

function buildHref(current: ParsedParams, override: Partial<ParsedParams>): string {
  const merged = { ...current, ...override }
  const p = new URLSearchParams()
  if (merged.eventType !== 'all') p.set('type', merged.eventType)
  if (merged.page !== 1) p.set('page', String(merged.page))
  const qs = p.toString()
  return qs ? `/admin/activity?${qs}` : '/admin/activity'
}

function formatEventType(key: string): string {
  return key
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
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

type ActivityEvent = {
  event_id: string
  event_type: string
  created_at: string
  want_id: number | null
  have_id: number | null
  match_id: number | null
  offer_id: string | null
  chat_room_id: string | null
  metadata: Record<string, unknown> | null
  user_id: string
  user_name: string | null
  user_email: string | null
  profile: string | null
}

type RpcResponse = {
  total_by_type: Record<string, number>
  events: ActivityEvent[]
}

export const dynamic = 'force-dynamic'

export default async function ActivityLogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const raw = await searchParams
  const p = parseSearchParams(raw)
  const offset = (p.page - 1) * PAGE_SIZE

  // IMPORTANT: regular server client — the RPC uses auth.uid() indirectly
  // (via SECURITY DEFINER) and p_admin_mode=true gives us global visibility.
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_user_events_with_summary', {
    p_event_type: p.eventType,
    p_limit: PAGE_SIZE,
    p_offset: offset,
    p_admin_mode: true,
  })

  const response = (data ?? {
    total_by_type: {},
    events: [],
  }) as RpcResponse

  const totalCount = Object.values(response.total_by_type).reduce(
    (sum, n) => sum + n,
    0,
  )
  const currentTypeCount =
    p.eventType === 'all'
      ? totalCount
      : response.total_by_type[p.eventType] ?? 0
  const totalPages = currentTypeCount
    ? Math.ceil(currentTypeCount / PAGE_SIZE)
    : 1

  return (
    <div>
      <header className="mb-8 lg:mb-12">
        <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-3 lg:mb-4">
          System
        </div>
        <h1 className="text-[32px] sm:text-[38px] lg:text-[44px] font-extralight leading-[1.05] text-ink">
          Activity log
        </h1>
        <p className="mt-2 text-[13px] text-granny font-light">
          {totalCount.toLocaleString()} total events across the community
        </p>
      </header>

      {/* Totals-by-type summary row */}
      <section className="mb-8 lg:mb-10">
        <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-3">
          Breakdown
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-granny/20 border border-granny/20">
          {EVENT_TYPES.filter((t) => t !== 'all').map((type) => {
            const count = response.total_by_type[type] ?? 0
            const isActive = p.eventType === type
            return (
              <Link
                key={type}
                href={buildHref(p, { eventType: type, page: 1 })}
                className={`bg-offwhite px-4 py-4 transition-colors ${
                  isActive
                    ? 'ring-1 ring-inset ring-firefly/30'
                    : 'hover:bg-firefly/[0.03] active:bg-firefly/[0.05]'
                }`}
              >
                <div
                  className={`text-[9px] uppercase tracking-[0.15em] mb-2 ${
                    isActive ? 'text-firefly' : 'text-granny'
                  }`}
                >
                  {formatEventType(type)}
                </div>
                <div
                  className={`text-[22px] lg:text-[26px] font-extralight tabular-nums leading-none ${
                    isActive ? 'text-firefly' : 'text-ink'
                  }`}
                >
                  {count.toLocaleString()}
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Filter row */}
      <nav
        aria-label="Event type filter"
        className="mb-8 lg:mb-10 flex items-center gap-0 border-b border-granny/25 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-5 px-5 sm:mx-0 sm:px-0"
      >
        {EVENT_TYPES.map((type) => {
          const active = p.eventType === type
          return (
            <Link
              key={type}
              href={buildHref(p, { eventType: type, page: 1 })}
              className={`relative min-h-[44px] inline-flex items-center px-3 lg:px-4 text-[11px] lg:text-[12px] uppercase tracking-[0.13em] font-light whitespace-nowrap transition-colors ${
                active ? 'text-firefly' : 'text-granny hover:text-ink'
              }`}
            >
              {type === 'all' ? 'All' : formatEventType(type)}
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
          Failed to load activity: {error.message}
        </div>
      )}

      {/* Event list — single layout, works on both mobile and desktop */}
      {response.events.length > 0 ? (
        <ul className="border border-granny/20 divide-y divide-granny/15">
          {response.events.map((evt) => (
            <li
              key={evt.event_id}
              className="px-4 sm:px-5 py-4 flex items-start gap-4"
            >
              {/* Small colored dot indicating event type */}
              <EventTypeDot type={evt.event_type} />

              <div className="flex-1 min-w-0">
                {/* Event type + timestamp row */}
                <div className="flex items-baseline gap-3 mb-1 flex-wrap">
                  <span className="text-[13px] lg:text-[14px] font-light text-ink">
                    {formatEventType(evt.event_type)}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.12em] text-granny/70 whitespace-nowrap">
                    {formatDateTime(evt.created_at)}
                  </span>
                </div>

                {/* User attribution */}
                <div className="text-[12px] text-granny font-light mb-2">
                  <Link
                    href={`/admin/users/${evt.user_id}`}
                    className="hover:text-firefly transition-colors"
                  >
                    {evt.user_name || evt.user_email || 'Unknown'}
                  </Link>
                </div>

                {/* Related object links */}
                <RelatedLinks event={evt} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="border border-granny/20 py-16 text-center text-granny text-[13px] font-light italic">
          No events match this filter.
        </div>
      )}

      {/* Pagination */}
      {currentTypeCount > PAGE_SIZE && (
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-[12px] font-light">
          <div className="text-granny uppercase tracking-[0.15em] text-[10px]">
            Page {p.page} of {totalPages} · {currentTypeCount.toLocaleString()}{' '}
            events
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

      <p className="mt-12 max-w-xl text-[11px] text-granny leading-relaxed font-light">
        Powered by{' '}
        <code className="font-mono text-[10px] text-firefly">
          get_user_events_with_summary
        </code>{' '}
        with <code className="font-mono text-[10px] text-firefly">p_admin_mode</code>{' '}
        enabled. Events are logged by the mobile app whenever users take
        meaningful actions.
      </p>
    </div>
  )
}

function EventTypeDot({ type }: { type: string }) {
  const colorMap: Record<string, string> = {
    want_added: 'bg-firefly',
    have_added: 'bg-casablanca-dark',
    match_created: 'bg-firefly-light',
    offer_sent: 'bg-casablanca',
    chat_started: 'bg-granny',
    first_message_sent: 'bg-granny',
    offer_accepted: 'bg-firefly',
    offer_rejected: 'bg-red-600',
    counter_offer_sent: 'bg-casablanca-dark',
  }
  const color = colorMap[type] ?? 'bg-granny'
  return (
    <div className="shrink-0 pt-1.5">
      <span
        aria-hidden
        className={`block w-2 h-2 rounded-full ${color}`}
      />
    </div>
  )
}

function RelatedLinks({ event }: { event: ActivityEvent }) {
  const links: { label: string; href: string }[] = []
  if (event.want_id) {
    links.push({ label: `Want #${event.want_id}`, href: `/admin/want-have/${event.want_id}` })
  }
  if (event.have_id) {
    links.push({ label: `Have #${event.have_id}`, href: `/admin/want-have/${event.have_id}` })
  }
  if (event.chat_room_id) {
    links.push({ label: 'Chat room', href: `/admin/chat/${event.chat_room_id}` })
  }
  if (event.offer_id) {
    links.push({ label: `Offer`, href: `/admin/offers` })
  }
  if (event.match_id) {
    links.push({ label: `Match #${event.match_id}`, href: `/admin/matches` })
  }

  if (links.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.12em]">
      {links.map((link, i) => (
        <span key={`${link.href}-${i}`} className="flex items-center gap-3">
          {i > 0 && <span className="text-granny/30">·</span>}
          <Link
            href={link.href}
            className="text-granny hover:text-firefly transition-colors"
          >
            {link.label}
          </Link>
        </span>
      ))}
    </div>
  )
}
