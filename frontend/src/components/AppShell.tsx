'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import RouteGuard from './RouteGuard';

const PUBLIC_ROUTES = ['/login'];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = PUBLIC_ROUTES.includes(pathname);

  // Public routes render without sidebar or auth guard
  if (isPublic) {
    return <>{children}</>;
  }

  // Protected routes go through RouteGuard + full shell
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
