from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class TextAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=10, description="The raw text content to analyze")
    title: Optional[str] = "Untitled Text"
    metadata: Optional[Dict[str, Any]] = None

class DocumentAnalysisRequest(BaseModel):
    document_base64: Optional[str] = None
    file_type: str = Field("pdf", description="pdf, docx, or txt")
    file_name: str = "document"
    raw_text: Optional[str] = None

class SentenceAnalysisSchema(BaseModel):
    id: str
    sentenceIndex: int
    text: str
    score: float
    category: str # "AI-like signal" | "Human-like signal" | "Uncertain"
    confidence: str # "Low" | "Medium" | "High"
    evidence: List[str]
    modelContribution: Dict[str, Any]

class EvidenceItemSchema(BaseModel):
    id: str
    title: str
    description: str
    severity: str # "low" | "medium" | "high" | "critical"
    contribution: float
    source: str
    model: str

class WritingFingerprintSchema(BaseModel):
    avgSentenceLength: float
    sentenceLengthVariation: float
    vocabularyDiversity: float
    repetitionScore: float
    syntacticComplexity: float
    styleConsistency: float
    punctuationDensity: float
    readabilityScore: float

class ProvenanceRecordSchema(BaseModel):
    sourceOrigin: str
    creationTimestamp: Optional[str] = None
    modificationTimestamp: Optional[str] = None
    softwareAgent: Optional[str] = None
    contentCredentialsPresent: bool = False
    metadataEntries: Dict[str, Any] = Field(default_factory=dict)
    integrityVerified: bool = True
    notes: str = ""

class FileIntegrityRecordSchema(BaseModel):
    sha256Hash: str
    fileSizeBytes: int
    mimeType: str
    timestamp: str
    verifiedMatch: bool = True

class CompositeScoreSchema(BaseModel):
    overallRiskLevel: str # "Low" | "Moderate" | "Elevated" | "High"
    aiGenerationSignal: float
    manipulationSignal: float
    similaritySignal: float
    provenanceSignal: float
    integritySignal: float
    methodologyNotes: str

class ModelMetadataSchema(BaseModel):
    modelName: str
    modelVersion: str
    pipelineVersion: str
    provider: str
    isDemoAnalysis: bool
    executionTimeMs: float

class AnalysisResponse(BaseModel):
    id: str
    title: str
    modality: str
    status: str
    createdAt: str
    completedAt: Optional[str] = None

    aiLikelihood: float
    humanLikelihood: float
    uncertainLikelihood: float
    detectionConfidence: str

    compositeScore: CompositeScoreSchema
    evidenceSignals: List[EvidenceItemSchema]
    sentences: Optional[List[SentenceAnalysisSchema]] = None
    writingFingerprint: Optional[WritingFingerprintSchema] = None
    provenance: ProvenanceRecordSchema
    integrity: FileIntegrityRecordSchema
    modelInfo: ModelMetadataSchema

    textDetails: Optional[Dict[str, Any]] = None
    imageDetails: Optional[Dict[str, Any]] = None
    audioDetails: Optional[Dict[str, Any]] = None
    videoDetails: Optional[Dict[str, Any]] = None

    limitationsDisclaimer: str
    manualReviewGuidance: str
