'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, ShieldCheck, User as UserIcon, Plus } from 'lucide-react';

export default function DashboardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem('clever_user');
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch (e) {}
    }
  }, []);

  return (
    <header className="h-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/analyze"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-semibold hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-glow"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Analysis</span>
        </Link>

        {user && (
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-cyan-400 uppercase">
              {user.name ? user.name[0] : 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-medium text-slate-200 leading-tight">{user.name}</span>
              <span className="block text-[10px] text-slate-500 font-mono">{user.role}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
