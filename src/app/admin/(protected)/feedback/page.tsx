import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

const PAGE_SIZE = 30

type CategoryKey = 'all' | 'general' | 'bug' | 'idea' | 'praise' | 'other'

const CATEGORY_KEYS: CategoryKey[] = ['all', 'general', 'bug', 'idea', 'praise', 'other']

type ParsedParams = { category: CategoryKey; page: number }

function parseSearchParams(raw: Record<string, string | undefined>): ParsedParams {
  const category = (CATEGORY_KEYS as string[]).includes(raw.category ?? '')
    ? (raw.category as CategoryKey)
    : 'all'
  const page = Math.max(1, parseInt(raw.page ?? '1', 10) || 1)
  return { category, page }
}

function buildHref(current: ParsedParams, override: Partial<ParsedParams>): string {
  const merged = { ...current, ...override }
  const p = new URLSearchParams()
  if (merged.category !== 'all') p.set('category', merged.category)
  if (merged.page !== 1) p.set('page', String(merged.page))
  const qs = p.toString()
  return qs ? `/admin/feedback?${qs}` : '/admin/feedback'
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

const CATEGORY_STYLE: Record<string, string> = {
  bug: 'bg-red-50 text-red-700',
  idea: 'bg-casablanca/20 text-casablanca-dark',
  praise: 'bg-firefly/10 text-firefly',
  general: 'bg-granny/15 text-granny',
  other: 'bg-granny/15 text-granny',
}

type FeedbackRow = {
  id: string
  user_id: string | null
  category: string
  message: string
  app_version: string | null
  created_at: string
}

type UserLite = { id: string; name: string | null; email: string | null }

export const dynamic = 'force-dynamic'

export default async function FeedbackPage({
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
    .from('v2_feedback')
    .select('id, user_id, category, message, app_version, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (p.category !== 'all') query = query.eq('category', p.category)

  const { data: items, count, error } = (await query) as {
    data: FeedbackRow[] | null
    count: number | null
    error: { message: string } | null
  }

  const userIds = Array.from(new Set((items ?? []).map((i) => i.user_id).filter((x): x is string => !!x)))
  const { data: users } = userIds.length
    ? await supabase.from('users').select('id, name, email').in('id', userIds)
    : { data: [] as UserLite[] }
  const userMap = new Map((users ?? []).map((u) => [u.id, u as UserLite]))

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1

  return (
    <div>
      <header className="admin-fade-up mb-8 lg:mb-12">
        <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-3 lg:mb-4">
          Moderation · v2
        </div>
        <h1 className="text-[32px] sm:text-[38px] lg:text-[44px] font-extralight leading-[1.05] text-ink">
          Feedback
        </h1>
        <p className="mt-2 text-[13px] text-granny font-light">
          {count !== null && count !== undefined
            ? `${count.toLocaleString()} ${count === 1 ? 'submission' : 'submissions'}`
            : 'Loading…'}
        </p>
      </header>

      <nav
        aria-label="Feedback category filter"
        className="mb-8 lg:mb-10 flex items-center gap-0 border-b border-granny/25 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-5 px-5 sm:mx-0 sm:px-0"
      >
        {CATEGORY_KEYS.map((key) => {
          const active = p.category === key
          const label = key === 'all' ? 'All' : key[0].toUpperCase() + key.slice(1)
          return (
            <Link
              key={key}
              href={buildHref(p, { category: key, page: 1 })}
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
          Failed to load feedback: {error.message}
        </div>
      )}

      {items && items.length > 0 ? (
        <ul className="admin-stagger border border-granny/20 divide-y divide-granny/15">
          {items.map((f) => {
            const user = f.user_id ? userMap.get(f.user_id) : null
            return (
              <li key={f.id} className="p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <CategoryBadge category={f.category} />
                  {f.app_version && (
                    <span className="px-2 py-[3px] bg-granny/10 text-granny text-[10px] uppercase tracking-[0.12em]">
                      v{f.app_version}
                    </span>
                  )}
                  <div className="ml-auto text-[10px] uppercase tracking-[0.12em] text-granny/80">
                    {formatDateTime(f.created_at)}
                  </div>
                </div>
                <p className="text-[14px] text-ink/90 font-light leading-relaxed break-words whitespace-pre-wrap">
                  {f.message}
                </p>
                <div className="mt-3 text-[11px] uppercase tracking-[0.12em] text-granny/70">
                  {user ? (
                    <Link href={`/admin/users/${user.id}`} className="hover:text-firefly transition-colors">
                      {user.name || user.email || 'Unknown'}
                    </Link>
                  ) : (
                    'Anonymous'
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="border border-granny/20 py-16 text-center text-granny text-[13px] font-light italic">
          No feedback found.
        </div>
      )}

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

function CategoryBadge({ category }: { category: string }) {
  const style = CATEGORY_STYLE[category] ?? 'bg-granny/15 text-granny'
  return (
    <span className={`inline-flex items-center px-2 py-[3px] text-[10px] uppercase tracking-[0.15em] font-medium ${style}`}>
      {category}
    </span>
  )
}
