'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/serverClient';
import { createLocation, deleteLocation } from '@/lib/data/locations';
import { upsertProfile } from '@/lib/data/profile';

export async function signOutAction() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function upsertProfileAction(formData: FormData) {
  const name = String(formData.get('name') ?? '');
  await upsertProfile({ name });
  revalidatePath('/account');
}

export async function createLocationAction(formData: FormData) {
  const name = String(formData.get('name') ?? '');
  const lat = Number(formData.get('lat'));
  const lon = Number(formData.get('lon'));

  await createLocation({ name, lat, lon });
  revalidatePath('/account');
}

export async function deleteLocationAction(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  await deleteLocation(id);
  revalidatePath('/account');
}
