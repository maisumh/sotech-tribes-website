import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '../login/actions'
import { TribesLogo } from '@/components/admin/brand/TribesLogo'

export const metadata: Metadata = {
  title: 'No access — Tribes Admin',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

// Shown when an authenticated, non-admin user reaches an admin route. They have a
// valid Tribes session but no staff role — so we explain that plainly and give them
// a way out (sign out), instead of redirecting them to the marketing homepage.
// This route lives OUTSIDE the (protected) group, so it never calls requireAdmin()
// and can't loop.
export default async function NoAccessPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-firefly text-offwhite flex items-center justify-center px-6 py-12 pt-[max(3rem,env(safe-area-inset-top))] pb-[max(3rem,env(safe-area-inset-bottom))]">
      {/* Decorative atmosphere */}
      <div
        aria-hidden
        className="absolute -top-20 -right-40 w-[560px] h-[560px] rounded-full bg-casablanca/15 blur-[140px] pointer-events-none"
      />

      <div className="relative w-full max-w-[420px] text-center">
        <div className="flex flex-col items-center">
          <TribesLogo className="w-14 h-14 text-offwhite" />
          <div className="mt-3 text-[9px] uppercase tracking-[0.24em] text-casablanca">
            Admin
          </div>
        </div>

        <div className="mt-12">
          <div className="text-[10px] uppercase tracking-[0.22em] text-offwhite/40 mb-4">
            Access restricted
          </div>
          <h1 className="text-[28px] lg:text-[32px] font-extralight leading-tight">
            You don&rsquo;t have access to this resource.
          </h1>
          <p className="mt-6 text-[14px] leading-[1.7] text-offwhite/60 font-light">
            This area is for Tribes staff only.
            {user?.email ? (
              <>
                {' '}
                You&rsquo;re signed in as{' '}
                <span className="text-offwhite/90">{user.email}</span>.
              </>
            ) : null}{' '}
            If you believe you should have access, contact{' '}
            <a
              href="mailto:info@trytribes.com"
              className="text-casablanca underline-offset-4 hover:underline"
            >
              info@trytribes.com
            </a>
            .
          </p>
        </div>

        <form action={signOut} className="mt-12">
          <button
            type="submit"
            className="admin-press min-h-[52px] w-full border border-offwhite/25 bg-transparent py-[15px] text-[11px] uppercase tracking-[0.24em] font-medium text-offwhite hover:bg-offwhite hover:text-firefly transition-colors duration-200"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}
