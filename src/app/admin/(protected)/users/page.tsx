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

function parseSearchParams(raw: Record<string, string | undefined>) {
  const q = (raw.q ?? '').trim()
  const role: RoleFilter =
    raw.role === 'admin' || raw.role === 'user' ? raw.role : 'all'
  const active: ActiveFilter =
    raw.active === 'true' || raw.active === 'false' ? raw.active : 'all'
  const sort: SortKey =
    raw.sort && raw.sort in SORTABLE_COLUMNS
      ? (raw.sort as SortKey)
      : 'created_at'
  const order: 'asc' | 'desc' = raw.order === 'asc' ? 'asc' : 'desc'
  const page = Math.max(1, parseInt(raw.page ?? '1', 10) || 1)
  return { q, role, active, sort, order, page }
}

function buildHref(
  current: ReturnType<typeof parseSearchParams>,
  override: Partial<ReturnType<typeof parseSearchParams>>,
) {
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

export const dynamic = 'force-dynamic'

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const raw = await searchParams
  const params = parseSearchParams(raw)

  const from = (params.page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = createAdminClient()

  let query = supabase
    .from('users')
    .select(
      'id, name, email, role, is_active, is_profile_setup, city, state, created_at',
      { count: 'exact' },
    )
    .order(params.sort, { ascending: params.order === 'asc' })
    .range(from, to)

  if (params.q) {
    query = query.or(`name.ilike.%${params.q}%,email.ilike.%${params.q}%`)
  }
  if (params.role !== 'all') {
    query = query.eq('role', params.role)
  }
  if (params.active !== 'all') {
    query = query.eq('is_active', params.active === 'true')
  }

  const { data: users, count, error } = await query

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1

  return (
    <div>
      {/* Header */}
      <header className="mb-12 flex items-end justify-between gap-8">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-4">
            Community
          </div>
          <h1 className="text-[44px] font-extralight leading-[1.05] text-ink">
            Users
          </h1>
          <p className="mt-3 text-[13px] text-granny font-light">
            {count !== null && count !== undefined
              ? `${count.toLocaleString()} ${count === 1 ? 'member' : 'members'}`
              : 'Loading…'}
          </p>
        </div>
      </header>

      {/* Filters */}
      <form
        method="GET"
        action="/admin/users"
        className="mb-10 flex flex-wrap items-end gap-6 pb-8 border-b border-granny/20"
      >
        <div className="flex-1 min-w-[240px]">
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
            defaultValue={params.q}
            placeholder="Name or email…"
            className="w-full border-0 border-b border-granny/40 bg-transparent pb-2 text-[14px] font-light text-ink placeholder:text-granny/50 focus:outline-none focus:border-firefly transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="role"
            className="block text-[10px] uppercase tracking-[0.22em] text-granny mb-2"
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            defaultValue={params.role}
            className="border-0 border-b border-granny/40 bg-transparent pb-2 pr-6 text-[14px] font-light text-ink focus:outline-none focus:border-firefly appearance-none cursor-pointer"
          >
            <option value="all">All</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="active"
            className="block text-[10px] uppercase tracking-[0.22em] text-granny mb-2"
          >
            Status
          </label>
          <select
            id="active"
            name="active"
            defaultValue={params.active}
            className="border-0 border-b border-granny/40 bg-transparent pb-2 pr-6 text-[14px] font-light text-ink focus:outline-none focus:border-firefly appearance-none cursor-pointer"
          >
            <option value="all">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-firefly text-offwhite px-6 py-[9px] text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-ink transition-colors"
        >
          Apply
        </button>

        {(params.q ||
          params.role !== 'all' ||
          params.active !== 'all') && (
          <Link
            href="/admin/users"
            className="text-[11px] uppercase tracking-[0.22em] text-granny hover:text-ink transition-colors pb-[11px]"
          >
            Clear
          </Link>
        )}
      </form>

      {error && (
        <div className="mb-8 border-l-2 border-red-700 bg-red-50 px-5 py-4 text-[13px] text-red-900 font-light">
          Failed to load users: {error.message}
        </div>
      )}

      {/* Table */}
      <div className="border border-granny/20">
        <table className="w-full text-[13px] font-light">
          <thead>
            <tr className="border-b border-granny/20 bg-offwhite">
              {(Object.keys(SORTABLE_COLUMNS) as SortKey[]).map((key) => {
                const active = params.sort === key
                const nextOrder =
                  active && params.order === 'desc' ? 'asc' : 'desc'
                return (
                  <th
                    key={key}
                    className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-granny font-medium"
                  >
                    <Link
                      href={buildHref(params, {
                        sort: key,
                        order: nextOrder,
                        page: 1,
                      })}
                      className={`inline-flex items-center gap-2 hover:text-ink transition-colors ${
                        active ? 'text-firefly' : ''
                      }`}
                    >
                      {SORTABLE_COLUMNS[key]}
                      {active && (
                        <span className="text-casablanca-dark text-[9px]">
                          {params.order === 'desc' ? '↓' : '↑'}
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
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
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
                    {user.city && user.state
                      ? `${user.city}, ${user.state}`
                      : <span className="italic">—</span>}
                  </td>
                  <td className="px-5 py-4">
                    <StatusIndicator active={user.is_active} />
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
        <div className="mt-8 flex items-center justify-between text-[12px] font-light">
          <div className="text-granny uppercase tracking-[0.15em] text-[10px]">
            Page {params.page} of {totalPages} · {count.toLocaleString()} total
          </div>
          <div className="flex items-center gap-2">
            {params.page > 1 && (
              <Link
                href={buildHref(params, { page: params.page - 1 })}
                className="px-4 py-2 border border-granny/30 text-ink hover:border-firefly hover:text-firefly transition-colors uppercase tracking-[0.15em] text-[10px]"
              >
                ← Prev
              </Link>
            )}
            {params.page < totalPages && (
              <Link
                href={buildHref(params, { page: params.page + 1 })}
                className="px-4 py-2 border border-granny/30 text-ink hover:border-firefly hover:text-firefly transition-colors uppercase tracking-[0.15em] text-[10px]"
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
      <span className="inline-flex items-center gap-1.5 px-2 py-[3px] bg-casablanca/15 text-casablanca-dark text-[10px] uppercase tracking-[0.15em] font-medium">
        <span className="block w-1 h-1 rounded-full bg-casablanca-dark" />
        Admin
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-[3px] bg-granny/10 text-granny text-[10px] uppercase tracking-[0.15em]">
      User
    </span>
  )
}

function StatusIndicator({ active }: { active: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em]">
      <span
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
