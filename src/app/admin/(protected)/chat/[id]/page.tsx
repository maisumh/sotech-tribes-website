import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { ChatRoomActions } from '@/components/admin/chat/ChatRoomActions'
import { DeleteMessageButton } from '@/components/admin/chat/DeleteMessageButton'

type RoomRow = {
  id: string
  user1_id: string | null
  user2_id: string | null
  offer_id: string | null
  last_message: string | null
  last_message_at: string | null
  blocked_by: string | null
  blocked_at: string | null
  reported_by: string | null
  reported_reason: string | null
  reported_at: string | null
  created_at: string
}

type MessageRow = {
  id: string
  room_id: string
  sender_id: string
  message: string | null
  attachment_urls: string[] | null
  is_read: boolean | null
  is_offer: boolean | null
  created_at: string
}

type UserLite = {
  id: string
  name: string | null
  email: string | null
}

export const dynamic = 'force-dynamic'

export default async function ChatRoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = createAdminClient()

  const { data: room, error: roomError } = (await supabase
    .from('chat_rooms')
    .select(
      'id, user1_id, user2_id, offer_id, last_message, last_message_at, blocked_by, blocked_at, reported_by, reported_reason, reported_at, created_at',
    )
    .eq('id', id)
    .single()) as {
    data: RoomRow | null
    error: { message: string } | null
  }

  if (roomError || !room) {
    if (roomError?.message?.includes('No rows')) {
      notFound()
    }
    return (
      <div>
        <BackLink />
        <div className="mt-6 border-l-2 border-red-700 bg-red-50 px-4 sm:px-5 py-4 text-[13px] text-red-900 font-light">
          {roomError?.message || 'Chat room not found.'}
        </div>
      </div>
    )
  }

  // Fetch messages + participant users in parallel
  const [messagesResult, usersResult] = await Promise.all([
    supabase
      .from('chat_messages')
      .select(
        'id, room_id, sender_id, message, attachment_urls, is_read, is_offer, created_at',
      )
      .eq('room_id', room.id)
      .order('created_at', { ascending: true }),
    (async () => {
      const ids = [room.user1_id, room.user2_id].filter(
        (x): x is string => !!x,
      )
      if (!ids.length) return { data: [] as UserLite[] }
      return supabase.from('users').select('id, name, email').in('id', ids)
    })(),
  ])

  const messages = (messagesResult.data ?? []) as MessageRow[]
  const users = (usersResult.data ?? []) as UserLite[]
  const userMap = new Map(users.map((u) => [u.id, u]))

  const u1 = room.user1_id ? userMap.get(room.user1_id) : null
  const u2 = room.user2_id ? userMap.get(room.user2_id) : null

  // Data quirk: the mobile app often sets reported_reason + reported_at
  // without populating reported_by. Treat any of them as a report signal.
  const isReported = !!(
    room.reported_by ||
    room.reported_reason ||
    room.reported_at
  )

  return (
    <div className="max-w-4xl">
      <BackLink />

      {/* Header */}
      <header className="mt-5 mb-8 lg:mt-6 lg:mb-10">
        <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-3">
          Chat room
        </div>

        <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-extralight leading-[1.2] text-ink break-words">
          {u1?.name || u1?.email || 'Unknown'}
          <span className="text-granny/40 mx-3">↔</span>
          {u2?.name || u2?.email || 'Unknown'}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {isReported && !room.blocked_by && (
            <Badge tone="warning">
              <span className="block w-1 h-1 rounded-full bg-red-700 mr-1.5" />
              Reported
            </Badge>
          )}
          {room.blocked_by && <Badge tone="muted">Blocked</Badge>}
        </div>

        {room.reported_reason && (
          <div className="mt-4 border-l-2 border-red-700 bg-red-50 px-4 py-3 text-[13px] text-red-900 font-light italic">
            &ldquo;{room.reported_reason}&rdquo;
          </div>
        )}
      </header>

      {/* Room moderation actions */}
      <section className="mb-10 lg:mb-12">
        <h2 className="text-[10px] uppercase tracking-[0.22em] text-granny mb-4 lg:mb-5">
          Room moderation
        </h2>
        <ChatRoomActions
          roomId={room.id}
          isBlocked={!!room.blocked_by}
          isReported={isReported}
        />
      </section>

      {/* Message thread */}
      <section className="mb-10 lg:mb-12">
        <h2 className="text-[10px] uppercase tracking-[0.22em] text-granny mb-4 lg:mb-5">
          Messages ({messages.length})
        </h2>
        {messages.length === 0 ? (
          <div className="border border-granny/20 py-16 text-center text-granny text-[13px] font-light italic">
            No messages in this room.
          </div>
        ) : (
          <ul className="border border-granny/20 divide-y divide-granny/15">
            {messages.map((msg) => {
              const sender = userMap.get(msg.sender_id)
              return (
                <li
                  key={msg.id}
                  className="px-4 sm:px-5 py-4 flex items-start gap-4"
                >
                  <div className="shrink-0 w-9 h-9 rounded-full bg-firefly/10 text-firefly flex items-center justify-center text-[10px] font-medium">
                    {initials(sender?.name, sender?.email)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 mb-1">
                      <div className="text-[13px] font-light text-ink truncate">
                        {sender?.name || sender?.email || 'Unknown'}
                      </div>
                      <div className="text-[10px] uppercase tracking-[0.12em] text-granny/70 whitespace-nowrap">
                        {formatDateTime(msg.created_at)}
                      </div>
                      {msg.is_offer && (
                        <span className="inline-flex items-center px-1.5 py-[2px] bg-casablanca/15 text-casablanca-dark text-[9px] uppercase tracking-[0.15em]">
                          Offer
                        </span>
                      )}
                    </div>
                    {msg.message && (
                      <p className="text-[14px] text-ink/90 font-light leading-relaxed break-words whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    )}
                    {msg.attachment_urls && msg.attachment_urls.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {msg.attachment_urls.map((url, i) => (
                          <a
                            key={`${url}-${i}`}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-[11px] uppercase tracking-[0.12em] text-granny hover:text-firefly transition-colors border border-granny/25 px-2 py-1"
                          >
                            Attachment {i + 1}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0">
                    <DeleteMessageButton
                      messageId={msg.id}
                      roomId={room.id}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* Room details */}
      <section>
        <h2 className="text-[10px] uppercase tracking-[0.22em] text-granny mb-4 lg:mb-5">
          Details
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5 text-[13px]">
          <DetailRow label="Created" value={formatDateTime(room.created_at)} />
          <DetailRow
            label="Last activity"
            value={formatDateTime(room.last_message_at)}
          />
          {u1 && (
            <DetailRow
              label="Participant 1"
              value={u1.name || u1.email || 'Unknown'}
              href={`/admin/users/${u1.id}`}
            />
          )}
          {u2 && (
            <DetailRow
              label="Participant 2"
              value={u2.name || u2.email || 'Unknown'}
              href={`/admin/users/${u2.id}`}
            />
          )}
          {room.blocked_at && (
            <DetailRow label="Blocked at" value={formatDateTime(room.blocked_at)} />
          )}
          {room.reported_at && (
            <DetailRow
              label="Reported at"
              value={formatDateTime(room.reported_at)}
            />
          )}
        </dl>
      </section>
    </div>
  )
}

function BackLink() {
  return (
    <Link
      href="/admin/chat"
      className="min-h-[44px] -ml-1 inline-flex items-center gap-2 px-1 text-[11px] uppercase tracking-[0.22em] text-granny hover:text-firefly active:text-firefly transition-colors"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
        aria-hidden
      >
        <line x1="10" y1="7" x2="3" y2="7" />
        <polyline points="6 4 3 7 6 10" />
      </svg>
      All rooms
    </Link>
  )
}

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode
  tone: 'warning' | 'muted'
}) {
  const styles: Record<typeof tone, string> = {
    warning: 'bg-red-50 text-red-700',
    muted: 'bg-granny/15 text-granny',
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] font-medium ${styles[tone]}`}
    >
      {children}
    </span>
  )
}

function DetailRow({
  label,
  value,
  href,
}: {
  label: string
  value: string | null
  href?: string
}) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.22em] text-granny mb-1.5">
        {label}
      </dt>
      <dd className="text-ink font-light break-words">
        {value ? (
          href ? (
            <Link href={href} className="hover:text-firefly transition-colors">
              {value}
            </Link>
          ) : (
            value
          )
        ) : (
          <span className="text-granny italic">—</span>
        )}
      </dd>
    </div>
  )
}

function initials(name: string | null | undefined, email: string | null | undefined): string {
  const source = name || email || '?'
  const parts = source.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return source.slice(0, 2).toUpperCase()
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
