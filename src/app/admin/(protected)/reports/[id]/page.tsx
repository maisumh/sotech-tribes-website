import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { ReportActions } from '@/components/admin/reports/ReportActions'

type ReportRow = {
  id: string
  reporter_id: string
  reported_user_id: string | null
  reported_listing_id: number | null
  context: string
  reason: string
  status: string
  admin_notes: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
}

type UserLite = { id: string; name: string | null; email: string | null; is_active: boolean | null }

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

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: report, error } = (await supabase
    .from('v2_reports')
    .select(
      'id, reporter_id, reported_user_id, reported_listing_id, context, reason, status, admin_notes, reviewed_by, reviewed_at, created_at',
    )
    .eq('id', id)
    .single()) as { data: ReportRow | null; error: { message: string } | null }

  if (error || !report) {
    if (error?.message?.includes('No rows')) notFound()
    return (
      <div>
        <BackLink />
        <div className="mt-6 border-l-2 border-red-700 bg-red-50 px-4 sm:px-5 py-4 text-[13px] text-red-900 font-light">
          {error?.message || 'Report not found.'}
        </div>
      </div>
    )
  }

  const userIds = [report.reporter_id, report.reported_user_id, report.reviewed_by].filter(
    (x): x is string => !!x,
  )

  const [usersRes, listingRes, chatRes] = await Promise.all([
    userIds.length
      ? supabase.from('users').select('id, name, email, is_active').in('id', userIds)
      : Promise.resolve({ data: [] as UserLite[] }),
    report.reported_listing_id
      ? supabase
          .from('want_have')
          .select('id, title, is_deleted, is_want, images')
          .eq('id', report.reported_listing_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    // Chat-context reports have no chat id, but the conversation is the
    // canonical pair (reporter ↔ reported user). Resolve it to a v2 chat link.
    report.context === 'chat' && report.reported_user_id
      ? supabase
          .from('v2_chats')
          .select('id')
          .in('user_a_id', [report.reporter_id, report.reported_user_id])
          .in('user_b_id', [report.reporter_id, report.reported_user_id])
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ])

  const userMap = new Map((usersRes.data ?? []).map((u) => [u.id, u as UserLite]))
  const reporter = userMap.get(report.reporter_id)
  const reportedUser = report.reported_user_id ? userMap.get(report.reported_user_id) : null
  const reviewer = report.reviewed_by ? userMap.get(report.reviewed_by) : null
  const listing = listingRes.data as
    | { id: number; title: string | null; is_deleted: boolean | null; is_want: boolean | null; images: string[] | null }
    | null
  const chat = chatRes.data as { id: string } | null

  const canDeleteListing = !!listing && listing.is_deleted !== true
  const canDeactivateUser = !!reportedUser && reportedUser.is_active !== false

  return (
    <div className="max-w-4xl">
      <BackLink />

      <header className="mt-5 mb-8 lg:mt-6 lg:mb-10">
        <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-3">
          Report · {report.context}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={report.status} />
          <span className="text-[12px] text-granny font-light">
            {formatDateTime(report.created_at)}
          </span>
        </div>
        <div className="mt-5 border-l-2 border-red-700 bg-red-50 px-4 py-3 text-[14px] text-red-900 font-light italic">
          &ldquo;{report.reason}&rdquo;
        </div>
      </header>

      {/* Actions */}
      <section className="mb-10 lg:mb-12">
        <h2 className="text-[10px] uppercase tracking-[0.22em] text-granny mb-4 lg:mb-5">
          Moderation
        </h2>
        <ReportActions
          reportId={report.id}
          status={report.status}
          canDeleteListing={canDeleteListing}
          canDeactivateUser={canDeactivateUser}
          currentNotes={report.admin_notes}
        />
      </section>

      {/* Target detail */}
      <section className="mb-10 lg:mb-12">
        <h2 className="text-[10px] uppercase tracking-[0.22em] text-granny mb-4 lg:mb-5">
          Reported {report.context === 'listing' ? 'listing' : report.context === 'chat' ? 'conversation' : 'target'}
        </h2>
        <div className="border border-granny/20 p-5 sm:p-6 bg-offwhite">
          {listing ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-[3px] bg-firefly/10 text-firefly text-[10px] uppercase tracking-[0.15em]">
                  {listing.is_want ? 'Seeking' : 'Offering'}
                </span>
                {listing.is_deleted && (
                  <span className="px-2 py-[3px] bg-granny/15 text-granny text-[10px] uppercase tracking-[0.15em]">
                    Deleted
                  </span>
                )}
              </div>
              <Link
                href={`/admin/want-have/${listing.id}`}
                className="text-[16px] text-ink font-light hover:text-firefly transition-colors"
              >
                {listing.title || `Listing #${listing.id}`}
              </Link>
              {listing.images && listing.images.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {listing.images.slice(0, 4).map((url, i) => (
                    <img
                      key={`${url}-${i}`}
                      src={url}
                      alt=""
                      className="w-20 h-20 object-cover border border-granny/20"
                    />
                  ))}
                </div>
              )}
            </div>
          ) : reportedUser ? (
            <div className="flex items-center justify-between gap-4">
              <div>
                <Link
                  href={`/admin/users/${reportedUser.id}`}
                  className="text-[16px] text-ink font-light hover:text-firefly transition-colors"
                >
                  {reportedUser.name || reportedUser.email || 'Unknown user'}
                </Link>
                <div className="text-[12px] text-granny mt-1">{reportedUser.email}</div>
              </div>
              {reportedUser.is_active === false && (
                <span className="px-2 py-[3px] bg-granny/15 text-granny text-[10px] uppercase tracking-[0.15em] shrink-0">
                  Deactivated
                </span>
              )}
            </div>
          ) : (
            <span className="text-granny italic text-[13px]">No structured target on this report.</span>
          )}

          {chat && (
            <div className="mt-4 pt-4 border-t border-granny/15">
              <Link
                href={`/admin/v2-chats/${chat.id}`}
                className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.15em] text-firefly hover:text-ink transition-colors"
              >
                Open conversation →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Details */}
      <section>
        <h2 className="text-[10px] uppercase tracking-[0.22em] text-granny mb-4 lg:mb-5">
          Details
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5 text-[13px]">
          <DetailRow
            label="Reporter"
            value={reporter?.name || reporter?.email || 'Unknown'}
            href={`/admin/users/${report.reporter_id}`}
          />
          <DetailRow
            label="Context"
            value={report.context[0].toUpperCase() + report.context.slice(1)}
          />
          <DetailRow label="Reported at" value={formatDateTime(report.created_at)} />
          <DetailRow
            label="Last reviewed"
            value={
              report.reviewed_at
                ? `${formatDateTime(report.reviewed_at)}${reviewer ? ` · ${reviewer.name || reviewer.email}` : ''}`
                : null
            }
          />
        </dl>
      </section>
    </div>
  )
}

function BackLink() {
  return (
    <Link
      href="/admin/reports"
      className="min-h-[44px] -ml-1 inline-flex items-center gap-2 px-1 text-[11px] uppercase tracking-[0.22em] text-granny hover:text-firefly transition-colors"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" aria-hidden>
        <line x1="10" y1="7" x2="3" y2="7" />
        <polyline points="6 4 3 7 6 10" />
      </svg>
      All reports
    </Link>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    open: 'bg-red-50 text-red-700',
    reviewed: 'bg-casablanca/20 text-casablanca-dark',
    actioned: 'bg-firefly/10 text-firefly',
    dismissed: 'bg-granny/15 text-granny',
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
