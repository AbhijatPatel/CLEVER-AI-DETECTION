import { Response, NextFunction } from 'express';
import { AuditLog } from '../models/AuditLog';
import { AuthRequest } from '../middleware/authMiddleware';

export async function listAuditLogs(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const skip = (page - 1) * limit;

    const filter: any = {
      $or: [{ userId: req.user!.id }]
    };
    if (req.user!.orgId) {
      filter.$or.push({ organizationId: req.user!.orgId });
    }

    if (req.query.action) {
      filter.action = req.query.action;
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limit),
      AuditLog.countDocuments(filter)
    ]);

    res.json({
      logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    next(err);
  }
}
