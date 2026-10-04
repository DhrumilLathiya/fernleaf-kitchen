'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  ShoppingBag,
  BookOpen,
  MenuSquare,
  DollarSign,
  Building2,
  Users,
  ChefHat,
  Truck,
  FileText,
  BarChart2,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { name: 'Overview', href: '/', icon: Home, roles: ['ADMIN', 'KITCHEN', 'DISPATCH'] },
  { name: 'My Deliveries', href: '/driver', icon: Truck, roles: ['DRIVER'] },
  { name: 'Orders', href: '/orders', icon: ShoppingBag, roles: ['ADMIN'] },
  { name: 'Catalogue', href: '/catalogue', icon: BookOpen, roles: ['ADMIN'] },
  { name: 'Menu', href: '/menu', icon: MenuSquare, roles: ['ADMIN'] },
  { name: 'Pricing', href: '/pricing', icon: DollarSign, roles: ['ADMIN'] },
  { name: 'Companies', href: '/companies', icon: Building2, roles: ['ADMIN'] },
  { name: 'Employees', href: '/employees', icon: Users, roles: ['ADMIN'] },
  { name: 'Kitchen', href: '/kitchen', icon: ChefHat, roles: ['ADMIN', 'KITCHEN'] },
  { name: 'Dispatch', href: '/dispatch', icon: Truck, roles: ['ADMIN', 'DISPATCH'] },
  { name: 'Billing', href: '/billing', icon: FileText, roles: ['ADMIN'] },
  { name: 'Reports', href: '/reports', icon: BarChart2, roles: ['ADMIN', 'KITCHEN', 'DISPATCH'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['ADMIN'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'FL';

  function handleLogout() {
    logout();
    router.replace('/login');
  }

  return (
    <aside className="relative flex h-screen w-72 flex-col justify-between border-r border-white/10 bg-[#050f0c] text-gray-400 overflow-y-auto shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
      
      {/* Decorative subtle glow behind Sidebar */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-[300px] w-[300px] rounded-full bg-emerald-900/20 blur-[80px]" />

      <div className="relative z-10 flex flex-col flex-1">
        {/* Brand / Logo */}
        <div className="flex h-24 items-center px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/20">
              <span className="text-xl text-white">🌿</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white drop-shadow-sm">
              Fernleaf<span className="text-emerald-400">.</span>
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 px-4 pb-8 mt-2 overflow-y-auto custom-scrollbar">
          {navItems
            .filter((item) => user?.role && item.roles.includes(user.role))
            .map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {/* Active Indicator Line */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  )}
                  
                  <Icon
                    size={18}
                    className={`transition-colors duration-300 ${
                      isActive ? 'text-emerald-400' : 'text-gray-500 group-hover:text-emerald-400/70'
                    }`}
                  />
                  <span className="tracking-wide">{item.name}</span>
                </Link>
              );
            })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="relative z-10 mx-4 mb-6 rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-md transition-colors hover:bg-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 font-bold text-white shadow-inner">
            {initials}
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            <span className="truncate text-sm font-bold text-white">
              {user?.email?.split('@')[0] || 'Admin'}
            </span>
            <span className="truncate text-xs font-medium text-emerald-400/80 uppercase tracking-wider">
              {user?.role || 'Staff'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-all hover:bg-red-500/20 hover:text-red-400"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}} />
    </aside>
  );
}
