/**
 * CLEVER AI - Shared Domain Types & Contracts
 * Enterprise Digital Forensics & AI Content Intelligence
 */

export type ModalityType = 'text' | 'document' | 'image' | 'audio' | 'video';

export type JobStatus = 'QUEUED' | 'PROCESSING' | 'ANALYZING' | 'GENERATING_REPORT' | 'COMPLETED' | 'FAILED';

export type ConfidenceLevel = 'Low' | 'Medium' | 'High';

export type SentenceCategory = 'AI-like signal' | 'Human-like signal' | 'Uncertain';

export interface SentenceAnalysis {
  id: string;
  sentenceIndex: number;
  text: string;
  score: number; // 0.0 to 1.0 (AI likelihood)
  category: SentenceCategory;
  confidence: ConfidenceLevel;
  evidence: string[];
  modelContribution: {
    modelName: string;
    weight: number;
    signal: string;
  };
}

export interface EvidenceItem {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  contribution: number; // Percentage contribution (0 to 100)
  source: 'linguistic' | 'stylometric' | 'statistical' | 'metadata' | 'visual' | 'spectral' | 'provenance';
  model: string;
}

export interface WritingFingerprint {
  avgSentenceLength: number;
  sentenceLengthVariation: number; // Standard deviation
  vocabularyDiversity: number; // Type-Token Ratio (TTR)
  repetitionScore: number;
  syntacticComplexity: number;
  styleConsistency: number;
  punctuationDensity: number;
  readabilityScore: number; // Flesch-Kincaid equivalent
}

export interface ProvenanceRecord {
  sourceOrigin: string;
  creationTimestamp?: string;
  modificationTimestamp?: string;
  softwareAgent?: string;
  contentCredentialsPresent: boolean;
  metadataEntries: Record<string, string | number | boolean | null>;
  integrityVerified: boolean;
  notes: string;
}

export interface FileIntegrityRecord {
  sha256Hash: string;
  fileSizeBytes: number;
  mimeType: string;
  timestamp: string;
  verifiedMatch: boolean;
}

export interface CompositeAuthenticityScore {
  overallRiskLevel: 'Low' | 'Moderate' | 'Elevated' | 'High';
  aiGenerationSignal: number; // 0-100
  manipulationSignal: number; // 0-100
  similaritySignal: number; // 0-100
  provenanceSignal: number; // 0-100
  integritySignal: number; // 0-100
  methodologyNotes: string;
}

export interface ModelMetadata {
  modelName: string;
  modelVersion: string;
  pipelineVersion: string;
  provider: 'mock' | 'heuristic' | 'production-ensemble';
  isDemoAnalysis: boolean;
  executionTimeMs: number;
}

export interface AnalysisResult {
  id: string;
  userId: string;
  orgId?: string;
  title: string;
  modality: ModalityType;
  status: JobStatus;
  createdAt: string;
  completedAt?: string;

  // Likelihood Distribution (Must sum to ~100%)
  aiLikelihood: number;
  humanLikelihood: number;
  uncertainLikelihood: number;
  detectionConfidence: ConfidenceLevel;

  // Forensic Breakdown
  compositeScore: CompositeAuthenticityScore;
  evidenceSignals: EvidenceItem[];
  sentences?: SentenceAnalysis[];
  writingFingerprint?: WritingFingerprint;
  provenance: ProvenanceRecord;
  integrity: FileIntegrityRecord;
  modelInfo: ModelMetadata;

  // Modality Specific Findings
  textDetails?: {
    totalWords: number;
    totalSentences: number;
    readingTimeSeconds: number;
    paraphrasingLikelihood: number;
    syntacticPredictability: number;
  };
  imageDetails?: {
    dimensions: { width: number; height: number };
    compressionAnomaliesDetected: boolean;
    manipulationHeatmapUrl?: string;
    exifData: Record<string, string>;
  };
  audioDetails?: {
    durationSeconds: number;
    sampleRate: number;
    channels: number;
    syntheticVoiceScore: number;
  };
  videoDetails?: {
    fps: number;
    totalFrames: number;
    analyzedFrames: number;
    temporalAnomalyCount: number;
    suspiciousFrameRanges: Array<{ startFrame: number; endFrame: number; reason: string }>;
  };

  limitationsDisclaimer: string;
  manualReviewGuidance: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Manager' | 'Analyst' | 'Member';
  organizationId?: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  organizationId?: string;
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
  metadata?: Record<string, unknown>;
}
