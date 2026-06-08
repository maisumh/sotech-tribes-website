import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

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

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

type Circle = {
  id: string
  name: string
  description: string | null
  type: string
  is_discoverable: boolean
  join_mode: string
  member_count: number
  created_by: string | null
  is_deleted: boolean
  created_at: string
  updated_at: string
}
type Member = { user_id: string; role: string; status: string; joined_at: string }
type Invite = {
  id: string
  code: string
  role: string
  use_count: number
  max_uses: number | null
  expires_at: string | null
  revoked: boolean
  created_at: string
}
type Ban = { user_id: string; reason: string | null; created_at: string }
type UserLite = { id: string; name: string | null; email: string | null }

const ROLE_RANK: Record<string, number> = { owner: 0, admin: 1, member: 2 }
const STATUS_RANK: Record<string, number> = { active: 0, pending: 1, left: 2, removed: 3 }

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-granny/15 px-4 py-3">
      <div className="text-[9px] uppercase tracking-[0.18em] text-granny mb-1">{label}</div>
      <div className="text-[14px] font-light text-ink">{value}</div>
    </div>
  )
}

export default async function CircleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: circle } = (await supabase
    .from('circles')
    .select(
      'id, name, description, type, is_discoverable, join_mode, member_count, created_by, is_deleted, created_at, updated_at',
    )
    .eq('id', id)
    .maybeSingle()) as { data: Circle | null }

  if (!circle) notFound()

  const [{ data: members }, { data: invites }, { data: bans }] = await Promise.all([
    supabase
      .from('circle_members')
      .select('user_id, role, status, joined_at')
      .eq('circle_id', id),
    supabase
      .from('circle_invites')
      .select('id, code, role, use_count, max_uses, expires_at, revoked, created_at')
      .eq('circle_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('circle_bans')
      .select('user_id, reason, created_at')
      .eq('circle_id', id)
      .order('created_at', { ascending: false }),
  ])

  const memberList = (members ?? []) as Member[]
  const inviteList = (invites ?? []) as Invite[]
  const banList = (bans ?? []) as Ban[]

  const userIds = Array.from(
    new Set([
      ...memberList.map((m) => m.user_id),
      ...banList.map((b) => b.user_id),
      ...(circle.created_by ? [circle.created_by] : []),
    ]),
  )
  const { data: users } = userIds.length
    ? await supabase.from('users').select('id, name, email').in('id', userIds)
    : { data: [] as UserLite[] }
  const userMap = new Map((users ?? []).map((u) => [u.id, u as UserLite]))
  const nameFor = (uid: string) => {
    const u = userMap.get(uid)
    return u?.name || u?.email || uid.slice(0, 8)
  }

  const sortedMembers = [...memberList].sort(
    (a, b) =>
      (STATUS_RANK[a.status] ?? 9) - (STATUS_RANK[b.status] ?? 9) ||
      (ROLE_RANK[a.role] ?? 9) - (ROLE_RANK[b.role] ?? 9) ||
      nameFor(a.user_id).localeCompare(nameFor(b.user_id)),
  )
  const activeCount = memberList.filter((m) => m.status === 'active').length

  return (
    <div>
      <Link
        href="/admin/circles"
        className="admin-fade-up inline-flex items-center text-[11px] uppercase tracking-[0.18em] text-granny hover:text-firefly transition-colors mb-6"
      >
        ← Circles
      </Link>

      <header className="admin-fade-up mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {circle.is_deleted && (
            <span className="px-2 py-[3px] bg-granny/15 text-granny text-[9px] uppercase tracking-[0.15em]">
              Deleted
            </span>
          )}
          {circle.is_discoverable && (
            <span className="px-2 py-[3px] bg-casablanca/20 text-casablanca-dark text-[9px] uppercase tracking-[0.15em]">
              Discoverable
            </span>
          )}
        </div>
        <h1 className="text-[30px] sm:text-[36px] font-extralight leading-[1.08] text-ink">
          {circle.name}
        </h1>
        {circle.description && (
          <p className="mt-3 text-[14px] text-granny font-light max-w-2xl">{circle.description}</p>
        )}
      </header>

      <div className="admin-fade-up grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
        <Stat label="Type" value={circle.type === 'hoa' ? 'HOA' : titleCase(circle.type)} />
        <Stat label="Visibility" value={circle.is_discoverable ? 'Discoverable' : 'Private'} />
        <Stat label="Join mode" value={titleCase(circle.join_mode)} />
        <Stat label="Active members" value={String(activeCount)} />
        <Stat label="Created by" value={circle.created_by ? nameFor(circle.created_by) : '—'} />
        <Stat label="Created" value={formatDateTime(circle.created_at)} />
        <Stat label="Updated" value={formatDateTime(circle.updated_at)} />
        <Stat label="member_count" value={String(circle.member_count)} />
      </div>

      {/* Members */}
      <section className="mb-10">
        <h2 className="text-[11px] uppercase tracking-[0.2em] text-granny mb-3">
          Members · {memberList.length}
        </h2>
        {sortedMembers.length > 0 ? (
          <ul className="divide-y divide-granny/15 border-y border-granny/15">
            {sortedMembers.map((m) => (
              <li key={m.user_id} className="flex items-center gap-3 py-3">
                <Link
                  href={`/admin/users/${m.user_id}`}
                  className="min-w-0 flex-1 text-[14px] font-light text-ink hover:text-firefly transition-colors truncate"
                >
                  {nameFor(m.user_id)}
                </Link>
                <span
                  className={`px-2 py-[2px] text-[9px] uppercase tracking-[0.15em] ${
                    m.role === 'owner'
                      ? 'bg-firefly/10 text-firefly'
                      : m.role === 'admin'
                        ? 'bg-firefly/[0.06] text-firefly'
                        : 'bg-granny/10 text-granny'
                  }`}
                >
                  {m.role}
                </span>
                {m.status !== 'active' && (
                  <span className="px-2 py-[2px] bg-granny/15 text-granny text-[9px] uppercase tracking-[0.15em]">
                    {m.status}
                  </span>
                )}
                <span className="hidden sm:block text-[11px] text-granny w-28 text-right">
                  {formatDateTime(m.joined_at)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-[13px] text-granny font-light italic">No members.</div>
        )}
      </section>

      {/* Invites */}
      <section className="mb-10">
        <h2 className="text-[11px] uppercase tracking-[0.2em] text-granny mb-3">
          Invites · {inviteList.length}
        </h2>
        {inviteList.length > 0 ? (
          <ul className="divide-y divide-granny/15 border-y border-granny/15">
            {inviteList.map((inv) => (
              <li key={inv.id} className="flex items-center gap-3 py-3 text-[13px] font-light">
                <span className="font-mono text-ink tracking-wider">{inv.code}</span>
                <span className="text-granny text-[11px]">{inv.role}</span>
                {inv.revoked && (
                  <span className="px-2 py-[2px] bg-granny/15 text-granny text-[9px] uppercase tracking-[0.15em]">
                    Revoked
                  </span>
                )}
                <span className="ml-auto text-[11px] text-granny">
                  used {inv.use_count}
                  {inv.max_uses != null ? ` / ${inv.max_uses}` : ''}
                  {inv.expires_at ? ` · expires ${formatDateTime(inv.expires_at)}` : ''}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-[13px] text-granny font-light italic">No invites.</div>
        )}
      </section>

      {/* Bans */}
      {banList.length > 0 && (
        <section className="mb-10">
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-granny mb-3">
            Bans · {banList.length}
          </h2>
          <ul className="divide-y divide-granny/15 border-y border-granny/15">
            {banList.map((b) => (
              <li key={b.user_id} className="flex items-center gap-3 py-3 text-[13px] font-light">
                <span className="text-ink truncate">{nameFor(b.user_id)}</span>
                {b.reason && <span className="text-granny text-[11px] truncate">“{b.reason}”</span>}
                <span className="ml-auto text-[11px] text-granny">{formatDateTime(b.created_at)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
