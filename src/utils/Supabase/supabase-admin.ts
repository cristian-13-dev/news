import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL ?? ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  // Keep this file importable during dev even if env vars are missing.
  // Runtime calls will fail if env vars are not set.
  // eslint-disable-next-line no-console
  console.warn('Supabase admin client created without SUPABASE_URL or SERVICE_ROLE_KEY')
}

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
