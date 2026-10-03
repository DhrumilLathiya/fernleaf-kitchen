'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Invoice } from '@/types/billing';
import type { Order } from '@/types/order';

interface Company {
  id: string;
  name: string;
}

export default function BillingPage() {
  const { token } = useAuth();
  
  // Data state
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [unInvoicedOrders, setUnInvoicedOrders] = useState<Order[]>([]);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'history' | 'generate'>('history');
  
  // Generator state
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function fetchInitialData() {
      if (!token) return;
      setLoading(true);
      try {
        const [invoicesRes, companiesRes] = await Promise.all([
          api.get<Invoice[]>('/billing/invoices', token),
          api.get<Company[]>('/companies', token), // Assuming /api/companies exists from req 4.2
        ]);
        setInvoices(invoicesRes);
        setCompanies(companiesRes);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchInitialData();
  }, [token]);

  useEffect(() => {
    async function fetchUninvoiced() {
      if (!selectedCompanyId || !token) {
        setUnInvoicedOrders([]);
        return;
      }
      try {
        const orders = await api.get<Order[]>(`/billing/companies/${selectedCompanyId}/un-invoiced`, token);
        setUnInvoicedOrders(orders);
      } catch (err: any) {
        alert(`Failed to fetch orders: ${err.message}`);
      }
    }
    fetchUninvoiced();
  }, [selectedCompanyId, token]);

  const handleGenerateInvoice = async () => {
    if (!selectedCompanyId || unInvoicedOrders.length === 0 || !token) return;
    
    setGenerating(true);
    try {
      const orderIds = unInvoicedOrders.map(o => o.id);
      await api.post('/billing/invoices', { companyId: selectedCompanyId, orderIds }, token);
      
      // Refresh invoices and switch tab
      const freshInvoices = await api.get<Invoice[]>('/billing/invoices', token);
      setInvoices(freshInvoices);
      setUnInvoicedOrders([]); // clear
      setActiveTab('history');
    } catch (err: any) {
      alert(`Failed to generate invoice: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleMarkPaid = async (invoiceId: string) => {
    if (!token) return;
    try {
      await api.put(`/billing/invoices/${invoiceId}/pay`, {}, token);
      setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, isPaid: true } : inv));
    } catch (err: any) {
      alert(`Failed to mark paid: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Invoicing</h1>
          <p className="text-sm text-gray-500 mt-1">Generate weekly invoices for companies and track payments.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'history' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Invoice History
          </button>
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'generate' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Generate New
          </button>
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600"></div>
        </div>
      ) : activeTab === 'history' ? (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {invoices.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No invoices generated yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-gray-900">Invoice ID</th>
                    <th className="px-6 py-3 font-semibold text-gray-900">Company</th>
                    <th className="px-6 py-3 font-semibold text-gray-900">Date Generated</th>
                    <th className="px-6 py-3 font-semibold text-gray-900">Total Amount</th>
                    <th className="px-6 py-3 font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 font-semibold text-gray-900 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.map((inv) => {
                    const total = inv.orders.reduce((sum, o) => sum + o.totalAmount, 0);
                    return (
                      <tr key={inv.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-mono text-xs text-gray-500">{inv.id.split('-')[0].toUpperCase()}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{inv.company.name}</td>
                        <td className="px-6 py-4 text-gray-600">{new Date(inv.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">£{total.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          {inv.isPaid ? (
                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Paid</span>
                          ) : (
                            <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">Pending</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {!inv.isPaid && (
                            <button
                              onClick={() => handleMarkPaid(inv.id)}
                              className="text-green-600 hover:text-green-900 font-medium text-sm"
                            >
                              Mark as Paid
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm max-w-2xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate New Invoice</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Company</label>
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="" disabled>Select a company to bill...</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {selectedCompanyId && (
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Un-invoiced Orders</span>
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {unInvoicedOrders.length} orders found
                  </span>
                </div>
                
                {unInvoicedOrders.length > 0 ? (
                  <div className="text-2xl font-bold text-gray-900 mt-4">
                    £{unInvoicedOrders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2)}
                    <span className="text-sm font-normal text-gray-500 ml-2">Total Due</span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-2">This company has no pending confirmed orders to invoice.</p>
                )}
              </div>

              <button
                onClick={handleGenerateInvoice}
                disabled={unInvoicedOrders.length === 0 || generating}
                className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {generating ? 'Generating Invoice...' : 'Generate Invoice Now'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
