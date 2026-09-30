'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/lib/useAuth';
import { Loader2 } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Wraps all authenticated dashboard pages:
 * - Enforces auth guard (redirects to /login if not authenticated)
 * - Renders the Sidebar on desktop + mobile hamburger nav
 * - Adds mobile top-bar padding (pt-14 on mobile, none on desktop)
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { loading: authLoading } = useAuth(true);

  if (authLoading) {
    return (
      <div className="flex min-h-screen bg-slate-950 items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Authenticating workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto md:pt-0 pt-14">
        {children}
      </div>
    </div>
  );
}
