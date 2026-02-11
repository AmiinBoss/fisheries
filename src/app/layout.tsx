import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fisheries Supabase Starter',
  description: 'Supabase + PostGIS foundation for fisheries workflows'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="nav">
          <Link href="/">Home</Link>
          <Link href="/login">Login</Link>
          <Link href="/signup">Sign up</Link>
          <Link href="/account">Account</Link>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
