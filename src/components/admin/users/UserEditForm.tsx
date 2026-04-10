'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { updateUser, type UpdateUserState } from '@/app/admin/(protected)/users/actions'

const INITIAL_STATE: UpdateUserState = { status: 'idle' }

export function UserEditForm({
  userId,
  currentRole,
  currentIsActive,
}: {
  userId: string
  currentRole: 'admin' | 'user'
  currentIsActive: boolean
}) {
  const [state, formAction] = useActionState(updateUser, INITIAL_STATE)

  return (
    <form action={formAction} className="border border-granny/20 p-6 bg-offwhite">
      <input type="hidden" name="id" value={userId} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-6">
        {/* Role */}
        <div>
          <label
            htmlFor="role"
            className="block text-[10px] uppercase tracking-[0.22em] text-granny mb-2"
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            defaultValue={currentRole}
            className="w-full border-0 border-b border-granny/40 bg-transparent pb-2 text-[14px] font-light text-ink focus:outline-none focus:border-firefly appearance-none cursor-pointer"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* is_active */}
        <div>
          <div className="block text-[10px] uppercase tracking-[0.22em] text-granny mb-2">
            Account status
          </div>
          <label className="inline-flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              value="true"
              defaultChecked={currentIsActive}
              className="w-4 h-4 border-granny/40 text-firefly focus:ring-firefly cursor-pointer"
            />
            <span className="text-[14px] font-light text-ink">
              Active (user can sign in and use the app)
            </span>
          </label>
        </div>
      </div>

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
          {state.message ?? 'User updated.'}
        </div>
      )}

      <div className="flex items-center justify-end gap-4 pt-5 border-t border-granny/15">
        <p className="text-[11px] text-granny font-light italic mr-auto">
          Changes are logged to the admin audit trail.
        </p>
        <SubmitButton />
      </div>
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-firefly text-offwhite px-6 py-3 text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Saving…' : 'Save changes'}
    </button>
  )
}
