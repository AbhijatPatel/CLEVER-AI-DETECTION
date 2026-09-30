import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config/env';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateTokens(payload: { userId: string; email: string; role: string; orgId?: string }) {
  const accessToken = jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtAccessExpiry
  } as jwt.SignOptions);

  const refreshToken = jwt.sign({ userId: payload.userId }, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiry
  } as jwt.SignOptions);

  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): any {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token: string): any {
  try {
    return jwt.verify(token, config.jwtRefreshSecret);
  } catch (error) {
    return null;
  }
}

export function sha256(data: string | Buffer): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function generateApiKey(): { apiKey: string; keyPrefix: string; keyHash: string } {
  const rawSecret = crypto.randomBytes(32).toString('hex');
  const keyPrefix = `clv_${rawSecret.substring(0, 8)}`;
  const apiKey = `${keyPrefix}_${rawSecret.substring(8)}`;
  const keyHash = sha256(apiKey);
  return { apiKey, keyPrefix, keyHash };
}
