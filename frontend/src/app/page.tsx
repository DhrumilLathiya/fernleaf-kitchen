'use client';

import { Bell, TrendingUp, Clock, PackageCheck, ChefHat, Search, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

export default function Home() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const firstName = user?.email?.split('@')[0] || 'Alex';
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="flex flex-col flex-1 h-full bg-transparent text-gray-900 font-sans relative">
      
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-full h-80 bg-gradient-to-b from-emerald-100/40 to-transparent pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 flex justify-between items-center px-10 py-5 bg-white/60 backdrop-blur-xl border-b border-white/20 sticky top-0 shadow-sm">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search orders, clients, or employees..." 
            className="w-[400px] pl-12 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm shadow-sm transition-all focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
          />
        </div>
        
        <div className="flex items-center gap-6">
          <button className="relative p-2 text-gray-400 hover:text-emerald-600 transition-colors">
            <Bell size={22} />
            <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
          </button>
          
          <div className="h-8 w-px bg-gray-200"></div>

          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-bold text-white shadow-md group-hover:shadow-lg transition-all">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block text-sm">
              <p className="font-semibold text-gray-700 leading-tight capitalize">{firstName}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase() || 'Staff'}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 p-10 flex-1 overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
              Good morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 capitalize">{firstName}</span> 👋
            </h1>
            <p className="text-gray-500 font-medium">Here is your daily operational overview for Fernleaf Kitchen.</p>
          </div>
          
          <div className="flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="text-sm font-semibold text-gray-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
              {currentDate}
            </span>
          </div>
        </div>

        {/* Premium KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {/* Card 1 */}
          <div className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all hover:-translate-y-1 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full blur-2xl group-hover:bg-emerald-100 transition-colors" />
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                <TrendingUp size={24} />
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                <ArrowRight size={12} className="-rotate-45" /> +12%
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Today's Orders</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-gray-900">248</span>
                <span className="text-sm font-medium text-gray-400">meals</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all hover:-translate-y-1 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-50 rounded-full blur-2xl group-hover:bg-orange-100 transition-colors" />
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="p-3 bg-orange-50 rounded-2xl text-orange-500">
                <ChefHat size={24} />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">In Kitchen (Prep)</h3>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-4xl font-black text-gray-900">64</span>
                <span className="text-sm font-medium text-gray-400">items</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-orange-400 to-amber-400 w-[26%] h-full rounded-full relative">
                  <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 animate-[shimmer_2s_infinite]" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all hover:-translate-y-1 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors" />
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-500">
                <PackageCheck size={24} />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Ready for Dispatch</h3>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-4xl font-black text-gray-900">18</span>
                <span className="text-sm font-medium text-gray-400">drops</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-400 to-cyan-400 w-[7%] h-full rounded-full relative">
                  <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 animate-[shimmer_2s_infinite]" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="group bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="p-3 bg-white/10 rounded-2xl text-emerald-400 backdrop-blur-sm border border-white/5">
                <Clock size={24} />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Next Cut-off</h3>
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-black text-white">4:00 PM</span>
                <span className="text-sm font-medium text-emerald-400">in 4 hrs 32 mins</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Activity Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Chart / List Area */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-8 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Order Activity</h2>
              <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">View All</button>
            </div>
            
            <div className="space-y-4">
              {[
                { name: 'TechCorp Delivery', status: 'In Kitchen', time: '10 mins ago', color: 'bg-orange-100 text-orange-700' },
                { name: 'Global Industries', status: 'Dispatched', time: '45 mins ago', color: 'bg-blue-100 text-blue-700' },
                { name: 'Nexus Solutions', status: 'Delivered', time: '2 hours ago', color: 'bg-green-100 text-green-700' },
                { name: 'Apex Media Group', status: 'Confirmed', time: '3 hours ago', color: 'bg-gray-100 text-gray-700' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${item.color}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* System Status / Helpers */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
             <h2 className="text-xl font-bold text-gray-900 mb-6">System Health</h2>
             
             <div className="space-y-6">
               <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 flex gap-4">
                 <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                 <div>
                   <h4 className="font-bold text-emerald-900">All Systems Operational</h4>
                   <p className="text-sm text-emerald-700 mt-1">Order syncing and payment gateways are running smoothly.</p>
                 </div>
               </div>

               <div className="pt-4 border-t border-gray-100">
                 <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
                 <div className="flex flex-wrap gap-2">
                   {['Update Menu', 'Manage Drivers', 'View Reports', 'Billing'].map(link => (
                     <button key={link} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 transition-colors">
                       {link}
                     </button>
                   ))}
                 </div>
               </div>
             </div>
          </div>

        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}} />
    </div>
  );
}
