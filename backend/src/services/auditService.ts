import { AuditLog } from '../models/AuditLog';

export interface LogAuditParams {
  userId: string;
  userEmail: string;
  orgId?: string;
  action:
    | 'LOGIN'
    | 'LOGOUT'
    | 'FILE_UPLOAD'
    | 'ANALYSIS_CREATED'
    | 'ANALYSIS_STARTED'
    | 'ANALYSIS_COMPLETED'
    | 'ANALYSIS_FAILED'
    | 'REPORT_GENERATED'
    | 'FILE_DELETED'
    | 'USER_CREATED'
    | 'ROLE_CHANGED'
    | 'API_KEY_CREATED';
  resource: string;
  requestId: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
}

export async function logAuditEvent(params: LogAuditParams): Promise<void> {
  try {
    await AuditLog.create({
      timestamp: new Date(),
      userId: params.userId,
      userEmail: params.userEmail,
      organizationId: params.orgId,
      action: params.action,
      resource: params.resource,
      requestId: params.requestId,
      ipAddress: params.ipAddress,
      metadata: params.metadata
    });
  } catch (err) {
    // Audit logging failure should not crash the core user journey, but log to stderr
    console.error('[AuditLog] Failed to persist audit record:', err);
  }
}
