'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/require-admin'
import { createAdminClient } from '@/lib/supabase/admin'

const UpdateUserSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(['admin', 'user']),
  is_active: z.boolean(),
})

export type UpdateUserState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

export async function updateUser(
  _prev: UpdateUserState,
  formData: FormData,
): Promise<UpdateUserState> {
  const adminUser = await requireAdmin()

  // Parse and validate input
  const parsed = UpdateUserSchema.safeParse({
    id: formData.get('id'),
    role: formData.get('role'),
    is_active: formData.get('is_active') === 'true',
  })

  if (!parsed.success) {
    return { status: 'error', message: 'Invalid input.' }
  }

  const { id: targetId, role: newRole, is_active: newIsActive } = parsed.data

  const supabase = createAdminClient()

  // Fetch current state of the target user for diff + self-lockout checks
  const { data: current, error: fetchError } = await supabase
    .from('users')
    .select('id, role, is_active')
    .eq('id', targetId)
    .single()

  if (fetchError || !current) {
    return { status: 'error', message: 'User not found.' }
  }

  // Safety rule #1: admin cannot change their own role
  if (adminUser.id === targetId && current.role !== newRole) {
    return {
      status: 'error',
      message: 'You cannot change your own role. Ask another admin.',
    }
  }

  // Safety rule #2: cannot demote the last admin
  if (current.role === 'admin' && newRole === 'user') {
    const { count: adminCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin')

    if ((adminCount ?? 0) <= 1) {
      return {
        status: 'error',
        message: 'Cannot demote the last remaining admin.',
      }
    }
  }

  // No-op short-circuit
  if (current.role === newRole && current.is_active === newIsActive) {
    return { status: 'idle', message: 'No changes.' }
  }

  // Apply the update
  const { error: updateError } = await supabase
    .from('users')
    .update({ role: newRole, is_active: newIsActive, updated_at: new Date().toISOString() })
    .eq('id', targetId)

  if (updateError) {
    return { status: 'error', message: updateError.message }
  }

  // Audit log — record only changed fields
  const changes: Record<string, { from: unknown; to: unknown }> = {}
  if (current.role !== newRole) {
    changes.role = { from: current.role, to: newRole }
  }
  if (current.is_active !== newIsActive) {
    changes.is_active = { from: current.is_active, to: newIsActive }
  }

  const action =
    current.role !== newRole
      ? 'update_user_role'
      : newIsActive
      ? 'reactivate_user'
      : 'deactivate_user'

  await supabase.from('admin_audit_log').insert({
    admin_id: adminUser.id,
    action,
    target_table: 'users',
    target_id: targetId,
    changes,
  })

  revalidatePath(`/admin/users/${targetId}`)
  revalidatePath('/admin/users')

  return { status: 'success', message: 'User updated.' }
}
