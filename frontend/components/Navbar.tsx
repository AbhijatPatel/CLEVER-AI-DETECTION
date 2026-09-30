'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Menu, X, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import { api } from '@/lib/api';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Check stored user
    const saved = localStorage.getItem('clever_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {}
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 shadow-lg'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-wider text-white">CLEVER</span>
            <span className="font-bold text-xl tracking-wider text-cyan-400 ml-1.5">AI</span>
            <span className="block text-[10px] tracking-widest text-slate-400 uppercase font-mono">Forensics Lab</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link href="/#technology" className="hover:text-cyan-400 transition-colors">
            Technology
          </Link>
          <Link href="/#solutions" className="hover:text-cyan-400 transition-colors">
            Solutions
          </Link>
          <Link href="/#forensics" className="hover:text-cyan-400 transition-colors">
            Forensics
          </Link>
          <Link href="/#security" className="hover:text-cyan-400 transition-colors">
            Security
          </Link>
          <Link href="/docs" className="hover:text-cyan-400 transition-colors">
            API Docs
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm font-medium text-slate-200 hover:border-cyan-500/50 transition-all"
              >
                <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/analyze"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-sm font-semibold hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-glow hover:shadow-cyan-500/30"
              >
                Start Analysis
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 px-6 py-6 space-y-4">
          <Link
            href="/#technology"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-cyan-400 py-1"
          >
            Technology
          </Link>
          <Link
            href="/#solutions"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-cyan-400 py-1"
          >
            Solutions
          </Link>
          <Link
            href="/#security"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-cyan-400 py-1"
          >
            Security
          </Link>
          <Link
            href="/docs"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-cyan-400 py-1"
          >
            API Docs
          </Link>
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg bg-cyan-600 text-white font-medium"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-slate-300 hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/analyze"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold"
                >
                  Start Analysis
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
