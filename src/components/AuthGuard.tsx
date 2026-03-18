'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

const PUBLIC_PATHS = ['/login', '/api', '/landmark', '/_next', '/favicon'];

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));
      if (!user && !isPublicPath && pathname !== '/') {
        router.replace('/landmark');
      } else if (user && pathname === '/login') {
        router.replace('/landmark');
      }
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C0A080] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
