// ⚠️ SERVER-ONLY. DO NOT IMPORT FROM A CLIENT COMPONENT.
// This client uses the Supabase service role key, which BYPASSES Row Level Security.
// Only ever use this after requireAdmin() has verified the caller is an admin.

import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
