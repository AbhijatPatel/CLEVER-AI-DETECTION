import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  analysisId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  orgId?: mongoose.Types.ObjectId;
  reportNumber: string;
  title: string;
  sha256Hash: string;
  summary: string;
  filePath: string;
  createdAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    analysisId: { type: Schema.Types.ObjectId, ref: 'Analysis', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    orgId: { type: Schema.Types.ObjectId, ref: 'Organization', index: true },
    reportNumber: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    sha256Hash: { type: String, required: true },
    summary: { type: String, required: true },
    filePath: { type: String, required: true }
  },
  { timestamps: true }
);

export const Report = mongoose.model<IReport>('Report', ReportSchema);
