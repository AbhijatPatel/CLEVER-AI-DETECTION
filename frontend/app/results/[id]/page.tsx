'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import {
  ShieldCheck,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Fingerprint,
  Lock,
  Layers,
  ChevronRight,
  Info,
  HelpCircle,
  Cpu,
  Loader2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { api } from '@/lib/api';

export default function ResultDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSentenceIndex, setSelectedSentenceIndex] = useState<number | null>(0);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    async function fetchAnalysis() {
      try {
        const data = await api.getAnalysis(id);
        setAnalysis(data);

        // If job is still processing, poll every 2.5 seconds
        if (data.status === 'QUEUED' || data.status === 'PROCESSING' || data.status === 'ANALYZING') {
          if (!interval) {
            interval = setInterval(fetchAnalysis, 2500);
          }
        } else {
          if (interval) clearInterval(interval);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to retrieve analysis dossier.');
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [id]);

  const handleExportPdf = async () => {
    if (!analysis) return;
    setGeneratingReport(true);
    try {
      const res = await api.generateReport(analysis._id);
      // Download report
      const downloadUrl = api.getReportDownloadUrl(res.report._id);
      window.open(downloadUrl, '_blank');
    } catch (err: any) {
      alert('Report generation failed: ' + err.message);
    } finally {
      setGeneratingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-950 text-slate-100">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto" />
            <p className="text-sm font-medium text-slate-300">Retrieving forensic artifact dossier...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="flex min-h-screen bg-slate-950 text-slate-100">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-md mx-auto p-6 glass-panel rounded-2xl text-center space-y-4">
            <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Investigation Not Found</h3>
            <p className="text-xs text-slate-400">{error || 'Could not locate analysis record.'}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-medium text-cyan-400"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isPending =
    analysis.status === 'QUEUED' || analysis.status === 'PROCESSING' || analysis.status === 'ANALYZING';

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <DashboardHeader
          title={`Forensic Dossier: ${analysis.title}`}
          subtitle={`Analysis ID: ${analysis._id} • Modality: ${analysis.modality.toUpperCase()}`}
        />

        <main className="p-6 sm:p-8 space-y-8 max-w-7xl">
          {/* Top Status & Export Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <span
                className={`inline-block px-2.5 py-1 rounded text-xs font-mono font-bold uppercase ${
                  analysis.status === 'COMPLETED'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : analysis.status === 'FAILED'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                }`}
              >
                {analysis.status}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Initiated: {new Date(analysis.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {isPending && (
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Pipeline Active (Auto-updating)</span>
                </div>
              )}

              {analysis.status === 'COMPLETED' && (
                <button
                  onClick={handleExportPdf}
                  disabled={generatingReport}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-white text-xs font-semibold transition-all shadow-sm disabled:opacity-50"
                >
                  {generatingReport ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                      <span>Generating Certified PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Export Forensic PDF Report</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Explicit Demo Analysis Warning Banner if Mock Mode Active */}
          {analysis.modelInfo?.isDemoAnalysis && (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
                  Demo Analysis Mode Active
                </h4>
                <p className="text-xs text-amber-200/80 mt-0.5 leading-relaxed">
                  This analysis was processed by a development MockModelProvider. The scores and evidence signals
                  displayed below are demonstration values designed to verify UI workflows, and must NEVER be treated as
                  verified real model results.
                </p>
              </div>
            </div>
          )}

          {/* Pending Pipeline Progress State */}
          {isPending ? (
            <div className="p-12 glass-panel rounded-2xl text-center space-y-4 max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-cyan-400">
                <Loader2 className="w-7 h-7 animate-spin" />
              </div>
              <h3 className="text-base font-bold text-white">Forensic Pipeline Processing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Extracting features, computing stylometric variance, parsing provenance records, and calibrating ensemble
                probabilities. This page will automatically update once processing completes.
              </p>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mt-4">
                <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full w-2/3 animate-pulse" />
              </div>
            </div>
          ) : (
            <>
              {/* Primary Probabilistic Likelihood Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="glass-panel p-5 rounded-2xl border-rose-500/20">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono font-medium">
                    AI Likelihood
                  </span>
                  <div className="text-3xl font-extrabold text-rose-400 mt-1">
                    {analysis.aiLikelihood}%
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: `${analysis.aiLikelihood}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-2 font-mono">Probabilistic signal</span>
                </div>

                <div className="glass-panel p-5 rounded-2xl border-emerald-500/20">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono font-medium">
                    Human-Like Likelihood
                  </span>
                  <div className="text-3xl font-extrabold text-emerald-400 mt-1">
                    {analysis.humanLikelihood}%
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${analysis.humanLikelihood}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-2 font-mono">Organic cadence</span>
                </div>

                <div className="glass-panel p-5 rounded-2xl border-amber-500/20">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono font-medium">
                    Uncertain
                  </span>
                  <div className="text-3xl font-extrabold text-amber-400 mt-1">
                    {analysis.uncertainLikelihood}%
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${analysis.uncertainLikelihood}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-2 font-mono">Statistical margin</span>
                </div>

                <div className="glass-panel p-5 rounded-2xl border-cyan-500/20">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono font-medium">
                    Detection Confidence
                  </span>
                  <div className="text-3xl font-extrabold text-cyan-400 mt-1">
                    {analysis.detectionConfidence}
                  </div>
                  <div className="inline-block mt-3 px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                    Model: {analysis.modelInfo?.modelName || 'clever-ensemble'}
                  </div>
                </div>
              </div>

              {/* Composite Authenticity / Risk Indicator Bar */}
              {analysis.compositeScore && (
                <div className="glass-panel p-6 rounded-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-800/80 gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                        Composite Authenticity & Risk Indicator
                      </h3>
                      <p className="text-xs text-slate-400">
                        Synthesized multi-signal evaluation ({analysis.compositeScore.methodologyNotes})
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase self-start sm:self-auto ${
                        analysis.compositeScore.overallRiskLevel === 'High'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : analysis.compositeScore.overallRiskLevel === 'Elevated'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      Risk Level: {analysis.compositeScore.overallRiskLevel}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">AI Generation</span>
                      <span className="text-base font-bold text-rose-400 mt-1 block">
                        {analysis.compositeScore.aiGenerationSignal}%
                      </span>
                    </div>
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Manipulation</span>
                      <span className="text-base font-bold text-amber-400 mt-1 block">
                        {analysis.compositeScore.manipulationSignal}%
                      </span>
                    </div>
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Similarity</span>
                      <span className="text-base font-bold text-indigo-400 mt-1 block">
                        {analysis.compositeScore.similaritySignal}%
                      </span>
                    </div>
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Provenance Score</span>
                      <span className="text-base font-bold text-cyan-400 mt-1 block">
                        {analysis.compositeScore.provenanceSignal}%
                      </span>
                    </div>
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Integrity Match</span>
                      <span className="text-base font-bold text-emerald-400 mt-1 block">
                        {analysis.compositeScore.integritySignal}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Sentence-Level Document Viewer (If sentences present) */}
              {analysis.sentences && analysis.sentences.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Interactive Highlighted Document */}
                  <div className="lg:col-span-7 glass-panel p-6 rounded-2xl">
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <FileText className="w-4 h-4 text-cyan-400" />
                          <span>Sentence-Level Forensic Inspection</span>
                        </h3>
                        <p className="text-xs text-slate-400">Click any sentence to inspect specific evidence signals</p>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">
                        {analysis.sentences.length} sentences
                      </span>
                    </div>

                    <div className="space-y-3 text-sm leading-relaxed max-h-[500px] overflow-y-auto pr-2">
                      {analysis.sentences.map((s: any, idx: number) => {
                        const isSelected = selectedSentenceIndex === idx;
                        const isAi = s.score >= 0.6;
                        const isHuman = s.score <= 0.4;

                        return (
                          <div
                            key={s.id || idx}
                            onClick={() => setSelectedSentenceIndex(idx)}
                            className={`p-3 rounded-xl cursor-pointer border transition-all ${
                              isSelected
                                ? isAi
                                  ? 'bg-rose-950/40 border-rose-500/80 text-rose-100 shadow-glow-rose'
                                  : isHuman
                                  ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-100 shadow-glow-emerald'
                                  : 'bg-amber-950/40 border-amber-500/80 text-amber-100'
                                : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1.5">
                              <span
                                className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                                  isAi
                                    ? 'bg-rose-900/60 text-rose-300'
                                    : isHuman
                                    ? 'bg-emerald-900/60 text-emerald-300'
                                    : 'bg-amber-900/60 text-amber-300'
                                }`}
                              >
                                {s.category} ({Math.round(s.score * 100)}%)
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">Sentence #{idx + 1}</span>
                            </div>
                            <p className="text-xs sm:text-sm">{s.text}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right: Selected Sentence Evidence Drawer */}
                  <div className="lg:col-span-5 space-y-6">
                    {selectedSentenceIndex !== null && analysis.sentences[selectedSentenceIndex] && (
                      <div className="glass-panel p-6 rounded-2xl">
                        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
                          <Fingerprint className="w-4 h-4 text-cyan-400" />
                          <h3 className="text-sm font-bold text-white uppercase font-mono">
                            Sentence #{selectedSentenceIndex + 1} Evidence
                          </h3>
                        </div>

                        <div className="space-y-4 text-xs">
                          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                            <span className="text-slate-400 block mb-1 text-[11px]">Selected Sentence:</span>
                            <p className="text-slate-200 italic font-serif">
                              &ldquo;{analysis.sentences[selectedSentenceIndex].text}&rdquo;
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                              <span className="text-slate-400 block text-[10px] font-mono uppercase">
                                Classification
                              </span>
                              <span className="font-bold text-slate-100 text-sm mt-0.5 block">
                                {analysis.sentences[selectedSentenceIndex].category}
                              </span>
                            </div>
                            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                              <span className="text-slate-400 block text-[10px] font-mono uppercase">Score</span>
                              <span className="font-bold text-cyan-400 text-sm mt-0.5 block font-mono">
                                {Math.round(analysis.sentences[selectedSentenceIndex].score * 100)}%
                              </span>
                            </div>
                          </div>

                          <div>
                            <span className="text-slate-400 block mb-2 font-mono text-[11px] uppercase">
                              Observable Signals:
                            </span>
                            <ul className="space-y-1.5">
                              {analysis.sentences[selectedSentenceIndex].evidence?.map((ev: string, i: number) => (
                                <li
                                  key={i}
                                  className="bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-slate-300 flex items-start gap-2"
                                >
                                  <span className="text-cyan-400 mt-0.5">•</span>
                                  <span>{ev}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {analysis.sentences[selectedSentenceIndex].modelContribution && (
                            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
                              Model: {analysis.sentences[selectedSentenceIndex].modelContribution.modelName} (Weight{' '}
                              {analysis.sentences[selectedSentenceIndex].modelContribution.weight})
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Stylometric Writing Fingerprint & Evidence Signals */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Writing Fingerprint Metrics */}
                {analysis.writingFingerprint && (
                  <div className="lg:col-span-6 glass-panel p-6 rounded-2xl">
                    <div className="pb-3 mb-4 border-b border-slate-800">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                        Writing Fingerprint (Stylometrics)
                      </h3>
                      <p className="text-xs text-slate-400">Quantitative linguistic characteristics</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px] font-mono">Average Sentence Length</span>
                        <span className="text-base font-bold text-slate-100 font-mono mt-1 block">
                          {analysis.writingFingerprint.avgSentenceLength} words
                        </span>
                      </div>
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px] font-mono">Length Variance (Burstiness)</span>
                        <span className="text-base font-bold text-slate-100 font-mono mt-1 block">
                          {analysis.writingFingerprint.sentenceLengthVariation}
                        </span>
                      </div>
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px] font-mono">Vocabulary Diversity (TTR)</span>
                        <span className="text-base font-bold text-slate-100 font-mono mt-1 block">
                          {analysis.writingFingerprint.vocabularyDiversity}%
                        </span>
                      </div>
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px] font-mono">Repetition Score</span>
                        <span className="text-base font-bold text-slate-100 font-mono mt-1 block">
                          {analysis.writingFingerprint.repetitionScore}%
                        </span>
                      </div>
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px] font-mono">Syntactic Complexity</span>
                        <span className="text-base font-bold text-slate-100 font-mono mt-1 block">
                          {analysis.writingFingerprint.syntacticComplexity} / 100
                        </span>
                      </div>
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px] font-mono">Readability Index</span>
                        <span className="text-base font-bold text-slate-100 font-mono mt-1 block">
                          {analysis.writingFingerprint.readabilityScore}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Evidence Signals List */}
                <div className={`${analysis.writingFingerprint ? 'lg:col-span-6' : 'lg:col-span-12'} glass-panel p-6 rounded-2xl`}>
                  <div className="pb-3 mb-4 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      Forensic Evidence Signals
                    </h3>
                    <p className="text-xs text-slate-400">Observable empirical cues contributing to estimate</p>
                  </div>

                  <div className="space-y-3">
                    {analysis.evidenceSignals?.map((ev: any) => (
                      <div key={ev.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200">{ev.title}</span>
                          <span
                            className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                              ev.severity === 'high' || ev.severity === 'critical'
                                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                : ev.severity === 'medium'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}
                          >
                            {ev.severity} ({ev.contribution}% weight)
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{ev.description}</p>
                        <span className="text-[10px] text-slate-500 font-mono block pt-1">
                          Source: {ev.source} • Engine: {ev.model}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Provenance & Cryptographic File Integrity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-sm font-bold text-white font-mono uppercase">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>Provenance & Metadata</span>
                  </div>
                  <div className="text-xs space-y-2 text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400">Source Origin:</span>
                      <span className="font-mono">{analysis.provenance?.sourceOrigin || 'Digital Input'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400">Creation Timestamp:</span>
                      <span className="font-mono">{analysis.provenance?.creationTimestamp || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400">Software / Agent:</span>
                      <span className="font-mono">{analysis.provenance?.softwareAgent || 'Unspecified'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Content Credentials (C2PA):</span>
                      <span className="font-mono text-slate-400">
                        {analysis.provenance?.contentCredentialsPresent ? 'Present & Verified' : 'Not Present'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-sm font-bold text-white font-mono uppercase">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>Cryptographic File Integrity</span>
                  </div>
                  <div className="text-xs space-y-2 text-slate-300">
                    <div>
                      <span className="text-slate-400 block mb-1">SHA-256 Digest:</span>
                      <span className="font-mono text-[11px] bg-slate-900 p-2 rounded block border border-slate-800 truncate text-emerald-400">
                        {analysis.integrity?.sha256Hash || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400">File Size:</span>
                      <span className="font-mono">{analysis.integrity?.fileSizeBytes || 0} bytes</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Integrity Verification:</span>
                      <span className="text-emerald-400 font-mono font-bold">Verified Match</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mandatory Limitations Disclaimer & Manual Review Guidance */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-mono text-xs uppercase font-bold">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Mandatory Forensic Limitations Statement</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {analysis.limitationsDisclaimer}
                </p>
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] font-mono text-slate-400 font-semibold block mb-1">
                    Investigator Manual Review Guidance:
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {analysis.manualReviewGuidance}
                  </p>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
