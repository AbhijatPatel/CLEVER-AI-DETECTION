'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { Settings, Shield, Lock, Bell, Check, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [retentionDays, setRetentionDays] = useState('90');
  const [autoGenerateReports, setAutoGenerateReports] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('clever_user');
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch (e) {}
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto md:pt-0 pt-14">
        <DashboardHeader
          title="Workspace & Forensics Settings"
          subtitle="Configure retention schedules, privacy policies, and organization parameters"
        />

        <main className="p-6 sm:p-8 space-y-6 max-w-4xl">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Account Information */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                Investigator Profile
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    disabled
                    value={user?.name || 'Investigator'}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || 'user@clever.ai'}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* Retention & Privacy Policy */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Forensic Retention & Privacy</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Artifact Data Retention Schedule</label>
                  <select
                    value={retentionDays}
                    onChange={(e) => setRetentionDays(e.target.value)}
                    className="w-full sm:w-64 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="30">30 Days (Strict compliance)</option>
                    <option value="90">90 Days (Standard retention)</option>
                    <option value="365">365 Days (Legal hold)</option>
                    <option value="0">Immediate purge after report creation</option>
                  </select>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoGenerateReports}
                      onChange={(e) => setAutoGenerateReports(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                    />
                    <span className="text-slate-300">
                      Automatically generate certified PDF reports for every completed analysis
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-semibold hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-glow"
              >
                {saved ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Preferences Saved</span>
                  </>
                ) : (
                  <span>Save Configuration</span>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
