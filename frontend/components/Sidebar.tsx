'use client';

import React, { useState, useEffect } from 'react';
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
  ChevronRight,
  Menu,
  X,
  User
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

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role?: string } | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('clever_user');
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch (e) {}
    }
  }, []);

  const handleLogout = async () => {
    await api.logout();
    window.location.href = '/';
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand header */}
      <div className="h-20 px-6 flex items-center border-b border-slate-900 shrink-0">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-cyan-500/30 shadow-glow bg-slate-950 flex items-center justify-center shrink-0">
            <img src="/logo.jpg" alt="CLEVER AI Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-wider text-white">CLEVER</span>
            <span className="font-bold text-lg tracking-wider text-cyan-400 ml-1">AI</span>
            <span className="block text-[9px] tracking-widest text-slate-500 uppercase font-mono">Forensics Suite</span>
          </div>
        </Link>
      </div>

      {/* Navigation list */}
      <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
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

      {/* User info & Signout */}
      <div className="p-4 border-t border-slate-900 shrink-0 space-y-2">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-600 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/30 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-slate-950/95 backdrop-blur border-b border-slate-900 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl overflow-hidden border border-cyan-500/30 shadow-glow bg-slate-950 flex items-center justify-center shrink-0">
            <img src="/logo.jpg" alt="CLEVER AI Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-base tracking-wider text-white">
            CLEVER <span className="text-cyan-400">AI</span>
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`md:hidden fixed top-14 left-0 bottom-0 z-40 w-72 bg-slate-950 border-r border-slate-900 transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className={`w-64 bg-slate-950 border-r border-slate-900 hidden md:flex flex-col min-h-screen sticky top-0 h-screen ${className}`}>
        <SidebarContent />
      </aside>
    </>
  );
}
