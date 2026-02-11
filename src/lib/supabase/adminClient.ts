import 'server-only';

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';
import { env } from '@/lib/env';

if (!env.supabaseServiceRoleKey) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY is not set. Admin operations will fail until provided.');
}

export const supabaseAdmin = createClient<Database>(env.supabaseUrl, env.supabaseServiceRoleKey ?? '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
