'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/require-admin'
import { createAdminClient } from '@/lib/supabase/admin'

export type ReportActionState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

// Status transitions + notes write to v2_reports. Target actions
// (soft-delete the reported listing / deactivate the reported user) reuse the
// existing want_have / users moderation paths and their canonical audit
// strings. Each branch writes exactly one admin_audit_log row.
const ModerateReportSchema = z.object({
  reportId: z.string().uuid(),
  op: z.enum([
    'mark_reviewed',
    'mark_actioned',
    'dismiss',
    'reopen',
    'save_notes',
    'soft_delete_listing',
    'deactivate_user',
  ]),
  notes: z.string().max(2000).optional(),
})

const STATUS_FOR_OP: Record<string, string> = {
  mark_reviewed: 'reviewed',
  mark_actioned: 'actioned',
  dismiss: 'dismissed',
  reopen: 'open',
}

export async function moderateReport(
  _prev: ReportActionState,
  formData: FormData,
): Promise<ReportActionState> {
  const adminUser = await requireAdmin()

  const parsed = ModerateReportSchema.safeParse({
    reportId: formData.get('reportId'),
    op: formData.get('op'),
    notes: formData.get('notes') ?? undefined,
  })

  if (!parsed.success) {
    return { status: 'error', message: 'Invalid input.' }
  }

  const { reportId, op, notes } = parsed.data
  const supabase = createAdminClient()

  const { data: report, error: fetchError } = await supabase
    .from('v2_reports')
    .select(
      'id, status, context, reported_listing_id, reported_user_id, admin_notes',
    )
    .eq('id', reportId)
    .single()

  if (fetchError || !report) {
    return { status: 'error', message: 'Report not found.' }
  }

  const nowIso = new Date().toISOString()

  // --- Status transitions ---------------------------------------------------
  if (op in STATUS_FOR_OP) {
    const next = STATUS_FOR_OP[op]
    if (report.status === next) {
      return { status: 'idle', message: `Already ${next}.` }
    }
    const { error } = await supabase
      .from('v2_reports')
      .update({ status: next, reviewed_by: adminUser.id, reviewed_at: nowIso })
      .eq('id', reportId)
    if (error) return { status: 'error', message: error.message }

    await supabase.from('admin_audit_log').insert({
      admin_id: adminUser.id,
      action: 'update_v2_report_status',
      target_table: 'v2_reports',
      target_id: reportId,
      changes: { status: { from: report.status, to: next } },
    })

    revalidatePath(`/admin/reports/${reportId}`)
    revalidatePath('/admin/reports')
    return { status: 'success', message: `Report marked ${next}.` }
  }

  // --- Save moderator notes -------------------------------------------------
  if (op === 'save_notes') {
    const trimmed = (notes ?? '').trim() || null
    const { error } = await supabase
      .from('v2_reports')
      .update({ admin_notes: trimmed, reviewed_by: adminUser.id, reviewed_at: nowIso })
      .eq('id', reportId)
    if (error) return { status: 'error', message: error.message }

    await supabase.from('admin_audit_log').insert({
      admin_id: adminUser.id,
      action: 'update_v2_report_status',
      target_table: 'v2_reports',
      target_id: reportId,
      changes: { admin_notes: { from: report.admin_notes, to: trimmed } },
    })

    revalidatePath(`/admin/reports/${reportId}`)
    return { status: 'success', message: 'Notes saved.' }
  }

  // --- Target actions (reuse existing moderation paths) ---------------------
  if (op === 'soft_delete_listing') {
    if (!report.reported_listing_id) {
      return { status: 'error', message: 'This report has no linked listing.' }
    }
    const listingId = report.reported_listing_id
    const { data: listing } = await supabase
      .from('want_have')
      .select('id, is_deleted')
      .eq('id', listingId)
      .single()
    if (!listing) {
      return { status: 'error', message: 'Reported listing no longer exists.' }
    }
    if (listing.is_deleted) {
      return { status: 'idle', message: 'Listing already soft-deleted.' }
    }
    const { error } = await supabase
      .from('want_have')
      .update({ is_deleted: true, updated_at: nowIso })
      .eq('id', listingId)
    if (error) return { status: 'error', message: error.message }

    await supabase.from('admin_audit_log').insert({
      admin_id: adminUser.id,
      action: 'soft_delete_want_have',
      target_table: 'want_have',
      target_id: String(listingId),
      changes: { is_deleted: { from: false, to: true }, via_report: reportId },
    })

    revalidatePath(`/admin/reports/${reportId}`)
    revalidatePath(`/admin/want-have/${listingId}`)
    return {
      status: 'success',
      message: 'Reported listing soft-deleted. Mark the report Actioned when done.',
    }
  }

  if (op === 'deactivate_user') {
    if (!report.reported_user_id) {
      return { status: 'error', message: 'This report has no linked user.' }
    }
    const userId = report.reported_user_id
    const { data: target } = await supabase
      .from('users')
      .select('id, is_active')
      .eq('id', userId)
      .single()
    if (!target) {
      return { status: 'error', message: 'Reported user no longer exists.' }
    }
    if (target.is_active === false) {
      return { status: 'idle', message: 'User already deactivated.' }
    }
    const { error } = await supabase
      .from('users')
      .update({ is_active: false, updated_at: nowIso })
      .eq('id', userId)
    if (error) return { status: 'error', message: error.message }

    await supabase.from('admin_audit_log').insert({
      admin_id: adminUser.id,
      action: 'deactivate_user',
      target_table: 'users',
      target_id: userId,
      changes: { is_active: { from: true, to: false }, via_report: reportId },
    })

    revalidatePath(`/admin/reports/${reportId}`)
    revalidatePath(`/admin/users/${userId}`)
    return {
      status: 'success',
      message: 'Reported user deactivated. Mark the report Actioned when done.',
    }
  }

  return { status: 'error', message: 'Unsupported operation.' }
}
