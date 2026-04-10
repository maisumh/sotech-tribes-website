import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { UserEditForm } from '@/components/admin/users/UserEditForm'

type UserRow = {
  id: string
  name: string | null
  email: string | null
  role: 'admin' | 'user' | null
  is_active: boolean
  is_profile_setup: boolean
  is_varify_email: boolean | null
  city: string | null
  state: string | null
  dob: string | null
  hobbies: string[] | null
  profile: string | null
  created_at: string
  updated_at: string
}

type WantHaveItem = {
  item_id: number
  item_data: Record<string, unknown>
  is_want: boolean
  is_matched: boolean
}

type FullProfile = {
  user: UserRow | null
  wants: WantHaveItem[]
  haves: WantHaveItem[]
  total_wants: number
  total_haves: number
  total_offers: number
  total_matches: number
}

export const dynamic = 'force-dynamic'

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_user_full_profile', {
    p_user_id: id,
  })

  if (error) {
    return (
      <div>
        <BackLink />
        <div className="mt-6 border-l-2 border-red-700 bg-red-50 px-4 sm:px-5 py-4 text-[13px] text-red-900 font-light">
          Failed to load user: {error.message}
        </div>
      </div>
    )
  }

  const profile = data as FullProfile | null
  if (!profile || !profile.user) {
    notFound()
  }

  const user = profile.user

  return (
    <div className="max-w-4xl">
      <BackLink />

      {/* Header */}
      <header className="mt-5 mb-8 lg:mt-6 lg:mb-12">
        <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-3">
          Member
        </div>

        <h1 className="text-[28px] sm:text-[34px] lg:text-[40px] font-extralight leading-[1.1] text-ink break-words">
          {user.name || <span className="text-granny italic">Unnamed</span>}
        </h1>
        <div className="mt-2 text-[14px] text-granny font-light break-all">
          {user.email || '—'}
        </div>

        {/* User ID — secondary, stacked below on mobile */}
        <div className="mt-4 text-[10px] uppercase tracking-[0.2em] text-granny/70">
          User ID
        </div>
        <div className="font-mono text-[11px] text-granny break-all">
          {user.id}
        </div>

        {/* Badges */}
        <div className="mt-5 flex flex-wrap items-center gap-2 sm:gap-3">
          {user.role === 'admin' ? (
            <Badge tone="accent">Admin</Badge>
          ) : (
            <Badge tone="muted">User</Badge>
          )}
          <Badge tone={user.is_active ? 'active' : 'inactive'}>
            {user.is_active ? 'Active' : 'Inactive'}
          </Badge>
          {user.is_profile_setup ? (
            <Badge tone="muted">Profile set up</Badge>
          ) : (
            <Badge tone="warning">Profile incomplete</Badge>
          )}
          {user.is_varify_email === false && (
            <Badge tone="warning">Email not verified</Badge>
          )}
        </div>
      </header>

      {/* Totals grid */}
      <section className="mb-10 lg:mb-12 grid grid-cols-2 sm:grid-cols-4 gap-px bg-granny/20 border border-granny/20">
        <StatCell label="Wants" value={profile.total_wants} />
        <StatCell label="Haves" value={profile.total_haves} />
        <StatCell label="Matches" value={profile.total_matches} />
        <StatCell label="Offers" value={profile.total_offers} />
      </section>

      {/* Edit form */}
      <section className="mb-12 lg:mb-14">
        <h2 className="text-[10px] uppercase tracking-[0.22em] text-granny mb-4 lg:mb-5">
          Manage
        </h2>
        <UserEditForm
          userId={user.id}
          currentRole={user.role ?? 'user'}
          currentIsActive={user.is_active}
        />
      </section>

      {/* Profile details */}
      <section className="mb-12 lg:mb-14">
        <h2 className="text-[10px] uppercase tracking-[0.22em] text-granny mb-4 lg:mb-5">
          Profile
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5 text-[13px]">
          <DetailRow label="Location" value={formatLocation(user.city, user.state)} />
          <DetailRow label="Date of birth" value={formatDate(user.dob)} />
          <DetailRow label="Joined" value={formatDateTime(user.created_at)} />
          <DetailRow label="Last updated" value={formatDateTime(user.updated_at)} />
          <DetailRow
            label="Hobbies"
            value={
              user.hobbies && user.hobbies.length > 0
                ? user.hobbies.join(', ')
                : null
            }
            colSpan
          />
        </dl>
      </section>

      {/* Wants */}
      <section className="mb-12 lg:mb-14">
        <h2 className="text-[10px] uppercase tracking-[0.22em] text-granny mb-4 lg:mb-5">
          Wants ({profile.wants.length})
        </h2>
        <WantHaveList items={profile.wants} />
      </section>

      {/* Haves */}
      <section className="mb-12 lg:mb-14">
        <h2 className="text-[10px] uppercase tracking-[0.22em] text-granny mb-4 lg:mb-5">
          Haves ({profile.haves.length})
        </h2>
        <WantHaveList items={profile.haves} />
      </section>
    </div>
  )
}

function BackLink() {
  return (
    <Link
      href="/admin/users"
      className="min-h-[44px] -ml-1 inline-flex items-center gap-2 px-1 text-[11px] uppercase tracking-[0.22em] text-granny hover:text-firefly active:text-firefly transition-colors"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" aria-hidden>
        <line x1="10" y1="7" x2="3" y2="7" />
        <polyline points="6 4 3 7 6 10" />
      </svg>
      All users
    </Link>
  )
}

function StatCell({
  label,
  value,
}: {
  label: string
  value: number | undefined
}) {
  return (
    <div className="bg-offwhite px-5 py-6 sm:px-6 sm:py-7">
      <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-3">
        {label}
      </div>
      <div className="text-[32px] sm:text-[40px] font-extralight text-firefly tabular-nums leading-none">
        {value?.toLocaleString() ?? '—'}
      </div>
    </div>
  )
}

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode
  tone: 'accent' | 'muted' | 'active' | 'inactive' | 'warning'
}) {
  const styles: Record<typeof tone, string> = {
    accent: 'bg-casablanca/15 text-casablanca-dark',
    muted: 'bg-granny/10 text-granny',
    active: 'bg-firefly/10 text-firefly',
    inactive: 'bg-granny/10 text-granny',
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
  colSpan,
}: {
  label: string
  value: string | null
  colSpan?: boolean
}) {
  return (
    <div className={colSpan ? 'sm:col-span-2' : ''}>
      <dt className="text-[10px] uppercase tracking-[0.22em] text-granny mb-1.5">
        {label}
      </dt>
      <dd className="text-ink font-light break-words">
        {value || <span className="text-granny italic">—</span>}
      </dd>
    </div>
  )
}

function WantHaveList({ items }: { items: WantHaveItem[] }) {
  if (items.length === 0) {
    return (
      <div className="border border-granny/20 px-5 py-8 text-center text-[13px] text-granny italic font-light">
        None posted.
      </div>
    )
  }
  return (
    <ul className="border border-granny/20 divide-y divide-granny/15">
      {items.map((item) => {
        const data = item.item_data as {
          title?: string
          description?: string
          status?: string
          category?: string
          is_deleted?: boolean
        }
        return (
          <li
            key={item.item_id}
            className="px-4 sm:px-5 py-4 flex items-start justify-between gap-4 sm:gap-6"
          >
            <div className="flex-1 min-w-0">
              <div className="text-[14px] text-ink font-light break-words">
                {data.title || (
                  <span className="text-granny italic">Untitled</span>
                )}
              </div>
              {data.description && (
                <div className="mt-1 text-[12px] text-granny line-clamp-2">
                  {data.description}
                </div>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.15em] text-granny/80">
                {data.category && <span>{data.category}</span>}
                {data.category && data.status && (
                  <span className="text-granny/40">·</span>
                )}
                {data.status && <span>{data.status}</span>}
                {data.is_deleted && (
                  <>
                    <span className="text-granny/40">·</span>
                    <span className="text-red-700">Deleted</span>
                  </>
                )}
              </div>
            </div>
            {item.is_matched && (
              <span className="shrink-0 inline-flex items-center px-2 py-[3px] bg-firefly/10 text-firefly text-[9px] uppercase tracking-[0.15em]">
                Matched
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function formatLocation(city: string | null, state: string | null): string | null {
  if (city && state) return `${city}, ${state}`
  if (city) return city
  if (state) return state
  return null
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
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
