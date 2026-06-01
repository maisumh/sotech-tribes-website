import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

type TradeRow = {
  id: string
  proposer_id: string
  recipient_id: string
  target_want_have_id: number | null
  target_want_have_ids: number[] | null
  offered_want_have_ids: number[] | null
  message: string | null
  status: string
  is_help_offer: boolean
  chat_id: string | null
  proposer_completed_at: string | null
  recipient_completed_at: string | null
  created_at: string
  updated_at: string
}

type UserLite = { id: string; name: string | null; email: string | null }
type ListingLite = { id: number; title: string | null; is_want: boolean | null }

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

export const dynamic = 'force-dynamic'

export default async function TradeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: trade, error } = (await supabase
    .from('trade_proposals')
    .select(
      'id, proposer_id, recipient_id, target_want_have_id, target_want_have_ids, offered_want_have_ids, message, status, is_help_offer, chat_id, proposer_completed_at, recipient_completed_at, created_at, updated_at',
    )
    .eq('id', id)
    .single()) as { data: TradeRow | null; error: { message: string } | null }

  if (error || !trade) {
    if (error?.message?.includes('No rows')) notFound()
    return (
      <div>
        <BackLink />
        <div className="mt-6 border-l-2 border-red-700 bg-red-50 px-4 sm:px-5 py-4 text-[13px] text-red-900 font-light">
          {error?.message || 'Trade not found.'}
        </div>
      </div>
    )
  }

  // Baskets: prefer the array columns, fall back to the singular target.
  const targetIds = trade.target_want_have_ids?.length
    ? trade.target_want_have_ids
    : trade.target_want_have_id
    ? [trade.target_want_have_id]
    : []
  const offeredIds = trade.offered_want_have_ids ?? []
  const allListingIds = Array.from(new Set([...targetIds, ...offeredIds]))

  const [usersRes, listingsRes] = await Promise.all([
    supabase.from('users').select('id, name, email').in('id', [trade.proposer_id, trade.recipient_id]),
    allListingIds.length
      ? supabase.from('want_have').select('id, title, is_want').in('id', allListingIds)
      : Promise.resolve({ data: [] as ListingLite[] }),
  ])

  const userMap = new Map((usersRes.data ?? []).map((u) => [u.id, u as UserLite]))
  const listingMap = new Map((listingsRes.data ?? []).map((l) => [l.id, l as ListingLite]))
  const proposer = userMap.get(trade.proposer_id)
  const recipient = userMap.get(trade.recipient_id)

  const bothCompleted = !!(trade.proposer_completed_at && trade.recipient_completed_at)

  return (
    <div className="max-w-4xl">
      <BackLink />

      <header className="mt-5 mb-8 lg:mt-6 lg:mb-10">
        <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-3">
          Trade proposal{trade.is_help_offer ? ' · help offer' : ''}
        </div>
        <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-extralight leading-[1.2] text-ink break-words">
          {proposer?.name || proposer?.email || 'Unknown'}
          <span className="text-granny/40 mx-3">→</span>
          {recipient?.name || recipient?.email || 'Unknown'}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusBadge status={trade.status} />
          {bothCompleted && <span className="px-2 py-[3px] bg-firefly/10 text-firefly text-[10px] uppercase tracking-[0.15em]">Both confirmed</span>}
        </div>
        {trade.message && (
          <div className="mt-4 border-l-2 border-granny/30 bg-offwhite px-4 py-3 text-[14px] text-ink/90 font-light italic">
            &ldquo;{trade.message}&rdquo;
          </div>
        )}
      </header>

      {/* Baskets */}
      <section className="mb-10 lg:mb-12 grid grid-cols-1 sm:grid-cols-2 gap-px bg-granny/25 border border-granny/25">
        <Basket
          title={`${proposer?.name || 'Proposer'} offers`}
          ids={offeredIds}
          listingMap={listingMap}
        />
        <Basket
          title={`In exchange for (${recipient?.name || 'recipient'})`}
          ids={targetIds}
          listingMap={listingMap}
        />
      </section>

      {/* Details */}
      <section>
        <h2 className="text-[10px] uppercase tracking-[0.22em] text-granny mb-4 lg:mb-5">Details</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5 text-[13px]">
          <DetailRow label="Proposer" value={proposer?.name || proposer?.email || 'Unknown'} href={`/admin/users/${trade.proposer_id}`} />
          <DetailRow label="Recipient" value={recipient?.name || recipient?.email || 'Unknown'} href={`/admin/users/${trade.recipient_id}`} />
          <DetailRow label="Created" value={formatDateTime(trade.created_at)} />
          <DetailRow label="Updated" value={formatDateTime(trade.updated_at)} />
          <DetailRow
            label="Proposer confirmed"
            value={trade.proposer_completed_at ? formatDateTime(trade.proposer_completed_at) : null}
          />
          <DetailRow
            label="Recipient confirmed"
            value={trade.recipient_completed_at ? formatDateTime(trade.recipient_completed_at) : null}
          />
          {trade.chat_id && (
            <DetailRow label="Conversation" value="Open chat →" href={`/admin/v2-chats/${trade.chat_id}`} />
          )}
        </dl>
      </section>
    </div>
  )
}

function Basket({
  title,
  ids,
  listingMap,
}: {
  title: string
  ids: number[]
  listingMap: Map<number, ListingLite>
}) {
  return (
    <div className="bg-offwhite p-5 sm:p-6">
      <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-4">{title}</div>
      {ids.length === 0 ? (
        <div className="text-granny italic text-[13px]">—</div>
      ) : (
        <ul className="space-y-2">
          {ids.map((lid) => {
            const l = listingMap.get(lid)
            return (
              <li key={lid}>
                <Link href={`/admin/want-have/${lid}`} className="text-[14px] text-ink font-light hover:text-firefly transition-colors">
                  {l?.title || `Listing #${lid}`}
                </Link>
                {l && (
                  <span className="ml-2 text-[10px] uppercase tracking-[0.15em] text-granny">
                    {l.is_want ? 'Seeking' : 'Offering'}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function BackLink() {
  return (
    <Link href="/admin/trades" className="min-h-[44px] -ml-1 inline-flex items-center gap-2 px-1 text-[11px] uppercase tracking-[0.22em] text-granny hover:text-firefly transition-colors">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" aria-hidden>
        <line x1="10" y1="7" x2="3" y2="7" />
        <polyline points="6 4 3 7 6 10" />
      </svg>
      All trades
    </Link>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-casablanca/20 text-casablanca-dark',
    accepted: 'bg-firefly/10 text-firefly',
    countered: 'bg-casablanca/20 text-casablanca-dark',
    completed: 'bg-firefly/10 text-firefly',
    rejected: 'bg-granny/15 text-granny',
    cancelled: 'bg-granny/15 text-granny',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] font-medium ${styles[status] ?? 'bg-granny/15 text-granny'}`}>
      {status}
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
