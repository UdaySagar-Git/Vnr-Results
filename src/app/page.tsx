"use client"

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {

  const router = useRouter();

  useEffect(() => {
    router.push('/results');
  }, []);

  return (
    <div className="flex flex-col items-center pt-4 md:pt-8">
      <p className="text-gray-500">Redirecting to results Page...</p>
      <Link href="/results" className="text-blue-500 hover:underline">
        Click here if you are not redirected.
      </Link>
    </div>
  );
}