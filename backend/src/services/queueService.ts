import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { config } from '../config/env';
import { Analysis } from '../models/Analysis';
import { aiClient } from './aiClientService';
import { sha256 } from '../utils/security';
import fs from 'fs';

export interface AnalysisJobData {
  analysisId: string;
  modality: 'text' | 'document' | 'image' | 'audio' | 'video';
  text?: string;
  filePath?: string;
  originalFilename?: string;
  title: string;
  userId: string;
  orgId?: string;
}

let analysisQueue: Queue | null = null;
let isRedisAvailable = false;

// Attempt Redis connection only if not in test mode
if (process.env.NODE_ENV !== 'test' && config.redisUrl) {
  try {
    const redisConnection = new IORedis(config.redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      connectTimeout: 1000,
      retryStrategy: () => null // don't loop endlessly if redis not running
    });

    redisConnection.connect().then(() => {
      console.log('[Queue] Connected to Redis for BullMQ processing');
      isRedisAvailable = true;
      analysisQueue = new Queue('analysis-jobs', { connection: redisConnection });
      startWorker(redisConnection);
    }).catch(() => {
      console.warn('[Queue] Redis not available. Utilizing built-in async task runner for development.');
    });

    redisConnection.on('error', () => {
      // Graceful fallback to direct processing in dev
      if (!isRedisAvailable) {
        console.warn('[Queue] Redis not available. Utilizing built-in async task runner for development.');
      }
    });
  } catch (e) {
    console.warn('[Queue] Redis setup skipped, using in-memory runner.');
  }
}

function startWorker(connection: IORedis) {
  const worker = new Worker(
    'analysis-jobs',
    async (job: Job<AnalysisJobData>) => {
      console.log(`[Worker] BullMQ processing job ${job.id} for analysis ${job.data.analysisId}`);
      await processAnalysisJob(job.data);
    },
    { connection }
  );

  worker.on('completed', (job) => {
    console.log(`[Worker] Job ${job.id} completed successfully`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed:`, err);
  });
}

export async function enqueueAnalysis(data: AnalysisJobData): Promise<void> {
  if (isRedisAvailable && analysisQueue) {
    await analysisQueue.add('analyze', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 }
    });
  } else {
    // In-memory async execution
    setImmediate(async () => {
      try {
        await processAnalysisJob(data);
      } catch (err) {
        console.error('[QueueRunner] Failed processing async job:', err);
      }
    });
  }
}

export async function processAnalysisJob(data: AnalysisJobData): Promise<void> {
  const { analysisId, modality, text, filePath, originalFilename, title } = data;

  try {
    // 1. Mark status PROCESSING
    await Analysis.findByIdAndUpdate(analysisId, {
      status: 'PROCESSING'
    });

    let aiResult: any;

    if (modality === 'text' && text) {
      // 2. Mark status ANALYZING
      await Analysis.findByIdAndUpdate(analysisId, { status: 'ANALYZING' });
      aiResult = await aiClient.analyzeText(text, title);
      aiResult.integrity.sha256Hash = sha256(text);
      aiResult.integrity.fileSizeBytes = Buffer.byteLength(text, 'utf8');
    } else if (modality !== 'text' && filePath && originalFilename) {
      await Analysis.findByIdAndUpdate(analysisId, { status: 'ANALYZING' });
      aiResult = await aiClient.analyzeMediaFile(modality, filePath, originalFilename, title);
      
      if (fs.existsSync(filePath)) {
        const buf = fs.readFileSync(filePath);
        aiResult.integrity.sha256Hash = sha256(buf);
        aiResult.integrity.fileSizeBytes = buf.length;
      }
    } else {
      throw new Error('Invalid job parameters: missing content or file');
    }

    // 3. Save completed analysis
    await Analysis.findByIdAndUpdate(analysisId, {
      status: 'COMPLETED',
      aiLikelihood: aiResult.aiLikelihood,
      humanLikelihood: aiResult.humanLikelihood,
      uncertainLikelihood: aiResult.uncertainLikelihood,
      detectionConfidence: aiResult.detectionConfidence,
      compositeScore: aiResult.compositeScore,
      evidenceSignals: aiResult.evidenceSignals,
      sentences: aiResult.sentences,
      writingFingerprint: aiResult.writingFingerprint,
      provenance: aiResult.provenance,
      integrity: aiResult.integrity,
      modelInfo: aiResult.modelInfo,
      textDetails: aiResult.textDetails,
      imageDetails: aiResult.imageDetails,
      audioDetails: aiResult.audioDetails,
      videoDetails: aiResult.videoDetails,
      limitationsDisclaimer: aiResult.limitationsDisclaimer,
      manualReviewGuidance: aiResult.manualReviewGuidance,
      completedAt: new Date()
    });

    console.log(`[Queue] Successfully completed analysis ${analysisId}`);
  } catch (error: any) {
    console.error(`[Queue] Error processing analysis ${analysisId}:`, error);
    await Analysis.findByIdAndUpdate(analysisId, {
      status: 'FAILED',
      errorMessage: error.message || 'Analysis pipeline encountered an error'
    });
  }
}
