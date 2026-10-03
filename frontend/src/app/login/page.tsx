'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.replace('/');
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#0f2420]">

      {/* ── Decorative blobs ── */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#1B3B36] opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-[400px] w-[400px] rounded-full bg-emerald-900 opacity-30 blur-3xl" />

      {/* ── Left panel — branding ── */}
      <div className="relative hidden w-1/2 flex-col justify-between p-14 lg:flex">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white text-xl font-bold shadow">
            🌿
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Fernleaf Kitchen</span>
        </div>

        {/* Hero text */}
        <div className="space-y-6">
          <div className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-400">
            Admin Panel
          </div>
          <h1 className="text-5xl font-bold leading-tight text-white">
            Delicious food,<br />
            <span className="text-emerald-400">perfectly managed.</span>
          </h1>
          <p className="text-base text-white/50 max-w-sm leading-relaxed">
            From cut-off schedules to kitchen prep boards — everything you need to run a world-class corporate catering operation.
          </p>
        </div>

        {/* Feature bullets */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '🍽️', label: 'Menu Catalogue' },
            { icon: '📦', label: 'Order Management' },
            { icon: '🏭', label: 'Kitchen Boards' },
            { icon: '🚚', label: 'Dispatch & Drivers' },
            { icon: '💷', label: 'Billing & Invoices' },
            { icon: '📊', label: 'Reports & Analytics' },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-3">
              <span className="text-lg">{f.icon}</span>
              <span className="text-sm font-medium text-white/70">{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel — login form ── */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-14">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Top accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600" />

            <div className="p-8 sm:p-10">
              {/* Mobile logo */}
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1B3B36] text-white text-lg font-bold">
                  🌿
                </div>
                <span className="text-lg font-bold text-gray-900">Fernleaf Kitchen</span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
              <p className="mt-1.5 text-sm text-gray-500">
                Sign in to access your admin dashboard
              </p>

              {/* Error banner */}
              {error && (
                <div className="mt-5 flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 p-4">
                  <span className="text-base">⚠️</span>
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </span>
                    <input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@fernleaf.com"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 transition focus:border-[#1B3B36] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3B36]/20"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <button type="button" className="text-xs text-[#1B3B36] font-medium hover:underline">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                    <input
                      id="password"
                      type={showPass ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-12 text-sm text-gray-900 placeholder-gray-400 transition focus:border-[#1B3B36] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3B36]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((s) => !s)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPass ? (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  id="login-submit"
                  type="submit"
                  disabled={loading}
                  className="relative w-full overflow-hidden rounded-xl bg-[#1B3B36] py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#132A26] focus:outline-none focus:ring-2 focus:ring-[#1B3B36]/50 disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Signing in…
                    </span>
                  ) : (
                    'Sign in to Dashboard'
                  )}
                </button>
              </form>


            </div>
          </div>

          <p className="mt-6 text-center text-xs text-white/30">
            © {new Date().getFullYear()} Fernleaf Kitchen · All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
