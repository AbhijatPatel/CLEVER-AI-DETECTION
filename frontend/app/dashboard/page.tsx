'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import {
  FileText,
  Image as ImageIcon,
  Mic,
  Video,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.getDashboardStats();
        setStats(data);
      } catch (e) {
        console.error('Failed to load dashboard stats:', e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const total = stats?.totalAnalyses || 0;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <DashboardHeader
          title="Forensic Operations Center"
          subtitle="Real-time multi-modal content authentication and evidence dashboard"
        />

        <main className="p-6 sm:p-8 space-y-8 max-w-7xl">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            <div className="glass-card p-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Total Analyses</span>
              <div className="text-2xl font-bold text-white mt-1">{loading ? '...' : total}</div>
              <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-cyan-400" /> All modalities
              </div>
            </div>

            <div className="glass-card p-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Documents / Text</span>
              <div className="text-2xl font-bold text-indigo-400 mt-1">
                {loading ? '...' : (stats?.documentsAnalyzed || 0) + (stats?.textAnalyzed || 0)}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                <FileText className="w-3 h-3 text-indigo-400" /> PDF, DOCX, TXT
              </div>
            </div>

            <div className="glass-card p-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Images Forensics</span>
              <div className="text-2xl font-bold text-rose-400 mt-1">{loading ? '...' : stats?.imagesAnalyzed || 0}</div>
              <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                <ImageIcon className="w-3 h-3 text-rose-400" /> EXIF & ELA
              </div>
            </div>

            <div className="glass-card p-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Audio / Speech</span>
              <div className="text-2xl font-bold text-amber-400 mt-1">{loading ? '...' : stats?.audioAnalyzed || 0}</div>
              <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                <Mic className="w-3 h-3 text-amber-400" /> Synthetics
              </div>
            </div>

            <div className="glass-card p-4 col-span-2 sm:col-span-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Deepfake Videos</span>
              <div className="text-2xl font-bold text-sky-400 mt-1">{loading ? '...' : stats?.videosAnalyzed || 0}</div>
              <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                <Video className="w-3 h-3 text-sky-400" /> Temporal checks
              </div>
            </div>
          </div>

          {/* Forensic Distribution Bar & Summary */}
          {total > 0 && (
            <div className="glass-panel p-6 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800/80 gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-white">Aggregated Signal Distribution</h3>
                  <p className="text-xs text-slate-400">Proportional classification across verified investigations</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-rose-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> AI-dominant ({stats.aiLikeCount})
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Human-dominant ({stats.humanLikeCount})
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Mixed / Uncertain ({stats.uncertainCount})
                  </span>
                </div>
              </div>

              {/* Proportional distribution bar */}
              <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden flex">
                <div
                  className="bg-rose-500 h-full transition-all"
                  style={{ width: `${(stats.aiLikeCount / total) * 100}%` }}
                  title="AI-like"
                />
                <div
                  className="bg-emerald-500 h-full transition-all"
                  style={{ width: `${(stats.humanLikeCount / total) * 100}%` }}
                  title="Human-like"
                />
                <div
                  className="bg-amber-500 h-full transition-all"
                  style={{ width: `${(stats.uncertainCount / total) * 100}%` }}
                  title="Uncertain"
                />
              </div>
            </div>
          )}

          {/* Recent Analyses Table OR Meaningful Empty State */}
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Recent Analyses</h3>
                <p className="text-xs text-slate-400">Most recent forensic inspections and verification jobs</p>
              </div>
              <Link
                href="/history"
                className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                View Full History <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {total === 0 ? (
              // Meaningful Empty State for New Account (Never fake data!)
              <div className="p-12 text-center max-w-md mx-auto space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <Search className="w-7 h-7 text-cyan-400" />
                </div>
                <h4 className="text-base font-semibold text-white">No Analyses Created Yet</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your workspace is clean. Start by pasting text or uploading a document, image, audio, or video file
                  to generate your first probabilistic forensic breakdown.
                </p>
                <div className="pt-2">
                  <Link
                    href="/analyze"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-semibold hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-glow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create First Analysis</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/60 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800/80">
                    <tr>
                      <th className="px-6 py-3.5">Artifact / File</th>
                      <th className="px-6 py-3.5">Modality</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5">AI Likelihood</th>
                      <th className="px-6 py-3.5">Confidence</th>
                      <th className="px-6 py-3.5">Date</th>
                      <th className="px-6 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {stats?.recentAnalyses?.map((item: any) => (
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
                                : 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
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
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/results/${item._id}`}
                            className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium"
                          >
                            Inspect <ExternalLink className="w-3 h-3" />
                          </Link>
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
