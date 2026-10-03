'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Settings } from '@/types/settings';

const DAYS_OF_WEEK = [
  { id: 0, name: 'Sunday' },
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' },
];

export default function SettingsPage() {
  const { token, user } = useAuth();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      if (!token) return;
      try {
        const data = await api.get<Settings>('/settings', token);
        setSettings(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !settings) return;
    
    setSaving(true);
    setSuccess(false);
    try {
      const data = await api.put<Settings>('/settings', settings, token);
      setSettings(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert(`Failed to save settings: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const toggleDay = (dayId: number) => {
    if (!settings) return;
    const days = settings.kitchenWorkingDays;
    const newDays = days.includes(dayId) ? days.filter(d => d !== dayId) : [...days, dayId];
    setSettings({ ...settings, kitchenWorkingDays: newDays });
  };

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

  if (!settings) return null;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure global operational parameters like order cut-off times and kitchen schedules.</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <form onSubmit={handleSave} className="divide-y divide-gray-200">
          
          <div className="p-6 md:flex md:items-start md:justify-between">
            <div className="mb-4 md:mb-0 md:w-1/3">
              <h2 className="text-sm font-semibold text-gray-900">Order Cut-off Window</h2>
              <p className="mt-1 text-sm text-gray-500">Determine how many days in advance orders must be finalized and at what time.</p>
            </div>
            <div className="md:w-2/3 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cut-off Days</label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={14}
                      value={settings.cutoffDays}
                      onChange={e => setSettings({...settings, cutoffDays: parseInt(e.target.value) || 0})}
                      disabled={user?.role !== 'ADMIN'}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 sm:text-sm">days</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cut-off Time</label>
                  <input
                    type="time"
                    value={settings.cutoffTime}
                    onChange={e => setSettings({...settings, cutoffTime: e.target.value})}
                    disabled={user?.role !== 'ADMIN'}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>
              </div>
              <div className="rounded-md bg-blue-50 p-3">
                <p className="text-xs text-blue-700">
                  Example: If days is 2 and time is 16:00, orders for Friday must be finalized by 16:00 on Wednesday.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:flex md:items-start md:justify-between">
            <div className="mb-4 md:mb-0 md:w-1/3">
              <h2 className="text-sm font-semibold text-gray-900">Kitchen Working Days</h2>
              <p className="mt-1 text-sm text-gray-500">Select which days of the week the kitchen operates and deliveries can be made.</p>
            </div>
            <div className="md:w-2/3">
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map(day => {
                  const isActive = settings.kitchenWorkingDays.includes(day.id);
                  return (
                    <button
                      key={day.id}
                      type="button"
                      disabled={user?.role !== 'ADMIN'}
                      onClick={() => toggleDay(day.id)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        isActive 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : 'bg-gray-100 text-gray-500 border border-transparent hover:bg-gray-200'
                      } ${user?.role !== 'ADMIN' ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {day.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-6 md:flex md:items-start md:justify-between">
            <div className="mb-4 md:mb-0 md:w-1/3">
              <h2 className="text-sm font-semibold text-gray-900">Kitchen Holidays</h2>
              <p className="mt-1 text-sm text-gray-500">Dates when the kitchen is closed. The cut-off engine will skip these days.</p>
            </div>
            <div className="md:w-2/3">
              <textarea
                placeholder="Comma separated dates (YYYY-MM-DD)"
                value={settings.kitchenHolidays.map(d => new Date(d).toISOString().split('T')[0]).join(', ')}
                onChange={e => {
                  const dates = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                  setSettings({ ...settings, kitchenHolidays: dates });
                }}
                disabled={user?.role !== 'ADMIN'}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 disabled:bg-gray-100 disabled:text-gray-500 resize-none"
              />
            </div>
          </div>

          {user?.role === 'ADMIN' && (
            <div className="flex items-center justify-end gap-4 p-6 bg-gray-50">
              {success && <span className="text-sm font-medium text-green-600">Settings saved successfully!</span>}
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-green-700 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 transition-colors disabled:bg-gray-400"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
