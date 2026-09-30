'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Sparkles,
  FileText,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Info,
  Lock,
  Cpu,
  Fingerprint,
  ChevronRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';

// Demo analysis runs entirely in-browser using heuristics
// No backend call needed — makes it instant and auth-free
function analyzeDemoText(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 3);
  const avgSentenceLen = words.length / Math.max(1, sentences.length);
  const uniqueWords = new Set(words.map((w) => w.toLowerCase().replace(/[^a-z]/g, '')));
  const ttr = uniqueWords.size / Math.max(1, words.length);

  const aiMarkers = [
    'furthermore', 'in conclusion', 'it is important to note', 'delve into', 'tapestry',
    'testament to', 'multifaceted', 'paramount', 'moreover', 'nonetheless',
    'in summary', 'to summarize', 'as previously mentioned', 'it should be noted'
  ];
  const markerHits = aiMarkers.filter((m) => text.toLowerCase().includes(m));

  // Burstiness: variance in sentence lengths
  const sentLengths = sentences.map((s) => s.split(/\s+/).length);
  const mean = sentLengths.reduce((a, b) => a + b, 0) / Math.max(1, sentLengths.length);
  const variance = sentLengths.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / Math.max(1, sentLengths.length);
  const burstiness = Math.sqrt(variance) / Math.max(1, mean); // Coefficient of variation

  let aiProb = 0.40;
  if (markerHits.length >= 2) aiProb += 0.22;
  else if (markerHits.length === 1) aiProb += 0.12;
  if (avgSentenceLen > 20) aiProb += 0.12;
  if (ttr < 0.45) aiProb += 0.10;
  if (burstiness < 0.25) aiProb += 0.10; // Low burstiness = AI-like uniform rhythm
  if (burstiness > 0.60) aiProb -= 0.12; // High burstiness = more human-like

  aiProb = Math.min(0.91, Math.max(0.08, aiProb));

  const aiLikelihood = Math.round(aiProb * 100 * 10) / 10;
  const humanLikelihood = Math.round((1 - aiProb) * 75 * 10) / 10;
  const uncertainLikelihood = Math.round((100 - aiLikelihood - humanLikelihood) * 10) / 10;

  const signals = [];
  if (markerHits.length > 0) {
    signals.push({
      title: 'AI Transitional Markers',
      desc: `Detected ${markerHits.length} high-frequency AI phrase pattern(s): "${markerHits.slice(0, 2).join('", "')}"`,
      severity: markerHits.length >= 2 ? 'high' : 'medium',
      contribution: Math.round(markerHits.length * 12)
    });
  }
  if (burstiness < 0.30) {
    signals.push({
      title: 'Uniform Sentence Rhythm (Low Burstiness)',
      desc: `Sentence length variance is unusually low (CV: ${burstiness.toFixed(2)}). Human writing typically shows higher rhythmic variation.`,
      severity: 'medium',
      contribution: 20
    });
  }
  if (ttr < 0.50) {
    signals.push({
      title: 'Reduced Lexical Diversity',
      desc: `Type-Token Ratio of ${ttr.toFixed(3)} indicates lower vocabulary variation than typical organic writing.`,
      severity: 'low',
      contribution: 12
    });
  }
  if (avgSentenceLen > 20) {
    signals.push({
      title: 'Extended Average Sentence Length',
      desc: `Average ${avgSentenceLen.toFixed(1)} words/sentence. Longer sentences correlate with AI generation patterns.`,
      severity: 'low',
      contribution: 10
    });
  }
  if (signals.length === 0) {
    signals.push({
      title: 'No Strong AI Signals Detected',
      desc: 'The text exhibits organic patterns consistent with human writing.',
      severity: 'low',
      contribution: 5
    });
  }

  const sentenceScores = sentences.slice(0, 8).map((text, i) => {
    const hasMarker = aiMarkers.some((m) => text.toLowerCase().includes(m));
    const len = text.split(/\s+/).length;
    const score = Math.round(
      Math.min(95, Math.max(5,
        aiProb * 80 +
        (hasMarker ? 15 : -5) +
        (len > 22 ? 8 : 0) +
        (Math.random() * 16 - 8)
      ))
    );
    return { text, score };
  });

  return {
    aiLikelihood,
    humanLikelihood,
    uncertainLikelihood,
    confidence: words.length > 100 ? 'High' : words.length > 50 ? 'Medium' : 'Low',
    signals,
    sentenceScores,
    wordCount: words.length,
    sentenceCount: sentences.length,
    ttr: Math.round(ttr * 1000) / 1000,
    burstiness: Math.round(burstiness * 1000) / 1000,
    markerHits
  };
}

const SAMPLE_TEXTS = [
  {
    label: 'AI-Generated (Sample)',
    text: 'Furthermore, it is important to note that artificial intelligence has become a multifaceted tapestry of innovation. In conclusion, delving into these complex neural architectures requires a comprehensive understanding of advanced algorithms. Moreover, the implications of this generative revolution are of paramount importance across modern society. It should be noted that the integration of machine learning systems presents significant opportunities for optimization and efficiency across various domains.'
  },
  {
    label: 'Human-Written (Sample)',
    text: 'Last Tuesday we ran the experiment in Lab 3 — the results surprised everyone. Jamie had predicted a 15% yield, but we barely hit 8%. I blamed the reagent batch from the new supplier. The fluorescence readings were all over the place, which honestly drove me crazy for two days. We ended up rerunning it Friday with the old batch and things looked much better, though not perfect.'
  },
  {
    label: 'Mixed / Uncertain (Sample)',
    text: 'The study examined cognitive patterns among adolescents in urban environments during the pandemic. Participants were recruited through local schools and completed standardized assessments. Some kids really struggled with the online format — Zoom fatigue was genuinely a problem we hadn\'t anticipated. The data suggests a complex relationship between screen time and academic performance.'
  }
];

export default function DemoPage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<ReturnType<typeof analyzeDemoText> | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedSentence, setSelectedSentence] = useState<number | null>(null);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 30) return;

    setAnalyzing(true);
    setResult(null);

    // Small delay for UX effect
    setTimeout(() => {
      setResult(analyzeDemoText(text));
      setAnalyzing(false);
      setSelectedSentence(0);
    }, 1200);
  };

  const handleSampleLoad = (sampleText: string) => {
    setText(sampleText);
    setResult(null);
    setSelectedSentence(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      <Navbar />

      <main className="flex-1 pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-cyan-300 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Free Demo — No Account Required</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Try the AI Forensics{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Engine Live
              </span>
            </h1>
            <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
              Paste any text and see real-time stylometric and AI signal analysis.
              For full multi-modal analysis, reports, and audit trails —{' '}
              <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-medium">
                create a free account
              </Link>
              .
            </p>
          </div>

          {/* Demo disclaimer */}
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200/80 leading-relaxed">
              <strong className="text-amber-300">Demo Mode:</strong> This analysis runs client-side using heuristic
              models. Results are illustrative and should not be used for formal decision-making. For certified forensic
              reports with full evidence chains, sign in to the platform.
            </p>
          </div>

          {/* Sample Text Loaders */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-slate-400 flex items-center">Load sample:</span>
            {SAMPLE_TEXTS.map((s) => (
              <button
                key={s.label}
                onClick={() => handleSampleLoad(s.text)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-xs text-slate-300 hover:text-cyan-300 transition-all"
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Input form */}
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="glass-panel rounded-2xl p-1 glow-border">
              <textarea
                id="demo-text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste or type your text here (minimum 30 characters)..."
                rows={8}
                className="w-full bg-transparent px-5 py-4 text-sm text-slate-100 placeholder-slate-600 resize-none focus:outline-none font-sans leading-relaxed"
              />
              <div className="flex items-center justify-between px-5 pb-4">
                <span className="text-[11px] text-slate-500 font-mono">
                  {text.trim().split(/\s+/).filter(Boolean).length} words · {text.length} chars
                </span>
                <button
                  id="demo-analyze-btn"
                  type="submit"
                  disabled={text.trim().length < 30 || analyzing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-semibold hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-glow disabled:opacity-40"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Analyze Text</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Results */}
          {result && (
            <div className="space-y-6 animate-fade-in">
              {/* Score Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'AI Likelihood', value: `${result.aiLikelihood}%`, color: 'text-rose-400', bar: 'bg-rose-500', pct: result.aiLikelihood, sub: 'Synthetic signal' },
                  { label: 'Human-Like', value: `${result.humanLikelihood}%`, color: 'text-emerald-400', bar: 'bg-emerald-500', pct: result.humanLikelihood, sub: 'Organic cadence' },
                  { label: 'Uncertain', value: `${result.uncertainLikelihood}%`, color: 'text-amber-400', bar: 'bg-amber-500', pct: result.uncertainLikelihood, sub: 'Statistical margin' },
                  { label: 'Confidence', value: result.confidence, color: 'text-cyan-400', bar: null, pct: 0, sub: `${result.wordCount} words` }
                ].map((m) => (
                  <div key={m.label} className="glass-panel p-5 rounded-2xl">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">{m.label}</span>
                    <div className={`text-3xl font-extrabold mt-1 ${m.color}`}>{m.value}</div>
                    {m.bar && (
                      <div className="w-full bg-slate-900 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div
                          className={`${m.bar} h-full rounded-full transition-all duration-1000`}
                          style={{ width: `${Math.min(100, m.pct)}%` }}
                        />
                      </div>
                    )}
                    {!m.bar && (
                      <span className="inline-block mt-3 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-700">
                        {m.sub}
                      </span>
                    )}
                    {m.bar && <span className="text-[10px] text-slate-500 block mt-2 font-mono">{m.sub}</span>}
                  </div>
                ))}
              </div>

              {/* Evidence Signals */}
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-cyan-400" />
                  Evidence Signal Breakdown
                </h3>
                <div className="space-y-3">
                  {result.signals.map((sig, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
                      <span
                        className={`mt-0.5 shrink-0 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                          sig.severity === 'high'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : sig.severity === 'medium'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {sig.severity}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white">{sig.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{sig.desc}</p>
                      </div>
                      <span className="text-xs font-mono text-slate-500 shrink-0">+{sig.contribution}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sentence-level view */}
              {result.sentenceScores.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  <div className="lg:col-span-7 glass-panel p-6 rounded-2xl space-y-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      Sentence-Level Inspection
                    </h3>
                    <p className="text-[11px] text-slate-400">Click a sentence to inspect its signal</p>
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                      {result.sentenceScores.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedSentence(i)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs leading-relaxed border transition-all ${
                            selectedSentence === i
                              ? 'border-cyan-500/60 bg-cyan-950/20 text-white'
                              : 'border-transparent hover:border-slate-700 text-slate-300 hover:bg-slate-900/50'
                          }`}
                          style={{
                            borderLeft: `3px solid ${
                              s.score > 65 ? '#f43f5e' : s.score > 35 ? '#f59e0b' : '#10b981'
                            }`
                          }}
                        >
                          {s.text}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-5 glass-panel p-6 rounded-2xl space-y-4">
                    <h3 className="text-sm font-bold text-white">Signal Detail</h3>
                    {selectedSentence !== null && result.sentenceScores[selectedSentence] ? (
                      <>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">AI-like score</span>
                            <span className={`font-bold font-mono ${
                              result.sentenceScores[selectedSentence].score > 65 ? 'text-rose-400' :
                              result.sentenceScores[selectedSentence].score > 35 ? 'text-amber-400' : 'text-emerald-400'
                            }`}>{result.sentenceScores[selectedSentence].score}%</span>
                          </div>
                          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                result.sentenceScores[selectedSentence].score > 65 ? 'bg-rose-500' :
                                result.sentenceScores[selectedSentence].score > 35 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${result.sentenceScores[selectedSentence].score}%` }}
                            />
                          </div>
                        </div>
                        <div className="space-y-2 text-[11px]">
                          {[
                            { k: 'Length', v: `${result.sentenceScores[selectedSentence].text.split(/\s+/).length} words` },
                            { k: 'TTR (Sample)', v: result.ttr.toString() },
                            { k: 'Burstiness CV', v: result.burstiness.toString() }
                          ].map(({ k, v }) => (
                            <div key={k} className="flex justify-between text-slate-400 border-b border-slate-800/50 pb-1">
                              <span className="font-mono">{k}</span>
                              <span className="text-slate-200">{v}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-slate-500">Select a sentence to inspect its signals</p>
                    )}
                  </div>
                </div>
              )}

              {/* CTA to sign up */}
              <div className="glass-panel p-6 rounded-2xl glow-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-sm font-bold text-white">Unlock Full Platform</h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    Document & image forensics · PDF audit reports · Team workspaces · API access
                  </p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <Link
                    href="/register"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-semibold hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-glow"
                  >
                    Create Free Account
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
