import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, sha256 } from '../utils/security';
import { User } from '../models/User';
import { ApiKey } from '../models/ApiKey';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'Admin' | 'Manager' | 'Analyst' | 'Member';
    orgId?: string;
  };
  apiKey?: any;
}

export async function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  // 1. Check API Key header
  const apiKeyHeader = req.headers['x-api-key'] as string;
  if (apiKeyHeader) {
    try {
      const hashed = sha256(apiKeyHeader);
      const keyDoc = await ApiKey.findOne({ keyHash: hashed });
      if (keyDoc) {
        if (keyDoc.expiresAt && keyDoc.expiresAt < new Date()) {
          res.status(401).json({ error: 'API key has expired' });
          return;
        }
        keyDoc.lastUsedAt = new Date();
        await keyDoc.save();

        req.user = {
          id: keyDoc.userId.toString(),
          email: 'api-service-account@clever.ai',
          role: 'Analyst',
          orgId: keyDoc.orgId?.toString()
        };
        req.apiKey = keyDoc;
        next();
        return;
      }
    } catch (e) {
      // Fall through to bearer check
    }
  }

  // 2. Check Bearer JWT
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({ error: 'Authentication required. No token provided.' });
    return;
  }

  const payload = verifyAccessToken(token);
  if (!payload || !payload.userId) {
    res.status(401).json({ error: 'Invalid or expired access token' });
    return;
  }

  req.user = {
    id: payload.userId,
    email: payload.email,
    role: payload.role,
    orgId: payload.orgId
  };

  next();
}

export function requireRole(allowedRoles: Array<'Admin' | 'Manager' | 'Analyst' | 'Member'>) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: `Insufficient permissions. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}`
      });
      return;
    }

    next();
  };
}
