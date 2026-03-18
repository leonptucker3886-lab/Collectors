'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

const PUBLIC_PATHS = ['/login', '/api', '/collections', '/_next', '/favicon'];

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));
      if (!user && !isPublicPath) {
        router.replace('/collections');
      }
    }
  }, [user, loading, pathname, router]);

  return <>{children}</>;
}
