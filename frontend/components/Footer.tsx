import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Cpu, FileCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-wider text-white">
                CLEVER <span className="text-cyan-400">AI</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Clever AI is a multi-modal AI content intelligence and digital forensics platform designed to help
              human investigators understand evidence signals across text, documents, images, audio, and video.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 font-mono">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-cyan-400" /> SOC2 Type II Aligned
              </span>
              <span className="flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" /> C2PA Ready
              </span>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono mb-4">
              Forensic Engines
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/analyze" className="hover:text-cyan-400 transition-colors">
                  Text Intelligence
                </Link>
              </li>
              <li>
                <Link href="/analyze" className="hover:text-cyan-400 transition-colors">
                  Document Forensics (PDF/DOCX)
                </Link>
              </li>
              <li>
                <Link href="/analyze" className="hover:text-cyan-400 transition-colors">
                  Image Forensics & ELA
                </Link>
              </li>
              <li>
                <Link href="/analyze" className="hover:text-cyan-400 transition-colors">
                  Synthetic Audio & Speech
                </Link>
              </li>
              <li>
                <Link href="/analyze" className="hover:text-cyan-400 transition-colors">
                  Video & Deepfake Analysis
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">
                  Investigation Dashboard
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-cyan-400 transition-colors">
                  Case History
                </Link>
              </li>
              <li>
                <Link href="/reports" className="hover:text-cyan-400 transition-colors">
                  Forensic PDF Reports
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-cyan-400 transition-colors">
                  Developer REST API
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-cyan-400 transition-colors">
                  Enterprise Workspaces
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance & Legal */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono mb-4">
              Trust & Security
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/docs" className="hover:text-cyan-400 transition-colors">
                  Security Overview
                </Link>
              </li>
              <li>
                <Link href="/audit-logs" className="hover:text-cyan-400 transition-colors">
                  Immutable Audit Logs
                </Link>
              </li>
              <li>
                <span className="text-slate-500">Zero Content Training Policy</span>
              </li>
              <li>
                <span className="text-slate-500">Explainable AI Methodology</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Forensic Disclaimer Bar */}
        <div className="mt-12 pt-6 border-t border-slate-900/80 text-[11px] leading-relaxed text-slate-500">
          <p className="max-w-4xl">
            <strong className="text-slate-400">Forensic Disclaimer:</strong> Automated AI content detection and digital
            forensics produce probabilistic likelihood estimates and evidence signals. These outputs are intended to
            augment human investigation and manual review. Clever AI never claims 100% mathematical certainty of
            authorship or synthetic generation.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-600">
            <span>© {new Date().getFullYear()} Clever AI Technologies, Inc. All rights reserved.</span>
            <div className="flex gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Responsible AI Guidelines</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
