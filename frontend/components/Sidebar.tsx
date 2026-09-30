'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  LayoutDashboard,
  Search,
  History,
  FileText,
  Users,
  Key,
  ShieldAlert,
  Settings,
  Code2,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { api } from '@/lib/api';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'New Analysis', href: '/analyze', icon: Search },
  { label: 'Investigation History', href: '/history', icon: History },
  { label: 'Forensic Reports', href: '/reports', icon: FileText },
  { label: 'Team & RBAC', href: '/team', icon: Users },
  { label: 'Developer API Keys', href: '/api-keys', icon: Key },
  { label: 'Audit Logs', href: '/audit-logs', icon: ShieldAlert },
  { label: 'API Documentation', href: '/docs', icon: Code2 },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await api.logout();
    window.location.href = '/';
  };

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-900 flex flex-col justify-between shrink-0 hidden md:flex min-h-screen sticky top-0">
      <div>
        {/* Brand header */}
        <div className="h-20 px-6 flex items-center border-b border-slate-900">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-glow">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-wider text-white">CLEVER</span>
              <span className="font-bold text-lg tracking-wider text-cyan-400 ml-1">AI</span>
              <span className="block text-[9px] tracking-widest text-slate-500 uppercase font-mono">Forensics Suite</span>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="p-4 space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-950/50 text-cyan-300 border border-cyan-700/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User info & Signout */}
      <div className="p-4 border-t border-slate-900">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/30 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
