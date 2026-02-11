import Link from 'next/link';
import { signupAction } from './actions';

export default function SignupPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <section className="card">
      <h1>Sign up</h1>
      {searchParams.error ? <p className="error">{searchParams.error}</p> : null}
      <form action={signupAction}>
        <label>
          Email
          <input name="email" type="email" required />
        </label>
        <label>
          Password
          <input name="password" type="password" required minLength={8} />
        </label>
        <button type="submit">Create account</button>
      </form>
      <p>
        Already have an account? <Link href="/login">Sign in</Link>
      </p>
    </section>
  );
}
