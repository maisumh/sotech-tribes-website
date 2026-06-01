import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { ShowcaseActions } from '@/components/admin/showcase/ShowcaseActions'

type ProjectRow = {
  id: string
  user_id: string
  title: string
  description: string | null
  images: string[] | null
  category: string | null
  source: string
  trade_proposal_id: string | null
  partner_user_id: string | null
  featured: boolean
  is_deleted: boolean
  created_at: string
  updated_at: string
}

type UserLite = { id: string; name: string | null; email: string | null }

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

export default async function ShowcaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: project, error } = (await supabase
    .from('v2_projects')
    .select(
      'id, user_id, title, description, images, category, source, trade_proposal_id, partner_user_id, featured, is_deleted, created_at, updated_at',
    )
    .eq('id', id)
    .single()) as { data: ProjectRow | null; error: { message: string } | null }

  if (error || !project) {
    if (error?.message?.includes('No rows')) notFound()
    return (
      <div>
        <BackLink />
        <div className="mt-6 border-l-2 border-red-700 bg-red-50 px-4 sm:px-5 py-4 text-[13px] text-red-900 font-light">
          {error?.message || 'Project not found.'}
        </div>
      </div>
    )
  }

  const userIds = [project.user_id, project.partner_user_id].filter((x): x is string => !!x)
  const { data: users } = userIds.length
    ? await supabase.from('users').select('id, name, email').in('id', userIds)
    : { data: [] as UserLite[] }
  const userMap = new Map((users ?? []).map((u) => [u.id, u as UserLite]))
  const owner = userMap.get(project.user_id)
  const partner = project.partner_user_id ? userMap.get(project.partner_user_id) : null

  return (
    <div className="max-w-4xl">
      <BackLink />

      <header className="mt-5 mb-8 lg:mt-6 lg:mb-10">
        <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-3">
          Showcase{project.category ? ` · ${project.category}` : ''}
        </div>
        <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-extralight leading-[1.2] text-ink break-words">
          {project.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {project.source === 'trade' && (
            <span className="px-2.5 py-1 bg-firefly/10 text-firefly text-[10px] uppercase tracking-[0.15em]">
              Verified on Tribes
            </span>
          )}
          {project.featured && (
            <span className="px-2.5 py-1 bg-casablanca/20 text-casablanca-dark text-[10px] uppercase tracking-[0.15em]">
              Featured
            </span>
          )}
          {project.is_deleted && (
            <span className="px-2.5 py-1 bg-granny/15 text-granny text-[10px] uppercase tracking-[0.15em]">
              Deleted
            </span>
          )}
        </div>
      </header>

      <section className="mb-10 lg:mb-12">
        <h2 className="text-[10px] uppercase tracking-[0.22em] text-granny mb-4 lg:mb-5">Moderation</h2>
        <ShowcaseActions projectId={project.id} isDeleted={project.is_deleted} isFeatured={project.featured} />
      </section>

      {project.images && project.images.length > 0 && (
        <section className="mb-10 lg:mb-12">
          <h2 className="text-[10px] uppercase tracking-[0.22em] text-granny mb-4 lg:mb-5">
            Images ({project.images.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {project.images.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <a key={`${url}-${i}`} href={url} target="_blank" rel="noopener noreferrer" className="block aspect-square overflow-hidden border border-granny/20">
                <img src={url} alt="" className="w-full h-full object-cover" />
              </a>
            ))}
          </div>
        </section>
      )}

      {project.description && (
        <section className="mb-10 lg:mb-12">
          <h2 className="text-[10px] uppercase tracking-[0.22em] text-granny mb-4 lg:mb-5">Description</h2>
          <p className="text-[14px] text-ink/90 font-light leading-relaxed break-words whitespace-pre-wrap">
            {project.description}
          </p>
        </section>
      )}

      <section>
        <h2 className="text-[10px] uppercase tracking-[0.22em] text-granny mb-4 lg:mb-5">Details</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5 text-[13px]">
          <DetailRow label="Owner" value={owner?.name || owner?.email || 'Unknown'} href={`/admin/users/${project.user_id}`} />
          {partner && (
            <DetailRow label="Trade partner" value={partner.name || partner.email || 'Unknown'} href={`/admin/users/${partner.id}`} />
          )}
          <DetailRow label="Source" value={project.source[0].toUpperCase() + project.source.slice(1)} />
          {project.trade_proposal_id && (
            <DetailRow label="Linked trade" value="View trade →" href={`/admin/trades/${project.trade_proposal_id}`} />
          )}
          <DetailRow label="Created" value={formatDateTime(project.created_at)} />
          <DetailRow label="Updated" value={formatDateTime(project.updated_at)} />
        </dl>
      </section>
    </div>
  )
}

function BackLink() {
  return (
    <Link href="/admin/showcase" className="min-h-[44px] -ml-1 inline-flex items-center gap-2 px-1 text-[11px] uppercase tracking-[0.22em] text-granny hover:text-firefly transition-colors">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" aria-hidden>
        <line x1="10" y1="7" x2="3" y2="7" />
        <polyline points="6 4 3 7 6 10" />
      </svg>
      All projects
    </Link>
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
