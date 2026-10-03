'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { DispatchDrop, Driver } from '@/types/dispatch';

export default function DispatchBoardPage() {
  const { token } = useAuth();
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [drops, setDrops] = useState<DispatchDrop[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!token) return;
      setLoading(true);
      try {
        const [dropsRes, driversRes] = await Promise.all([
          api.get<DispatchDrop[]>(`/dispatch/drops?date=${date}`, token),
          api.get<Driver[]>('/dispatch/drivers', token),
        ]);
        setDrops(dropsRes);
        setDrivers(driversRes);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [date, token]);

  const handleAssignDriver = async (dropId: string, driverId: string) => {
    if (!token) return;
    try {
      await api.post(`/dispatch/drops/${encodeURIComponent(dropId)}/assign`, { driverId }, token);
      const assignedDriver = drivers.find((d) => d.id === driverId);
      setDrops((prev) =>
        prev.map((drop) =>
          drop.dropId === dropId ? { ...drop, driver: assignedDriver || null } : drop
        )
      );
    } catch (err: any) {
      alert(`Failed to assign driver: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dispatch Board</h1>
          <p className="text-sm text-gray-500 mt-1">Manage delivery routes and assign drivers to drops.</p>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600"></div>
        </div>
      ) : drops.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white p-12 text-center text-gray-500 shadow-sm">
          No deliveries scheduled for this date.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {drops.map((drop) => (
            <div key={drop.dropId} className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md">
              
              {/* Header */}
              <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{drop.company.name}</h3>
                    {drop.isKitchenReady ? (
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">
                        Kitchen Ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                        Cooking...
                      </span>
                    )}
                  </div>
                  <span className="inline-flex items-center rounded-md bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
                    {drop.deliveryTime}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <svg className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {drop.deliveryAddress}
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 p-5">
                <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
                  <span className="text-sm font-medium text-gray-500">Assignment</span>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <select
                        value={drop.driver?.id || ''}
                        onChange={(e) => handleAssignDriver(drop.dropId, e.target.value)}
                        className={`block w-48 appearance-none rounded-lg border py-2 pl-3 pr-8 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 ${
                          drop.driver ? 'border-green-200 bg-green-50 text-green-700 font-medium' : 'border-gray-300 bg-white text-gray-700'
                        }`}
                      >
                        <option value="" disabled>Unassigned</option>
                        {drivers.map(d => (
                          <option key={d.id} value={d.id}>{d.email}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                    {drop.driver && drop.isKitchenReady && (
                      <button 
                        onClick={async () => {
                          if (!token) return;
                          try {
                            await api.post(`/dispatch/drops/${encodeURIComponent(drop.dropId)}/out-for-delivery`, {}, token);
                            alert('Drop marked as out for delivery!');
                          } catch (err: any) {
                            alert(`Failed: ${err.message}`);
                          }
                        }}
                        className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-700 transition"
                      >
                        Send Out
                      </button>
                    )}
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex justify-between">
                  <span>Included Orders</span>
                  <span className="text-gray-500 font-normal">{drop.totalMeals} total meals</span>
                </h4>
                
                <div className="space-y-3">
                  {drop.orders.map((order) => (
                    <div key={order.id} className="rounded-lg bg-gray-50 p-3 text-sm">
                      <div className="font-medium text-gray-900 mb-1">
                        {order.employee.firstName} {order.employee.lastName}
                      </div>
                      <ul className="list-disc pl-5 text-gray-600 space-y-0.5">
                        {order.lines.map((line, idx) => (
                          <li key={idx}>
                            {line.dishQuantity}x {line.dish.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
