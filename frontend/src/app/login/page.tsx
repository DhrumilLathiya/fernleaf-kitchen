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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black font-sans selection:bg-emerald-500 selection:text-white">
      {/* Cinematic Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-[url('/images/login-bg.jpg')] bg-cover bg-center bg-no-repeat transition-transform duration-10000 scale-105"
      />
      
      {/* Moody Overlay with smooth gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90 backdrop-blur-[2px]" />

      <div className="relative z-10 w-full max-w-5xl px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        {/* Left Side: Brand Story */}
        <div className="hidden lg:flex flex-1 flex-col justify-center space-y-8 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-500/30">
              <span className="text-3xl text-white drop-shadow-md">🌿</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-lg">Fernleaf Kitchen</h1>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-5xl font-black leading-[1.1] text-white drop-shadow-2xl">
              Elevate your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                catering experience.
              </span>
            </h2>
            <p className="max-w-md text-lg leading-relaxed text-white/80 drop-shadow">
              Welcome to the ultimate command center. Seamlessly manage cut-offs, dispatch logistics, and culinary prep across your entire enterprise.
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <div className="h-1 w-12 rounded-full bg-emerald-500" />
            <div className="h-1 w-4 rounded-full bg-white/20" />
            <div className="h-1 w-4 rounded-full bg-white/20" />
          </div>
        </div>

        {/* Right Side: Glassmorphism Login Card */}
        <div className="w-full max-w-md flex-shrink-0 animate-fade-in">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white/10 p-8 shadow-2xl backdrop-blur-2xl border border-white/20 ring-1 ring-black/5">
            
            {/* Subtle glow effect behind card */}
            <div className="absolute -inset-1 z-[-1] bg-gradient-to-br from-emerald-500/20 to-transparent blur-2xl" />

            {/* Mobile Logo (visible only on small screens) */}
            <div className="mb-10 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg">
                <span className="text-2xl text-white">🌿</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Fernleaf</h1>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white tracking-wide">Welcome back</h3>
              <p className="mt-2 text-sm text-white/60 font-medium">Please sign in to your dashboard.</p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-500/20 border border-red-500/30 p-4 backdrop-blur-md transition-all">
                <span className="text-red-400">⚠️</span>
                <p className="text-sm font-medium text-red-100">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-white/70">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-white/40 group-focus-within:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@fernleaf.com"
                    className="block w-full rounded-2xl border-0 bg-white/5 py-4 pl-12 pr-4 text-white placeholder-white/30 ring-1 ring-inset ring-white/10 transition-all focus:bg-white/10 focus:ring-2 focus:ring-inset focus:ring-emerald-400 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-white/70">
                    Password
                  </label>
                  <a href="#" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-white/40 group-focus-within:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full rounded-2xl border-0 bg-white/5 py-4 pl-12 pr-12 text-white placeholder-white/30 ring-1 ring-inset ring-white/10 transition-all focus:bg-white/10 focus:ring-2 focus:ring-inset focus:ring-emerald-400 sm:text-sm sm:leading-6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white transition-colors"
                  >
                    {showPass ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] hover:shadow-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-70 disabled:hover:scale-100"
              >
                {loading ? (
                  <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In to Portal
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                )}
              </button>
            </form>
          </div>
          
          <p className="mt-8 text-center text-sm text-white/40 font-medium">
            © {new Date().getFullYear()} Fernleaf Kitchen. All rights reserved.
          </p>
        </div>
      </div>
      
      {/* Global styling for the simple animations if not already in tailwind config */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 1.2s ease-out forwards;
        }
      `}} />
    </div>
  );
}
