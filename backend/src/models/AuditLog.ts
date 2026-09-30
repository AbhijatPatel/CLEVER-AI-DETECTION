import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  timestamp: Date;
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  organizationId?: mongoose.Types.ObjectId;
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

const AuditLogSchema = new Schema<IAuditLog>(
  {
    timestamp: { type: Date, default: Date.now, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userEmail: { type: String, required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', index: true },
    action: {
      type: String,
      enum: [
        'LOGIN', 'LOGOUT', 'FILE_UPLOAD', 'ANALYSIS_CREATED',
        'ANALYSIS_STARTED', 'ANALYSIS_COMPLETED', 'ANALYSIS_FAILED',
        'REPORT_GENERATED', 'FILE_DELETED', 'USER_CREATED',
        'ROLE_CHANGED', 'API_KEY_CREATED'
      ],
      required: true,
      index: true
    },
    resource: { type: String, required: true },
    requestId: { type: String, required: true },
    ipAddress: { type: String },
    metadata: { type: Schema.Types.Mixed }
  },
  { timestamps: false }
);

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
