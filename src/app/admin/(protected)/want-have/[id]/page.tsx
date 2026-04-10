import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { ModerationActions } from '@/components/admin/want-have/ModerationActions'

type WantHaveRow = {
  id: number
  user_id: string | null
  title: string | null
  description: string | null
  description_prompt: string | null
  prompt: string | null
  category: string | null
  subcategory: string | null
  images: string[] | null
  is_want: boolean
  is_product: boolean
  min_price: number | null
  max_price: number | null
  status: 'open' | 'closed' | 'matched' | null
  is_deleted: boolean | null
  embedding_generated: boolean | null
  embedding_retry_count: number | null
  embedding_error_message: string | null
  created_at: string
  updated_at: string
}

type UserLite = {
  id: string
  name: string | null
  email: string | null
}

export const dynamic = 'force-dynamic'

export default async function WantHaveDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const numericId = Number(id)

  if (!Number.isFinite(numericId) || numericId <= 0) {
    notFound()
  }

  const supabase = createAdminClient()

  const { data: row, error } = (await supabase
    .from('want_have')
    .select(
      'id, user_id, title, description, description_prompt, prompt, category, subcategory, images, is_want, is_product, min_price, max_price, status, is_deleted, embedding_generated, embedding_retry_count, embedding_error_message, created_at, updated_at',
    )
    .eq('id', numericId)
    .single()) as {
    data: WantHaveRow | null
    error: { message: string } | null
  }

  if (error || !row) {
    return (
      <div>
        <BackLink />
        <div className="mt-6 border-l-2 border-red-700 bg-red-50 px-4 sm:px-5 py-4 text-[13px] text-red-900 font-light">
          {error?.message || 'Entry not found.'}
        </div>
      </div>
    )
  }

  // Fetch the posting user
  let user: UserLite | null = null
  if (row.user_id) {
    const { data: u } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('id', row.user_id)
      .single()
    user = u as UserLite | null
  }

  return (
    <div className="max-w-4xl">
      <BackLink />

      <header className="mt-5 mb-8 lg:mt-6 lg:mb-12">
        <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-3">
          {row.is_want ? 'Want' : 'Have'}
        </div>

        <h1 className="text-[28px] sm:text-[34px] lg:text-[40px] font-extralight leading-[1.1] text-ink break-words">
          {row.title || <span className="text-granny italic">Untitled</span>}
        </h1>

        {user && (
          <Link
            href={`/admin/users/${user.id}`}
            className="mt-2 inline-flex items-center gap-2 text-[14px] text-granny hover:text-firefly transition-colors font-light"
          >
            <span>Posted by {user.name || user.email || 'Unknown'}</span>
            <span aria-hidden>→</span>
          </Link>
        )}

        {/* Badges */}
        <div className="mt-5 flex flex-wrap items-center gap-2 sm:gap-3">
          <Badge tone={row.is_want ? 'firefly' : 'accent'}>
            {row.is_want ? 'Want' : 'Have'}
          </Badge>
          {row.status && (
            <Badge
              tone={
                row.status === 'matched'
                  ? 'accent'
                  : row.status === 'closed'
                  ? 'muted'
                  : 'firefly'
              }
            >
              {row.status}
            </Badge>
          )}
          {row.category && <Badge tone="muted">{row.category}</Badge>}
          {row.subcategory && <Badge tone="muted">{row.subcategory}</Badge>}
          {row.is_product && <Badge tone="muted">Product</Badge>}
          {row.is_deleted && <Badge tone="warning">Deleted</Badge>}
        </div>
      </header>

      {/* Moderation actions */}
      <section className="mb-10 lg:mb-12">
        <h2 className="text-[10px] uppercase tracking-[0.22em] text-granny mb-4 lg:mb-5">
          Moderate
        </h2>
        <ModerationActions
          entryId={row.id}
          isDeleted={row.is_deleted ?? false}
          isClosed={row.status === 'closed'}
        />
      </section>

      {/* Description */}
      {row.description && (
        <section className="mb-10 lg:mb-12">
          <h2 className="text-[10px] uppercase tracking-[0.22em] text-granny mb-4">
            Description
          </h2>
          <p className="text-[15px] font-light text-ink leading-relaxed whitespace-pre-wrap break-words">
            {row.description}
          </p>
        </section>
      )}

      {/* Images */}
      {row.images && row.images.length > 0 && (
        <section className="mb-10 lg:mb-12">
          <h2 className="text-[10px] uppercase tracking-[0.22em] text-granny mb-4">
            Images ({row.images.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {row.images.map((url, i) => (
              <div
                key={`${url}-${i}`}
                className="aspect-square bg-granny/10 border border-granny/20 overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Image ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Details grid */}
      <section className="mb-10 lg:mb-12">
        <h2 className="text-[10px] uppercase tracking-[0.22em] text-granny mb-4 lg:mb-5">
          Details
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5 text-[13px]">
          <DetailRow label="Price range" value={formatPriceRange(row.min_price, row.max_price)} />
          <DetailRow label="Type" value={row.is_want ? 'Want' : 'Have'} />
          <DetailRow label="Category" value={row.category} />
          <DetailRow label="Subcategory" value={row.subcategory} />
          <DetailRow label="Posted" value={formatDateTime(row.created_at)} />
          <DetailRow label="Last updated" value={formatDateTime(row.updated_at)} />
        </dl>
      </section>

      {/* Prompt / AI info */}
      {(row.prompt || row.description_prompt) && (
        <section className="mb-10 lg:mb-12">
          <h2 className="text-[10px] uppercase tracking-[0.22em] text-granny mb-4">
            AI context
          </h2>
          <dl className="space-y-4 text-[13px] text-granny font-light">
            {row.prompt && (
              <div>
                <dt className="text-[10px] uppercase tracking-[0.22em] text-granny/70 mb-1.5">
                  Prompt
                </dt>
                <dd className="font-mono text-[12px] text-ink/70 whitespace-pre-wrap break-words">
                  {row.prompt}
                </dd>
              </div>
            )}
            {row.description_prompt && (
              <div>
                <dt className="text-[10px] uppercase tracking-[0.22em] text-granny/70 mb-1.5">
                  Description prompt
                </dt>
                <dd className="font-mono text-[12px] text-ink/70 whitespace-pre-wrap break-words">
                  {row.description_prompt}
                </dd>
              </div>
            )}
          </dl>
        </section>
      )}

      {/* Embedding diagnostic */}
      <section>
        <h2 className="text-[10px] uppercase tracking-[0.22em] text-granny mb-4">
          Embedding diagnostics
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 text-[12px] text-granny font-light">
          <DetailRow
            label="Generated"
            value={row.embedding_generated ? 'Yes' : 'No'}
          />
          <DetailRow
            label="Retry count"
            value={String(row.embedding_retry_count ?? 0)}
          />
          {row.embedding_error_message && (
            <div className="sm:col-span-2">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-granny/70 mb-1.5">
                Last error
              </dt>
              <dd className="font-mono text-[11px] text-red-800 break-words">
                {row.embedding_error_message}
              </dd>
            </div>
          )}
        </dl>
      </section>
    </div>
  )
}

function BackLink() {
  return (
    <Link
      href="/admin/want-have"
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
      All entries
    </Link>
  )
}

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode
  tone: 'firefly' | 'accent' | 'muted' | 'warning'
}) {
  const styles: Record<typeof tone, string> = {
    firefly: 'bg-firefly/10 text-firefly',
    accent: 'bg-casablanca/15 text-casablanca-dark',
    muted: 'bg-granny/10 text-granny',
    warning: 'bg-red-50 text-red-800',
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
}: {
  label: string
  value: string | null
}) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.22em] text-granny mb-1.5">
        {label}
      </dt>
      <dd className="text-ink font-light break-words">
        {value || <span className="text-granny italic">—</span>}
      </dd>
    </div>
  )
}

function formatPriceRange(
  min: number | null,
  max: number | null,
): string | null {
  if (min === null && max === null) return null
  const fmt = (n: number) => `$${n.toLocaleString()}`
  if (min !== null && max !== null) {
    if (min === max) return fmt(min)
    return `${fmt(min)} – ${fmt(max)}`
  }
  if (min !== null) return `${fmt(min)}+`
  if (max !== null) return `Up to ${fmt(max)}`
  return null
}

function formatDateTime(iso: string | null): string | null {
  if (!iso) return null
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
