import mongoose from 'mongoose';
import { config } from './env';

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 1500
    });
    console.log(`[Database] Connected to MongoDB at ${config.mongodbUri.split('@')[1] || config.mongodbUri}`);
  } catch (error) {
    if (config.nodeEnv !== 'production') {
      console.warn('[Database] Notice: Local MongoDB not detected on port 27017. API server running in local dev mode.');
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
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  } catch (e) {}
}
