'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function ReportsPage() {
  const { token, user } = useAuth();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      if (!token) return;
      try {
        const data = await api.get('/dashboard/metrics', token);
        setMetrics(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, [token]);

  // Dummy chart data for visualization since we don't have historical data API yet
  const chartData = [
    { name: 'Mon', orders: 120, revenue: 1500 },
    { name: 'Tue', orders: 150, revenue: 1800 },
    { name: 'Wed', orders: 180, revenue: 2200 },
    { name: 'Thu', orders: 170, revenue: 2100 },
    { name: 'Fri', orders: 210, revenue: 2600 },
  ];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Key performance indicators and operational metrics based on your role.</p>
      </div>

      {/* Role-Aware KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics?.todayOrders !== undefined && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Today's Orders</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{metrics.todayOrders}</p>
          </div>
        )}
        
        {metrics?.inKitchen !== undefined && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">In Kitchen (Prep)</h3>
            <p className="mt-2 text-3xl font-bold text-amber-600">{metrics.inKitchen}</p>
          </div>
        )}

        {metrics?.readyToDispatch !== undefined && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Ready to Dispatch</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{metrics.readyToDispatch}</p>
          </div>
        )}

        {metrics?.outstanding !== undefined && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Unpaid Invoices</h3>
            <p className="mt-2 text-3xl font-bold text-red-600">{metrics.outstanding}</p>
          </div>
        )}
      </div>

      {/* Charts Section - Visible mainly to Admin */}
      {user?.role === 'ADMIN' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Order Volume</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                  <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="orders" fill="#1f4d36" radius={[4, 4, 0, 0]} name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Orders Feed</h3>
            <div className="space-y-4">
              {metrics?.recentOrders?.map((order: any) => (
                <div key={order.id} className="flex justify-between items-center p-3 rounded-lg border border-gray-100 bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">{order.employee.company.name}</p>
                    <p className="text-xs text-gray-500">{order.employee.firstName} {order.employee.lastName} • {order.deliveryTime}</p>
                  </div>
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 ring-green-600/20' : 
                    order.status === 'CONFIRMED' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' : 
                    'bg-gray-50 text-gray-600 ring-gray-500/10'
                  }`}>
                    {order.status}
                  </span>
                </div>
              ))}
              {(!metrics?.recentOrders || metrics.recentOrders.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">No recent orders found for today.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
