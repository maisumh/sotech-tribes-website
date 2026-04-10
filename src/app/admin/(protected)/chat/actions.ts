'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/require-admin'
import { createAdminClient } from '@/lib/supabase/admin'

export type ChatActionState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

const RoomModerationSchema = z.object({
  roomId: z.string().uuid(),
  op: z.enum(['block', 'unblock', 'clear_report']),
})

const ACTION_FOR_OP = {
  block: 'block_chat_room',
  unblock: 'unblock_chat_room',
  clear_report: 'clear_report',
} as const

/**
 * Block, unblock, or clear the report on a chat_room.
 * Every mutation logs to admin_audit_log.
 */
export async function moderateChatRoom(
  _prev: ChatActionState,
  formData: FormData,
): Promise<ChatActionState> {
  const adminUser = await requireAdmin()

  const parsed = RoomModerationSchema.safeParse({
    roomId: formData.get('roomId'),
    op: formData.get('op'),
  })

  if (!parsed.success) {
    return { status: 'error', message: 'Invalid input.' }
  }

  const { roomId, op } = parsed.data
  const supabase = createAdminClient()

  const { data: current, error: fetchError } = await supabase
    .from('chat_rooms')
    .select(
      'id, blocked_by, blocked_at, reported_by, reported_reason, reported_at',
    )
    .eq('id', roomId)
    .single()

  if (fetchError || !current) {
    return { status: 'error', message: 'Chat room not found.' }
  }

  let update: Record<string, unknown>
  const changes: Record<string, { from: unknown; to: unknown }> = {}

  switch (op) {
    case 'block':
      if (current.blocked_by) {
        return { status: 'idle', message: 'Already blocked.' }
      }
      update = {
        blocked_by: adminUser.id,
        blocked_at: new Date().toISOString(),
      }
      changes.blocked_by = { from: null, to: adminUser.id }
      break
    case 'unblock':
      if (!current.blocked_by) {
        return { status: 'idle', message: 'Not blocked.' }
      }
      update = { blocked_by: null, blocked_at: null }
      changes.blocked_by = { from: current.blocked_by, to: null }
      break
    case 'clear_report':
      // Data quirk: mobile app often sets reported_reason/at without reported_by
      if (
        !current.reported_by &&
        !current.reported_reason &&
        !current.reported_at
      ) {
        return { status: 'idle', message: 'No active report.' }
      }
      update = {
        reported_by: null,
        reported_reason: null,
        reported_at: null,
      }
      if (current.reported_by)
        changes.reported_by = { from: current.reported_by, to: null }
      if (current.reported_reason)
        changes.reported_reason = { from: current.reported_reason, to: null }
      if (current.reported_at)
        changes.reported_at = { from: current.reported_at, to: null }
      break
  }

  update.updated_at = new Date().toISOString()

  const { error: updateError } = await supabase
    .from('chat_rooms')
    .update(update)
    .eq('id', roomId)

  if (updateError) {
    return { status: 'error', message: updateError.message }
  }

  await supabase.from('admin_audit_log').insert({
    admin_id: adminUser.id,
    action: ACTION_FOR_OP[op],
    target_table: 'chat_rooms',
    target_id: roomId,
    changes,
  })

  revalidatePath(`/admin/chat/${roomId}`)
  revalidatePath('/admin/chat')

  const messages = {
    block: 'Chat room blocked.',
    unblock: 'Chat room unblocked.',
    clear_report: 'Report cleared.',
  }
  return { status: 'success', message: messages[op] }
}

const DeleteMessageSchema = z.object({
  messageId: z.string().uuid(),
  roomId: z.string().uuid(),
})

/**
 * Delete a single chat_message. This is the ONE intentional hard-delete
 * in the admin panel — chat messages have no soft-delete column, and
 * removing an objectionable message is the moderator's primary tool.
 */
export async function deleteChatMessage(
  _prev: ChatActionState,
  formData: FormData,
): Promise<ChatActionState> {
  const adminUser = await requireAdmin()

  const parsed = DeleteMessageSchema.safeParse({
    messageId: formData.get('messageId'),
    roomId: formData.get('roomId'),
  })

  if (!parsed.success) {
    return { status: 'error', message: 'Invalid input.' }
  }

  const { messageId, roomId } = parsed.data
  const supabase = createAdminClient()

  // Fetch the message first so we can record its content in the audit log
  const { data: message, error: fetchError } = await supabase
    .from('chat_messages')
    .select('id, sender_id, message, room_id')
    .eq('id', messageId)
    .single()

  if (fetchError || !message) {
    return { status: 'error', message: 'Message not found.' }
  }

  const { error: deleteError } = await supabase
    .from('chat_messages')
    .delete()
    .eq('id', messageId)

  if (deleteError) {
    return { status: 'error', message: deleteError.message }
  }

  await supabase.from('admin_audit_log').insert({
    admin_id: adminUser.id,
    action: 'delete_chat_message',
    target_table: 'chat_messages',
    target_id: messageId,
    changes: {
      deleted: {
        from: {
          sender_id: message.sender_id,
          room_id: message.room_id,
          message: message.message,
        },
        to: null,
      },
    },
  })

  revalidatePath(`/admin/chat/${roomId}`)

  return { status: 'success', message: 'Message deleted.' }
}
