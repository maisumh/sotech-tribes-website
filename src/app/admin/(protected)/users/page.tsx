import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

const PAGE_SIZE = 25

const SORTABLE_COLUMNS = {
  created_at: 'Joined',
  name: 'Name',
  email: 'Email',
  role: 'Role',
} as const

type SortKey = keyof typeof SORTABLE_COLUMNS
type RoleFilter = 'all' | 'admin' | 'user'
type ActiveFilter = 'all' | 'true' | 'false'

type ParsedParams = {
  q: string
  role: RoleFilter
  active: ActiveFilter
  sort: SortKey
  order: 'asc' | 'desc'
  page: number
}

function parseSearchParams(raw: Record<string, string | undefined>): ParsedParams {
  const q = (raw.q ?? '').trim()
  const role: RoleFilter =
    raw.role === 'admin' || raw.role === 'user' ? raw.role : 'all'
  const active: ActiveFilter =
    raw.active === 'true' || raw.active === 'false' ? raw.active : 'all'
  const sort: SortKey =
    raw.sort && raw.sort in SORTABLE_COLUMNS ? (raw.sort as SortKey) : 'created_at'
  const order: 'asc' | 'desc' = raw.order === 'asc' ? 'asc' : 'desc'
  const page = Math.max(1, parseInt(raw.page ?? '1', 10) || 1)
  return { q, role, active, sort, order, page }
}

function buildHref(current: ParsedParams, override: Partial<ParsedParams>): string {
  const merged = { ...current, ...override }
  const params = new URLSearchParams()
  if (merged.q) params.set('q', merged.q)
  if (merged.role !== 'all') params.set('role', merged.role)
  if (merged.active !== 'all') params.set('active', merged.active)
  if (merged.sort !== 'created_at') params.set('sort', merged.sort)
  if (merged.order !== 'desc') params.set('order', merged.order)
  if (merged.page !== 1) params.set('page', String(merged.page))
  const qs = params.toString()
  return qs ? `/admin/users?${qs}` : '/admin/users'
}

function initials(name: string | null, email: string | null): string {
  const source = name || email || '?'
  const parts = source.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return source.slice(0, 2).toUpperCase()
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

type UserRow = {
  id: string
  name: string | null
  email: string | null
  role: 'admin' | 'user' | null
  is_active: boolean
  is_profile_setup: boolean
  city: string | null
  state: string | null
  created_at: string
}

export const dynamic = 'force-dynamic'

export default async function UsersPage({
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
    .from('users')
    .select(
      'id, name, email, role, is_active, is_profile_setup, city, state, created_at',
      { count: 'exact' },
    )
    .order(p.sort, { ascending: p.order === 'asc' })
    .range(from, to)

  if (p.q) {
    query = query.or(`name.ilike.%${p.q}%,email.ilike.%${p.q}%`)
  }
  if (p.role !== 'all') {
    query = query.eq('role', p.role)
  }
  if (p.active !== 'all') {
    query = query.eq('is_active', p.active === 'true')
  }

  const { data: users, count, error } = (await query) as {
    data: UserRow[] | null
    count: number | null
    error: { message: string } | null
  }

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1
  const hasFilters = p.q || p.role !== 'all' || p.active !== 'all'

  return (
    <div>
      {/* Header */}
      <header className="mb-8 lg:mb-12">
        <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-3 lg:mb-4">
          Community
        </div>
        <h1 className="text-[32px] sm:text-[38px] lg:text-[44px] font-extralight leading-[1.05] text-ink">
          Users
        </h1>
        <p className="mt-2 text-[13px] text-granny font-light">
          {count !== null && count !== undefined
            ? `${count.toLocaleString()} ${count === 1 ? 'member' : 'members'}`
            : 'Loading…'}
        </p>
      </header>

      {/* Filters form — responsive: stacks on mobile, inline on desktop */}
      <form
        method="GET"
        action="/admin/users"
        className="mb-8 lg:mb-10 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-end sm:gap-6 pb-6 lg:pb-8 border-b border-granny/20"
      >
        <div className="flex-1 sm:min-w-[240px]">
          <label
            htmlFor="q"
            className="block text-[10px] uppercase tracking-[0.22em] text-granny mb-2"
          >
            Search
          </label>
          <input
            id="q"
            name="q"
            type="text"
            defaultValue={p.q}
            placeholder="Name or email…"
            className="w-full min-h-[44px] border-0 border-b border-granny/40 bg-transparent pb-2 text-[15px] lg:text-[14px] font-light text-ink placeholder:text-granny/50 focus:outline-none focus:border-firefly transition-colors"
          />
        </div>

        <div className="flex gap-5 sm:gap-6">
          <div className="flex-1 sm:flex-none">
            <label
              htmlFor="role"
              className="block text-[10px] uppercase tracking-[0.22em] text-granny mb-2"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              defaultValue={p.role}
              className="w-full sm:w-auto min-h-[44px] border-0 border-b border-granny/40 bg-transparent pb-2 pr-6 text-[15px] lg:text-[14px] font-light text-ink focus:outline-none focus:border-firefly appearance-none cursor-pointer"
            >
              <option value="all">All</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <div className="flex-1 sm:flex-none">
            <label
              htmlFor="active"
              className="block text-[10px] uppercase tracking-[0.22em] text-granny mb-2"
            >
              Status
            </label>
            <select
              id="active"
              name="active"
              defaultValue={p.active}
              className="w-full sm:w-auto min-h-[44px] border-0 border-b border-granny/40 bg-transparent pb-2 pr-6 text-[15px] lg:text-[14px] font-light text-ink focus:outline-none focus:border-firefly appearance-none cursor-pointer"
            >
              <option value="all">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:self-end">
          <button
            type="submit"
            className="min-h-[44px] bg-firefly text-offwhite px-6 py-[9px] text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-ink active:bg-ink transition-colors"
          >
            Apply
          </button>
          {hasFilters && (
            <Link
              href="/admin/users"
              className="min-h-[44px] inline-flex items-center text-[11px] uppercase tracking-[0.22em] text-granny hover:text-ink active:text-ink transition-colors"
            >
              Clear
            </Link>
          )}
        </div>
      </form>

      {error && (
        <div className="mb-8 border-l-2 border-red-700 bg-red-50 px-4 sm:px-5 py-4 text-[13px] text-red-900 font-light">
          Failed to load users: {error.message}
        </div>
      )}

      {/* Mobile: card list */}
      <div className="lg:hidden">
        {users && users.length > 0 ? (
          <ul className="border-t border-granny/20">
            {users.map((user) => (
              <li key={user.id} className="border-b border-granny/15">
                <Link
                  href={`/admin/users/${user.id}`}
                  className="flex items-start gap-4 py-5 px-1 active:bg-firefly/[0.03] transition-colors"
                >
                  {/* Avatar / initials circle */}
                  <div className="shrink-0 w-11 h-11 rounded-full bg-firefly/10 text-firefly flex items-center justify-center text-[12px] font-medium tabular-nums">
                    {initials(user.name, user.email)}
                  </div>

                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="text-[15px] text-ink font-light truncate">
                          {user.name || (
                            <span className="text-granny italic">Unnamed</span>
                          )}
                        </div>
                        <div className="mt-0.5 text-[13px] text-granny font-light truncate">
                          {user.email || '—'}
                        </div>
                      </div>
                      <RoleBadge role={user.role} />
                    </div>
                    <div className="mt-2.5 flex items-center gap-3 text-[11px] text-granny/80">
                      <StatusDot active={user.is_active} />
                      {user.city && user.state && (
                        <>
                          <span className="text-granny/30">·</span>
                          <span className="truncate">
                            {user.city}, {user.state}
                          </span>
                        </>
                      )}
                      <span className="text-granny/30">·</span>
                      <span className="shrink-0 uppercase tracking-[0.12em] text-[10px]">
                        {formatShortDate(user.created_at)}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="border border-granny/20 py-16 text-center text-granny text-[13px] font-light italic">
            No users match these filters.
          </div>
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden lg:block border border-granny/20">
        <table className="w-full text-[13px] font-light">
          <thead>
            <tr className="border-b border-granny/20 bg-offwhite">
              {(Object.keys(SORTABLE_COLUMNS) as SortKey[]).map((key) => {
                const active = p.sort === key
                const nextOrder = active && p.order === 'desc' ? 'asc' : 'desc'
                return (
                  <th
                    key={key}
                    className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium"
                  >
                    <Link
                      href={buildHref(p, { sort: key, order: nextOrder, page: 1 })}
                      className={`inline-flex items-center gap-2 hover:text-ink transition-colors ${
                        active ? 'text-firefly' : ''
                      }`}
                    >
                      {SORTABLE_COLUMNS[key]}
                      {active && (
                        <span className="text-casablanca-dark text-[9px]">
                          {p.order === 'desc' ? '↓' : '↑'}
                        </span>
                      )}
                    </Link>
                  </th>
                )
              })}
              <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium">
                Location
              </th>
              <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-granny/15 hover:bg-firefly/[0.03] transition-colors last:border-b-0"
                >
                  <td className="px-5 py-4 text-granny tabular-nums text-[12px]">
                    {formatShortDate(user.created_at)}
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-ink hover:text-firefly transition-colors"
                    >
                      {user.name || <span className="text-granny italic">—</span>}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-granny">
                    {user.email || <span className="italic">—</span>}
                  </td>
                  <td className="px-5 py-4">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-5 py-4 text-granny text-[12px]">
                    {user.city && user.state ? (
                      `${user.city}, ${user.state}`
                    ) : (
                      <span className="italic">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <StatusLabel active={user.is_active} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-16 text-center text-granny text-[13px]"
                >
                  No users match these filters.
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

function RoleBadge({ role }: { role: 'admin' | 'user' | null }) {
  if (role === 'admin') {
    return (
      <span className="shrink-0 inline-flex items-center gap-1.5 px-2 py-[3px] bg-casablanca/15 text-casablanca-dark text-[10px] uppercase tracking-[0.15em] font-medium">
        <span aria-hidden className="block w-1 h-1 rounded-full bg-casablanca-dark" />
        Admin
      </span>
    )
  }
  return (
    <span className="shrink-0 inline-flex items-center px-2 py-[3px] bg-granny/10 text-granny text-[10px] uppercase tracking-[0.15em]">
      User
    </span>
  )
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        aria-hidden
        className={`block w-[6px] h-[6px] rounded-full ${
          active ? 'bg-firefly' : 'bg-granny/40'
        }`}
      />
      <span className={`uppercase tracking-[0.12em] text-[10px] ${
        active ? 'text-ink/70' : 'text-granny'
      }`}>
        {active ? 'Active' : 'Inactive'}
      </span>
    </span>
  )
}

function StatusLabel({ active }: { active: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em]">
      <span
        aria-hidden
        className={`block w-[6px] h-[6px] rounded-full ${
          active ? 'bg-firefly' : 'bg-granny/40'
        }`}
      />
      <span className={active ? 'text-ink' : 'text-granny'}>
        {active ? 'Active' : 'Inactive'}
      </span>
    </span>
  )
}
