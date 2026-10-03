'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { KitchenCombination } from '@/types/kitchen';

export default function KitchenBoardPage() {
  const { token } = useAuth();
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [stationFilter, setStationFilter] = useState<string>('All');
  const [combinations, setCombinations] = useState<KitchenCombination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBoard() {
      if (!token) return;
      setLoading(true);
      try {
        const query = new URLSearchParams({ date });
        if (stationFilter !== 'All') {
          query.append('station', stationFilter);
        }
        const res = await api.get<KitchenCombination[]>(`/kitchen/board?${query.toString()}`, token);
        setCombinations(res);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBoard();
  }, [date, stationFilter, token]);

  const handleStart = async (id: string) => {
    if (!token) return;
    try {
      await api.post(`/kitchen/units/${id}/start`, {}, token);
      setCombinations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isStarted: true, startedAt: new Date().toISOString() } : c))
      );
    } catch (err: any) {
      alert(`Failed to start: ${err.message}`);
    }
  };

  const handleComplete = async (id: string) => {
    if (!token) return;
    try {
      await api.post(`/kitchen/units/${id}/done`, {}, token);
      setCombinations((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, isDone: true, doneAt: new Date().toISOString(), isStarted: true }
            : c
        )
      );
    } catch (err: any) {
      alert(`Failed to complete: ${err.message}`);
    }
  };

  // Group by station
  const grouped = combinations.reduce((acc, combo) => {
    const st = combo.kitchenStation || 'Unassigned';
    if (!acc[st]) acc[st] = [];
    acc[st].push(combo);
    return acc;
  }, {} as Record<string, KitchenCombination[]>);

  const stations = ['All', ...Array.from(new Set(combinations.map((c) => c.kitchenStation || 'Unassigned')))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kitchen Board</h1>
          <p className="text-sm text-gray-500 mt-1">Manage food preparation orders for delivery.</p>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          <select
            value={stationFilter}
            onChange={(e) => setStationFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            {stations.map((st) => (
              <option key={st} value={st}>
                {st} Station
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600"></div>
        </div>
      ) : combinations.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white p-12 text-center text-gray-500 shadow-sm">
          No prep units scheduled for this date/station.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(grouped).map(([station, combos]) => (
            <div key={station} className="flex flex-col rounded-2xl border border-gray-200 bg-gray-50/50">
              <div className="border-b border-gray-200 bg-white px-4 py-3 rounded-t-2xl">
                <h3 className="font-semibold text-gray-900">{station} Station</h3>
                <p className="text-xs text-gray-500">{combos.length} items to prep</p>
              </div>
              <div className="flex-1 space-y-3 p-4">
                {combos.map((combo) => (
                  <div
                    key={combo.id}
                    className={`relative overflow-hidden rounded-xl bg-white p-4 shadow-sm border transition-all ${
                      combo.isDone
                        ? 'border-green-200 bg-green-50/30 opacity-75'
                        : combo.isStarted
                        ? 'border-amber-200 bg-amber-50/30'
                        : 'border-gray-200'
                    }`}
                  >
                    {/* Status indicator line */}
                    <div
                      className={`absolute left-0 top-0 h-full w-1 ${
                        combo.isDone ? 'bg-green-500' : combo.isStarted ? 'bg-amber-500' : 'bg-gray-300'
                      }`}
                    />

                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-gray-900 line-clamp-2 pr-4">
                        {combo.quantity}x {combo.orderLine.dish.name}
                      </div>
                      <div className="flex-shrink-0 text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                        {combo.orderLine.order.deliveryTime}
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 mb-4">
                      {combo.orderLine.order.employee.firstName} {combo.orderLine.order.employee.lastName} •{' '}
                      {combo.orderLine.order.employee.company.name}
                    </div>

                    <div className="flex gap-2">
                      {!combo.isDone && !combo.isStarted && (
                        <button
                          onClick={() => handleStart(combo.id)}
                          className="flex-1 rounded-lg bg-amber-100 py-2 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-200"
                        >
                          Start Prep
                        </button>
                      )}
                      {!combo.isDone && (
                        <button
                          onClick={() => handleComplete(combo.id)}
                          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                            combo.isStarted
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          Mark Done
                        </button>
                      )}
                      {combo.isDone && (
                        <div className="flex-1 text-center py-2 text-sm font-medium text-green-600 flex items-center justify-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Completed
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
