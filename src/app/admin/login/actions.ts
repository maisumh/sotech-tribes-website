'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Start the Google OAuth (authorization-code / PKCE) flow. Supabase stores the
// PKCE verifier in a cookie here, then redirects the browser to Google. Google
// returns to /admin/auth/callback, which exchanges the code for a session and
// enforces the admin-role gate. The origin is derived from the request so this
// works on localhost, Vercel previews, and production (trytribes.com) without a
// hardcoded URL — every origin used must be in Supabase's Redirect URL allow-list.
export async function signInWithGoogle(): Promise<void> {
  const supabase = await createClient()
  const hdrs = await headers()
  const origin = hdrs.get('origin') ?? `https://${hdrs.get('host')}`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // NO query string here. Supabase matches redirect_to against the
      // Redirect URL allow-list, and an entry without a wildcard ('.../callback')
      // does NOT match '.../callback?next=/admin' — so a query string makes the
      // match fail and Supabase falls back to the project Site URL (which on this
      // shared project is the mobile scheme `tribes://`, an unopenable URL on
      // desktop → frozen tab). The callback already defaults `next` to '/admin'.
      redirectTo: `${origin}/admin/auth/callback`,
      queryParams: { prompt: 'select_account' },
    },
  })

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`)
  }

  if (data?.url) {
    redirect(data.url)
  }
}

export async function signIn(formData: FormData): Promise<void> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    redirect('/admin/login?error=Email%20and%20password%20required')
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/admin')
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
