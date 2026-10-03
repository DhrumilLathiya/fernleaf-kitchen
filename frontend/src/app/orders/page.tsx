'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Order, OrdersResponse } from '@/types/order';

function StatusBadge({ status }: { status: Order['status'] }) {
  const styles: Record<Order['status'], string> = {
    DRAFT: 'bg-gray-100 text-gray-700',
    PLACED: 'bg-blue-100 text-blue-700',
    CONFIRMED: 'bg-purple-100 text-purple-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
    REJECTED: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

export default function OrdersPage() {
  const { token } = useAuth();
  const [data, setData] = useState<OrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    async function fetchOrders() {
      if (!token) return;
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (search) query.append('search', search);
        if (statusFilter) query.append('status', statusFilter);

        const res = await api.get<OrdersResponse>(`/orders?${query.toString()}`, token);
        setData(res);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(fetchOrders, 300); // debounce search
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-8 sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage corporate meal orders across all companies.
          </p>
        </div>
        <div className="mt-4 sm:ml-4 sm:mt-0 flex gap-3">
          <button className="inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            Process Cut-off
          </button>
          <button className="inline-flex items-center justify-center rounded-md bg-[#1B3B36] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#132A26]">
            Create Order
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Search employee or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-xs rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-[#1B3B36] sm:text-sm sm:leading-6"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:max-w-[150px] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-[#1B3B36] sm:text-sm sm:leading-6"
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PLACED">Placed</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {error ? (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">Failed to load orders: {error}</p>
        </div>
      ) : (
        <div className="mt-2 flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900">Order ID</th>
                  <th scope="col" className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900">Employee</th>
                  <th scope="col" className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900">Company</th>
                  <th scope="col" className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900">Delivery Date</th>
                  <th scope="col" className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
                  <th scope="col" className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" className="relative px-6 py-3.5"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="whitespace-nowrap px-6 py-4"><div className="h-4 w-16 bg-gray-200 rounded"></div></td>
                      <td className="whitespace-nowrap px-6 py-4"><div className="h-4 w-32 bg-gray-200 rounded"></div></td>
                      <td className="whitespace-nowrap px-6 py-4"><div className="h-4 w-24 bg-gray-200 rounded"></div></td>
                      <td className="whitespace-nowrap px-6 py-4"><div className="h-4 w-24 bg-gray-200 rounded"></div></td>
                      <td className="whitespace-nowrap px-6 py-4"><div className="h-4 w-12 bg-gray-200 rounded"></div></td>
                      <td className="whitespace-nowrap px-6 py-4"><div className="h-5 w-20 bg-gray-200 rounded-full"></div></td>
                      <td className="whitespace-nowrap px-6 py-4 text-right"></td>
                    </tr>
                  ))
                ) : data?.orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                      No orders found matching your filters.
                    </td>
                  </tr>
                ) : (
                  data?.orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {order.employee.firstName} {order.employee.lastName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {order.employee.company.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(order.deliveryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}<br />
                        <span className="text-xs text-gray-400">{order.deliveryTime}</span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <a href={`/orders/${order.id}`} className="text-[#1B3B36] hover:text-[#132A26]">
                          View<span className="sr-only">, {order.id}</span>
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && data && data.total > 0 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button disabled className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 opacity-50">Previous</button>
                <button disabled className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 opacity-50">Next</button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{Math.min(data.limit, data.total)}</span> of <span className="font-medium">{data.total}</span> results
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
