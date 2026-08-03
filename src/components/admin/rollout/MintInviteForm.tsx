'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { mintInvite, type RolloutActionState } from '@/app/admin/(protected)/rollout/actions'

const INITIAL: RolloutActionState = { status: 'idle' }

/**
 * Mint an invite code.
 *
 * "Unlimited" is an explicit tick, never a default. `max_uses IS NULL` means
 * unlimited in the DB, so a blank field quietly defaulting to null is exactly
 * how a shared congregation code gets minted by accident — that ambiguity
 * already caused one bug before launch. Blank here means single-use.
 */
export function MintInviteForm() {
  const [state, formAction] = useActionState(mintInvite, INITIAL)
  const [unlimited, setUnlimited] = useState(false)

  return (
    <section className="border border-granny/20 bg-offwhite mb-10">
      <div className="px-5 sm:px-6 py-4 border-b border-granny/15">
        <h2 className="text-[11px] uppercase tracking-[0.22em] text-granny">Mint a code</h2>
      </div>
      <div className="px-5 sm:px-6 py-5">
        {state.status === 'error' && state.message && (
          <div role="alert" className="mb-4 border-l-2 border-red-700 bg-red-50 px-4 py-3 text-[12px] text-red-900 font-light">
            {state.message}
          </div>
        )}
        {state.status === 'success' && state.message && (
          <div role="status" className="mb-4 border-l-2 border-firefly bg-firefly/5 px-4 py-3 text-[12px] text-firefly font-light">
            {state.message}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              name="code"
              required
              placeholder="CODE (letters, numbers, hyphens)"
              className="flex-1 min-h-[48px] px-4 border border-granny/30 bg-offwhite text-[13px] font-light text-ink placeholder:text-granny/60 focus:border-firefly focus:outline-none uppercase"
            />
            <input
              name="label"
              placeholder="What it's for (optional)"
              className="flex-1 min-h-[48px] px-4 border border-granny/30 bg-offwhite text-[13px] font-light text-ink placeholder:text-granny/60 focus:border-firefly focus:outline-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <label className="flex-1">
              <span className="block text-[10px] uppercase tracking-[0.18em] text-granny mb-1.5">
                Max uses
              </span>
              <input
                name="maxUses"
                type="number"
                min={1}
                defaultValue={1}
                disabled={unlimited}
                className="w-full min-h-[48px] px-4 border border-granny/30 bg-offwhite text-[13px] font-light text-ink focus:border-firefly focus:outline-none disabled:opacity-40"
              />
            </label>
            <label className="flex-1">
              <span className="block text-[10px] uppercase tracking-[0.18em] text-granny mb-1.5">
                Expires in (days)
              </span>
              <input
                name="expiresInDays"
                type="number"
                min={1}
                max={365}
                placeholder="never"
                className="w-full min-h-[48px] px-4 border border-granny/30 bg-offwhite text-[13px] font-light text-ink placeholder:text-granny/60 focus:border-firefly focus:outline-none"
              />
            </label>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              name="unlimited"
              type="checkbox"
              checked={unlimited}
              onChange={(e) => setUnlimited(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[#103730]"
            />
            <span className="text-[12px] text-granny font-light">
              <strong className="font-medium text-ink">Unlimited uses</strong> — one shared code a
              whole community can redeem (a congregation, a school). It cannot be exhausted, so
              revoking is the only way to stop it. Leave unticked for a code that burns after the
              set number of uses.
            </span>
          </label>

          <Submit />
        </form>
      </div>
    </section>
  )
}

function Submit() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto min-h-[48px] px-6 py-3 text-[11px] uppercase tracking-[0.22em] font-medium bg-firefly text-offwhite hover:bg-ink active:bg-ink transition-colors disabled:opacity-50"
    >
      {pending ? 'Minting…' : 'Mint code'}
    </button>
  )
}
