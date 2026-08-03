'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { setInviteRevoked, type RolloutActionState } from '@/app/admin/(protected)/rollout/actions'

const INITIAL: RolloutActionState = { status: 'idle' }

/**
 * Revoke / restore a code. Revoking stops future redemptions only — anyone the
 * code already admitted keeps their admission, because admission is monotonic
 * server-side. That's why this needs no confirmation step: it isn't destructive
 * and it's reversible in one click.
 */
export function InviteRevokeButton({ code, revoked }: { code: string; revoked: boolean }) {
  const [state, formAction] = useActionState(setInviteRevoked, INITIAL)

  return (
    <form action={formAction} className="shrink-0">
      <input type="hidden" name="code" value={code} />
      <input type="hidden" name="op" value={revoked ? 'restore' : 'revoke'} />
      <Button revoked={revoked} />
      {state.status === 'error' && state.message && (
        <span role="alert" className="ml-2 text-[11px] text-red-800 font-light">
          {state.message}
        </span>
      )}
    </form>
  )
}

function Button({ revoked }: { revoked: boolean }) {
  const { pending } = useFormStatus()
  const styles = revoked
    ? 'text-firefly border-firefly/30 hover:bg-firefly/5 hover:border-firefly'
    : 'text-red-800 border-red-800/30 hover:bg-red-50 hover:border-red-800'
  return (
    <button
      type="submit"
      disabled={pending}
      className={`min-h-[40px] px-4 py-2 text-[10px] uppercase tracking-[0.18em] font-medium bg-transparent border transition-colors disabled:opacity-50 whitespace-nowrap ${styles}`}
    >
      {pending ? '…' : revoked ? 'Restore' : 'Revoke'}
    </button>
  )
}
