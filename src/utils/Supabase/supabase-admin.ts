import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * Return a Supabase admin client created with server-only env vars.
 * This is lazy (created at request time) so importing this module during
 * Next.js build won't throw if server env vars are missing.
 */
export function getSupabaseAdmin(): SupabaseClient {
  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in server environment')
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
}
