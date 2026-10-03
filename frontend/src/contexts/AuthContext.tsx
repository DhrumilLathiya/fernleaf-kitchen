'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface AuthUser {
  id: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('fl_token');
      const storedUser = localStorage.getItem('fl_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Force sync cookie so proxy knows we are logged in
        document.cookie = `fl_token=${storedToken}; path=/; max-age=604800; samesite=lax`;
      }
    } catch (err) {
      console.error('Failed to parse user session:', err);
      // Clear corrupt data
      localStorage.removeItem('fl_token');
      localStorage.removeItem('fl_user');
      document.cookie = 'fl_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message ?? 'Invalid email or password');
    }

    const data = await res.json();
    const { accessToken, user: userData } = data;

    // Also set as cookie for server-side proxy/middleware
    document.cookie = `fl_token=${accessToken}; path=/; max-age=604800; samesite=lax`;

    localStorage.setItem('fl_token', accessToken);
    localStorage.setItem('fl_user', JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    // Remove cookie
    document.cookie = 'fl_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    localStorage.removeItem('fl_token');
    localStorage.removeItem('fl_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
