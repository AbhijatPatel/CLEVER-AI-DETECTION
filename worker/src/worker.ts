import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clever_ai';
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

async function startWorker() {
  console.log('[Worker Service] Bootstrapping Clever AI Background Forensics Worker...');

  await mongoose.connect(MONGODB_URI);
  console.log('[Worker Service] Connected to MongoDB');

  const connection = new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null
  });

  const worker = new Worker(
    'analysis-jobs',
    async (job: Job) => {
      console.log(`[Worker Service] Processing job ${job.id} for analysis ${job.data.analysisId}`);
      // Interacts with AI service and MongoDB
    },
    { connection, concurrency: 5 }
  );

  worker.on('ready', () => {
    console.log('[Worker Service] BullMQ worker ready and polling for forensic jobs');
  });

  worker.on('failed', (job, err) => {
    console.error(`[Worker Service] Job ${job?.id} failed:`, err);
  });
}

startWorker().catch((err) => {
  console.error('[Worker Service] Fatal worker error:', err);
  process.exit(1);
});
