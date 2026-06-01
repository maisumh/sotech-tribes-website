'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/require-admin'
import { createAdminClient } from '@/lib/supabase/admin'

export type V2ChatActionState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

const ChatModerationSchema = z.object({
  chatId: z.string().uuid(),
  op: z.enum(['block', 'unblock', 'clear_report']),
})

const ACTION_FOR_OP = {
  block: 'block_v2_chat',
  unblock: 'unblock_v2_chat',
  clear_report: 'clear_v2_chat_report',
} as const

/**
 * Block, unblock, or clear the report on a v2_chats row.
 * Mirrors the v1 chat_rooms moderation action; writes one admin_audit_log row.
 *
 * Note: a v2 chat report ALSO appears as a row in v2_reports (context='chat').
 * Clearing the report here only resets the per-chat reported_* fields — the
 * v2_reports queue entry is triaged separately in /admin/reports.
 */
export async function moderateV2Chat(
  _prev: V2ChatActionState,
  formData: FormData,
): Promise<V2ChatActionState> {
  const adminUser = await requireAdmin()

  const parsed = ChatModerationSchema.safeParse({
    chatId: formData.get('chatId'),
    op: formData.get('op'),
  })

  if (!parsed.success) {
    return { status: 'error', message: 'Invalid input.' }
  }

  const { chatId, op } = parsed.data
  const supabase = createAdminClient()

  const { data: current, error: fetchError } = await supabase
    .from('v2_chats')
    .select('id, blocked_by, blocked_at, reported_by, reported_reason, reported_at')
    .eq('id', chatId)
    .single()

  if (fetchError || !current) {
    return { status: 'error', message: 'Chat not found.' }
  }

  let update: Record<string, unknown>
  const changes: Record<string, { from: unknown; to: unknown }> = {}

  switch (op) {
    case 'block':
      if (current.blocked_by) return { status: 'idle', message: 'Already blocked.' }
      update = { blocked_by: adminUser.id, blocked_at: new Date().toISOString() }
      changes.blocked_by = { from: null, to: adminUser.id }
      break
    case 'unblock':
      if (!current.blocked_by) return { status: 'idle', message: 'Not blocked.' }
      update = { blocked_by: null, blocked_at: null }
      changes.blocked_by = { from: current.blocked_by, to: null }
      break
    case 'clear_report':
      if (!current.reported_by && !current.reported_reason && !current.reported_at) {
        return { status: 'idle', message: 'No active report.' }
      }
      update = { reported_by: null, reported_reason: null, reported_at: null }
      if (current.reported_by) changes.reported_by = { from: current.reported_by, to: null }
      if (current.reported_reason) changes.reported_reason = { from: current.reported_reason, to: null }
      if (current.reported_at) changes.reported_at = { from: current.reported_at, to: null }
      break
  }

  update.updated_at = new Date().toISOString()

  const { error: updateError } = await supabase.from('v2_chats').update(update).eq('id', chatId)
  if (updateError) return { status: 'error', message: updateError.message }

  await supabase.from('admin_audit_log').insert({
    admin_id: adminUser.id,
    action: ACTION_FOR_OP[op],
    target_table: 'v2_chats',
    target_id: chatId,
    changes,
  })

  revalidatePath(`/admin/v2-chats/${chatId}`)
  revalidatePath('/admin/v2-chats')

  const messages = {
    block: 'Chat blocked.',
    unblock: 'Chat unblocked.',
    clear_report: 'Report cleared.',
  }
  return { status: 'success', message: messages[op] }
}

const DeleteMessageSchema = z.object({
  messageId: z.string().uuid(),
  chatId: z.string().uuid(),
})

/**
 * Hard-delete a single v2_chat_messages row. v2 messages have no soft-delete
 * column (same as v1). Deleting a message cascades its v2_message_reactions
 * automatically (FK ON DELETE CASCADE). Logged to the admin audit trail.
 */
export async function deleteV2ChatMessage(
  _prev: V2ChatActionState,
  formData: FormData,
): Promise<V2ChatActionState> {
  const adminUser = await requireAdmin()

  const parsed = DeleteMessageSchema.safeParse({
    messageId: formData.get('messageId'),
    chatId: formData.get('chatId'),
  })

  if (!parsed.success) {
    return { status: 'error', message: 'Invalid input.' }
  }

  const { messageId, chatId } = parsed.data
  const supabase = createAdminClient()

  const { data: message, error: fetchError } = await supabase
    .from('v2_chat_messages')
    .select('id, sender_id, kind, body, chat_id')
    .eq('id', messageId)
    .single()

  if (fetchError || !message) {
    return { status: 'error', message: 'Message not found.' }
  }

  const { error: deleteError } = await supabase
    .from('v2_chat_messages')
    .delete()
    .eq('id', messageId)

  if (deleteError) return { status: 'error', message: deleteError.message }

  await supabase.from('admin_audit_log').insert({
    admin_id: adminUser.id,
    action: 'delete_v2_chat_message',
    target_table: 'v2_chat_messages',
    target_id: messageId,
    changes: {
      deleted: {
        from: { sender_id: message.sender_id, chat_id: message.chat_id, kind: message.kind, body: message.body },
        to: null,
      },
    },
  })

  revalidatePath(`/admin/v2-chats/${chatId}`)
  return { status: 'success', message: 'Message deleted.' }
}
