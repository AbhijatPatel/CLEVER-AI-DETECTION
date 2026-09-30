'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import {
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Download,
  Loader2,
  Calendar,
  FileText,
  AlertCircle
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/useAuth';

export default function HistoryPage() {
  const { loading: authLoading } = useAuth(true);
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalityFilter, setModalityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.listAnalyses({
        page,
        limit: 10,
        modality: modalityFilter || undefined,
        search: searchQuery || undefined
      });
      setItems(res.items || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (e) {
      console.error('Failed to load history:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, modalityFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this forensic analysis?')) return;
    try {
      await api.deleteAnalysis(id);
      fetchHistory();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto md:pt-0 pt-14">
        <DashboardHeader
          title="Investigation History"
          subtitle="Audit trail of previous forensic examinations, tamper checks, and reports"
        />

        <main className="p-6 sm:p-8 space-y-6 max-w-7xl">
          {/* Filter & Search Bar */}
          <div className="glass-panel p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </form>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Filter className="w-3.5 h-3.5" />
                <span>Modality:</span>
              </div>
              <select
                value={modalityFilter}
                onChange={(e) => {
                  setModalityFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="">All Modalities</option>
                <option value="text">Text</option>
                <option value="document">Document</option>
                <option value="image">Image</option>
                <option value="audio">Audio</option>
                <option value="video">Video</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="glass-panel rounded-2xl overflow-hidden">
            {loading ? (
              <div className="p-12 text-center space-y-3">
                <Loader2 className="w-6 h-6 animate-spin text-cyan-400 mx-auto" />
                <p className="text-xs text-slate-400">Loading forensic records...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="p-12 text-center max-w-sm mx-auto space-y-3">
                <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                <h4 className="text-sm font-semibold text-white">No Analyses Match Criteria</h4>
                <p className="text-xs text-slate-400">
                  {searchQuery || modalityFilter
                    ? 'Try clearing the search query or selecting another filter.'
                    : 'Start by creating your first forensic analysis from the New Analysis tab.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/60 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800/80">
                    <tr>
                      <th className="px-6 py-3.5">Title / File</th>
                      <th className="px-6 py-3.5">Modality</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5">AI Likelihood</th>
                      <th className="px-6 py-3.5">Confidence</th>
                      <th className="px-6 py-3.5">Created</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {items.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="px-6 py-4 font-medium text-white max-w-xs truncate">{item.title}</td>
                        <td className="px-6 py-4 capitalize font-mono text-slate-300">{item.modality}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                              item.status === 'COMPLETED'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : item.status === 'FAILED'
                                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono font-semibold text-slate-200">
                          {item.aiLikelihood !== undefined ? `${item.aiLikelihood}%` : '—'}
                        </td>
                        <td className="px-6 py-4 text-slate-300">{item.detectionConfidence || 'Medium'}</td>
                        <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right space-x-3">
                          <Link
                            href={`/results/${item._id}`}
                            className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1"
                          >
                            Open <ExternalLink className="w-3 h-3" />
                          </Link>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="text-slate-500 hover:text-rose-400 transition-colors"
                            title="Delete record"
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Page {page} of {totalPages} ({total} total analyses)
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
