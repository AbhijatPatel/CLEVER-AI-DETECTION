'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { ShieldAlert, Filter, Loader2, FileSearch } from 'lucide-react';
import { api } from '@/lib/api';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionFilter, setActionFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.listAuditLogs({
        page,
        action: actionFilter || undefined
      });
      setLogs(res.logs || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, actionFilter]);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto md:pt-0 pt-14">
        <DashboardHeader
          title="Enterprise Audit Trails"
          subtitle="Immutable chronological compliance ledger recording logins, uploads, inspections, and report exports"
        />

        <main className="p-6 sm:p-8 space-y-6 max-w-7xl">
          {/* Action Filter */}
          <div className="glass-panel p-4 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <span>Filter by Action:</span>
            </div>
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="">All Actions</option>
              <option value="LOGIN">LOGIN</option>
              <option value="LOGOUT">LOGOUT</option>
              <option value="FILE_UPLOAD">FILE_UPLOAD</option>
              <option value="ANALYSIS_CREATED">ANALYSIS_CREATED</option>
              <option value="REPORT_GENERATED">REPORT_GENERATED</option>
              <option value="FILE_DELETED">FILE_DELETED</option>
              <option value="API_KEY_CREATED">API_KEY_CREATED</option>
            </select>
          </div>

          {/* Audit Logs Table */}
          <div className="glass-panel rounded-2xl overflow-hidden">
            {loading ? (
              <div className="p-12 text-center space-y-3">
                <Loader2 className="w-6 h-6 animate-spin text-cyan-400 mx-auto" />
                <p className="text-xs text-slate-400">Loading audit records...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="p-12 text-center max-w-sm mx-auto space-y-3">
                <FileSearch className="w-8 h-8 text-slate-600 mx-auto" />
                <h4 className="text-sm font-semibold text-white">No Audit Events Logged</h4>
                <p className="text-xs text-slate-400">Audit logs will populate automatically as actions occur.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/60 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800/80">
                    <tr>
                      <th className="px-6 py-3.5">Timestamp</th>
                      <th className="px-6 py-3.5">Action</th>
                      <th className="px-6 py-3.5">User</th>
                      <th className="px-6 py-3.5">Target Resource</th>
                      <th className="px-6 py-3.5">Request ID</th>
                      <th className="px-6 py-3.5 text-right">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {logs.map((log) => (
                      <tr key={log._id} className="hover:bg-slate-900/40 transition-colors font-mono">
                        <td className="px-6 py-4 text-slate-400 text-[11px]">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.action.includes('CREATED') || log.action === 'LOGIN'
                                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                                : log.action.includes('DELETED')
                                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-200">{log.userEmail}</td>
                        <td className="px-6 py-4 text-slate-400 truncate max-w-xs">{log.resource}</td>
                        <td className="px-6 py-4 text-slate-500 text-[10px]">{log.requestId}</td>
                        <td className="px-6 py-4 text-right text-slate-400 text-[11px]">
                          {log.ipAddress || '127.0.0.1'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Page {page} of {totalPages} ({total} audit records)
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
