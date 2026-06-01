'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import {
  moderateProject,
  type ShowcaseActionState,
} from '@/app/admin/(protected)/showcase/actions'

const INITIAL_STATE: ShowcaseActionState = { status: 'idle' }

export function ShowcaseActions({
  projectId,
  isDeleted,
  isFeatured,
}: {
  projectId: string
  isDeleted: boolean
  isFeatured: boolean
}) {
  const [state, formAction] = useActionState(moderateProject, INITIAL_STATE)

  return (
    <div className="border border-granny/20 p-5 sm:p-6 bg-offwhite">
      {state.status === 'error' && state.message && (
        <div role="alert" className="mb-5 border-l-2 border-red-700 bg-red-50 px-4 py-3 text-[12px] text-red-900 font-light">
          {state.message}
        </div>
      )}
      {state.status === 'success' && (
        <div role="status" className="mb-5 border-l-2 border-firefly bg-firefly/5 px-4 py-3 text-[12px] text-firefly font-light">
          {state.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        {!isDeleted ? (
          <SubmitForm projectId={projectId} op="soft_delete" formAction={formAction}>
            <ActionButton intent="danger" label="Soft delete" pendingLabel="Deleting…" />
          </SubmitForm>
        ) : (
          <SubmitForm projectId={projectId} op="restore" formAction={formAction}>
            <ActionButton intent="primary" label="Restore" pendingLabel="Restoring…" />
          </SubmitForm>
        )}

        {!isDeleted &&
          (!isFeatured ? (
            <SubmitForm projectId={projectId} op="feature" formAction={formAction}>
              <ActionButton intent="secondary" label="Feature" pendingLabel="Featuring…" />
            </SubmitForm>
          ) : (
            <SubmitForm projectId={projectId} op="unfeature" formAction={formAction}>
              <ActionButton intent="secondary" label="Unfeature" pendingLabel="Updating…" />
            </SubmitForm>
          ))}
      </div>

      <p className="mt-5 pt-5 border-t border-granny/15 text-[11px] text-granny font-light italic">
        Soft delete hides this showcase piece from the mobile app without removing it. All actions
        are logged to the admin audit trail.
      </p>
    </div>
  )
}

function SubmitForm({
  projectId,
  op,
  formAction,
  children,
}: {
  projectId: string
  op: string
  formAction: (formData: FormData) => void
  children: React.ReactNode
}) {
  return (
    <form action={formAction} className="contents">
      <input type="hidden" name="id" value={projectId} />
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
