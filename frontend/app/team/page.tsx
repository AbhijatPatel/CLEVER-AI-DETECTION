'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { Users, UserPlus, Shield, Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function TeamPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Analyst');
  const [inviteName, setInviteName] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchMembers = async () => {
    try {
      const res = await api.listTeamMembers();
      setMembers(res.members || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    try {
      await api.inviteMember(inviteEmail, inviteRole, inviteName);
      setSuccessMessage(`Invitation successfully dispatched to ${inviteEmail}`);
      setInviteModalOpen(false);
      setInviteEmail('');
      setInviteName('');
    } catch (err: any) {
      alert(err.message || 'Invitation failed');
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto md:pt-0 pt-14">
        <DashboardHeader
          title="Team Management & Access Control"
          subtitle="Manage workspace collaborators, Role-Based Access Controls (RBAC), and investigation permissions"
        />

        <main className="p-6 sm:p-8 space-y-6 max-w-7xl">
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center gap-2.5 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Top Actions & Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl">
            <div>
              <h3 className="text-base font-bold text-white">Active Team Members</h3>
              <p className="text-xs text-slate-400">
                Investigators and analysts with access to organization forensic cases
              </p>
            </div>
            <button
              onClick={() => setInviteModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-semibold hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-glow"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite Investigator</span>
            </button>
          </div>

          {/* Members Table */}
          <div className="glass-panel rounded-2xl overflow-hidden">
            {loading ? (
              <div className="p-12 text-center space-y-3">
                <Loader2 className="w-6 h-6 animate-spin text-cyan-400 mx-auto" />
                <p className="text-xs text-slate-400">Loading team members...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/60 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800/80">
                    <tr>
                      <th className="px-6 py-3.5">Name</th>
                      <th className="px-6 py-3.5">Email</th>
                      <th className="px-6 py-3.5">Role (RBAC)</th>
                      <th className="px-6 py-3.5">Member Since</th>
                      <th className="px-6 py-3.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {members.map((m) => (
                      <tr key={m._id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="px-6 py-4 font-semibold text-white flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[11px] font-bold text-cyan-400">
                            {m.name ? m.name[0] : 'U'}
                          </div>
                          <span>{m.name}</span>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-300">{m.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              m.role === 'Admin'
                                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                                : m.role === 'Manager'
                                ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}
                          >
                            {m.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                          {new Date(m.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-emerald-400 font-mono text-[11px]">Active</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Roles & Permissions Reference Card */}
          <div className="glass-panel p-6 rounded-2xl">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider mb-4">
              RBAC Role Hierarchy & Security Matrix
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <span className="font-bold text-cyan-400 block mb-1">Admin</span>
                <p className="text-slate-400 text-[11px]">
                  Full system control, billing, API key generation, member deletion, audit log access.
                </p>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <span className="font-bold text-indigo-400 block mb-1">Manager</span>
                <p className="text-slate-400 text-[11px]">
                  Invite members, assign analysis jobs, view organization reports and aggregate statistics.
                </p>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <span className="font-bold text-slate-200 block mb-1">Analyst</span>
                <p className="text-slate-400 text-[11px]">
                  Create new analyses, execute multi-modal pipelines, inspect evidence, generate certified PDF reports.
                </p>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <span className="font-bold text-slate-400 block mb-1">Member</span>
                <p className="text-slate-400 text-[11px]">
                  Read-only view for shared organizational forensic investigations and reports.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Invite Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Invite New Investigator</h3>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Officer Jane Doe"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="jane.doe@unit.gov"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Analyst">Analyst (Forensic execution & reports)</option>
                  <option value="Manager">Manager (Team & case management)</option>
                  <option value="Admin">Admin (Full administrative rights)</option>
                  <option value="Member">Member (Read-only viewing)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviteLoading}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-glow disabled:opacity-50"
                >
                  {inviteLoading ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
