'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import RouteGuard from './RouteGuard';

const PUBLIC_ROUTES = ['/login'];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const isPublic = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (!isLoading) {
      if (isPublic && user) {
        router.replace('/');
      } else if (!isPublic && !user) {
        router.replace('/login');
      }
    }
  }, [isPublic, user, isLoading, router]);

  // While auth is loading, or if we are about to redirect away (from /login to / OR from / to /login), show spinner
  if (isLoading || (isPublic && user) || (!isPublic && !user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f2420]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          <p className="text-sm text-white/50 font-medium">Loading Fernleaf Kitchen…</p>
        </div>
      </div>
    );
  }

  // Public routes (like /login) render without sidebar
  if (isPublic) {
    return <>{children}</>;
  }

  // Protected routes go through full shell
  return (
    <RouteGuard>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </RouteGuard>
  );
}
