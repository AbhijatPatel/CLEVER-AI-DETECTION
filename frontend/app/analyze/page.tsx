'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import {
  FileText,
  Layers,
  Image as ImageIcon,
  Mic,
  Video,
  Upload,
  ArrowRight,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/useAuth';

type Modality = 'text' | 'document' | 'image' | 'audio' | 'video';

export default function AnalyzePage() {
  const router = useRouter();
  const { loading: authLoading } = useAuth(true);
  const [activeTab, setActiveTab] = useState<Modality>('text');

  // Text state
  const [textContent, setTextContent] = useState('');
  const [title, setTitle] = useState('');

  // Media state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textContent.trim() || textContent.trim().length < 20) {
      setError('Please provide at least 20 characters for meaningful forensic stylometric analysis.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await api.createTextAnalysis(textContent, title || 'Text Analysis');
      router.push(`/results/${res.analysisId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to initialize analysis job.');
      setLoading(false);
    }
  };

  const handleMediaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const mediaModality = activeTab as 'document' | 'image' | 'audio' | 'video';
      const res = await api.createMediaAnalysis(mediaModality, selectedFile, title || selectedFile.name);
      router.push(`/results/${res.analysisId}`);
    } catch (err: any) {
      setError(err.message || 'File upload failed. Ensure format and size are supported.');
      setLoading(false);
    }
  };

  const modalityCards = [
    {
      id: 'text' as Modality,
      title: 'Text Intelligence',
      icon: FileText,
      formats: 'Pasted text, TXT payloads',
      analyzed: 'Sentence predictability, burstiness variance, Type-Token Ratio, AI transitional markers',
      processingTime: 'Instant (~1 - 3 seconds)',
      privacy: 'Processed in-memory. Zero data used for AI training.'
    },
    {
      id: 'document' as Modality,
      title: 'Document Forensics',
      icon: Layers,
      formats: 'PDF, DOCX, TXT',
      analyzed: 'Structural paragraphs, document metadata (author, generator software), OCR layers',
      processingTime: 'Fast (~3 - 8 seconds)',
      privacy: 'Isolated storage. Retained only per organization retention policy.'
    },
    {
      id: 'image' as Modality,
      title: 'Image Forensics',
      icon: ImageIcon,
      formats: 'PNG, JPG, JPEG, WEBP',
      analyzed: 'EXIF camera hardware tags, Error Level Analysis (ELA), diffusion dimension matrices',
      processingTime: 'Fast (~2 - 5 seconds)',
      privacy: 'Cryptographic SHA-256 hash generated. Never indexed publicly.'
    },
    {
      id: 'audio' as Modality,
      title: 'Audio Forensics',
      icon: Mic,
      formats: 'MP3, WAV, M4A',
      analyzed: 'Voice synthesis artifacts, vocoder frequency cutoffs, acoustic modulation cadence',
      processingTime: 'Moderate (~5 - 15 seconds)',
      privacy: 'Acoustic waveform extracted for feature extraction only.'
    },
    {
      id: 'video' as Modality,
      title: 'Video Forensics',
      icon: Video,
      formats: 'MP4, MOV, WEBM',
      analyzed: 'Frame-by-frame temporal consistency, facial boundary warping, audio-visual sync',
      processingTime: 'Queue-based (~15 - 45 seconds)',
      privacy: 'Sample frames extracted in sandboxed temporary volume.'
    }
  ];

  const currentModalityInfo = modalityCards.find((m) => m.id === activeTab)!;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto md:pt-0 pt-14">
        <DashboardHeader
          title="Create New Forensic Analysis"
          subtitle="Select content modality and initiate multi-signal authenticity inspection"
        />

        <main className="p-6 sm:p-8 space-y-8 max-w-6xl">
          {/* Modality Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {modalityCards.map((m) => {
              const Icon = m.icon;
              const isSelected = activeTab === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setActiveTab(m.id);
                    setError(null);
                    setSelectedFile(null);
                  }}
                  className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/80 shadow-glow'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                    {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                  </div>
                  <div>
                    <h3 className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>{m.title}</h3>
                    <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{m.formats.split(',')[0]}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Forensic Parameters Info Banner */}
          <div className="glass-card p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="font-mono text-slate-500 uppercase text-[10px] block">Analyzed Features</span>
              <p className="text-slate-300 mt-1">{currentModalityInfo.analyzed}</p>
            </div>
            <div>
              <span className="font-mono text-slate-500 uppercase text-[10px] block flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" /> Processing Category
              </span>
              <p className="text-slate-300 mt-1 font-mono">{currentModalityInfo.processingTime}</p>
            </div>
            <div>
              <span className="font-mono text-slate-500 uppercase text-[10px] block flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" /> Privacy & Retention
              </span>
              <p className="text-slate-300 mt-1">{currentModalityInfo.privacy}</p>
            </div>
          </div>

          {/* Input Form Box */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl glow-border">
            {error && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 flex items-center gap-2.5 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {activeTab === 'text' ? (
              <form onSubmit={handleTextSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Analysis Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Investigation Exhibit #104 - Research Paper"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Text Content for Forensic Inspection
                    </label>
                    <span className="text-[11px] font-mono text-slate-500">
                      {textContent.trim().split(/\s+/).filter(Boolean).length} words | {textContent.length} chars
                    </span>
                  </div>
                  <textarea
                    rows={10}
                    required
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Paste the text passage here to analyze linguistic predictability, burstiness variance, sentence structure, and synthetic phrase frequency..."
                    className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono leading-relaxed"
                  />
                </div>

                {/* Sample Text Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">Load Sample:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setTitle('Sample AI-Assisted Article');
                      setTextContent(
                        'Furthermore, it is important to note that the rapid advancement of artificial intelligence has revolutionized modern digital architecture. In conclusion, delving into these complex neural mechanisms requires a comprehensive understanding of statistical algorithms. Moreover, the implications of this transformative technology are multifaceted and of paramount importance.'
                      );
                    }}
                    className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-300 text-[11px]"
                  >
                    AI Sample
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTitle('Sample Human Writing Field Notes');
                      setTextContent(
                        'We visited the archive basement in Boston early Tuesday morning. The old radiator in the hallway was rattling loudly, making it tough to concentrate on the microfilms. I ended up copying eighteen pages of handwritten notes by hand after realizing my scanner battery died.'
                      );
                    }}
                    className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 hover:border-emerald-500 text-slate-300 text-[11px]"
                  >
                    Human Sample
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-semibold hover:from-cyan-400 hover:to-indigo-500 focus:outline-none transition-all shadow-glow disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Initializing Queue Pipeline...</span>
                      </>
                    ) : (
                      <>
                        <span>Execute Text Analysis</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleMediaSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Analysis Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={`e.g. Suspect ${activeTab.toUpperCase()} Evidence File`}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Drag & Drop Upload Zone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Upload {activeTab.toUpperCase()} File
                  </label>
                  <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/60 rounded-2xl p-8 text-center transition-colors bg-slate-900/30">
                    <input
                      type="file"
                      id="media-file-input"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0]);
                          if (!title) setTitle(e.target.files[0].name);
                        }
                      }}
                    />
                    <label htmlFor="media-file-input" className="cursor-pointer block">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-cyan-400 mb-3">
                        <Upload className="w-6 h-6" />
                      </div>
                      {selectedFile ? (
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-white">{selectedFile.name}</p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {(selectedFile.size / 1024).toFixed(1)} KB | {selectedFile.type || 'binary'}
                          </p>
                          <span className="text-[10px] text-cyan-400 underline block mt-2">Click to replace</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-slate-300">
                            Click to select or drag & drop target {activeTab}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            Supported: {currentModalityInfo.formats} (Up to 50MB)
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading || !selectedFile}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-semibold hover:from-cyan-400 hover:to-indigo-500 focus:outline-none transition-all shadow-glow disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading & Dispatching Job...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit for Forensics</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
