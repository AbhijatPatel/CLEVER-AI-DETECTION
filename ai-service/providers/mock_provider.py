import time
import hashlib
from typing import Dict, Any, List
from providers.base import BaseModelProvider

class MockModelProvider(BaseModelProvider):
    @property
    def name(self) -> str:
        return "clever-demo-mock-engine"

    @property
    def version(self) -> str:
        return "0.9.0-demo"

    @property
    def is_mock(self) -> bool:
        return True

    async def analyze_text(self, text: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        start = time.time()
        sha256 = hashlib.sha256(text.encode('utf-8')).hexdigest()
        
        # Safe mock response clearly tagged as Demo Analysis
        return {
            "aiLikelihood": 62.4,
            "humanLikelihood": 24.8,
            "uncertainLikelihood": 12.8,
            "detectionConfidence": "Medium",
            "compositeScore": {
                "overallRiskLevel": "Elevated",
                "aiGenerationSignal": 62.4,
                "manipulationSignal": 18.0,
                "similaritySignal": 22.5,
                "provenanceSignal": 10.0,
                "integritySignal": 100.0,
                "methodologyNotes": "DEMO MOCK ENGINE: Synthetic evaluation generated for development testing. Not real model inference."
            },
            "evidenceSignals": [
                {
                    "id": "mock-ev-1",
                    "title": "[DEMO] Simulated Predictability Marker",
                    "description": "Mock provider generated indicative evidence to test frontend explainability rendering.",
                    "severity": "medium",
                    "contribution": 40.0,
                    "source": "linguistic",
                    "model": self.name
                },
                {
                    "id": "mock-ev-2",
                    "title": "[DEMO] Syntactic Uniformity Signal",
                    "description": "Demonstration signal representing cadence uniformity across paragraph structures.",
                    "severity": "low",
                    "contribution": 30.0,
                    "source": "stylometric",
                    "model": self.name
                }
            ],
            "sentences": [
                {
                    "id": "mock-s-1",
                    "sentenceIndex": 0,
                    "text": text[:80] + "..." if len(text) > 80 else text,
                    "score": 0.68,
                    "category": "AI-like signal",
                    "confidence": "Medium",
                    "evidence": ["Sample mock demonstration signal for UI inspection"],
                    "modelContribution": {
                        "modelName": self.name,
                        "weight": 1.0,
                        "signal": "Demonstration mock indicator"
                    }
                }
            ],
            "writingFingerprint": {
                "avgSentenceLength": 18.4,
                "sentenceLengthVariation": 3.8,
                "vocabularyDiversity": 58.2,
                "repetitionScore": 14.5,
                "syntacticComplexity": 64.0,
                "styleConsistency": 82.0,
                "punctuationDensity": 6.2,
                "readabilityScore": 55.4
            },
            "provenance": {
                "sourceOrigin": "Demo Testing Harness",
                "creationTimestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "contentCredentialsPresent": False,
                "metadataEntries": {"mode": "MOCK_PROVIDER", "sample": True},
                "integrityVerified": True,
                "notes": "Mock provider generated records. Do not use for legal or forensic verification."
            },
            "integrity": {
                "sha256Hash": sha256,
                "fileSizeBytes": len(text.encode('utf-8')),
                "mimeType": "text/plain",
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "verifiedMatch": True
            },
            "modelInfo": {
                "modelName": self.name,
                "modelVersion": self.version,
                "pipelineVersion": "demo-1.0",
                "provider": "mock",
                "isDemoAnalysis": True,
                "executionTimeMs": round((time.time() - start) * 1000, 2)
            },
            "textDetails": {
                "totalWords": len(text.split()),
                "totalSentences": 1,
                "readingTimeSeconds": 2,
                "paraphrasingLikelihood": 15.0,
                "syntacticPredictability": 65.0
            },
            "limitationsDisclaimer": "DEMO NOTICE: This is a synthetic mock response generated for local UI and contract verification. No real machine learning inference was performed.",
            "manualReviewGuidance": "Real forensic cases require manual investigation and production model verification."
        }

    async def analyze_image(self, image_bytes: bytes, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        return self._generate_mock_media_response("image", image_bytes)

    async def analyze_audio(self, audio_bytes: bytes, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        return self._generate_mock_media_response("audio", audio_bytes)

    async def analyze_video(self, video_bytes: bytes, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        return self._generate_mock_media_response("video", video_bytes)

    def _generate_mock_media_response(self, modality: str, raw_bytes: bytes) -> Dict[str, Any]:
        sha256 = hashlib.sha256(raw_bytes).hexdigest()
        return {
            "aiLikelihood": 54.0,
            "humanLikelihood": 32.0,
            "uncertainLikelihood": 14.0,
            "detectionConfidence": "Medium",
            "compositeScore": {
                "overallRiskLevel": "Moderate",
                "aiGenerationSignal": 54.0,
                "manipulationSignal": 24.0,
                "similaritySignal": 10.0,
                "provenanceSignal": 15.0,
                "integritySignal": 100.0,
                "methodologyNotes": f"DEMO MOCK ENGINE: Synthetic {modality} assessment for development testing."
            },
            "evidenceSignals": [
                {
                    "id": f"mock-{modality}-1",
                    "title": f"[DEMO] {modality.capitalize()} Forensic Metric Test",
                    "description": "Demonstration signal to verify forensic UI displays and charts.",
                    "severity": "medium",
                    "contribution": 50.0,
                    "source": "metadata",
                    "model": self.name
                }
            ],
            "provenance": {
                "sourceOrigin": f"Uploaded {modality} binary (Demo)",
                "creationTimestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "contentCredentialsPresent": False,
                "metadataEntries": {"demoMode": True},
                "integrityVerified": True,
                "notes": "Demo mock analysis."
            },
            "integrity": {
                "sha256Hash": sha256,
                "fileSizeBytes": len(raw_bytes),
                "mimeType": f"{modality}/sample",
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "verifiedMatch": True
            },
            "modelInfo": {
                "modelName": self.name,
                "modelVersion": self.version,
                "pipelineVersion": "demo-1.0",
                "provider": "mock",
                "isDemoAnalysis": True,
                "executionTimeMs": 15.2
            },
            "limitationsDisclaimer": "DEMO NOTICE: This is a synthetic mock response generated for local UI testing.",
            "manualReviewGuidance": "Requires actual model provider and certified digital forensic examination."
        }
