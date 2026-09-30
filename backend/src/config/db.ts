import mongoose from 'mongoose';
import { config } from './env';

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 1500
    });
    console.log(`[Database] Connected to MongoDB at ${config.mongodbUri.split('@')[1] || config.mongodbUri}`);
  } catch (error) {
    console.warn('[Database] Notice: MongoDB unreachable or connection timed out. Server continuing to operate.', error);
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
