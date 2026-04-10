'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import {
  moderateChatRoom,
  type ChatActionState,
} from '@/app/admin/(protected)/chat/actions'

const INITIAL_STATE: ChatActionState = { status: 'idle' }

export function ChatRoomActions({
  roomId,
  isBlocked,
  isReported,
}: {
  roomId: string
  isBlocked: boolean
  isReported: boolean
}) {
  const [state, formAction] = useActionState(moderateChatRoom, INITIAL_STATE)

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

      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        {!isBlocked ? (
          <form action={formAction} className="contents">
            <input type="hidden" name="roomId" value={roomId} />
            <input type="hidden" name="op" value="block" />
            <ActionButton
              intent="danger"
              label="Block room"
              pendingLabel="Blocking…"
            />
          </form>
        ) : (
          <form action={formAction} className="contents">
            <input type="hidden" name="roomId" value={roomId} />
            <input type="hidden" name="op" value="unblock" />
            <ActionButton
              intent="primary"
              label="Unblock room"
              pendingLabel="Unblocking…"
            />
          </form>
        )}

        {isReported && (
          <form action={formAction} className="contents">
            <input type="hidden" name="roomId" value={roomId} />
            <input type="hidden" name="op" value="clear_report" />
            <ActionButton
              intent="secondary"
              label="Clear report"
              pendingLabel="Clearing…"
            />
          </form>
        )}
      </div>

      <p className="mt-5 pt-5 border-t border-granny/15 text-[11px] text-granny font-light italic">
        Blocking prevents both participants from exchanging new messages. All
        actions are logged to the admin audit trail.
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
