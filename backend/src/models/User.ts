import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: 'Admin' | 'Manager' | 'Analyst' | 'Member';
  organizationId?: mongoose.Types.ObjectId;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ['Admin', 'Manager', 'Analyst', 'Member'], default: 'Analyst' },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', index: true },
    refreshTokens: [{ type: String }]
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
