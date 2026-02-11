import { createSupabaseServerClient } from '@/lib/supabase/serverClient';

export async function getCurrentUser() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(`Failed to load authenticated user: ${error.message}`);
  }

  return data.user;
}
