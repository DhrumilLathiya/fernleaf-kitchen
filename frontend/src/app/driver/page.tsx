'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface DeliveryDrop {
  id: string; // Drop key
  deliveryTime: string;
  companyName: string;
  deliveryAddress: string;
  orders: {
    id: string;
    employee: { firstName: string; lastName: string };
    total: number;
  }[];
  status: string;
  isDelivered: boolean;
}

export default function DriverPage() {
  const { token, user } = useAuth();
  const [deliveries, setDeliveries] = useState<DeliveryDrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Note modal state
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchDeliveries() {
      if (!token) return;
      try {
        const data = await api.get<DeliveryDrop[]>('/driver/deliveries', token);
        setDeliveries(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDeliveries();
  }, [token]);

  const handleDeliver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedOrder) return;

    setSubmitting(true);
    try {
      await api.post(`/driver/deliveries/${selectedOrder}/deliver`, { note }, token);
      
      // Update local state to reflect delivery
      setDeliveries(prev => prev.map(drop => {
        // If this order was in the drop, we don't have per-order status in this type, 
        // but we can refresh the list or optimistically update. Let's just refresh.
        return drop;
      }));
      
      // For simplicity, refetch
      const data = await api.get<DeliveryDrop[]>('/driver/deliveries', token);
      setDeliveries(data);

      setSelectedOrder(null);
      setNote('');
    } catch (err: any) {
      alert(`Failed to mark delivered: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-20">
      <div className="bg-[#0f2920] p-6 text-white rounded-b-3xl shadow-md">
        <h1 className="text-2xl font-bold">My Deliveries</h1>
        <p className="text-[#a4dfa1] mt-1 text-sm">Today's schedule for {user?.email}</p>
      </div>

      <div className="p-4 space-y-4 mt-2">
        {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}

        {deliveries.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            No deliveries assigned today.
          </div>
        ) : (
          deliveries.map((drop, idx) => {
            const allDelivered = drop.orders.length > 0 && drop.isDelivered; // Simplified check
            return (
              <div key={drop.id || idx} className={`rounded-2xl bg-white shadow-sm border overflow-hidden ${allDelivered ? 'border-green-200' : 'border-gray-200'}`}>
                <div className={`p-4 border-b flex justify-between items-center ${allDelivered ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">{drop.deliveryTime}</div>
                    <div className="text-sm font-medium text-gray-600">{drop.companyName}</div>
                  </div>
                  <div className={`text-xs font-bold px-3 py-1 rounded-full ${allDelivered ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {allDelivered ? 'COMPLETED' : 'PENDING'}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-4">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm text-gray-700">{drop.deliveryAddress}</p>
                  </div>
                  
                  <div className="space-y-3">
                    {drop.orders.map(order => (
                      <div key={order.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{order.employee.firstName} {order.employee.lastName}</div>
                          <div className="text-xs text-gray-500">Order #{order.id.slice(-6)}</div>
                        </div>
                        {!allDelivered ? (
                          <button
                            onClick={() => setSelectedOrder(order.id)}
                            className="bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:bg-green-500"
                          >
                            Deliver
                          </button>
                        ) : (
                          <span className="text-green-600">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Deliver Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-60 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Mark Delivered</h2>
              <p className="text-sm text-gray-500 mb-6">Add a note or photo for proof of delivery.</p>
              
              <form onSubmit={handleDeliver}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Note (Optional)</label>
                    <textarea
                      rows={3}
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      placeholder="e.g., Left at reception with Sarah"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Proof of Delivery</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50">
                      <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm font-medium text-green-600">Take Photo</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => { setSelectedOrder(null); setNote(''); }}
                    className="flex-1 px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-green-600 hover:bg-green-500 rounded-xl transition-colors disabled:bg-gray-400"
                  >
                    {submitting ? 'Saving...' : 'Confirm'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
