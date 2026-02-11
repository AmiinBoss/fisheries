import { createSupabaseServerClient } from '@/lib/supabase/serverClient';

export async function getProfile() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }

  return data;
}

export async function upsertProfile(input: { name: string }) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User must be signed in.');
  }

  const { error } = await supabase.from('profiles').upsert({ user_id: user.id, name: input.name });

  if (error) {
    throw new Error(`Failed to upsert profile: ${error.message}`);
  }
}
