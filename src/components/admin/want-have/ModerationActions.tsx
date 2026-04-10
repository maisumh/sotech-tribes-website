'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import {
  moderateWantHave,
  type WantHaveActionState,
} from '@/app/admin/(protected)/want-have/actions'

const INITIAL_STATE: WantHaveActionState = { status: 'idle' }

export function ModerationActions({
  entryId,
  isDeleted,
  isClosed,
}: {
  entryId: number
  isDeleted: boolean
  isClosed: boolean
}) {
  const [state, formAction] = useActionState(moderateWantHave, INITIAL_STATE)

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
          {state.message ?? 'Updated.'}
        </div>
      )}

      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        {!isDeleted ? (
          <form action={formAction} className="contents">
            <input type="hidden" name="id" value={entryId} />
            <input type="hidden" name="op" value="soft_delete" />
            <ActionButton
              intent="danger"
              label="Soft delete"
              pendingLabel="Deleting…"
            />
          </form>
        ) : (
          <form action={formAction} className="contents">
            <input type="hidden" name="id" value={entryId} />
            <input type="hidden" name="op" value="restore" />
            <ActionButton
              intent="primary"
              label="Restore"
              pendingLabel="Restoring…"
            />
          </form>
        )}

        {!isClosed && !isDeleted && (
          <form action={formAction} className="contents">
            <input type="hidden" name="id" value={entryId} />
            <input type="hidden" name="op" value="close" />
            <ActionButton
              intent="secondary"
              label="Force close"
              pendingLabel="Closing…"
            />
          </form>
        )}
      </div>

      <p className="mt-5 pt-5 border-t border-granny/15 text-[11px] text-granny font-light italic">
        Soft delete hides the entry from the mobile app without removing it from
        the database. Actions are logged to the admin audit trail.
      </p>
    </div>
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
