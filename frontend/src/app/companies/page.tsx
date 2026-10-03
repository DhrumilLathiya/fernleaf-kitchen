'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Company } from '@/types/company';

export default function CompaniesPage() {
  const { token } = useAuth();
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    emailDomains: '',
    deliveryAddresses: '',
    billingContact: ''
  });

  useEffect(() => {
    async function fetchCompanies() {
      if (!token) return;
      setLoading(true);
      try {
        const data = await api.get<Company[]>('/companies', token);
        setCompanies(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanies();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    setSubmitting(true);
    try {
      // Process comma separated lists
      const payload = {
        ...formData,
        emailDomains: formData.emailDomains.split(',').map(s => s.trim()).filter(Boolean),
        deliveryAddresses: formData.deliveryAddresses.split(',').map(s => s.trim()).filter(Boolean)
      };

      const newComp = await api.post<Company>('/companies', payload, token);
      setCompanies(prev => [...prev, newComp]);
      setIsModalOpen(false);
      setFormData({ name: '', emailDomains: '', deliveryAddresses: '', billingContact: '' });
    } catch (err: any) {
      alert(`Failed to add company: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">B2B Companies</h1>
          <p className="text-sm text-gray-500 mt-1">Manage partner companies, billing contacts, and delivery locations.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 transition-colors"
        >
          + Add Company
        </button>
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
                  <th className="px-6 py-3 font-semibold text-gray-900">Company Name</th>
                  <th className="px-6 py-3 font-semibold text-gray-900">Billing Contact</th>
                  <th className="px-6 py-3 font-semibold text-gray-900">Allowed Domains</th>
                  <th className="px-6 py-3 font-semibold text-gray-900">Delivery Addresses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {companies.map((comp) => (
                  <tr key={comp.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {comp.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{comp.billingContact}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {comp.emailDomains.map(d => (
                          <span key={d} className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                            @{d}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <ul className="list-disc pl-4 text-gray-500 text-xs space-y-1">
                        {comp.deliveryAddresses.map((addr, idx) => (
                          <li key={idx}>{addr}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
                {companies.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      No companies found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Add New Company</h2>
              <p className="text-sm text-gray-500 mt-1">Register a new B2B client.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Billing Contact Name/Email</label>
                <input
                  required
                  type="text"
                  value={formData.billingContact}
                  onChange={e => setFormData({...formData, billingContact: e.target.value})}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Domains (comma-separated)</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. acme.com, tech.acme.com"
                  value={formData.emailDomains}
                  onChange={e => setFormData({...formData, emailDomains: e.target.value})}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Addresses (comma-separated)</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. 123 Main St HQ, 456 Annex Bldg"
                  value={formData.deliveryAddresses}
                  onChange={e => setFormData({...formData, deliveryAddresses: e.target.value})}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-600 rounded-md transition-colors disabled:bg-gray-400"
                >
                  {submitting ? 'Registering...' : 'Register Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
