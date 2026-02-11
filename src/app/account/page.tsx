import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/data/user';
import { listLocations } from '@/lib/data/locations';
import { getProfile } from '@/lib/data/profile';
import {
  createLocationAction,
  deleteLocationAction,
  signOutAction,
  upsertProfileAction
} from './actions';

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const [profile, locations] = await Promise.all([getProfile(), listLocations()]);

  return (
    <div>
      <section className="card">
        <h1>Account</h1>
        <p><strong>User ID:</strong> {user.id}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <form action={signOutAction}>
          <button type="submit">Sign out</button>
        </form>
      </section>

      <section className="card">
        <h2>Profile</h2>
        <form action={upsertProfileAction}>
          <label>
            Display name
            <input name="name" defaultValue={profile?.name ?? ''} placeholder="Your name" />
          </label>
          <button type="submit">Save profile</button>
        </form>
      </section>

      <section className="card">
        <h2>Locations</h2>
        <form action={createLocationAction}>
          <label>
            Name
            <input name="name" required />
          </label>
          <label>
            Latitude
            <input name="lat" type="number" step="0.000001" required />
          </label>
          <label>
            Longitude
            <input name="lon" type="number" step="0.000001" required />
          </label>
          <button type="submit">Add location</button>
        </form>

        {locations.length === 0 ? (
          <p>No locations yet.</p>
        ) : (
          <ul>
            {locations.map((location) => (
              <li key={location.id} className="inline">
                <span>{location.name}</span>
                <small>{new Date(location.created_at).toLocaleString()}</small>
                <form action={deleteLocationAction}>
                  <input type="hidden" name="id" value={location.id} />
                  <button type="submit">Delete</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
