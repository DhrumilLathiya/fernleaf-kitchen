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
      <div className="flex h-screen overflow-hidden bg-[#f4f7f6] relative">
        
        {/* Global Dashboard Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-[url('/images/dashboard-bg.jpg')] bg-cover bg-center bg-no-repeat opacity-[0.15] mix-blend-multiply pointer-events-none"
        />
        
        {/* Optional Logo Watermark as requested */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <div className="flex flex-col items-center gap-4 grayscale">
            <span className="text-[15rem]">🌿</span>
            <span className="text-8xl font-black tracking-tighter text-black">Fernleaf Kitchen</span>
          </div>
        </div>

        <Sidebar />
        
        <main className="relative z-10 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </RouteGuard>
  );
}
