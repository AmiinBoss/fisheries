import { createSupabaseServerClient } from '@/lib/supabase/serverClient';

export async function listLocations() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('locations')
    .select('id,name,created_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch locations: ${error.message}`);
  }

  return data;
}

export async function createLocation(input: { name: string; lat: number; lon: number }) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User must be signed in.');
  }

  const pointWkt = `SRID=4326;POINT(${input.lon} ${input.lat})`;

  const { error } = await supabase.from('locations').insert({
    owner_user_id: user.id,
    name: input.name,
    geom: pointWkt
  });

  if (error) {
    throw new Error(`Failed to create location: ${error.message}`);
  }
}

export async function deleteLocation(id: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from('locations').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete location: ${error.message}`);
  }
}
