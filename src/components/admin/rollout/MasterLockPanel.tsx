'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { setMasterLock, type RolloutActionState } from '@/app/admin/(protected)/rollout/actions'

const INITIAL: RolloutActionState = { status: 'idle' }

/**
 * The global `invite_only` master lock.
 *
 * Turning it OFF activates geography for the entire public fleet on both stores
 * at once — so it is gated behind typing UNLOCK (enforced again server-side, not
 * just here). Turning it back ON is the safe direction and is one click.
 */
export function MasterLockPanel({
  inviteOnly,
  geoGateEnabled,
  openAreas,
}: {
  inviteOnly: boolean
  geoGateEnabled: boolean
  openAreas: number
}) {
  const [state, formAction] = useActionState(setMasterLock, INITIAL)
  const [confirm, setConfirm] = useState('')

  return (
    <section className="border border-granny/20 bg-offwhite mb-10 lg:mb-14">
      <div className="px-5 sm:px-6 py-5 border-b border-granny/15">
        <h2 className="text-[11px] uppercase tracking-[0.22em] text-granny">Access</h2>
      </div>

      <div className="px-5 sm:px-6 py-5">
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

        <dl className="grid sm:grid-cols-2 gap-5 mb-6">
          <div>
            <dt className="text-[9px] uppercase tracking-[0.18em] text-granny mb-1.5">Master lock</dt>
            <dd className="flex items-center gap-2">
              <span
                aria-hidden
                className={`h-2 w-2 rounded-full ${inviteOnly ? 'bg-casablanca' : 'bg-firefly'}`}
              />
              <span className="text-[15px] font-light text-ink">
                {inviteOnly ? 'Invite-only' : 'Open'}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-[9px] uppercase tracking-[0.18em] text-granny mb-1.5">Geo gate</dt>
            <dd className="flex items-center gap-2">
              <span
                aria-hidden
                className={`h-2 w-2 rounded-full ${geoGateEnabled ? 'bg-firefly' : 'bg-granny/50'}`}
              />
              <span className="text-[15px] font-light text-ink">
                {geoGateEnabled ? 'Enabled' : 'Disabled — any ZIP admits'}
              </span>
            </dd>
          </div>
        </dl>

        {inviteOnly ? (
          <div className="border-t border-granny/15 pt-5">
            <p className="text-[12px] text-granny font-light mb-4 max-w-2xl">
              While the lock is on, the per-area ZIP gate is <strong className="font-medium">dormant</strong> —
              only invites, existing circle members and grandfathered users get in. Turning it off
              admits everyone in an <strong className="font-medium">open</strong> area, on both stores,
              immediately.{' '}
              {openAreas === 0 && (
                <span className="text-ink">
                  No areas are open right now, so turning it off would admit nobody until you open one.
                </span>
              )}
            </p>
            <form action={formAction} className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <input type="hidden" name="inviteOnly" value="off" />
              <input
                name="confirm"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value.toUpperCase())}
                placeholder="Type UNLOCK"
                aria-label="Type UNLOCK to confirm"
                className="min-h-[48px] px-4 border border-granny/30 bg-offwhite text-[13px] font-light text-ink placeholder:text-granny/60 focus:border-firefly focus:outline-none sm:w-48"
              />
              <SubmitButton
                intent="danger"
                label="Turn lock off"
                pendingLabel="Unlocking…"
                disabled={confirm !== 'UNLOCK'}
              />
            </form>
          </div>
        ) : (
          <div className="border-t border-granny/15 pt-5">
            <p className="text-[12px] text-granny font-light mb-4 max-w-2xl">
              Geography is live. Anyone signing up with a ZIP in an open area is admitted
              immediately. Turning the lock back on is safe and takes effect at once.
            </p>
            <form action={formAction}>
              <input type="hidden" name="inviteOnly" value="on" />
              <SubmitButton intent="primary" label="Turn lock on" pendingLabel="Locking…" />
            </form>
          </div>
        )}
      </div>
    </section>
  )
}

function SubmitButton({
  intent,
  label,
  pendingLabel,
  disabled,
}: {
  intent: 'primary' | 'danger'
  label: string
  pendingLabel: string
  disabled?: boolean
}) {
  const { pending } = useFormStatus()
  const styles: Record<typeof intent, string> = {
    primary: 'bg-firefly text-offwhite hover:bg-ink active:bg-ink',
    danger: 'bg-red-700 text-offwhite hover:bg-red-800 active:bg-red-800',
  }
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={`w-full sm:w-auto min-h-[48px] px-6 py-3 text-[11px] uppercase tracking-[0.22em] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${styles[intent]}`}
    >
      {pending ? pendingLabel : label}
    </button>
  )
}
