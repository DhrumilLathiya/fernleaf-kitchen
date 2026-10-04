'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Order } from '@/types/order';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      if (!token || !id) return;
      try {
        const data = await api.get<Order>(`/orders/${id}`, token);
        setOrder(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-6">
        <div className="rounded-md bg-red-50 p-4 text-red-700">
          Failed to load order: {error || 'Not found'}
        </div>
        <button onClick={() => router.back()} className="mt-4 text-[#1B3B36] hover:underline">
          &larr; Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-6 sm:p-10">
      <div className="mb-6">
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-900 mb-4 inline-block">
          &larr; Back to Orders
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Order #{order.id.slice(0, 8).toUpperCase()}</h1>
        <p className="mt-1 text-sm text-gray-500">
          Placed by {order.employee.firstName} {order.employee.lastName} ({order.employee.company.name})
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Order Info */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-gray-500">Status</dt>
              <dd className="font-medium text-gray-900 mt-1">
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                  {order.status}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Delivery Date</dt>
              <dd className="font-medium text-gray-900">{new Date(order.deliveryDate).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Delivery Time</dt>
              <dd className="font-medium text-gray-900">{order.deliveryTime}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Address</dt>
              <dd className="font-medium text-gray-900">{order.deliveryAddress}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Total Amount</dt>
              <dd className="font-medium text-gray-900">${order.totalAmount.toFixed(2)}</dd>
            </div>
          </dl>
        </div>

        {/* Order Items */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
          </div>
          <ul className="divide-y divide-gray-200">
            {order.lines.map((line) => (
              <li key={line.id} className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{line.dish.name}</h3>
                  <p className="text-sm text-gray-500">Qty: {line.dishQuantity}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">${(line.dishPrice * line.dishQuantity).toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
