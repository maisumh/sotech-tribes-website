'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import {
  moderateReport,
  type ReportActionState,
} from '@/app/admin/(protected)/reports/actions'

const INITIAL_STATE: ReportActionState = { status: 'idle' }

export function ReportActions({
  reportId,
  status,
  canDeleteListing,
  canDeactivateUser,
  currentNotes,
}: {
  reportId: string
  status: string
  canDeleteListing: boolean
  canDeactivateUser: boolean
  currentNotes: string | null
}) {
  const [state, formAction] = useActionState(moderateReport, INITIAL_STATE)

  const isResolved = status === 'actioned' || status === 'dismissed'

  return (
    <div className="border border-granny/20 p-5 sm:p-6 bg-offwhite">
      {state.status === 'error' && state.message && (
        <div
          role="alert"
          className="mb-5 border-l-2 border-red-700 bg-red-50 px-4 py-3 text-[12px] text-red-900 font-light"
        >
          {state.message}
        </div>
      )}
      {state.status === 'success' && (
        <div
          role="status"
          className="mb-5 border-l-2 border-firefly bg-firefly/5 px-4 py-3 text-[12px] text-firefly font-light"
        >
          {state.message}
        </div>
      )}

      {/* Triage status */}
      <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-3">
        Triage
      </div>
      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        {status !== 'reviewed' && !isResolved && (
          <SubmitForm reportId={reportId} op="mark_reviewed" formAction={formAction}>
            <ActionButton intent="secondary" label="Mark reviewed" pendingLabel="Saving…" />
          </SubmitForm>
        )}
        {status !== 'actioned' && (
          <SubmitForm reportId={reportId} op="mark_actioned" formAction={formAction}>
            <ActionButton intent="primary" label="Mark actioned" pendingLabel="Saving…" />
          </SubmitForm>
        )}
        {status !== 'dismissed' && (
          <SubmitForm reportId={reportId} op="dismiss" formAction={formAction}>
            <ActionButton intent="secondary" label="Dismiss" pendingLabel="Saving…" />
          </SubmitForm>
        )}
        {isResolved && (
          <SubmitForm reportId={reportId} op="reopen" formAction={formAction}>
            <ActionButton intent="secondary" label="Reopen" pendingLabel="Saving…" />
          </SubmitForm>
        )}
      </div>

      {/* Target actions */}
      {(canDeleteListing || canDeactivateUser) && (
        <>
          <div className="mt-7 pt-6 border-t border-granny/15 text-[10px] uppercase tracking-[0.22em] text-granny mb-3">
            Take action on the target
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            {canDeleteListing && (
              <SubmitForm reportId={reportId} op="soft_delete_listing" formAction={formAction}>
                <ActionButton intent="danger" label="Soft-delete listing" pendingLabel="Deleting…" />
              </SubmitForm>
            )}
            {canDeactivateUser && (
              <SubmitForm reportId={reportId} op="deactivate_user" formAction={formAction}>
                <ActionButton intent="danger" label="Deactivate user" pendingLabel="Deactivating…" />
              </SubmitForm>
            )}
          </div>
        </>
      )}

      {/* Moderator notes */}
      <div className="mt-7 pt-6 border-t border-granny/15">
        <form action={formAction}>
          <input type="hidden" name="reportId" value={reportId} />
          <input type="hidden" name="op" value="save_notes" />
          <label
            htmlFor="report-notes"
            className="block text-[10px] uppercase tracking-[0.22em] text-granny mb-3"
          >
            Moderator notes
          </label>
          <textarea
            id="report-notes"
            name="notes"
            defaultValue={currentNotes ?? ''}
            rows={3}
            placeholder="Internal notes about this report…"
            className="w-full border border-granny/30 bg-offwhite px-4 py-3 text-[14px] lg:text-[13px] font-light text-ink focus:outline-none focus:border-firefly resize-y"
          />
          <div className="mt-3">
            <ActionButton intent="secondary" label="Save notes" pendingLabel="Saving…" />
          </div>
        </form>
      </div>

      <p className="mt-5 pt-5 border-t border-granny/15 text-[11px] text-granny font-light italic">
        Target actions reuse the standard moderation paths (soft-delete / deactivate). After
        acting, mark the report <span className="not-italic font-medium">Actioned</span>. All
        actions are logged to the admin audit trail.
      </p>
    </div>
  )
}

function SubmitForm({
  reportId,
  op,
  formAction,
  children,
}: {
  reportId: string
  op: string
  formAction: (formData: FormData) => void
  children: React.ReactNode
}) {
  return (
    <form action={formAction} className="contents">
      <input type="hidden" name="reportId" value={reportId} />
      <input type="hidden" name="op" value={op} />
      {children}
    </form>
  )
}

function ActionButton({
  intent,
  label,
  pendingLabel,
}: {
  intent: 'primary' | 'secondary' | 'danger'
  label: string
  pendingLabel: string
}) {
  const { pending } = useFormStatus()

  const styles: Record<typeof intent, string> = {
    primary: 'bg-firefly text-offwhite hover:bg-ink active:bg-ink',
    secondary:
      'bg-transparent text-firefly border border-firefly/30 hover:bg-firefly/5 hover:border-firefly active:bg-firefly/10',
    danger: 'bg-red-700 text-offwhite hover:bg-red-800 active:bg-red-800',
  }

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full sm:w-auto min-h-[48px] px-6 py-3 text-[11px] uppercase tracking-[0.22em] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles[intent]}`}
    >
      {pending ? pendingLabel : label}
    </button>
  )
}
