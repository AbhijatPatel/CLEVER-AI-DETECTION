import mongoose, { Document, Schema } from 'mongoose';

export interface IApiKey extends Document {
  keyHash: string;
  keyPrefix: string;
  name: string;
  userId: mongoose.Types.ObjectId;
  orgId?: mongoose.Types.ObjectId;
  permissions: string[];
  lastUsedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
}

const ApiKeySchema = new Schema<IApiKey>(
  {
    keyHash: { type: String, required: true, unique: true },
    keyPrefix: { type: String, required: true },
    name: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    orgId: { type: Schema.Types.ObjectId, ref: 'Organization', index: true },
    permissions: [{ type: String, default: ['analysis:read', 'analysis:create'] }],
    lastUsedAt: { type: Date },
    expiresAt: { type: Date }
  },
  { timestamps: true }
);

export const ApiKey = mongoose.model<IApiKey>('ApiKey', ApiKeySchema);
