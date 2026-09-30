'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { Key, Plus, Trash2, Copy, Check, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [creating, setCreating] = useState(false);
  const [newKeySecret, setNewKeySecret] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchKeys = async () => {
    try {
      const res = await api.listApiKeys();
      setKeys(res.keys || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await api.createApiKey(keyName);
      setNewKeySecret(res.apiKey);
      setKeyName('');
      fetchKeys();
    } catch (err: any) {
      alert(err.message || 'Key creation failed');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this API key? Applications using it will lose access immediately.')) return;
    try {
      await api.deleteApiKey(id);
      fetchKeys();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <DashboardHeader
          title="Developer API Keys"
          subtitle="Generate and manage programmatic API credentials for automated multi-modal forensic ingestion"
        />

        <main className="p-6 sm:p-8 space-y-6 max-w-7xl">
          {/* Top Panel */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl">
            <div>
              <h3 className="text-base font-bold text-white">Active Secret Keys</h3>
              <p className="text-xs text-slate-400">
                Authenticate server-to-server requests using the <code className="text-cyan-400">x-api-key</code> header
              </p>
            </div>
            <button
              onClick={() => {
                setNewKeySecret(null);
                setCreateModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-semibold hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-glow"
            >
              <Plus className="w-4 h-4" />
              <span>Generate New API Key</span>
            </button>
          </div>

          {/* Keys Table */}
          <div className="glass-panel rounded-2xl overflow-hidden">
            {loading ? (
              <div className="p-12 text-center space-y-3">
                <Loader2 className="w-6 h-6 animate-spin text-cyan-400 mx-auto" />
                <p className="text-xs text-slate-400">Loading API keys...</p>
              </div>
            ) : keys.length === 0 ? (
              <div className="p-12 text-center max-w-sm mx-auto space-y-3">
                <Key className="w-8 h-8 text-slate-600 mx-auto" />
                <h4 className="text-sm font-semibold text-white">No API Keys Generated</h4>
                <p className="text-xs text-slate-400">
                  Generate an API key to integrate Clever AI detection pipelines into automated pipelines.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/60 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800/80">
                    <tr>
                      <th className="px-6 py-3.5">Name</th>
                      <th className="px-6 py-3.5">Key Prefix</th>
                      <th className="px-6 py-3.5">Permissions</th>
                      <th className="px-6 py-3.5">Created</th>
                      <th className="px-6 py-3.5">Last Used</th>
                      <th className="px-6 py-3.5 text-right">Revoke</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {keys.map((k) => (
                      <tr key={k._id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="px-6 py-4 font-semibold text-white">{k.name}</td>
                        <td className="px-6 py-4 font-mono text-cyan-400">{k.keyPrefix}...</td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-800">
                            {k.permissions?.join(', ') || 'analysis:full'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                          {new Date(k.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                          {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(k._id)}
                            className="text-slate-500 hover:text-rose-400 transition-colors"
                            title="Revoke Key"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Creation Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-slate-800 space-y-4">
            {newKeySecret ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="text-sm font-bold uppercase font-mono">API Key Created Successfully</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Please copy this secret key now. For security purposes, <strong className="text-white">it will never be displayed again</strong>.
                </p>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between gap-2 font-mono text-xs text-cyan-300 break-all">
                  <span>{newKeySecret}</span>
                  <button
                    onClick={() => copyToClipboard(newKeySecret)}
                    className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg shrink-0"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  onClick={() => {
                    setNewKeySecret(null);
                    setCreateModalOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white hover:border-slate-600"
                >
                  I Have Saved My Secret Key
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="space-y-4">
                <h3 className="text-base font-bold text-white">Create New API Secret Key</h3>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Key Name / Description</label>
                  <input
                    type="text"
                    required
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    placeholder="e.g. CI/CD Ingestion Worker / Backend Microservice"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-glow disabled:opacity-50"
                  >
                    {creating ? 'Generating...' : 'Create Key'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
