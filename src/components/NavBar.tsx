// components/NavBar.tsx
'use client';

import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md rounded-b-2xl">
      <Link href="/" className="text-2xl font-bold hover:scale-105 transition-transform">
        Quote Generator
      </Link>
      <Link href="/about" className="text-lg hover:underline">
        About Us
      </Link>
    </nav>
  );
}
