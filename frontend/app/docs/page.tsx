'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { Code2, Key, Terminal, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <DashboardHeader
          title="Developer REST API Reference (v1)"
          subtitle="Programmatic multi-modal ingestion, automated forensic analysis, and certified PDF report retrieval"
        />

        <main className="p-6 sm:p-8 space-y-8 max-w-5xl">
          {/* Overview */}
          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-cyan-400" />
              <span>API Architecture & Base URL</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The Clever AI REST API adheres to standard HTTP status codes, structured JSON payloads, and predictable
              resource naming. All requests must be made over HTTPS.
            </p>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-xs text-cyan-400">
              https://api.cleverai.example/api/v1 (Production) / http://localhost:5000/api/v1 (Local)
            </div>
          </div>

          {/* Authentication */}
          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-400" />
              <span>Authentication</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pass your API key in the <code className="text-cyan-400 font-mono">x-api-key</code> HTTP header or use Bearer JWT tokens.
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
              curl -H &quot;x-api-key: clv_live_4a89f92...&quot; https://api.cleverai.example/api/v1/usage/dashboard-stats
            </div>
          </div>

          {/* Endpoints */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Available Endpoints</h3>

            {/* POST /analysis/text */}
            <div className="glass-card p-6 space-y-3">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-400 font-mono font-bold text-xs border border-cyan-800">
                  POST
                </span>
                <span className="font-mono text-sm text-white">/analysis/text</span>
              </div>
              <p className="text-xs text-slate-400">
                Submit raw text payload for stylometric, burstiness, and predictive marker extraction.
              </p>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                <span className="text-slate-500">// Request Body (application/json)</span>
                <br />
                &#123;
                <br />
                &nbsp;&nbsp;&quot;text&quot;: &quot;Furthermore, it is important to note the algorithmic complexities...&quot;,
                <br />
                &nbsp;&nbsp;&quot;title&quot;: &quot;Research Exhibit #4&quot;
                <br />
                &#125;
              </div>
            </div>

            {/* POST /analysis/document */}
            <div className="glass-card p-6 space-y-3">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-indigo-950 text-indigo-400 font-mono font-bold text-xs border border-indigo-800">
                  POST
                </span>
                <span className="font-mono text-sm text-white">/analysis/document</span>
              </div>
              <p className="text-xs text-slate-400">
                Upload a document (PDF, DOCX, TXT) for structural parsing and multi-signal inspection.
              </p>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
                <span className="text-slate-500">// multipart/form-data with file field</span>
                <br />
                curl -F &quot;file=@document.pdf&quot; -F &quot;title=Policy Document&quot; https://api.cleverai.example/api/v1/analysis/document
              </div>
            </div>

            {/* GET /analysis/:id */}
            <div className="glass-card p-6 space-y-3">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 font-mono font-bold text-xs border border-emerald-800">
                  GET
                </span>
                <span className="font-mono text-sm text-white">/analysis/:id</span>
              </div>
              <p className="text-xs text-slate-400">
                Poll or fetch the complete forensic dossier for an analysis job.
              </p>
            </div>

            {/* POST /reports/:analysisId */}
            <div className="glass-card p-6 space-y-3">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-400 font-mono font-bold text-xs border border-cyan-800">
                  POST
                </span>
                <span className="font-mono text-sm text-white">/reports/:analysisId</span>
              </div>
              <p className="text-xs text-slate-400">
                Generate a certified 13-section digital forensics PDF audit report.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
