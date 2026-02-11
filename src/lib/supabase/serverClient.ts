import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database.types';
import { env } from '@/lib/env';

export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: Record<string, unknown>) {
        try {
          cookieStore.set({ name, value, ...(options as Parameters<typeof cookieStore.set>[0]) });
        } catch {
          // Called from Server Component where cookies cannot be mutated.
        }
      },
      remove(name: string, options: Record<string, unknown>) {
        try {
          cookieStore.set({ name, value: '', ...(options as Parameters<typeof cookieStore.set>[0]) });
        } catch {
          // Called from Server Component where cookies cannot be mutated.
        }
      }
    }
  });
}
