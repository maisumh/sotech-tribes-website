import type { Metadata } from 'next'
import { signIn, signInWithGoogle } from './actions'
import { TribesLogo } from '@/components/admin/brand/TribesLogo'

export const metadata: Metadata = {
  title: 'Sign in — Tribes Admin',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const resolved = await searchParams
  const error = resolved.error ? decodeURIComponent(resolved.error) : null

  return (
    <div className="min-h-screen bg-firefly text-offwhite lg:grid lg:grid-cols-2">
      {/* Left: brand panel — desktop only */}
      <div className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden">
        {/* Blurred casablanca glow — decorative atmosphere */}
        <div
          aria-hidden
          className="absolute -top-20 -right-40 w-[560px] h-[560px] rounded-full bg-casablanca/20 blur-[140px] pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute top-1/2 -left-40 w-[400px] h-[400px] rounded-full bg-firefly-light/40 blur-[120px] pointer-events-none"
        />

        {/* Brand mark */}
        <div className="relative flex items-center gap-4">
          <TribesLogo className="w-14 h-14 -ml-2 text-offwhite shrink-0" />
          <div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-casablanca">
              Admin
            </div>
            <div className="mt-0.5 text-[13px] font-light text-offwhite/60 leading-none">
              Tribes community panel
            </div>
          </div>
        </div>

        {/* Headline */}
        <div className="relative">
          <div className="text-5xl xl:text-6xl font-extralight leading-[1.05] max-w-lg">
            Tend to the community.
          </div>
          <p className="mt-8 max-w-sm text-[14px] leading-[1.7] text-offwhite/60 font-light">
            Review members, moderate wants &amp; haves, and keep the neighborhood
            flowing. Access is restricted to staff.
          </p>
        </div>

        {/* Metadata strip */}
        <div className="relative flex items-center gap-4 text-[10px] uppercase tracking-[0.22em] text-offwhite/35">
          <span aria-hidden className="block h-px w-10 bg-offwhite/20" />
          <span>Restricted</span>
          <span aria-hidden className="text-offwhite/20">·</span>
          <span>Staff only</span>
        </div>
      </div>

      {/* Right: form panel */}
      <div className="flex items-center justify-center min-h-screen lg:min-h-0 px-6 py-12 sm:px-10 lg:p-16 bg-offwhite text-ink pt-[max(3rem,env(safe-area-inset-top))] pb-[max(3rem,env(safe-area-inset-bottom))]">
        <div className="w-full max-w-[380px]">
          {/* Mobile brand mark — hidden on desktop (already in left panel) */}
          <div className="lg:hidden mb-10 flex flex-col items-center relative">
            {/* Subtle casablanca accent behind the mark */}
            <div
              aria-hidden
              className="absolute left-1/2 -top-6 w-40 h-40 -translate-x-1/2 rounded-full bg-casablanca/15 blur-3xl pointer-events-none"
            />
            <div className="relative flex flex-col items-center">
              <TribesLogo className="w-16 h-16 text-firefly" />
              <div className="mt-3 text-[9px] uppercase tracking-[0.24em] text-granny">
                Admin
              </div>
            </div>
          </div>

          <div className="mb-10">
            <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-3">
              Sign in
            </div>
            <h1 className="text-[28px] lg:text-[32px] font-extralight leading-tight text-ink">
              Welcome back.
            </h1>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-8 border-l-2 border-red-700 bg-red-50 px-4 py-3 text-[13px] text-red-900 font-light"
            >
              {error}
            </div>
          )}

          {/* Google SSO — for admins who sign in with their Google account
              (no password). The callback enforces the admin-role gate. */}
          <form action={signInWithGoogle}>
            <button
              type="submit"
              className="admin-press w-full min-h-[52px] flex items-center justify-center gap-3 border border-granny/40 bg-white py-[15px] text-[13px] font-light text-ink hover:border-firefly hover:bg-granny/5 transition-colors duration-200"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="w-[18px] h-[18px] shrink-0">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <span aria-hidden className="block h-px flex-1 bg-granny/30" />
            <span className="text-[10px] uppercase tracking-[0.22em] text-granny/60">or</span>
            <span aria-hidden className="block h-px flex-1 bg-granny/30" />
          </div>

          <form action={signIn} className="space-y-8">
            <div>
              <label
                htmlFor="email"
                className="block text-[10px] uppercase tracking-[0.22em] text-granny mb-3"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                autoCapitalize="none"
                spellCheck={false}
                className="w-full min-h-[48px] border-0 border-b border-granny/40 bg-transparent pb-3 text-[16px] lg:text-[15px] font-light text-ink placeholder:text-granny/50 focus:outline-none focus:border-firefly transition-colors duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[10px] uppercase tracking-[0.22em] text-granny mb-3"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full min-h-[48px] border-0 border-b border-granny/40 bg-transparent pb-3 text-[16px] lg:text-[15px] font-light text-ink placeholder:text-granny/50 focus:outline-none focus:border-firefly transition-colors duration-200"
              />
            </div>

            <button
              type="submit"
              className="admin-press w-full min-h-[52px] bg-firefly text-offwhite py-[15px] text-[11px] uppercase tracking-[0.24em] font-medium hover:bg-ink active:bg-ink duration-200 mt-10"
            >
              Sign in
            </button>
          </form>

          <div className="mt-10 text-center text-[10px] uppercase tracking-[0.22em] text-granny/60">
            Protected area
          </div>
        </div>
      </div>
    </div>
  )
}
