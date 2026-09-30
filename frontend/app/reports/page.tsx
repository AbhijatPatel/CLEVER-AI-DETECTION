'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { FileText, Download, Lock, Loader2, ExternalLink } from 'lucide-react';
import { api } from '@/lib/api';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await api.listReports();
        setReports(res.reports || []);
      } catch (e) {
        console.error('Failed to load reports:', e);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto md:pt-0 pt-14">
        <DashboardHeader
          title="Forensic PDF Reports"
          subtitle="Certified digital evidence dossiers generated for compliance, audits, and legal review"
        />

        <main className="p-6 sm:p-8 space-y-6 max-w-7xl">
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Generated Forensic Reports</h3>
              <p className="text-xs text-slate-400">All PDF outputs with cryptographic SHA-256 chain of custody</p>
            </div>

            {loading ? (
              <div className="p-12 text-center space-y-3">
                <Loader2 className="w-6 h-6 animate-spin text-cyan-400 mx-auto" />
                <p className="text-xs text-slate-400">Loading reports...</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="p-12 text-center max-w-sm mx-auto space-y-3">
                <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                <h4 className="text-sm font-semibold text-white">No Reports Generated Yet</h4>
                <p className="text-xs text-slate-400">
                  You can export a certified 13-section PDF report from any completed analysis page.
                </p>
                <div className="pt-2">
                  <Link
                    href="/history"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-cyan-400"
                  >
                    Go to Analyses
                  </Link>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/60 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800/80">
                    <tr>
                      <th className="px-6 py-3.5">Report Number</th>
                      <th className="px-6 py-3.5">Target Title</th>
                      <th className="px-6 py-3.5">SHA-256 Hash</th>
                      <th className="px-6 py-3.5">Date Generated</th>
                      <th className="px-6 py-3.5 text-right">Download</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {reports.map((r) => (
                      <tr key={r._id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-cyan-400">{r.reportNumber}</td>
                        <td className="px-6 py-4 font-medium text-white">{r.title}</td>
                        <td className="px-6 py-4 font-mono text-slate-400 max-w-xs truncate">{r.sha256Hash}</td>
                        <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                          {new Date(r.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <a
                            href={api.getReportDownloadUrl(r._id)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500 text-white font-medium"
                          >
                            <Download className="w-3.5 h-3.5 text-cyan-400" />
                            <span>PDF</span>
                          </a>
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
    </div>
  );
}
