import Link from 'next/link';
import { loginAction } from './actions';

export default function LoginPage({ searchParams }: { searchParams: { error?: string; message?: string } }) {
  return (
    <section className="card">
      <h1>Login</h1>
      {searchParams.error ? <p className="error">{searchParams.error}</p> : null}
      {searchParams.message ? <p>{searchParams.message}</p> : null}
      <form action={loginAction}>
        <label>
          Email
          <input name="email" type="email" required />
        </label>
        <label>
          Password
          <input name="password" type="password" required minLength={8} />
        </label>
        <button type="submit">Sign in</button>
      </form>
      <p>
        No account? <Link href="/signup">Create one</Link>
      </p>
    </section>
  );
}
