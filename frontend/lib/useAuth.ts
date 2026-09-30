'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api } from './api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId?: string;
  organizationName?: string;
}

const PUBLIC_ROUTES = ['/', '/login', '/register', '/forgot-password', '/reset-password'];

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('clever_access_token');
    const raw = localStorage.getItem('clever_user');

    if (!token) {
      if (requireAuth && !PUBLIC_ROUTES.includes(pathname || '')) {
        router.replace('/login');
      }
      setLoading(false);
      return;
    }

    // Load user from localStorage first for instant display
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch (e) {}
    }

    // Verify token is still valid by calling /auth/me
    api
      .getMe()
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem('clever_user', JSON.stringify(data.user));
        }
      })
      .catch(() => {
        // Token invalid or expired — clear and redirect
        api.clearTokens();
        if (requireAuth && !PUBLIC_ROUTES.includes(pathname || '')) {
          router.replace('/login');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pathname, requireAuth, router]);

  return { user, loading, isAuthenticated: !!user };
}
