'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Dish, Category } from '@/types/catalogue';

export default function MenuPage() {
  const { token } = useAuth();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // For the UI filter
  const [showOnlyActive, setShowOnlyActive] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!token) return;
      setLoading(true);
      try {
        const [dishesRes, categoriesRes] = await Promise.all([
          api.get<Dish[]>('/catalogue/dishes', token),
          api.get<Category[]>('/catalogue/categories', token),
        ]);
        setDishes(dishesRes);
        setCategories(categoriesRes);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  const toggleDishStatus = async (dishId: string, currentStatus: boolean) => {
    if (!token) return;
    try {
      // Optimistic update
      setDishes(prev => prev.map(d => d.id === dishId ? { ...d, isActive: !currentStatus } : d));
      
      await api.put(`/catalogue/dishes/${dishId}`, { isActive: !currentStatus }, token);
    } catch (err: any) {
      alert(`Failed to update dish status: ${err.message}`);
      // Revert on failure
      setDishes(prev => prev.map(d => d.id === dishId ? { ...d, isActive: currentStatus } : d));
    }
  };

  const filteredDishes = showOnlyActive ? dishes.filter(d => d.isActive) : dishes;

  // Group by category for nicer display
  const groupedDishes = categories.map(cat => ({
    ...cat,
    dishes: filteredDishes.filter(d => d.categoryId === cat.id)
  })).filter(cat => cat.dishes.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Active Menu</h1>
          <p className="text-sm text-gray-500 mt-1">Manage which catalogue items are actively available to order this week.</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              className="rounded text-green-600 focus:ring-green-500"
              checked={showOnlyActive}
              onChange={(e) => setShowOnlyActive(e.target.checked)}
            />
            Show Active Only
          </label>
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600"></div>
        </div>
      ) : groupedDishes.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white p-12 text-center text-gray-500 shadow-sm">
          No dishes found.
        </div>
      ) : (
        <div className="space-y-8">
          {groupedDishes.map(category => (
            <div key={category.id} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2">{category.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.dishes.map(dish => (
                  <div 
                    key={dish.id} 
                    className={`relative overflow-hidden rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${dish.isActive ? 'border-green-200 ring-1 ring-green-100' : 'border-gray-200 opacity-75'}`}
                  >
                    {dish.image && (
                      <div 
                        className="h-32 -mx-5 -mt-5 mb-4 bg-cover bg-center border-b border-gray-100"
                        style={{ backgroundImage: `url(${dish.image})` }}
                      />
                    )}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className={`font-semibold ${dish.isActive ? 'text-gray-900' : 'text-gray-500'}`}>{dish.name}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{dish.description}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-700 ml-3 bg-gray-100 px-2 py-1 rounded">
                        £{dish.costPrice.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {dish.dietaryTags.map(tag => (
                        <span key={tag} className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                      <span className={`text-sm font-medium ${dish.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                        {dish.isActive ? 'Currently on Menu' : 'Hidden from Menu'}
                      </span>
                      <button
                        onClick={() => toggleDishStatus(dish.id, dish.isActive)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 ${dish.isActive ? 'bg-green-600' : 'bg-gray-200'}`}
                        role="switch"
                        aria-checked={dish.isActive}
                      >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${dish.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
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
