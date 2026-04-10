'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import {
  deleteChatMessage,
  type ChatActionState,
} from '@/app/admin/(protected)/chat/actions'

const INITIAL_STATE: ChatActionState = { status: 'idle' }

/**
 * Inline two-step delete for a single chat message.
 * First click: shows "Confirm" / "Cancel"
 * Second click: submits the form and deletes the message.
 *
 * On successful delete, revalidatePath in the Server Action re-renders the
 * parent message list, unmounting this specific button — so local state
 * cleanup happens naturally.
 */
export function DeleteMessageButton({
  messageId,
  roomId,
}: {
  messageId: string
  roomId: string
}) {
  const [confirming, setConfirming] = useState(false)
  const [, formAction] = useActionState(deleteChatMessage, INITIAL_STATE)

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label="Delete message"
        className="w-8 h-8 inline-flex items-center justify-center text-granny/60 hover:text-red-700 active:text-red-700 transition-colors"
      >
        <TrashIcon />
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <form action={formAction} className="contents">
        <input type="hidden" name="messageId" value={messageId} />
        <input type="hidden" name="roomId" value={roomId} />
        <ConfirmButton />
      </form>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="min-h-[32px] px-2 text-[10px] uppercase tracking-[0.15em] text-granny hover:text-ink transition-colors"
      >
        Cancel
      </button>
    </div>
  )
}

function ConfirmButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-[32px] px-3 bg-red-700 text-offwhite text-[10px] uppercase tracking-[0.15em] font-medium hover:bg-red-800 active:bg-red-800 transition-colors disabled:opacity-50"
    >
      {pending ? 'Deleting…' : 'Confirm'}
    </button>
  )
}

function TrashIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="square"
      aria-hidden
    >
      <polyline points="2.5 4 11.5 4" />
      <line x1="5.5" y1="4" x2="5.5" y2="2" />
      <line x1="8.5" y1="4" x2="8.5" y2="2" />
      <rect x="3.5" y="4" width="7" height="8" />
    </svg>
  )
}
