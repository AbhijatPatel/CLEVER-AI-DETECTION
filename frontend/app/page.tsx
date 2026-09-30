'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InteractiveHeroPreview from '@/components/InteractiveHeroPreview';
import {
  ShieldCheck,
  Cpu,
  FileSearch,
  Image as ImageIcon,
  Mic,
  Video,
  Layers,
  Sparkles,
  Lock,
  ArrowRight,
  Fingerprint,
  FileCheck,
  CheckCircle,
  HelpCircle,
  Code2,
  Terminal,
  Activity,
  Workflow
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/15 to-transparent blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-cyan-300 mb-6 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Multi-Modal AI Content Intelligence & Digital Forensics</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
              Understand the <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">authenticity</span> of digital content.
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-9">
              Analyze text, documents, images, audio, and video using explainable AI and digital-forensics signals.
              Built for investigators, educators, and enterprise security teams.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/analyze"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-glow hover:shadow-cyan-500/40 text-base"
              >
                Start Free Analysis
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#technology"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-700 text-slate-200 font-semibold transition-all text-base"
              >
                Explore Platform
              </Link>
            </div>
          </div>

          {/* Interactive Hero Forensic Preview */}
          <div className="max-w-5xl mx-auto">
            <InteractiveHeroPreview />
          </div>
        </div>
      </section>

      {/* 2. HOW CLEVER AI WORKS */}
      <section id="technology" className="py-24 bg-slate-900/30 border-y border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono font-semibold tracking-wider uppercase text-cyan-400 mb-3">
              Multi-Stage Forensic Pipeline
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Evidence-based inference instead of black-box guesses.
            </h3>
            <p className="text-sm sm:text-base text-slate-400 mt-4">
              Every analysis passes through independent extraction, statistical feature modeling, calibrated ensemble
              scoring, and explainability synthesis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Multi-Modal Ingestion',
                desc: 'MIME validation, SHA-256 cryptographic hashing, and document text/frame extraction.'
              },
              {
                step: '02',
                title: 'Feature Extraction',
                desc: 'Stylometric burstiness, perplexity heuristics, ELA compression analysis, and spectral voice metrics.'
              },
              {
                step: '03',
                title: 'Calibrated Ensemble',
                desc: 'Multi-model probabilistic scoring preventing single-detector bias or overconfident hallucinations.'
              },
              {
                step: '04',
                title: 'Explainable Dossier',
                desc: 'Sentence-by-sentence highlighting, evidence cards with source attribution, and certified PDF export.'
              }
            ].map((item, idx) => (
              <div key={idx} className="glass-card p-6 relative group">
                <span className="text-3xl font-mono font-black text-slate-800 group-hover:text-cyan-500/30 transition-colors block mb-3">
                  {item.step}
                </span>
                <h4 className="text-base font-semibold text-slate-100 mb-2">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 - 7. MULTI-MODAL MODALITIES */}
      <section id="forensics" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono font-semibold tracking-wider uppercase text-cyan-400 mb-3">
              Comprehensive Multi-Modal Coverage
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              One platform for every digital artifact format.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Text & Stylometry */}
            <div className="glass-panel rounded-2xl p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-950/70 border border-cyan-700/50 flex items-center justify-center text-cyan-400 mb-5">
                  <FileSearch className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Text & Stylometry</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Analyzes Type-Token Ratio (TTR), sentence length variation, n-gram repetitions, and AI transitional
                  phrases. Detects human/AI mixed content at the sentence level.
                </p>
                <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400" /> Burstiness & Perplexity
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400" /> Mixed-content sentence mapping
                  </div>
                </div>
              </div>
              <Link href="/analyze" className="mt-6 text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1.5">
                Analyze Text <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Document Intelligence */}
            <div className="glass-panel rounded-2xl p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-950/70 border border-indigo-700/50 flex items-center justify-center text-indigo-400 mb-5">
                  <Layers className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Document Intelligence</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Extracts text, paragraphs, and metadata from PDF and DOCX files. Evaluates internal author metadata,
                  creation timestamps, and structural layout anomalies.
                </p>
                <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-indigo-400" /> PDF / DOCX / TXT Extraction
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-indigo-400" /> Structural metadata integrity
                  </div>
                </div>
              </div>
              <Link href="/analyze" className="mt-6 text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1.5">
                Inspect Document <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Image Forensics */}
            <div className="glass-panel rounded-2xl p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-rose-950/70 border border-rose-700/50 flex items-center justify-center text-rose-400 mb-5">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Image Forensics</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Error Level Analysis (ELA) identifies resaved and spliced image regions. Parses EXIF camera hardware
                  tags and detects synthetic diffusion resolution matrices.
                </p>
                <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-rose-400" /> Error Level Analysis (ELA)
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-rose-400" /> Camera EXIF verification
                  </div>
                </div>
              </div>
              <Link href="/analyze" className="mt-6 text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1.5">
                Analyze Image <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Audio Intelligence */}
            <div className="glass-panel rounded-2xl p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-950/70 border border-amber-700/50 flex items-center justify-center text-amber-400 mb-5">
                  <Mic className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Audio Intelligence</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Evaluates synthetic voice synthesis, vocoder high-frequency cutoffs, acoustic modulation cadence, and
                  container stream integrity across MP3 and WAV files.
                </p>
                <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-400" /> Synthetic speech detection
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-400" /> Spectral bandwidth profiling
                  </div>
                </div>
              </div>
              <Link href="/analyze" className="mt-6 text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1.5">
                Analyze Audio <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Video Forensics */}
            <div className="glass-panel rounded-2xl p-7 flex flex-col justify-between md:col-span-2">
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-950/70 border border-sky-700/50 flex items-center justify-center text-sky-400 mb-5">
                  <Video className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Video Forensics & Deepfake Detection</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Processes MP4 and WebM videos frame-by-frame. Assesses facial boundary temporal stability, micro-jitter
                  in lighting contours, and phoneme-to-viseme audio-visual synchronization.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 font-mono">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-sky-400" /> Frame-by-frame temporal consistency
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-sky-400" /> Audio-video lip sync checks
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-sky-400" /> Suspicious frame range markers
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-sky-400" /> Container header inspection
                  </div>
                </div>
              </div>
              <Link href="/analyze" className="mt-6 text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1.5">
                Inspect Video <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8 - 10. EXPLAINABLE AI, PROVENANCE & INTEGRITY */}
      <section className="py-24 bg-slate-900/40 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="glass-card p-6">
              <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Explainable AI</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Every metric is backed by observable evidence signals. Review linguistic predictability, sentence length
                variance, and exact model contributions.
              </p>
              <div className="text-xs font-mono text-cyan-300/80 bg-slate-950 p-2.5 rounded border border-slate-800">
                ✓ Observable indicators
                <br />
                ✓ Contribution percentages
                <br />✓ Severity categorizations
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="w-10 h-10 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 mb-4">
                <Fingerprint className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Content Provenance</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Verifies origin headers, creation software tags, C2PA content credentials, and modification timestamps
                without jumping to false conclusions.
              </p>
              <div className="text-xs font-mono text-indigo-300/80 bg-slate-950 p-2.5 rounded border border-slate-800">
                ✓ Origin history tracing
                <br />
                ✓ Content credentials readiness
                <br />✓ Absence != guilt transparency
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Cryptographic File Integrity</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Calculates cryptographic SHA-256 digests upon ingestion to detect downstream file tampering or chain-of-custody
                discrepancies.
              </p>
              <div className="text-xs font-mono text-emerald-300/80 bg-slate-950 p-2.5 rounded border border-slate-800">
                ✓ Immutable SHA-256 fingerprint
                <br />
                ✓ Chain of custody timestamps
                <br />✓ Tamper verification checks
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11 - 13. ENTERPRISE SECURITY & DEVELOPER API */}
      <section id="security" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-xs font-mono font-semibold tracking-wider uppercase text-cyan-400">
                Enterprise Ready & Developer Centric
              </h2>
              <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Integrate digital forensics into your automated workflow.
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Whether you need multi-tenant organization management with strict RBAC, immutable audit logging for legal
                compliance, or programmatic REST APIs for batch processing, Clever AI is engineered for high scale.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="border border-slate-800 rounded-xl p-3 bg-slate-900/50">
                  <span className="text-xs font-semibold text-slate-200">Role-Based Access (RBAC)</span>
                  <p className="text-[11px] text-slate-400 mt-1">Admin, Manager, Analyst, and Member roles enforced server-side.</p>
                </div>
                <div className="border border-slate-800 rounded-xl p-3 bg-slate-900/50">
                  <span className="text-xs font-semibold text-slate-200">Audit Logging</span>
                  <p className="text-[11px] text-slate-400 mt-1">Every upload, inspection, and report creation logged with request IDs.</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm font-semibold text-cyan-400 hover:border-cyan-500/50 transition-all"
                >
                  <Code2 className="w-4 h-4" />
                  Explore Interactive API Docs
                </Link>
              </div>
            </div>

            {/* Code Snippet Preview */}
            <div className="lg:col-span-6">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl font-mono text-xs">
                <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-[11px] text-slate-300">curl -X POST /api/v1/analysis/text</span>
                  </div>
                  <span className="text-[10px]">REST API</span>
                </div>
                <div className="p-5 text-slate-300 space-y-3 leading-relaxed overflow-x-auto">
                  <p className="text-slate-500">// Submit text with forensic API key</p>
                  <p className="text-cyan-400">
                    curl -X POST https://clever-ai-api.onrender.com/api/v1/analysis/text \
                  </p>
                  <p className="pl-4 text-slate-300">
                    -H &quot;Authorization: Bearer clv_sec_...&quot; \
                  </p>
                  <p className="pl-4 text-slate-300">-H &quot;Content-Type: application/json&quot; \</p>
                  <p className="pl-4 text-indigo-300">
                    -d &apos;&#123;&quot;text&quot;: &quot;Submitted content sample...&quot;, &quot;title&quot;: &quot;Exhibit A&quot;&#125;&apos;
                  </p>
                  <div className="pt-2 text-emerald-400 border-t border-slate-800/80">
                    <p className="text-slate-500">// Response 202 Accepted</p>
                    <p>&#123;&quot;analysisId&quot;: &quot;670b8c...&quot;, &quot;status&quot;: &quot;QUEUED&quot;&#125;</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 14. FAQ */}
      <section className="py-24 bg-slate-900/30 border-t border-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs font-mono font-semibold tracking-wider uppercase text-cyan-400 mb-3">
              Forensic Guidance
            </h2>
            <h3 className="text-3xl font-bold text-white tracking-tight">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Can Clever AI guarantee 100% detection certainty?',
                a: 'No automated AI detector can legitimately claim 100% certainty. AI content generation is probabilistic. Clever AI presents likelihood distributions, confidence bands, and granular evidence signals to empower human investigators.'
              },
              {
                q: 'Does Clever AI train AI models on submitted documents?',
                a: 'Never. User submissions are processed strictly for forensic feature extraction and deleted or retained in accordance with your explicit organization retention policies. Zero data is shared for model training.'
              },
              {
                q: 'How does sentence-level analysis work?',
                a: 'We evaluate syntactical uniformity, lexical entropy, and stylistic markers on every sentence independently. This reveals whether a document is fully AI-generated, organic human-written, or a mixed human/AI collaboration.'
              },
              {
                q: 'Can results be exported for formal compliance audits?',
                a: 'Yes. Clever AI generates certified 13-section digital forensics PDF reports complete with cryptographic SHA-256 hashes, timestamps, and model versioning data.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="glass-card p-5">
                <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2 mb-2">
                  <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 15. CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="glass-panel p-10 sm:p-14 rounded-3xl glow-border">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              Equip your organization with explainable digital forensics.
            </h3>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
              Start analyzing text, documents, images, audio, and video with enterprise-grade evidence signals today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-glow text-sm"
              >
                Create Free Account
              </Link>
              <Link
                href="/analyze"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold transition-all text-sm"
              >
                Try Live Analysis
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
