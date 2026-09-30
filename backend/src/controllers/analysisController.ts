import { Request, Response, NextFunction } from 'express';
import { Analysis } from '../models/Analysis';
import { textAnalysisSchema } from '../validators/analysisValidator';
import { enqueueAnalysis } from '../services/queueService';
import { logAuditEvent } from '../services/auditService';
import { AuthRequest } from '../middleware/authMiddleware';

export async function createTextAnalysis(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = textAnalysisSchema.parse(req.body);
    const userId = req.user!.id;
    const orgId = req.user!.orgId;

    const analysis = await Analysis.create({
      userId,
      orgId,
      title: validated.title || 'Text Analysis',
      modality: 'text',
      status: 'QUEUED',
      rawContent: validated.text,
      aiLikelihood: 0,
      humanLikelihood: 0,
      uncertainLikelihood: 0,
      detectionConfidence: 'Medium',
      compositeScore: {
        overallRiskLevel: 'Moderate',
        aiGenerationSignal: 0,
        manipulationSignal: 0,
        similaritySignal: 0,
        provenanceSignal: 0,
        integritySignal: 100,
        methodologyNotes: 'Queued for linguistic stylometric ensemble.'
      },
      provenance: {
        sourceOrigin: 'Direct Text Input',
        creationTimestamp: new Date().toISOString(),
        contentCredentialsPresent: false,
        metadataEntries: { rawLength: validated.text.length },
        integrityVerified: true,
        notes: 'Submitted for multi-signal verification'
      },
      integrity: {
        sha256Hash: 'pending-calculation',
        fileSizeBytes: Buffer.byteLength(validated.text, 'utf8'),
        mimeType: 'text/plain',
        timestamp: new Date().toISOString(),
        verifiedMatch: true
      },
      modelInfo: {
        modelName: 'clever-text-pipeline',
        modelVersion: '1.2.0',
        pipelineVersion: '2.0.0',
        provider: 'heuristic',
        isDemoAnalysis: false,
        executionTimeMs: 0
      }
    });

    // Enqueue job for background execution
    await enqueueAnalysis({
      analysisId: analysis._id.toString(),
      modality: 'text',
      text: validated.text,
      title: analysis.title,
      userId,
      orgId
    });

    await logAuditEvent({
      userId,
      userEmail: req.user!.email,
      orgId,
      action: 'ANALYSIS_CREATED',
      resource: `analyses/${analysis._id}`,
      requestId: (req.headers['x-request-id'] as string) || 'an-create',
      ipAddress: req.ip
    });

    res.status(202).json({
      message: 'Analysis job created and queued successfully',
      analysisId: analysis._id,
      status: analysis.status,
      title: analysis.title,
      modality: analysis.modality
    });
  } catch (err) {
    next(err);
  }
}

export async function createMediaAnalysis(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No media file provided for analysis' });
      return;
    }

    const modality = (req.params.modality || req.body.modality || 'document') as 'document' | 'image' | 'audio' | 'video';
    const userId = req.user!.id;
    const orgId = req.user!.orgId;
    const title = req.body.title || req.file.originalname;

    const analysis = await Analysis.create({
      userId,
      orgId,
      title,
      modality,
      status: 'QUEUED',
      fileUrl: req.file.path,
      aiLikelihood: 0,
      humanLikelihood: 0,
      uncertainLikelihood: 0,
      detectionConfidence: 'Medium',
      compositeScore: {
        overallRiskLevel: 'Moderate',
        aiGenerationSignal: 0,
        manipulationSignal: 0,
        similaritySignal: 0,
        provenanceSignal: 0,
        integritySignal: 100,
        methodologyNotes: `Queued for ${modality} forensic evaluation.`
      },
      provenance: {
        sourceOrigin: `Uploaded File (${req.file.originalname})`,
        creationTimestamp: new Date().toISOString(),
        contentCredentialsPresent: false,
        metadataEntries: { originalName: req.file.originalname, size: req.file.size, mimeType: req.file.mimetype },
        integrityVerified: true,
        notes: 'File uploaded and validated for forensics.'
      },
      integrity: {
        sha256Hash: 'pending-calculation',
        fileSizeBytes: req.file.size,
        mimeType: req.file.mimetype,
        timestamp: new Date().toISOString(),
        verifiedMatch: true
      },
      modelInfo: {
        modelName: `clever-${modality}-pipeline`,
        modelVersion: '1.0.0',
        pipelineVersion: '2.0.0',
        provider: 'heuristic',
        isDemoAnalysis: false,
        executionTimeMs: 0
      }
    });

    await enqueueAnalysis({
      analysisId: analysis._id.toString(),
      modality,
      filePath: req.file.path,
      originalFilename: req.file.originalname,
      title,
      userId,
      orgId
    });

    await logAuditEvent({
      userId,
      userEmail: req.user!.email,
      orgId,
      action: 'FILE_UPLOAD',
      resource: `analyses/${analysis._id}`,
      requestId: (req.headers['x-request-id'] as string) || 'media-create',
      ipAddress: req.ip
    });

    res.status(202).json({
      message: `${modality.toUpperCase()} analysis job created and queued successfully`,
      analysisId: analysis._id,
      status: analysis.status,
      title: analysis.title,
      modality: analysis.modality
    });
  } catch (err) {
    next(err);
  }
}

export async function getAnalysisById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const analysis = await Analysis.findById(id);

    if (!analysis) {
      res.status(404).json({ error: 'Analysis record not found' });
      return;
    }

    // Access control: creator or same organization
    if (analysis.userId.toString() !== req.user!.id && (!req.user!.orgId || analysis.orgId?.toString() !== req.user!.orgId)) {
      res.status(403).json({ error: 'You do not have permission to view this analysis' });
      return;
    }

    res.json(analysis);
  } catch (err) {
    next(err);
  }
}

export async function listAnalyses(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {
      $or: [{ userId: req.user!.id }]
    };
    if (req.user!.orgId) {
      filter.$or.push({ orgId: req.user!.orgId });
    }

    if (req.query.modality) {
      filter.modality = req.query.modality;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: 'i' };
    }

    const [items, total] = await Promise.all([
      Analysis.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-rawContent -sentences'),
      Analysis.countDocuments(filter)
    ]);

    res.json({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteAnalysis(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const analysis = await Analysis.findById(id);

    if (!analysis) {
      res.status(404).json({ error: 'Analysis record not found' });
      return;
    }

    if (analysis.userId.toString() !== req.user!.id && req.user!.role !== 'Admin') {
      res.status(403).json({ error: 'You do not have permission to delete this analysis' });
      return;
    }

    await Analysis.findByIdAndDelete(id);

    await logAuditEvent({
      userId: req.user!.id,
      userEmail: req.user!.email,
      orgId: req.user!.orgId,
      action: 'FILE_DELETED',
      resource: `analyses/${id}`,
      requestId: (req.headers['x-request-id'] as string) || 'an-del',
      ipAddress: req.ip
    });

    res.json({ message: 'Analysis deleted successfully' });
  } catch (err) {
    next(err);
  }
}

export async function getDashboardStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const filter: any = {
      $or: [{ userId: req.user!.id }]
    };
    if (req.user!.orgId) {
      filter.$or.push({ orgId: req.user!.orgId });
    }

    const totalAnalyses = await Analysis.countDocuments(filter);
    
    if (totalAnalyses === 0) {
      res.json({
        totalAnalyses: 0,
        documentsAnalyzed: 0,
        imagesAnalyzed: 0,
        audioAnalyzed: 0,
        videosAnalyzed: 0,
        textAnalyzed: 0,
        aiLikeCount: 0,
        humanLikeCount: 0,
        uncertainCount: 0,
        pendingJobs: 0,
        completedReports: 0,
        recentAnalyses: []
      });
      return;
    }

    const [
      textCount,
      docCount,
      imgCount,
      audCount,
      vidCount,
      pendingCount,
      aiCount,
      humanCount,
      recent
    ] = await Promise.all([
      Analysis.countDocuments({ ...filter, modality: 'text' }),
      Analysis.countDocuments({ ...filter, modality: 'document' }),
      Analysis.countDocuments({ ...filter, modality: 'image' }),
      Analysis.countDocuments({ ...filter, modality: 'audio' }),
      Analysis.countDocuments({ ...filter, modality: 'video' }),
      Analysis.countDocuments({ ...filter, status: { $in: ['QUEUED', 'PROCESSING', 'ANALYZING'] } }),
      Analysis.countDocuments({ ...filter, aiLikelihood: { $gt: 55 } }),
      Analysis.countDocuments({ ...filter, humanLikelihood: { $gt: 55 } }),
      Analysis.find(filter).sort({ createdAt: -1 }).limit(5).select('title modality status aiLikelihood humanLikelihood detectionConfidence createdAt')
    ]);

    res.json({
      totalAnalyses,
      documentsAnalyzed: docCount,
      imagesAnalyzed: imgCount,
      audioAnalyzed: audCount,
      videosAnalyzed: vidCount,
      textAnalyzed: textCount,
      aiLikeCount: aiCount,
      humanLikeCount: humanCount,
      uncertainCount: Math.max(0, totalAnalyses - aiCount - humanCount),
      pendingJobs: pendingCount,
      completedReports: totalAnalyses - pendingCount,
      recentAnalyses: recent
    });
  } catch (err) {
    next(err);
  }
}
