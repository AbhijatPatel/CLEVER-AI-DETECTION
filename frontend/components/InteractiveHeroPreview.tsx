'use client';

import React, { useState } from 'react';
import { ShieldCheck, Info, CheckCircle2, AlertTriangle, FileText, Fingerprint, Lock, ChevronRight } from 'lucide-react';

export default function InteractiveHeroPreview() {
  const [selectedSentence, setSelectedSentence] = useState<number | null>(0);

  const demoSentences = [
    {
      id: 0,
      text: 'Furthermore, it is important to note that generative models construct narrative sequences through probabilistic token distribution.',
      score: 84,
      category: 'AI-like signal',
      rationale: 'High syntactical uniformity and typical transition markers frequently prioritized by language models.'
    },
    {
      id: 1,
      text: 'Our forensic lab collected these field samples manually last winter after reviewing local archive manuscripts in Boston.',
      score: 18,
      category: 'Human-like signal',
      rationale: 'Contains high personal episodic variance, contextual grounding, and organic phrasing cadence.'
    },
    {
      id: 2,
      text: 'The statistical deviation suggests varying degrees of authorial intervention across successive paragraphs.',
      score: 52,
      category: 'Uncertain',
      rationale: 'Technical syntax falls within both formal academic writing baselines and synthetic templates.'
    }
  ];

  return (
    <div className="w-full glass-panel rounded-2xl p-5 md:p-7 glow-border shadow-2xl relative overflow-hidden">
      {/* Banner explicitly distinguishing demo from real production measurements */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono tracking-wider uppercase text-cyan-400 font-semibold">
            Interactive Forensic Preview
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono bg-slate-900/90 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full">
          <Info className="w-3.5 h-3.5 text-amber-400" />
          <span>Demonstration Environment — Live Model Verification Active in App</span>
        </div>
      </div>

      {/* Primary Forensic Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-950/80 border border-rose-500/20 rounded-xl p-3.5">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">AI Likelihood</span>
          <div className="text-2xl font-bold text-rose-400 mt-1 flex items-baseline gap-1">
            64.2%
            <span className="text-xs font-normal text-slate-500">estimate</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: '64.2%' }} />
          </div>
        </div>

        <div className="bg-slate-950/80 border border-emerald-500/20 rounded-xl p-3.5">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Human Likelihood</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1 flex items-baseline gap-1">
            23.6%
            <span className="text-xs font-normal text-slate-500">estimate</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '23.6%' }} />
          </div>
        </div>

        <div className="bg-slate-950/80 border border-amber-500/20 rounded-xl p-3.5">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Uncertain</span>
          <div className="text-2xl font-bold text-amber-400 mt-1 flex items-baseline gap-1">
            12.2%
            <span className="text-xs font-normal text-slate-500">margin</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '12.2%' }} />
          </div>
        </div>

        <div className="bg-slate-950/80 border border-cyan-500/20 rounded-xl p-3.5">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Confidence</span>
          <div className="text-2xl font-bold text-cyan-400 mt-1 flex items-baseline gap-1">
            High
            <span className="text-xs font-normal text-slate-500">converged</span>
          </div>
          <span className="inline-block text-[10px] bg-cyan-950/60 text-cyan-300 border border-cyan-700/50 px-2 py-0.5 rounded mt-2">
            3 Models Aligned
          </span>
        </div>
      </div>

      {/* Main Forensic Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Document Sentence Highlighting Viewer */}
        <div className="lg:col-span-7 bg-slate-950/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-900">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Sentence-Level Forensic Inspection</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Click sentence to inspect</span>
          </div>

          <div className="space-y-2.5 text-sm leading-relaxed text-slate-300">
            {demoSentences.map((s) => (
              <p
                key={s.id}
                onClick={() => setSelectedSentence(s.id)}
                className={`p-2.5 rounded-lg cursor-pointer transition-all border ${
                  selectedSentence === s.id
                    ? s.score > 60
                      ? 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                      : s.score < 30
                      ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                      : 'bg-amber-950/30 border-amber-500/50 text-amber-200'
                    : 'bg-slate-900/40 border-slate-800/60 hover:border-slate-700 text-slate-300'
                }`}
              >
                <span
                  className={`inline-block mr-2 px-1.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                    s.score > 60
                      ? 'bg-rose-900/60 text-rose-300'
                      : s.score < 30
                      ? 'bg-emerald-900/60 text-emerald-300'
                      : 'bg-amber-900/60 text-amber-300'
                  }`}
                >
                  {s.category} ({s.score}%)
                </span>
                {s.text}
              </p>
            ))}
          </div>
        </div>

        {/* Right: Selected Sentence Evidence & Forensics Signals */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Active Sentence Drawer */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-2 font-mono uppercase">
              <Fingerprint className="w-4 h-4" />
              <span>Evidence Signal Drawer</span>
            </div>
            {selectedSentence !== null && (
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">Classification:</span>
                  <span
                    className={`font-semibold ${
                      demoSentences[selectedSentence].score > 60
                        ? 'text-rose-400'
                        : demoSentences[selectedSentence].score < 30
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {demoSentences[selectedSentence].category}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400">Forensic Likelihood:</span>
                  <span className="font-mono text-slate-200">{demoSentences[selectedSentence].score}%</span>
                </div>
                <p className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 leading-normal">
                  {demoSentences[selectedSentence].rationale}
                </p>
              </div>
            )}
          </div>

          {/* Cryptographic Hash & Provenance Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                SHA-256 Digest
              </span>
              <span className="text-emerald-400 font-mono text-[10px]">Verified Match</span>
            </div>
            <div className="font-mono text-[10px] text-slate-400 bg-slate-900/90 p-2 rounded border border-slate-800 truncate">
              e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
            </div>
            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
              <span>Model: clever-nlp-ensemble v1.2</span>
              <span>Pipeline: v2.4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
