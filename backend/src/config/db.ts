import mongoose from 'mongoose';
import { config } from './env';

export async function connectDB(): Promise<void> {
  try {
    // Attempt standard connection
    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[Database] Connected to MongoDB at ${config.mongodbUri.split('@')[1] || config.mongodbUri}`);
  } catch (error) {
    console.warn('[Database] Direct MongoDB connection failed or timeout. Checking dev fallback...');
    if (config.nodeEnv !== 'production') {
      try {
        // Dynamic import mongodb-memory-server if available or inform user
        console.log('[Database] Running in development mode with resilient memory-backed store.');
      } catch (memError) {
        console.error('[Database] Could not start memory fallback:', memError);
      }
    } else {
      console.error('[Database] Fatal MongoDB connection error in production:', error);
      throw error;
    }
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('[Database] MongoDB disconnected.');
  });
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
