'use client';

import { useEffect, useState, useMemo } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Dish, Category } from '@/types/catalogue';

// ─── Tag colour mapping ─────────────────────────────────────────────────────
const TAG_COLOURS: Record<string, string> = {
  Vegan: 'bg-emerald-100 text-emerald-700',
  Vegetarian: 'bg-green-100 text-green-700',
  'Gluten Free': 'bg-amber-100 text-amber-700',
  'High Protein': 'bg-blue-100 text-blue-700',
  'Dairy Free': 'bg-purple-100 text-purple-700',
};

// ─── Small components ───────────────────────────────────────────────────────
function DietaryBadge({ tag }: { tag: string }) {
  const colour = TAG_COLOURS[tag] ?? 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colour}`}>
      {tag}
    </span>
  );
}

function AllergenDot({ allergen }: { allergen: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 ring-1 ring-red-200">
      ⚠ {allergen}
    </span>
  );
}

function TemperatureBadge({ temp }: { temp: 'HOT' | 'COLD' }) {
  return temp === 'HOT' ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">
      🔥 Hot
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700">
      ❄ Cold
    </span>
  );
}

// ─── Dish Card ──────────────────────────────────────────────────────────────
function DishCard({ dish }: { dish: Dish }) {
  const defaultPrice = dish.prices.find((p) => p.tier.isDefault)?.price;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
      {/* Status ribbon */}
      {!dish.isActive && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-gray-900/40 backdrop-blur-sm">
          <span className="rounded-full bg-gray-800 px-4 py-1 text-sm font-semibold text-white">
            Inactive
          </span>
        </div>
      )}

      {/* Colour header */}
      <div className="flex h-20 items-center justify-between bg-gradient-to-br from-[#1B3B36] to-[#2d5a52] px-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-emerald-300">
            {dish.category.name}
          </p>
          <p className="text-sm text-white/60 mt-0.5">SKU: {dish.sku}</p>
        </div>
        <TemperatureBadge temp={dish.temperature} />
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="text-base font-semibold text-gray-900 leading-snug">{dish.name}</h3>
          {dish.description && (
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">{dish.description}</p>
          )}
        </div>

        {/* Prices */}
        <div className="flex items-baseline gap-3">
          {defaultPrice !== undefined && (
            <span className="text-lg font-bold text-[#1B3B36]">
              £{defaultPrice.toFixed(2)}
            </span>
          )}
          <span className="text-xs text-gray-400">
            Cost: £{dish.costPrice.toFixed(2)}
          </span>
        </div>

        {/* Station + min qty */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {dish.kitchenStation && (
            <span className="flex items-center gap-1">
              🍳 <span>{dish.kitchenStation}</span>
            </span>
          )}
          <span className="flex items-center gap-1">
            📦 Min: <span>{dish.minOrderQuantity}</span>
          </span>
        </div>

        {/* Dietary tags */}
        {dish.dietaryTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {dish.dietaryTags.map((tag) => (
              <DietaryBadge key={tag} tag={tag} />
            ))}
          </div>
        )}

        {/* Allergens */}
        {dish.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {dish.allergens.map((a) => (
              <AllergenDot key={a} allergen={a} />
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="border-t border-gray-100 flex">
        <button className="flex-1 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          Edit
        </button>
        <span className="w-px bg-gray-100" />
        <button className="flex-1 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          Pricing
        </button>
        <span className="w-px bg-gray-100" />
        <button
          className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
            dish.isActive
              ? 'text-red-500 hover:bg-red-50'
              : 'text-emerald-600 hover:bg-emerald-50'
          }`}
        >
          {dish.isActive ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </div>
  );
}

// ─── Skeleton ───────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="h-20 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-gray-100 rounded-full" />
          <div className="h-5 w-20 bg-gray-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function CataloguePage() {
  const { token } = useAuth();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [tempFilter, setTempFilter] = useState<'ALL' | 'HOT' | 'COLD'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  useEffect(() => {
    if (!token) return;
    async function load() {
      try {
        const [dishData, catData] = await Promise.all([
          api.get<Dish[]>('/catalogue/dishes', token!),
          api.get<Category[]>('/catalogue/categories', token!),
        ]);
        setDishes(dishData);
        setCategories(catData);
      } catch (err: any) {
        setError(err.message ?? 'Failed to load catalogue. Is the backend running?');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  const filtered = useMemo(() => {
    return dishes.filter((d) => {
      const matchSearch =
        search === '' ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.sku.toLowerCase().includes(search.toLowerCase()) ||
        d.description?.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === 'all' || d.categoryId === activeCategory;
      const matchTemp = tempFilter === 'ALL' || d.temperature === tempFilter;
      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && d.isActive) ||
        (statusFilter === 'INACTIVE' && !d.isActive);
      return matchSearch && matchCat && matchTemp && matchStatus;
    });
  }, [dishes, search, activeCategory, tempFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: dishes.length,
    active: dishes.filter((d) => d.isActive).length,
    hot: dishes.filter((d) => d.temperature === 'HOT').length,
    cold: dishes.filter((d) => d.temperature === 'COLD').length,
  }), [dishes]);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Catalogue</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all dishes, options and categories
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-[#1B3B36] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#132A26] transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Dish
        </button>
      </div>

      {/* ── Stats Bar ── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Dishes', value: stats.total, colour: 'bg-[#1B3B36] text-white' },
          { label: 'Active', value: stats.active, colour: 'bg-emerald-50 text-emerald-700' },
          { label: '🔥 Hot', value: stats.hot, colour: 'bg-orange-50 text-orange-700' },
          { label: '❄ Cold', value: stats.cold, colour: 'bg-sky-50 text-sky-700' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-4 ${s.colour}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium opacity-75 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, SKU or description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-[#1B3B36] focus:outline-none focus:ring-1 focus:ring-[#1B3B36]"
          />
        </div>

        {/* Temperature */}
        <div className="flex rounded-xl border border-gray-200 overflow-hidden text-sm font-medium">
          {(['ALL', 'HOT', 'COLD'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTempFilter(t)}
              className={`px-4 py-2 transition-colors ${
                tempFilter === t ? 'bg-[#1B3B36] text-white' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {t === 'HOT' ? '🔥 Hot' : t === 'COLD' ? '❄ Cold' : 'All Temps'}
            </button>
          ))}
        </div>

        {/* Status */}
        <div className="flex rounded-xl border border-gray-200 overflow-hidden text-sm font-medium">
          {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 transition-colors ${
                statusFilter === s ? 'bg-[#1B3B36] text-white' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ── Category Tabs ── */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveCategory('all')}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-[#1B3B36] text-white shadow'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? 'bg-[#1B3B36] text-white shadow'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* ── Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-20 text-center">
          <div className="text-5xl mb-4">🍽️</div>
          <p className="text-lg font-semibold text-gray-700">No dishes found</p>
          <p className="text-sm text-gray-400 mt-1">
            {search ? 'Try a different search term' : 'Add your first dish to get started'}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400">{filtered.length} dish{filtered.length !== 1 ? 'es' : ''} shown</p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
