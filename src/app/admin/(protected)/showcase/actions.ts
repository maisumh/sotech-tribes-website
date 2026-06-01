'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/require-admin'
import { createAdminClient } from '@/lib/supabase/admin'

export type ShowcaseActionState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

const ModerateSchema = z.object({
  id: z.string().uuid(),
  op: z.enum(['soft_delete', 'restore', 'feature', 'unfeature']),
})

const ACTION_FOR_OP: Record<z.infer<typeof ModerateSchema>['op'], string> = {
  soft_delete: 'soft_delete_v2_project',
  restore: 'restore_v2_project',
  feature: 'feature_v2_project',
  unfeature: 'unfeature_v2_project',
}

/**
 * Moderation for v2_projects ("My Work" showcase). soft_delete/restore toggles
 * is_deleted; feature/unfeature toggles featured. Each writes one
 * admin_audit_log row. Soft-delete only — never hard-delete UGC.
 */
export async function moderateProject(
  _prev: ShowcaseActionState,
  formData: FormData,
): Promise<ShowcaseActionState> {
  const adminUser = await requireAdmin()

  const parsed = ModerateSchema.safeParse({
    id: formData.get('id'),
    op: formData.get('op'),
  })

  if (!parsed.success) {
    return { status: 'error', message: 'Invalid input.' }
  }

  const { id, op } = parsed.data
  const supabase = createAdminClient()

  const { data: current, error: fetchError } = await supabase
    .from('v2_projects')
    .select('id, is_deleted, featured, title')
    .eq('id', id)
    .single()

  if (fetchError || !current) {
    return { status: 'error', message: 'Project not found.' }
  }

  let update: Record<string, unknown>
  const changes: Record<string, { from: unknown; to: unknown }> = {}

  switch (op) {
    case 'soft_delete':
      if (current.is_deleted) return { status: 'idle', message: 'Already deleted.' }
      update = { is_deleted: true }
      changes.is_deleted = { from: false, to: true }
      break
    case 'restore':
      if (!current.is_deleted) return { status: 'idle', message: 'Not deleted.' }
      update = { is_deleted: false }
      changes.is_deleted = { from: true, to: false }
      break
    case 'feature':
      if (current.featured) return { status: 'idle', message: 'Already featured.' }
      update = { featured: true }
      changes.featured = { from: false, to: true }
      break
    case 'unfeature':
      if (!current.featured) return { status: 'idle', message: 'Not featured.' }
      update = { featured: false }
      changes.featured = { from: true, to: false }
      break
  }

  update.updated_at = new Date().toISOString()

  const { error: updateError } = await supabase.from('v2_projects').update(update).eq('id', id)
  if (updateError) return { status: 'error', message: updateError.message }

  await supabase.from('admin_audit_log').insert({
    admin_id: adminUser.id,
    action: ACTION_FOR_OP[op],
    target_table: 'v2_projects',
    target_id: id,
    changes,
  })

  revalidatePath(`/admin/showcase/${id}`)
  revalidatePath('/admin/showcase')

  const messages: Record<typeof op, string> = {
    soft_delete: 'Project soft-deleted.',
    restore: 'Project restored.',
    feature: 'Project featured.',
    unfeature: 'Project unfeatured.',
  }
  return { status: 'success', message: messages[op] }
}
