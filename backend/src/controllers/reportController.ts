import { Response, NextFunction } from 'express';
import fs from 'fs';
import { Analysis } from '../models/Analysis';
import { Report } from '../models/Report';
import { generatePdfReport } from '../services/pdfReportService';
import { logAuditEvent } from '../services/auditService';
import { AuthRequest } from '../middleware/authMiddleware';

export async function createReport(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { analysisId } = req.params;
    const analysis = await Analysis.findById(analysisId);

    if (!analysis) {
      res.status(404).json({ error: 'Analysis record not found' });
      return;
    }

    if (analysis.status !== 'COMPLETED') {
      res.status(400).json({ error: 'Cannot generate report for incomplete analysis job' });
      return;
    }

    const report = await generatePdfReport(analysis, req.user!.email);

    await logAuditEvent({
      userId: req.user!.id,
      userEmail: req.user!.email,
      orgId: req.user!.orgId,
      action: 'REPORT_GENERATED',
      resource: `reports/${report._id}`,
      requestId: (req.headers['x-request-id'] as string) || 'rep-create',
      ipAddress: req.ip
    });

    res.status(201).json({
      message: 'Forensic PDF report generated successfully',
      report
    });
  } catch (err) {
    next(err);
  }
}

export async function downloadReport(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const report = await Report.findById(id);

    if (!report) {
      res.status(404).json({ error: 'Report not found' });
      return;
    }

    if (!fs.existsSync(report.filePath)) {
      res.status(404).json({ error: 'Report PDF file not found on disk' });
      return;
    }

    res.download(report.filePath, `${report.reportNumber}.pdf`);
  } catch (err) {
    next(err);
  }
}

export async function listReports(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const filter: any = {
      $or: [{ userId: req.user!.id }]
    };
    if (req.user!.orgId) {
      filter.$or.push({ orgId: req.user!.orgId });
    }

    const reports = await Report.find(filter).sort({ createdAt: -1 });
    res.json({ reports });
  } catch (err) {
    next(err);
  }
}
