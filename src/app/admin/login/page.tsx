import type { Metadata } from 'next'
import { signIn } from './actions'

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
  const params = await searchParams
  const error = params.error ? decodeURIComponent(params.error) : null

  return (
    <div className="min-h-screen bg-firefly text-offwhite lg:grid lg:grid-cols-2">
      {/* Left: brand panel (desktop only) */}
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

        {/* Top: brand mark */}
        <div className="relative">
          <div className="text-[10px] uppercase tracking-[0.24em] text-casablanca">
            Tribes
          </div>
          <div className="mt-1 text-3xl font-extralight leading-none">
            Admin
          </div>
        </div>

        {/* Middle: aspirational headline */}
        <div className="relative">
          <div className="text-5xl xl:text-6xl font-extralight leading-[1.05] max-w-lg">
            Tend to the community.
          </div>
          <p className="mt-8 max-w-sm text-[14px] leading-[1.7] text-offwhite/60 font-light">
            Review members, moderate wants &amp; haves, and keep the neighborhood
            flowing. Access is restricted to staff.
          </p>
        </div>

        {/* Bottom: metadata strip */}
        <div className="relative flex items-center gap-4 text-[10px] uppercase tracking-[0.22em] text-offwhite/35">
          <span className="block h-px w-10 bg-offwhite/20" />
          <span>Restricted</span>
          <span className="text-offwhite/20">·</span>
          <span>Staff only</span>
        </div>
      </div>

      {/* Right: form panel */}
      <div className="flex items-center justify-center min-h-screen lg:min-h-0 p-8 lg:p-16 bg-offwhite text-ink">
        <div className="w-full max-w-[360px]">
          {/* Mobile brand mark */}
          <div className="lg:hidden mb-12 text-center">
            <div className="text-[10px] uppercase tracking-[0.24em] text-granny">
              Tribes
            </div>
            <div className="mt-1 text-3xl font-extralight text-firefly">
              Admin
            </div>
          </div>

          <div className="mb-12">
            <div className="text-[10px] uppercase tracking-[0.22em] text-granny mb-3">
              Sign in
            </div>
            <h1 className="text-[32px] font-extralight leading-tight text-ink">
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
                className="w-full border-0 border-b border-granny/40 bg-transparent pb-3 text-[15px] font-light text-ink placeholder:text-granny/50 focus:outline-none focus:border-firefly transition-colors duration-200"
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
                className="w-full border-0 border-b border-granny/40 bg-transparent pb-3 text-[15px] font-light text-ink placeholder:text-granny/50 focus:outline-none focus:border-firefly transition-colors duration-200"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-firefly text-offwhite py-[14px] text-[11px] uppercase tracking-[0.24em] font-medium hover:bg-ink transition-colors duration-200 mt-12"
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
