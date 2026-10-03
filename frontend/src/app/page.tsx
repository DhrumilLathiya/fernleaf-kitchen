import { Bell } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 h-full bg-[#f8fafc] text-gray-900 font-sans">
      {/* Top Header */}
      <header className="flex justify-between items-center px-8 py-6 border-b border-gray-200 bg-white">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search orders, companies, employees..." 
            className="w-96 px-4 py-2 bg-gray-100 rounded-md text-sm border-none focus:ring-2 focus:ring-[#1f4d36] outline-none"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100 relative text-gray-600">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600 cursor-pointer">
            A
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-8 flex-1 overflow-y-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Good morning, Alex 👋</h1>
            <p className="text-gray-500">Here's what's happening at Fernleaf Kitchen today.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500">Tue, 16 Jul 2024</span>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium hover:bg-gray-50">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Today
            </button>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Today's orders</h3>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-gray-900">248</span>
              <span className="text-sm font-medium text-green-600 mb-1 flex items-center">↑ 12%</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">vs. yesterday</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-4">In kitchen</h3>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-gray-900">64</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
              <div className="bg-orange-400 w-[26%] h-full rounded-full"></div>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-right">26%</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Ready to dispatch</h3>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-gray-900">18</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
              <div className="bg-green-500 w-[7%] h-full rounded-full"></div>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-right">7%</p>
          </div>
        </div>
      </main>
    </div>
  );
}
