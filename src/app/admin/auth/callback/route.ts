import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// OAuth callback for the admin Google sign-in (see login/actions.ts → signInWithGoogle).
// Google redirects here with a `code`; we exchange it for a session, then enforce the
// same role gate as requireAdmin(): a non-admin Google account is sent to
// /admin/no-access (its session is kept so that page can show their email + a sign-out).
// force-dynamic because it depends on per-request query + cookies.
//
// We deliberately redirect admins to a FIXED `/admin` and accept no `next`/return-path
// query param: (a) it would be an open-redirect vector, and (b) signInWithGoogle can't
// carry one anyway — Supabase rejects a redirectTo that has ANY query string (the
// allow-list match fails and it falls back to the mobile `tribes://` Site URL, which a
// desktop browser can't open → a frozen tab). See docs/admin-architecture.md.
export const dynamic = 'force-dynamic'

function redirectTo(base: string, path: string) {
  return NextResponse.redirect(`${base}${path}`)
}

function redirectError(base: string, message: string) {
  return redirectTo(base, `/admin/login?error=${encodeURIComponent(message)}`)
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)

  // Behind Vercel's proxy request.url's origin can be the internal host; prefer the
  // forwarded host in production so redirects land on the real domain. Vercel sets
  // x-forwarded-host at the edge, so it is not attacker-controlled on this deployment.
  const forwardedHost = request.headers.get('x-forwarded-host')
  const isLocal = process.env.NODE_ENV === 'development'
  const base = !isLocal && forwardedHost ? `https://${forwardedHost}` : origin

  const code = searchParams.get('code')
  const oauthError = searchParams.get('error_description') ?? searchParams.get('error')

  if (oauthError) {
    return redirectError(base, oauthError)
  }

  if (!code) {
    return redirectError(base, 'Sign-in was cancelled or returned no code.')
  }

  try {
    const supabase = await createClient()

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (exchangeError) {
      return redirectError(base, exchangeError.message)
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return redirectError(base, 'Could not establish a session. Please try again.')
    }

    // Self-read of the caller's own row (permitted by RLS). `.single()` returns an
    // error (not a throw) for a missing/zero row, leaving `profile` null → the
    // `!== 'admin'` branch denies access. This fails CLOSED by design.
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      // Valid Google account, but not staff. Keep the session so /admin/no-access can
      // render (it shows their email + a sign-out) — same friendly dead-end the
      // email/password path hits via requireAdmin(). No silent bounce to the homepage.
      return redirectTo(base, '/admin/no-access')
    }

    return redirectTo(base, '/admin')
  } catch {
    // exchangeCodeForSession / getUser can throw (network, malformed response) rather
    // than return { error }. Never 500 the user — send them back to the login page.
    return redirectError(base, 'Sign-in failed. Please try again.')
  }
}
