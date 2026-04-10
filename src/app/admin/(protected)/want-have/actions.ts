'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/require-admin'
import { createAdminClient } from '@/lib/supabase/admin'

const ModerateSchema = z.object({
  id: z.coerce.number().int().positive(),
  op: z.enum(['soft_delete', 'restore', 'close']),
})

export type WantHaveActionState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

const ACTION_FOR_OP: Record<
  z.infer<typeof ModerateSchema>['op'],
  string
> = {
  soft_delete: 'soft_delete_want_have',
  restore: 'restore_want_have',
  close: 'close_want_have',
}

/**
 * Unified moderation Server Action for want_have entries.
 * Accepts `op` ∈ {soft_delete, restore, close} to discriminate.
 * Every successful mutation writes a row to admin_audit_log.
 *
 * IMPORTANT: does NOT call the vulnerable public.delete_want_have RPC.
 * We soft-delete via a direct service-role UPDATE, per the backend contract.
 */
export async function moderateWantHave(
  _prev: WantHaveActionState,
  formData: FormData,
): Promise<WantHaveActionState> {
  const adminUser = await requireAdmin()

  const parsed = ModerateSchema.safeParse({
    id: formData.get('id'),
    op: formData.get('op'),
  })

  if (!parsed.success) {
    return { status: 'error', message: 'Invalid input.' }
  }

  const { id: targetId, op } = parsed.data
  const supabase = createAdminClient()

  // Fetch current state for diff + precondition checks
  const { data: current, error: fetchError } = await supabase
    .from('want_have')
    .select('id, status, is_deleted, title, user_id')
    .eq('id', targetId)
    .single()

  if (fetchError || !current) {
    return { status: 'error', message: 'Want/have entry not found.' }
  }

  // Compute the update and diff based on op
  let update: Record<string, unknown>
  const changes: Record<string, { from: unknown; to: unknown }> = {}

  switch (op) {
    case 'soft_delete':
      if (current.is_deleted) {
        return { status: 'idle', message: 'Already deleted.' }
      }
      update = { is_deleted: true }
      changes.is_deleted = { from: false, to: true }
      break
    case 'restore':
      if (!current.is_deleted) {
        return { status: 'idle', message: 'Not deleted.' }
      }
      update = { is_deleted: false }
      changes.is_deleted = { from: true, to: false }
      break
    case 'close':
      if (current.status === 'closed') {
        return { status: 'idle', message: 'Already closed.' }
      }
      update = { status: 'closed' }
      changes.status = { from: current.status, to: 'closed' }
      break
  }

  update.updated_at = new Date().toISOString()

  const { error: updateError } = await supabase
    .from('want_have')
    .update(update)
    .eq('id', targetId)

  if (updateError) {
    return { status: 'error', message: updateError.message }
  }

  // Audit log
  await supabase.from('admin_audit_log').insert({
    admin_id: adminUser.id,
    action: ACTION_FOR_OP[op],
    target_table: 'want_have',
    target_id: String(targetId),
    changes,
  })

  revalidatePath(`/admin/want-have/${targetId}`)
  revalidatePath('/admin/want-have')

  const successMessages: Record<typeof op, string> = {
    soft_delete: 'Entry soft-deleted.',
    restore: 'Entry restored.',
    close: 'Entry closed.',
  }

  return { status: 'success', message: successMessages[op] }
}
