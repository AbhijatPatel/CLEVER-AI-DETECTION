import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { IAnalysis } from '../models/Analysis';
import { Report } from '../models/Report';

const REPORTS_DIR = path.resolve(process.cwd(), 'reports');
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

export async function generatePdfReport(analysis: IAnalysis, userEmail: string): Promise<any> {
  const reportNumber = `REP-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const fileName = `${reportNumber}.pdf`;
  const filePath = path.join(REPORTS_DIR, fileName);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    // --- Header Banner ---
    doc.rect(40, 40, 515, 60).fill('#0f172a');
    doc.fillColor('#38bdf8').fontSize(20).text('CLEVER AI', 60, 52);
    doc.fillColor('#94a3b8').fontSize(9).text('CONTENT INTELLIGENCE & DIGITAL FORENSICS REPORT', 60, 76);
    doc.fillColor('#ffffff').fontSize(10).text(`REPORT NO: ${reportNumber}`, 380, 55);
    doc.text(`DATE: ${new Date().toISOString().split('T')[0]}`, 380, 72);

    doc.moveDown(3);

    // Section 1: Executive Summary
    doc.fillColor('#0f172a').fontSize(13).text('1. Executive Forensic Summary');
    doc.rect(40, doc.y + 2, 515, 1).fill('#cbd5e1');
    doc.moveDown(0.5);
    doc.fillColor('#334155').fontSize(9).text(
      `This digital forensics report compiles automated probabilistic authenticity signals evaluated for target artifact "${analysis.title}". ` +
      `The analysis evaluated linguistic, statistical, provenance, and file integrity indicators.`
    );
    doc.moveDown(1);

    // Section 2 & 3: File Info & Config
    doc.fillColor('#0f172a').fontSize(13).text('2. File Information & Analysis Configuration');
    doc.rect(40, doc.y + 2, 515, 1).fill('#cbd5e1');
    doc.moveDown(0.5);
    doc.fillColor('#475569').fontSize(9);
    doc.text(`Artifact Title: ${analysis.title}`);
    doc.text(`Modality: ${analysis.modality.toUpperCase()}`);
    doc.text(`Analysis ID: ${analysis._id}`);
    doc.text(`Requester: ${userEmail}`);
    doc.text(`Status: ${analysis.status}`);
    doc.moveDown(1);

    // Section 4: Detection Results (Likelihood Distribution)
    doc.fillColor('#0f172a').fontSize(13).text('3. Detection Likelihood Distribution');
    doc.rect(40, doc.y + 2, 515, 1).fill('#cbd5e1');
    doc.moveDown(0.5);

    // Metrics grid
    const startY = doc.y;
    doc.rect(40, startY, 120, 45).fillAndStroke('#f8fafc', '#e2e8f0');
    doc.fillColor('#0f172a').fontSize(14).text(`${analysis.aiLikelihood}%`, 50, startY + 8);
    doc.fillColor('#64748b').fontSize(8).text('AI LIKELIHOOD', 50, startY + 28);

    doc.rect(170, startY, 120, 45).fillAndStroke('#f8fafc', '#e2e8f0');
    doc.fillColor('#0f172a').fontSize(14).text(`${analysis.humanLikelihood}%`, 180, startY + 8);
    doc.fillColor('#64748b').fontSize(8).text('HUMAN LIKELIHOOD', 180, startY + 28);

    doc.rect(300, startY, 120, 45).fillAndStroke('#f8fafc', '#e2e8f0');
    doc.fillColor('#0f172a').fontSize(14).text(`${analysis.uncertainLikelihood}%`, 310, startY + 8);
    doc.fillColor('#64748b').fontSize(8).text('UNCERTAIN', 310, startY + 28);

    doc.rect(430, startY, 125, 45).fillAndStroke('#f8fafc', '#e2e8f0');
    doc.fillColor('#0f172a').fontSize(14).text(`${analysis.detectionConfidence}`, 440, startY + 8);
    doc.fillColor('#64748b').fontSize(8).text('CONFIDENCE', 440, startY + 28);

    doc.y = startY + 60;

    // Section 5: Sentence & Paragraph Analysis
    if (analysis.sentences && analysis.sentences.length > 0) {
      doc.fillColor('#0f172a').fontSize(13).text('4. Sentence-Level Forensic Breakdown');
      doc.rect(40, doc.y + 2, 515, 1).fill('#cbd5e1');
      doc.moveDown(0.5);
      
      const sampleSentences = analysis.sentences.slice(0, 6);
      sampleSentences.forEach((s) => {
        doc.fillColor('#1e293b').fontSize(9).text(`[${s.category}] "${s.text.substring(0, 85)}..."`);
        doc.fillColor('#64748b').fontSize(8).text(`   Score: ${Math.round(s.score * 100)}% | Signal: ${s.evidence[0] || 'Standard baseline'}`);
        doc.moveDown(0.2);
      });
      doc.moveDown(0.8);
    }

    // Section 6: Writing Fingerprint (if text)
    if (analysis.writingFingerprint) {
      doc.fillColor('#0f172a').fontSize(13).text('5. Stylometric Writing Fingerprint');
      doc.rect(40, doc.y + 2, 515, 1).fill('#cbd5e1');
      doc.moveDown(0.5);
      const fp = analysis.writingFingerprint;
      doc.fillColor('#334155').fontSize(9);
      doc.text(`Average Sentence Length: ${fp.avgSentenceLength} words | Sentence Length Variation: ${fp.sentenceLengthVariation}`);
      doc.text(`Vocabulary Diversity (TTR): ${fp.vocabularyDiversity}% | Redundancy Repetition Score: ${fp.repetitionScore}%`);
      doc.text(`Syntactic Complexity: ${fp.syntacticComplexity}/100 | Style Consistency: ${fp.styleConsistency}/100`);
      doc.moveDown(1);
    }

    // Section 7, 8, 9: Provenance & File Integrity SHA-256
    doc.fillColor('#0f172a').fontSize(13).text('6. Provenance & Cryptographic File Integrity');
    doc.rect(40, doc.y + 2, 515, 1).fill('#cbd5e1');
    doc.moveDown(0.5);
    doc.fillColor('#334155').fontSize(9);
    doc.text(`Source Origin: ${analysis.provenance?.sourceOrigin || 'Direct Submission'}`);
    doc.text(`SHA-256 Hash: ${analysis.integrity?.sha256Hash || 'N/A'}`);
    doc.text(`File Size: ${analysis.integrity?.fileSizeBytes || 0} bytes | MIME: ${analysis.integrity?.mimeType || 'unknown'}`);
    doc.text(`Verification Timestamp: ${analysis.integrity?.timestamp || new Date().toISOString()}`);
    doc.moveDown(1);

    // Section 10: Evidence Signals
    doc.fillColor('#0f172a').fontSize(13).text('7. Key Forensic Evidence Signals');
    doc.rect(40, doc.y + 2, 515, 1).fill('#cbd5e1');
    doc.moveDown(0.5);
    (analysis.evidenceSignals || []).forEach((ev) => {
      doc.fillColor('#0f172a').fontSize(9).text(`• [${ev.severity.toUpperCase()}] ${ev.title} (${ev.contribution}% contribution)`);
      doc.fillColor('#64748b').fontSize(8).text(`   ${ev.description}`);
      doc.moveDown(0.2);
    });
    doc.moveDown(0.8);

    // Section 11, 12, 13: Model Metadata, Limitations & Guidance
    doc.fillColor('#0f172a').fontSize(13).text('8. Model Information & Mandatory Limitations Disclaimer');
    doc.rect(40, doc.y + 2, 515, 1).fill('#cbd5e1');
    doc.moveDown(0.5);
    doc.fillColor('#475569').fontSize(8);
    doc.text(`Model: ${analysis.modelInfo.modelName} (v${analysis.modelInfo.modelVersion}) | Pipeline: v${analysis.modelInfo.pipelineVersion} | Provider: ${analysis.modelInfo.provider}`);
    doc.moveDown(0.4);
    doc.fillColor('#b91c1c').text(`DISCLAIMER: ${analysis.limitationsDisclaimer}`);
    doc.moveDown(0.4);
    doc.fillColor('#334155').text(`MANUAL REVIEW GUIDANCE: ${analysis.manualReviewGuidance}`);

    // Footer
    doc.fontSize(8).fillColor('#94a3b8').text('Confidential Forensic Output generated by Clever AI Platform. Page 1 of 1', 40, 780, { align: 'center' });

    doc.end();

    writeStream.on('finish', async () => {
      try {
        const report = await Report.create({
          analysisId: analysis._id,
          userId: analysis.userId,
          orgId: analysis.orgId,
          reportNumber,
          title: `Forensic Report - ${analysis.title}`,
          sha256Hash: analysis.integrity.sha256Hash || 'hash-pending',
          summary: `AI Likelihood: ${analysis.aiLikelihood}%, Confidence: ${analysis.detectionConfidence}`,
          filePath
        });
        resolve(report);
      } catch (err) {
        reject(err);
      }
    });

    writeStream.on('error', reject);
  });
}
