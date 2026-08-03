'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { grantAdmission, type RolloutActionState } from '@/app/admin/(protected)/rollout/actions'

const INITIAL: RolloutActionState = { status: 'idle' }

/**
 * Admit one person manually, from the leads list.
 *
 * Server-side this is monotonic — it can only ever improve someone's standing,
 * never demote them — so there is no undo to build and no confirm step.
 */
export function GrantAdmissionButton({ userId }: { userId: string }) {
  const [state, formAction] = useActionState(grantAdmission, INITIAL)

  if (state.status === 'success') {
    return (
      <span
        role="status"
        className="shrink-0 text-[10px] uppercase tracking-[0.18em] text-firefly whitespace-nowrap"
      >
        Admitted
      </span>
    )
  }

  return (
    <form action={formAction} className="shrink-0">
      <input type="hidden" name="userId" value={userId} />
      <Button />
      {state.status === 'error' && state.message && (
        <span role="alert" className="ml-2 text-[11px] text-red-800 font-light">
          {state.message}
        </span>
      )}
    </form>
  )
}

function Button() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-[40px] px-4 py-2 text-[10px] uppercase tracking-[0.18em] font-medium bg-transparent text-firefly border border-firefly/30 hover:bg-firefly/5 hover:border-firefly active:bg-firefly/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
    >
      {pending ? 'Admitting…' : 'Admit'}
    </button>
  )
}
