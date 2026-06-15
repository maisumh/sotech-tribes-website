import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// OAuth callback for the admin Google sign-in (see login/actions.ts → signInWithGoogle).
// Google redirects here with a `code`; we exchange it for a session, then enforce
// the same role gate as requireAdmin(): a real Google account that is NOT an admin
// must not keep a session — we sign it back out and bounce to the login page with a
// clear message. force-dynamic because it depends on per-request query + cookies.
export const dynamic = 'force-dynamic'

function redirectError(base: string, message: string) {
  return NextResponse.redirect(`${base}/admin/login?error=${encodeURIComponent(message)}`)
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)

  // Behind Vercel's proxy request.url's origin can be the internal host; prefer the
  // forwarded host in production so redirects land on the real domain.
  const forwardedHost = request.headers.get('x-forwarded-host')
  const isLocal = process.env.NODE_ENV === 'development'
  const base = !isLocal && forwardedHost ? `https://${forwardedHost}` : origin

  const code = searchParams.get('code')
  const oauthError = searchParams.get('error_description') ?? searchParams.get('error')
  const nextParam = searchParams.get('next') ?? '/admin'
  // Only allow internal redirects.
  const next = nextParam.startsWith('/') ? nextParam : '/admin'

  if (oauthError) {
    return redirectError(base, oauthError)
  }

  if (!code) {
    return redirectError(base, 'Sign-in was cancelled or returned no code.')
  }

  const supabase = await createClient()

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
  if (exchangeError) {
    return redirectError(base, exchangeError.message)
  }

  // Enforce the admin gate before letting the session stand.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirectError(base, 'Could not establish a session. Please try again.')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    // Valid Google account, but not staff. Keep the session so /admin/no-access can
    // render (it shows their email + a sign-out) — same friendly dead-end the
    // email/password path hits via requireAdmin(). No silent bounce to the homepage.
    return NextResponse.redirect(`${base}/admin/no-access`)
  }

  return NextResponse.redirect(`${base}${next}`)
}
