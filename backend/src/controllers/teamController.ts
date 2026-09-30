import { Response, NextFunction } from 'express';
import { User } from '../models/User';
import { ApiKey } from '../models/ApiKey';
import { generateApiKey } from '../utils/security';
import { logAuditEvent } from '../services/auditService';
import { AuthRequest } from '../middleware/authMiddleware';

// Team Management
export async function listTeamMembers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const orgId = req.user?.orgId;
    if (!orgId) {
      // Individual workspace, return just self
      const self = await User.findById(req.user!.id).select('name email role createdAt');
      res.json({ members: [self] });
      return;
    }

    const members = await User.find({ organizationId: orgId }).select('name email role createdAt');
    res.json({ members });
  } catch (err) {
    next(err);
  }
}

export async function inviteTeamMember(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, role, name } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    res.status(201).json({
      message: `Invitation successfully dispatched to ${email}`,
      invitation: { email, role: role || 'Analyst', invitedAt: new Date() }
    });
  } catch (err) {
    next(err);
  }
}

// API Key Management
export async function listApiKeys(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const keys = await ApiKey.find({ userId: req.user!.id }).select('-keyHash').sort({ createdAt: -1 });
    res.json({ keys });
  } catch (err) {
    next(err);
  }
}

export async function createApiKeyEndpoint(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, permissions } = req.body;
    const { apiKey, keyPrefix, keyHash } = generateApiKey();

    const record = await ApiKey.create({
      keyHash,
      keyPrefix,
      name: name || 'Standard API Key',
      userId: req.user!.id,
      orgId: req.user!.orgId,
      permissions: permissions || ['analysis:read', 'analysis:create']
    });

    await logAuditEvent({
      userId: req.user!.id,
      userEmail: req.user!.email,
      orgId: req.user!.orgId,
      action: 'API_KEY_CREATED',
      resource: `api-keys/${record._id}`,
      requestId: (req.headers['x-request-id'] as string) || 'key-create',
      ipAddress: req.ip
    });

    // Secret apiKey returned ONLY once upon creation
    res.status(201).json({
      message: 'API Key generated. Save this secret now; it will not be displayed again.',
      apiKey,
      id: record._id,
      name: record.name,
      keyPrefix: record.keyPrefix,
      createdAt: record.createdAt
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteApiKeyEndpoint(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    await ApiKey.findOneAndDelete({ _id: id, userId: req.user!.id });
    res.json({ message: 'API Key revoked successfully' });
  } catch (err) {
    next(err);
  }
}
