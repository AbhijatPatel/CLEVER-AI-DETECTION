import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/clever_ai',
  jwtSecret: process.env.JWT_SECRET || 'clever_ai_jwt_super_secure_access_secret_2026',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'clever_ai_jwt_super_secure_refresh_secret_2026',
  jwtAccessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
  jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  storageProvider: process.env.STORAGE_PROVIDER || 'local',
  storagePath: process.env.STORAGE_PATH || './uploads',
  rateLimitWindowMs: 15 * 60 * 1000,
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10)
};
