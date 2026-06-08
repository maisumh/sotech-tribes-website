import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

const PAGE_SIZE = 30

const TYPE_KEYS = [
  'all',
  'neighborhood',
  'church',
  'school',
  'organization',
  'hoa',
  'other',
] as const
type TypeKey = (typeof TYPE_KEYS)[number]

type ParsedParams = {
  type: TypeKey
  showDeleted: boolean
  page: number
}

function parseSearchParams(raw: Record<string, string | undefined>): ParsedParams {
  const type = (TYPE_KEYS as readonly string[]).includes(raw.type ?? '')
    ? (raw.type as TypeKey)
    : 'all'
  return {
    type,
    showDeleted: raw.deleted === '1',
    page: Math.max(1, parseInt(raw.page ?? '1', 10) || 1),
  }
}

function buildHref(current: ParsedParams, override: Partial<ParsedParams>): string {
  const merged = { ...current, ...override }
  const p = new URLSearchParams()
  if (merged.type !== 'all') p.set('type', merged.type)
  if (merged.showDeleted) p.set('deleted', '1')
  if (merged.page !== 1) p.set('page', String(merged.page))
  const qs = p.toString()
  return qs ? `/admin/circles?${qs}` : '/admin/circles'
}

function formatDateTime(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

type CircleRow = {
  id: string
  name: string
  type: string
  is_discoverable: boolean
  join_mode: string
  member_count: number
  created_by: string | null
  is_deleted: boolean
  created_at: string
}

type UserLite = { id: string; name: string | null; email: string | null }

export const dynamic = 'force-dynamic'

export default async function CirclesPage({
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
    .from('circles')
    .select(
      'id, name, type, is_discoverable, join_mode, member_count, created_by, is_deleted, created_at',
      { count: 'exact' },
    )
    .order('created_at', { ascending: false })
    .range(from, to)

  if (!p.showDeleted) query = query.eq('is_deleted', false)
  if (p.type !== 'all') query = query.eq('type', p.type)

  const { data: circles, count, error } = (await query) as {
    data: CircleRow[] | null
    count: number | null
    error: { message: string } | null
  }

  const creatorIds = Array.from(
    new Set((circles ?? []).map((c) => c.created_by).filter((v): v is string => !!v)),
  )
  const { data: users } = creatorIds.length
    ? await supabase.from('users').select('id, name, email').in('id', creatorIds)
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
          Circles
        </h1>
        <p className="mt-2 text-[13px] text-granny font-light">
          {count !== null && count !== undefined
            ? `${count.toLocaleString()} ${count === 1 ? 'circle' : 'circles'}`
            : 'Loading…'}
        </p>
      </header>

      {/* Type pills */}
      <nav
        aria-label="Type filter"
        className="mb-4 flex items-center gap-0 border-b border-granny/25 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-5 px-5 sm:mx-0 sm:px-0"
      >
        {TYPE_KEYS.map((key) => {
          const active = p.type === key
          const label = key === 'all' ? 'All' : key === 'hoa' ? 'HOA' : titleCase(key)
          return (
            <Link
              key={key}
              href={buildHref(p, { type: key, page: 1 })}
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

      {/* Toggles */}
      <div className="mb-8 lg:mb-10 flex items-center gap-2">
        <Link
          href={buildHref(p, { showDeleted: !p.showDeleted, page: 1 })}
          className={`min-h-[34px] inline-flex items-center px-3 rounded-full text-[10px] uppercase tracking-[0.15em] font-medium transition-colors ${
            p.showDeleted ? 'bg-firefly text-offwhite' : 'bg-firefly/[0.06] text-granny hover:text-firefly'
          }`}
        >
          Show deleted
        </Link>
      </div>

      {error && (
        <div className="mb-8 border-l-2 border-red-700 bg-red-50 px-4 sm:px-5 py-4 text-[13px] text-red-900 font-light">
          Failed to load circles: {error.message}
        </div>
      )}

      {circles && circles.length > 0 ? (
        <ul className="admin-stagger divide-y divide-granny/15 border-y border-granny/15">
          {circles.map((c) => {
            const owner = c.created_by ? userMap.get(c.created_by) : undefined
            return (
              <li key={c.id}>
                <Link
                  href={`/admin/circles/${c.id}`}
                  className="admin-press flex items-center gap-4 py-4 px-1 hover:bg-firefly/[0.03] transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[15px] text-ink font-light truncate">{c.name}</span>
                      {c.is_deleted && (
                        <span className="px-2 py-[2px] bg-granny/15 text-granny text-[9px] uppercase tracking-[0.15em]">
                          Deleted
                        </span>
                      )}
                      {c.is_discoverable && (
                        <span className="px-2 py-[2px] bg-casablanca/20 text-casablanca-dark text-[9px] uppercase tracking-[0.15em]">
                          Discoverable
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-[11px] text-granny truncate">
                      {c.type === 'hoa' ? 'HOA' : titleCase(c.type)} · {c.join_mode} ·
                      {' '}created by {owner?.name || owner?.email || 'Unknown'} · {formatDateTime(c.created_at)}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-[20px] font-extralight text-firefly leading-none">
                      {c.member_count}
                    </div>
                    <div className="text-[9px] uppercase tracking-[0.15em] text-granny mt-1">
                      {c.member_count === 1 ? 'member' : 'members'}
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="border border-granny/20 py-16 text-center text-granny text-[13px] font-light italic">
          No circles found.
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
