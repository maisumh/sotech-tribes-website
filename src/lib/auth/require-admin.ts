import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Three-layer defense for admin routes:
//   1. src/middleware.ts redirects unauthenticated /admin/* requests
//   2. Every admin page/Server Action calls requireAdmin() (this function)
//   3. Only after requireAdmin() passes does code use createAdminClient() (service role)
//
// This function uses the regular server client (anon key, respects RLS) to
// read the user's role from public.users. The "Enable users to view their own
// data only" RLS policy on public.users permits the self-read.
export async function requireAdmin() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  return user
}
