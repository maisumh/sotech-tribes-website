import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { V2ChatActions } from '@/components/admin/v2-chat/V2ChatActions'
import { DeleteV2MessageButton } from '@/components/admin/v2-chat/DeleteV2MessageButton'

type ChatRow = {
  id: string
  user_a_id: string | null
  user_b_id: string | null
  status: string
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
  chat_id: string
  sender_id: string
  kind: string
  body: string | null
  trade_proposal_id: string | null
  read_at: string | null
  // Additive columns from tribes-app Phase 27 (edit / unsend). edited_at is
  // set when a text message was edited; deleted_at when it was "unsent" — the
  // body is RETAINED (kept for moderation), so we still render it, struck through.
  edited_at: string | null
  deleted_at: string | null
  created_at: string
}

type UserLite = { id: string; name: string | null; email: string | null }
type ReactionRow = { message_id: string; emoji: string }
type TradeLite = { id: string; status: string }

const STATUS_LABEL: Record<string, string> = {
  in_conversation: 'In conversation',
  exchanged: 'Exchanged',
  rejected: 'Rejected',
}

export const dynamic = 'force-dynamic'

export default async function V2ChatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: chat, error: chatError } = (await supabase
    .from('v2_chats')
    .select(
      'id, user_a_id, user_b_id, status, last_message_at, blocked_by, blocked_at, reported_by, reported_reason, reported_at, created_at',
    )
    .eq('id', id)
    .single()) as { data: ChatRow | null; error: { message: string } | null }

  if (chatError || !chat) {
    if (chatError?.message?.includes('No rows')) notFound()
    return (
      <div>
        <BackLink />
        <div className="mt-6 border-l-2 border-red-700 bg-red-50 px-4 sm:px-5 py-4 text-[13px] text-red-900 font-light">
          {chatError?.message || 'Chat not found.'}
        </div>
      </div>
    )
  }

  const [messagesResult, usersResult, reactionsResult] = await Promise.all([
    supabase
      .from('v2_chat_messages')
      .select('id, chat_id, sender_id, kind, body, trade_proposal_id, read_at, edited_at, deleted_at, created_at')
      .eq('chat_id', chat.id)
      .order('created_at', { ascending: true }),
    (async () => {
      const ids = [chat.user_a_id, chat.user_b_id].filter((x): x is string => !!x)
      if (!ids.length) return { data: [] as UserLite[] }
      return supabase.from('users').select('id, name, email').in('id', ids)
    })(),
    supabase.from('v2_message_reactions').select('message_id, emoji').eq('chat_id', chat.id),
  ])

  const messages = (messagesResult.data ?? []) as MessageRow[]
  const users = (usersResult.data ?? []) as UserLite[]
  const userMap = new Map(users.map((u) => [u.id, u]))

  // Reactions grouped per message
  const reactionsByMessage = new Map<string, string[]>()
  for (const r of (reactionsResult.data ?? []) as ReactionRow[]) {
    const arr = reactionsByMessage.get(r.message_id) ?? []
    arr.push(r.emoji)
    reactionsByMessage.set(r.message_id, arr)
  }

  // Resolve linked trade proposals for trade-kind messages
  const tradeIds = Array.from(
    new Set(messages.filter((m) => m.trade_proposal_id).map((m) => m.trade_proposal_id as string)),
  )
  const { data: trades } = tradeIds.length
    ? await supabase.from('trade_proposals').select('id, status').in('id', tradeIds)
    : { data: [] as TradeLite[] }
  const tradeMap = new Map((trades ?? []).map((t) => [t.id, t as TradeLite]))

  const ua = chat.user_a_id ? userMap.get(chat.user_a_id) : null
  const ub = chat.user_b_id ? userMap.get(chat.user_b_id) : null
  const isReported = !!(chat.reported_by || chat.reported_reason || chat.reported_at)

  return (
    <div className="max-w-4xl">
      <BackLink />

      <header className="mt-5 mb-8 lg:mt-6 lg:mb-10">
        <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-3">
          v2 conversation
        </div>
        <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-extralight leading-[1.2] text-ink break-words">
          {ua?.name || ua?.email || 'Unknown'}
          <span className="text-granny/40 mx-3">↔</span>
          {ub?.name || ub?.email || 'Unknown'}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 bg-firefly/10 text-firefly text-[10px] uppercase tracking-[0.15em] font-medium">
            {STATUS_LABEL[chat.status] ?? chat.status}
          </span>
          {isReported && !chat.blocked_by && (
            <Badge tone="warning">
              <span className="block w-1 h-1 rounded-full bg-red-700 mr-1.5" />
              Reported
            </Badge>
          )}
          {chat.blocked_by && <Badge tone="muted">Blocked</Badge>}
        </div>
        {chat.reported_reason && (
          <div className="mt-4 border-l-2 border-red-700 bg-red-50 px-4 py-3 text-[13px] text-red-900 font-light italic">
            &ldquo;{chat.reported_reason}&rdquo;
          </div>
        )}
      </header>

      <section className="mb-10 lg:mb-12">
        <h2 className="text-[10px] uppercase tracking-[0.22em] text-granny mb-4 lg:mb-5">
          Chat moderation
        </h2>
        <V2ChatActions chatId={chat.id} isBlocked={!!chat.blocked_by} isReported={isReported} />
      </section>

      <section className="mb-10 lg:mb-12">
        <h2 className="text-[10px] uppercase tracking-[0.22em] text-granny mb-4 lg:mb-5">
          Messages ({messages.length})
        </h2>
        {messages.length === 0 ? (
          <div className="border border-granny/20 py-16 text-center text-granny text-[13px] font-light italic">
            No messages in this conversation.
          </div>
        ) : (
          <ul className="border border-granny/20 divide-y divide-granny/15">
            {messages.map((msg) => {
              const sender = userMap.get(msg.sender_id)
              const reactions = reactionsByMessage.get(msg.id) ?? []
              const trade = msg.trade_proposal_id ? tradeMap.get(msg.trade_proposal_id) : null
              return (
                <li key={msg.id} className="px-4 sm:px-5 py-4 flex items-start gap-4">
                  <div className="shrink-0 w-9 h-9 rounded-full bg-firefly/10 text-firefly flex items-center justify-center text-[10px] font-medium">
                    {initials(sender?.name, sender?.email)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 mb-1 flex-wrap">
                      <div className="text-[13px] font-light text-ink truncate">
                        {sender?.name || sender?.email || 'Unknown'}
                      </div>
                      <div className="text-[10px] uppercase tracking-[0.12em] text-granny/70 whitespace-nowrap">
                        {formatDateTime(msg.created_at)}
                      </div>
                      {msg.kind === 'system' && (
                        <span className="inline-flex items-center px-1.5 py-[2px] bg-granny/15 text-granny text-[9px] uppercase tracking-[0.15em]">
                          System
                        </span>
                      )}
                      {msg.kind === 'trade' && (
                        <span className="inline-flex items-center px-1.5 py-[2px] bg-casablanca/20 text-casablanca-dark text-[9px] uppercase tracking-[0.15em]">
                          Trade
                        </span>
                      )}
                      {msg.edited_at && !msg.deleted_at && (
                        <span className="inline-flex items-center px-1.5 py-[2px] bg-granny/15 text-granny text-[9px] uppercase tracking-[0.15em]">
                          Edited
                        </span>
                      )}
                      {msg.deleted_at && (
                        <span className="inline-flex items-center px-1.5 py-[2px] bg-red-50 text-red-700 text-[9px] uppercase tracking-[0.15em]">
                          Unsent
                        </span>
                      )}
                    </div>

                    {msg.kind === 'trade' ? (
                      <div className="text-[13px] text-ink/80 font-light">
                        Trade proposal
                        {trade && <span className="text-granny"> · {trade.status}</span>}
                        {msg.trade_proposal_id && (
                          <>
                            {' — '}
                            <Link href={`/admin/trades/${msg.trade_proposal_id}`} className="text-firefly hover:text-ink transition-colors">
                              view
                            </Link>
                          </>
                        )}
                      </div>
                    ) : msg.deleted_at ? (
                      // Unsent by the sender — body is retained for moderation; show
                      // it struck through with a caption so it reads as retracted.
                      msg.body && (
                        <div>
                          <p className="text-[14px] font-light leading-relaxed break-words whitespace-pre-wrap text-ink/40 line-through">
                            {msg.body}
                          </p>
                          <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-granny/70">
                            Unsent by sender · retained for moderation
                          </p>
                        </div>
                      )
                    ) : (
                      msg.body && (
                        <p className={`text-[14px] font-light leading-relaxed break-words whitespace-pre-wrap ${msg.kind === 'system' ? 'text-granny italic' : 'text-ink/90'}`}>
                          {msg.body}
                        </p>
                      )
                    )}

                    {reactions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {reactions.map((emoji, i) => (
                          <span key={`${msg.id}-${i}`} className="inline-flex items-center px-1.5 py-[2px] bg-firefly/[0.06] rounded-full text-[12px]">
                            {emoji}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0">
                    <DeleteV2MessageButton messageId={msg.id} chatId={chat.id} />
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-[10px] uppercase tracking-[0.22em] text-granny mb-4 lg:mb-5">Details</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5 text-[13px]">
          <DetailRow label="Created" value={formatDateTime(chat.created_at)} />
          <DetailRow label="Last activity" value={formatDateTime(chat.last_message_at)} />
          {ua && <DetailRow label="Participant A" value={ua.name || ua.email || 'Unknown'} href={`/admin/users/${ua.id}`} />}
          {ub && <DetailRow label="Participant B" value={ub.name || ub.email || 'Unknown'} href={`/admin/users/${ub.id}`} />}
          {chat.blocked_at && <DetailRow label="Blocked at" value={formatDateTime(chat.blocked_at)} />}
          {chat.reported_at && <DetailRow label="Reported at" value={formatDateTime(chat.reported_at)} />}
        </dl>
      </section>
    </div>
  )
}

function BackLink() {
  return (
    <Link href="/admin/v2-chats" className="min-h-[44px] -ml-1 inline-flex items-center gap-2 px-1 text-[11px] uppercase tracking-[0.22em] text-granny hover:text-firefly transition-colors">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" aria-hidden>
        <line x1="10" y1="7" x2="3" y2="7" />
        <polyline points="6 4 3 7 6 10" />
      </svg>
      All chats
    </Link>
  )
}

function Badge({ children, tone }: { children: React.ReactNode; tone: 'warning' | 'muted' }) {
  const styles: Record<typeof tone, string> = {
    warning: 'bg-red-50 text-red-700',
    muted: 'bg-granny/15 text-granny',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] font-medium ${styles[tone]}`}>
      {children}
    </span>
  )
}

function DetailRow({ label, value, href }: { label: string; value: string | null; href?: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.22em] text-granny mb-1.5">{label}</dt>
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
