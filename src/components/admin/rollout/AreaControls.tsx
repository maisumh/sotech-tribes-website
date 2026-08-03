'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import {
  admitArea,
  assignAreaZips,
  setAreaStatus,
  type RolloutActionState,
} from '@/app/admin/(protected)/rollout/actions'

const INITIAL: RolloutActionState = { status: 'idle' }

/**
 * The three operator controls for one area, in the order you actually use them:
 * map ZIPs → set status → admit the people waiting.
 *
 * Mirrors `ReportActions` in grouping several related mutations into one panel.
 * Each form drives its own action state so one failure doesn't clear the others.
 */
export function AreaControls({
  areaId,
  areaName,
  status,
  waitlisted,
  zipCount,
}: {
  areaId: string
  areaName: string
  status: 'open' | 'waitlist' | 'closed'
  waitlisted: number
  zipCount: number
}) {
  const [statusState, statusAction] = useActionState(setAreaStatus, INITIAL)
  const [zipState, zipAction] = useActionState(assignAreaZips, INITIAL)
  const [admitState, admitAction] = useActionState(admitArea, INITIAL)

  const [limit, setLimit] = useState('50')
  const [notify, setNotify] = useState(false)

  return (
    <div className="space-y-8">
      {/* 1. ZIPs */}
      <Panel
        title="ZIP codes"
        note={
          zipCount === 0
            ? 'This area has no ZIPs mapped, so it can never admit anyone by geography. Paste them below.'
            : 'Re-assigning a ZIP moves it from whatever area currently owns it. Existing waitlist rows in these ZIPs are re-attributed to this area automatically.'
        }
        state={zipState}
      >
        <form action={zipAction} className="space-y-3">
          <input type="hidden" name="areaId" value={areaId} />
          <textarea
            name="zips"
            rows={3}
            required
            placeholder="77531, 77541, 77566 — commas, spaces or newlines all fine"
            className="w-full px-4 py-3 border border-granny/30 bg-offwhite text-[13px] font-light text-ink placeholder:text-granny/60 focus:border-firefly focus:outline-none"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              name="city"
              placeholder="City (optional)"
              className="flex-1 min-h-[48px] px-4 border border-granny/30 bg-offwhite text-[13px] font-light text-ink placeholder:text-granny/60 focus:border-firefly focus:outline-none"
            />
            <input
              name="state"
              maxLength={2}
              placeholder="TX"
              className="sm:w-24 min-h-[48px] px-4 border border-granny/30 bg-offwhite text-[13px] font-light text-ink placeholder:text-granny/60 focus:border-firefly focus:outline-none uppercase"
            />
            <Submit intent="secondary" label="Map ZIPs" pendingLabel="Mapping…" />
          </div>
        </form>
      </Panel>

      {/* 2. Status */}
      <Panel
        title="Status"
        note="Changing status is silent — it admits and notifies nobody. Opening an area is deliberately two steps; step two is below."
        state={statusState}
      >
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          {(['open', 'waitlist', 'closed'] as const).map((s) => (
            <form key={s} action={statusAction} className="contents">
              <input type="hidden" name="areaId" value={areaId} />
              <input type="hidden" name="status" value={s} />
              <Submit
                intent={s === 'open' ? 'primary' : 'secondary'}
                label={s === status ? `Currently ${s}` : `Set ${s}`}
                pendingLabel="Saving…"
                disabled={s === status}
              />
            </form>
          ))}
        </div>
      </Panel>

      {/* 3. Admit */}
      <Panel
        title="Admit waiting users"
        note={`Promotes the longest-waiting users in ${areaName} to admitted, oldest first. ${waitlisted} waiting right now.`}
        state={admitState}
      >
        <form action={admitAction} className="space-y-4">
          <input type="hidden" name="areaId" value={areaId} />
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <label className="text-[11px] uppercase tracking-[0.18em] text-granny sm:w-24">
              Batch size
            </label>
            <input
              name="limit"
              type="number"
              min={1}
              max={2000}
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="sm:w-32 min-h-[48px] px-4 border border-granny/30 bg-offwhite text-[13px] font-light text-ink focus:border-firefly focus:outline-none"
            />
            <Submit
              intent="primary"
              label="Admit batch"
              pendingLabel="Admitting…"
              disabled={waitlisted === 0}
            />
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              name="notify"
              type="checkbox"
              checked={notify}
              onChange={(e) => setNotify(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[#103730]"
            />
            <span className="text-[12px] text-granny font-light">
              Send an in-app &ldquo;your area is open&rdquo; notification to each admitted user.
              They have no push token (push is never requested on the lobby), so this lands in their
              in-app feed rather than as a lock-screen push.
            </span>
          </label>

          <p className="text-[11px] text-granny/80 font-light italic">
            Start small. Every notification insert fires the push webhook.
          </p>
        </form>

        {/* The trap: web leads are marked notified but nothing sends them mail. */}
        {admitState.webLeadEmails && admitState.webLeadEmails.length > 0 && (
          <div className="mt-5 border-l-2 border-casablanca bg-casablanca/5 px-4 py-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-ink mb-2">
              Email these {admitState.webLeadEmails.length} web leads
            </div>
            <p className="text-[12px] text-granny font-light mb-3">
              These are account-less signups from the website. They have just been marked
              &ldquo;notified&rdquo; in the database but <strong className="font-medium">nothing was sent</strong> —
              they will never show as waiting again, so copy this list now.
            </p>
            <textarea
              readOnly
              rows={4}
              value={admitState.webLeadEmails.join(', ')}
              onFocus={(e) => e.currentTarget.select()}
              className="w-full px-3 py-2 border border-granny/30 bg-offwhite text-[12px] font-mono text-ink"
            />
          </div>
        )}
      </Panel>
    </div>
  )
}

function Panel({
  title,
  note,
  state,
  children,
}: {
  title: string
  note: string
  state: RolloutActionState
  children: React.ReactNode
}) {
  return (
    <section className="border border-granny/20 bg-offwhite">
      <div className="px-5 sm:px-6 py-4 border-b border-granny/15">
        <h3 className="text-[11px] uppercase tracking-[0.22em] text-granny">{title}</h3>
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
        {state.status === 'idle' && state.message && (
          <div className="mb-4 text-[12px] text-granny font-light italic">{state.message}</div>
        )}
        <p className="text-[12px] text-granny font-light mb-4 max-w-2xl">{note}</p>
        {children}
      </div>
    </section>
  )
}

function Submit({
  intent,
  label,
  pendingLabel,
  disabled,
}: {
  intent: 'primary' | 'secondary'
  label: string
  pendingLabel: string
  disabled?: boolean
}) {
  const { pending } = useFormStatus()
  const styles: Record<typeof intent, string> = {
    primary: 'bg-firefly text-offwhite hover:bg-ink active:bg-ink',
    secondary:
      'bg-transparent text-firefly border border-firefly/30 hover:bg-firefly/5 hover:border-firefly active:bg-firefly/10',
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
