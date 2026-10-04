'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Dish } from '@/types/catalogue';
import type { PriceTier } from '@/types/pricing';

export default function PricingPage() {
  const { token } = useAuth();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [tiers, setTiers] = useState<PriceTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // For inline editing
  const [editingCell, setEditingCell] = useState<{ dishId: string, tierId: string } | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      if (!token) return;
      setLoading(true);
      try {
        const [dishesRes, tiersRes] = await Promise.all([
          api.get<Dish[]>('/catalogue/dishes', token),
          api.get<PriceTier[]>('/pricing/tiers', token),
        ]);
        setDishes(dishesRes);
        setTiers(tiersRes);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  const handleEditClick = (dishId: string, tierId: string, currentPrice: number | null, basePrice: number) => {
    setEditingCell({ dishId, tierId });
    setEditValue(currentPrice !== null ? currentPrice.toString() : basePrice.toString());
  };

  const handleSavePrice = async (dishId: string, tierId: string) => {
    if (!token) return;
    
    const parsed = parseFloat(editValue);
    if (isNaN(parsed) || parsed < 0) {
      alert("Please enter a valid positive number.");
      return;
    }

    try {
      // Optimistic UI update
      setDishes(prev => prev.map(d => {
        if (d.id === dishId) {
          const newPrices = d.prices?.filter(p => p.tier.id !== tierId) || [];
          newPrices.push({ id: 'temp-' + Date.now(), price: parsed, tier: { id: tierId, name: '', isDefault: false } });
          return { ...d, prices: newPrices };
        }
        return d;
      }));
      setEditingCell(null);

      // Persist to backend
      await api.put(`/pricing/dishes/${dishId}/prices`, { tierId, price: parsed }, token);
    } catch (err: any) {
      alert(`Failed to save price: ${err.message}`);
      // Simple reload to revert state if failed
      const dishesRes = await api.get<Dish[]>('/catalogue/dishes', token);
      setDishes(dishesRes);
    }
  };

  const getPriceForTier = (dish: Dish, tierId: string) => {
    const override = dish.prices?.find(p => p.tier.id === tierId);
    return override ? override.price : null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Custom Pricing Matrix</h1>
        <p className="text-sm text-gray-500 mt-1">Manage base cost prices and company-specific tier overrides.</p>
      </div>

      {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600"></div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-900 border-r border-gray-200">Item</th>
                  <th className="px-4 py-3 font-semibold text-gray-900 bg-gray-100 border-r border-gray-200 w-32 text-center">
                    Base Cost Price
                  </th>
                  {tiers.map(tier => (
                    <th key={tier.id} className="px-4 py-3 font-semibold text-gray-900 border-r border-gray-200 w-40 text-center">
                      <div className="flex flex-col items-center">
                        {tier.name}
                        {tier.isDefault && (
                          <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-100 px-1.5 py-0.5 rounded">Default</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dishes.map((dish) => (
                  <tr key={dish.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 border-r border-gray-200">
                      <div className="font-medium text-gray-900">{dish.name}</div>
                      <div className="text-xs text-gray-500">{dish.category.name}</div>
                    </td>
                    <td className="px-4 py-3 border-r border-gray-200 bg-gray-50/50 text-center font-medium text-gray-700">
                      £{dish.costPrice.toFixed(2)}
                    </td>
                    
                    {tiers.map(tier => {
                      const customPrice = getPriceForTier(dish, tier.id);
                      const displayPrice = customPrice !== null ? customPrice : dish.costPrice;
                      const hasOverride = customPrice !== null;
                      const isEditing = editingCell?.dishId === dish.id && editingCell?.tierId === tier.id;

                      return (
                        <td key={tier.id} className="px-4 py-3 border-r border-gray-200 text-center group relative">
                          {isEditing ? (
                            <div className="flex items-center justify-center space-x-1">
                              <span className="text-gray-500">£</span>
                              <input
                                type="number"
                                step="0.01"
                                autoFocus
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSavePrice(dish.id, tier.id);
                                  if (e.key === 'Escape') setEditingCell(null);
                                }}
                                onBlur={() => setEditingCell(null)}
                                className="w-16 rounded border border-green-500 px-1 py-0.5 text-center text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                              />
                            </div>
                          ) : (
                            <div
                              onClick={() => handleEditClick(dish.id, tier.id, customPrice, dish.costPrice)}
                              className={`cursor-pointer rounded px-2 py-1 transition-colors hover:bg-gray-100 ${
                                hasOverride ? 'text-green-700 font-semibold bg-green-50' : 'text-gray-600'
                              }`}
                              title="Click to edit price for this tier"
                            >
                              £{displayPrice.toFixed(2)}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
