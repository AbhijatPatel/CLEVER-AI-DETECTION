import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalysis extends Document {
  userId: mongoose.Types.ObjectId;
  orgId?: mongoose.Types.ObjectId;
  title: string;
  modality: 'text' | 'document' | 'image' | 'audio' | 'video';
  status: 'QUEUED' | 'PROCESSING' | 'ANALYZING' | 'GENERATING_REPORT' | 'COMPLETED' | 'FAILED';
  errorMessage?: string;

  aiLikelihood: number;
  humanLikelihood: number;
  uncertainLikelihood: number;
  detectionConfidence: 'Low' | 'Medium' | 'High';

  compositeScore: {
    overallRiskLevel: 'Low' | 'Moderate' | 'Elevated' | 'High';
    aiGenerationSignal: number;
    manipulationSignal: number;
    similaritySignal: number;
    provenanceSignal: number;
    integritySignal: number;
    methodologyNotes: string;
  };

  evidenceSignals: Array<{
    id: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    contribution: number;
    source: string;
    model: string;
  }>;

  sentences?: Array<{
    id: string;
    sentenceIndex: number;
    text: string;
    score: number;
    category: string;
    confidence: string;
    evidence: string[];
    modelContribution: {
      modelName: string;
      weight: number;
      signal: string;
    };
  }>;

  writingFingerprint?: {
    avgSentenceLength: number;
    sentenceLengthVariation: number;
    vocabularyDiversity: number;
    repetitionScore: number;
    syntacticComplexity: number;
    styleConsistency: number;
    punctuationDensity: number;
    readabilityScore: number;
  };

  provenance: {
    sourceOrigin: string;
    creationTimestamp?: string;
    modificationTimestamp?: string;
    softwareAgent?: string;
    contentCredentialsPresent: boolean;
    metadataEntries: Record<string, any>;
    integrityVerified: boolean;
    notes: string;
  };

  integrity: {
    sha256Hash: string;
    fileSizeBytes: number;
    mimeType: string;
    timestamp: string;
    verifiedMatch: boolean;
  };

  modelInfo: {
    modelName: string;
    modelVersion: string;
    pipelineVersion: string;
    provider: string;
    isDemoAnalysis: boolean;
    executionTimeMs: number;
  };

  textDetails?: Record<string, any>;
  imageDetails?: Record<string, any>;
  audioDetails?: Record<string, any>;
  videoDetails?: Record<string, any>;

  rawContent?: string;
  fileUrl?: string;
  limitationsDisclaimer: string;
  manualReviewGuidance: string;
  createdAt: Date;
  completedAt?: Date;
}

const AnalysisSchema = new Schema<IAnalysis>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    orgId: { type: Schema.Types.ObjectId, ref: 'Organization', index: true },
    title: { type: String, required: true },
    modality: { type: String, enum: ['text', 'document', 'image', 'audio', 'video'], required: true, index: true },
    status: {
      type: String,
      enum: ['QUEUED', 'PROCESSING', 'ANALYZING', 'GENERATING_REPORT', 'COMPLETED', 'FAILED'],
      default: 'QUEUED',
      index: true
    },
    errorMessage: { type: String },

    aiLikelihood: { type: Number, default: 0 },
    humanLikelihood: { type: Number, default: 0 },
    uncertainLikelihood: { type: Number, default: 0 },
    detectionConfidence: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },

    compositeScore: {
      overallRiskLevel: { type: String, enum: ['Low', 'Moderate', 'Elevated', 'High'], default: 'Moderate' },
      aiGenerationSignal: { type: Number, default: 0 },
      manipulationSignal: { type: Number, default: 0 },
      similaritySignal: { type: Number, default: 0 },
      provenanceSignal: { type: Number, default: 0 },
      integritySignal: { type: Number, default: 100 },
      methodologyNotes: { type: String, default: '' }
    },

    evidenceSignals: [
      {
        id: String,
        title: String,
        description: String,
        severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
        contribution: Number,
        source: String,
        model: String
      }
    ],

    sentences: [
      {
        id: String,
        sentenceIndex: Number,
        text: String,
        score: Number,
        category: String,
        confidence: String,
        evidence: [String],
        modelContribution: {
          modelName: String,
          weight: Number,
          signal: String
        }
      }
    ],

    writingFingerprint: {
      avgSentenceLength: Number,
      sentenceLengthVariation: Number,
      vocabularyDiversity: Number,
      repetitionScore: Number,
      syntacticComplexity: Number,
      styleConsistency: Number,
      punctuationDensity: Number,
      readabilityScore: Number
    },

    provenance: {
      sourceOrigin: { type: String, default: 'Direct Input' },
      creationTimestamp: String,
      modificationTimestamp: String,
      softwareAgent: String,
      contentCredentialsPresent: { type: Boolean, default: false },
      metadataEntries: { type: Schema.Types.Mixed, default: {} },
      integrityVerified: { type: Boolean, default: true },
      notes: { type: String, default: '' }
    },

    integrity: {
      sha256Hash: { type: String, index: true },
      fileSizeBytes: { type: Number, default: 0 },
      mimeType: { type: String, default: 'text/plain' },
      timestamp: String,
      verifiedMatch: { type: Boolean, default: true }
    },

    modelInfo: {
      modelName: { type: String, default: 'clever-ensemble' },
      modelVersion: { type: String, default: '1.0.0' },
      pipelineVersion: { type: String, default: '2.0.0' },
      provider: { type: String, default: 'heuristic' },
      isDemoAnalysis: { type: Boolean, default: false },
      executionTimeMs: { type: Number, default: 0 }
    },

    textDetails: { type: Schema.Types.Mixed },
    imageDetails: { type: Schema.Types.Mixed },
    audioDetails: { type: Schema.Types.Mixed },
    videoDetails: { type: Schema.Types.Mixed },

    rawContent: { type: String },
    fileUrl: { type: String },
    limitationsDisclaimer: { type: String, default: 'AI-content analysis is probabilistic and should be reviewed in context.' },
    manualReviewGuidance: { type: String, default: 'Check empirical evidence signals and source origin.' },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

export const Analysis = mongoose.model<IAnalysis>('Analysis', AnalysisSchema);
