import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

const PAGE_SIZE = 24

type SourceKey = 'all' | 'portfolio' | 'trade'

const SOURCE_KEYS: SourceKey[] = ['all', 'portfolio', 'trade']

type ParsedParams = {
  source: SourceKey
  showDeleted: boolean
  featuredOnly: boolean
  page: number
}

function parseSearchParams(raw: Record<string, string | undefined>): ParsedParams {
  const source = (SOURCE_KEYS as string[]).includes(raw.source ?? '')
    ? (raw.source as SourceKey)
    : 'all'
  return {
    source,
    showDeleted: raw.deleted === '1',
    featuredOnly: raw.featured === '1',
    page: Math.max(1, parseInt(raw.page ?? '1', 10) || 1),
  }
}

function buildHref(current: ParsedParams, override: Partial<ParsedParams>): string {
  const merged = { ...current, ...override }
  const p = new URLSearchParams()
  if (merged.source !== 'all') p.set('source', merged.source)
  if (merged.showDeleted) p.set('deleted', '1')
  if (merged.featuredOnly) p.set('featured', '1')
  if (merged.page !== 1) p.set('page', String(merged.page))
  const qs = p.toString()
  return qs ? `/admin/showcase?${qs}` : '/admin/showcase'
}

function formatDateTime(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

type ProjectRow = {
  id: string
  user_id: string
  title: string
  images: string[] | null
  category: string | null
  source: string
  featured: boolean
  is_deleted: boolean
  created_at: string
}

type UserLite = { id: string; name: string | null; email: string | null }

export const dynamic = 'force-dynamic'

export default async function ShowcasePage({
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
    .from('v2_projects')
    .select('id, user_id, title, images, category, source, featured, is_deleted, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (!p.showDeleted) query = query.eq('is_deleted', false)
  if (p.source !== 'all') query = query.eq('source', p.source)
  if (p.featuredOnly) query = query.eq('featured', true)

  const { data: projects, count, error } = (await query) as {
    data: ProjectRow[] | null
    count: number | null
    error: { message: string } | null
  }

  const userIds = Array.from(new Set((projects ?? []).map((p) => p.user_id)))
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
          Showcase
        </h1>
        <p className="mt-2 text-[13px] text-granny font-light">
          {count !== null && count !== undefined
            ? `${count.toLocaleString()} ${count === 1 ? 'project' : 'projects'}`
            : 'Loading…'}
        </p>
      </header>

      {/* Source pills */}
      <nav
        aria-label="Source filter"
        className="mb-4 flex items-center gap-0 border-b border-granny/25 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-5 px-5 sm:mx-0 sm:px-0"
      >
        {SOURCE_KEYS.map((key) => {
          const active = p.source === key
          const label = key === 'all' ? 'All' : key === 'trade' ? 'Verified (trade)' : 'Portfolio'
          return (
            <Link
              key={key}
              href={buildHref(p, { source: key, page: 1 })}
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
          href={buildHref(p, { featuredOnly: !p.featuredOnly, page: 1 })}
          className={`min-h-[34px] inline-flex items-center px-3 rounded-full text-[10px] uppercase tracking-[0.15em] font-medium transition-colors ${
            p.featuredOnly ? 'bg-firefly text-offwhite' : 'bg-firefly/[0.06] text-granny hover:text-firefly'
          }`}
        >
          Featured only
        </Link>
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
          Failed to load projects: {error.message}
        </div>
      )}

      {projects && projects.length > 0 ? (
        <ul className="admin-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => {
            const owner = userMap.get(proj.user_id)
            const cover = proj.images?.[0]
            return (
              <li key={proj.id}>
                <Link
                  href={`/admin/showcase/${proj.id}`}
                  className="admin-lift block border border-granny/20 bg-offwhite overflow-hidden"
                >
                  <div className="aspect-[4/3] bg-firefly/[0.04] relative overflow-hidden">
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cover} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-granny/40 text-[11px] uppercase tracking-[0.15em]">
                        No image
                      </div>
                    )}
                    {(proj.images?.length ?? 0) > 1 && (
                      <span className="absolute bottom-2 right-2 px-1.5 py-[2px] bg-ink/70 text-offwhite text-[10px] tracking-[0.1em]">
                        +{(proj.images?.length ?? 0) - 1}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      {proj.source === 'trade' && (
                        <span className="px-2 py-[3px] bg-firefly/10 text-firefly text-[9px] uppercase tracking-[0.15em]">
                          Verified
                        </span>
                      )}
                      {proj.featured && (
                        <span className="px-2 py-[3px] bg-casablanca/20 text-casablanca-dark text-[9px] uppercase tracking-[0.15em]">
                          Featured
                        </span>
                      )}
                      {proj.is_deleted && (
                        <span className="px-2 py-[3px] bg-granny/15 text-granny text-[9px] uppercase tracking-[0.15em]">
                          Deleted
                        </span>
                      )}
                    </div>
                    <div className="text-[15px] text-ink font-light leading-snug line-clamp-2">{proj.title}</div>
                    <div className="mt-2 text-[11px] text-granny truncate">
                      {owner?.name || owner?.email || 'Unknown'} · {formatDateTime(proj.created_at)}
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="border border-granny/20 py-16 text-center text-granny text-[13px] font-light italic">
          No projects found.
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
