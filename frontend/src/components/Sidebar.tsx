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
  { name: 'Overview', href: '/', icon: Home },
  { name: 'Orders', href: '/orders', icon: ShoppingBag },
  { name: 'Catalogue', href: '/catalogue', icon: BookOpen },
  { name: 'Menu', href: '/menu', icon: MenuSquare },
  { name: 'Pricing', href: '/pricing', icon: DollarSign },
  { name: 'Companies', href: '/companies', icon: Building2 },
  { name: 'Employees', href: '/employees', icon: Users },
  { name: 'Kitchen', href: '/kitchen', icon: ChefHat },
  { name: 'Dispatch', href: '/dispatch', icon: Truck },
  { name: 'Billing', href: '/billing', icon: FileText },
  { name: 'Reports', href: '/reports', icon: BarChart2 },
  { name: 'Settings', href: '/settings', icon: Settings },
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
    <aside className="w-64 h-screen bg-[#0f2920] text-gray-300 flex flex-col justify-between overflow-y-auto shrink-0">
      <div>
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center gap-2 text-white mb-2">
            <div className="bg-[#1f4d36] p-1.5 rounded-md">
              <ChefHat size={20} className="text-[#a4dfa1]" />
            </div>
            <span className="font-semibold text-lg tracking-tight leading-tight">
              Fernleaf<br />Kitchen
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-3 space-y-0.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#1f4d36] text-white shadow-sm'
                    : 'hover:bg-[#1a3b2c] hover:text-white text-gray-400'
                }`}
              >
                <Icon
                  size={17}
                  className={isActive ? 'text-[#a4dfa1]' : 'text-gray-500'}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User footer */}
      <div className="p-4 border-t border-[#1a3b2c]">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#a4dfa1] flex items-center justify-center text-[#0f2920] font-bold text-xs shrink-0">
            {initials}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-medium text-white truncate">
              {user?.email ?? 'Admin'}
            </span>
            <span className="text-xs text-gray-400 capitalize">
              {user?.role?.toLowerCase() ?? 'Staff'}
            </span>
          </div>
          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Sign out"
            className="rounded-md p-1.5 text-gray-500 hover:text-red-400 hover:bg-[#1a3b2c] transition-colors"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
