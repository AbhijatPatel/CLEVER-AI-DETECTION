# Clever AI Architecture Specification

## 1. System Overview

**Clever AI** is a multi-modal digital forensics and AI content intelligence platform designed to assist human investigators in verifying the authenticity of digital artifacts. It replaces black-box "AI percentage detectors" with transparent, calibrated, multi-signal evidence dossiers.

```
                     ┌───────────────┐
                     │     USER      │
                     └───────┬───────┘
                             │
                             ▼
                     ┌───────────────┐
                     │    VERCEL     │
                     │ Next.js/React │
                     │   FRONTEND    │
                     └───────┬───────┘
                             │ HTTPS / REST
                             ▼
                     ┌───────────────┐
                     │    RENDER     │
                     │ Node/Express  │
                     │   API SERVER  │
                     └───────┬───────┘
                             │
             ┌───────────────┼────────────────┐
             │               │                │
             ▼               ▼                ▼
      MongoDB Atlas        Redis         AI Service
      (Data of Record)    (BullMQ)    (Python / FastAPI)
                                              │
                                              ▼
                                       Forensics Engines:
                                       ├── NLP & Stylometrics
                                       ├── Computer Vision & ELA
                                       └── Audio / Video Temporal
                                              │
                                              ▼
                                       Calibrated Ensemble
                                              │
                                              ▼
                                         Result Save
```

---

## 2. Core Principles & Non-Absolutist Tenets

1. **Probabilistic Nature**: AI detection is inherently probabilistic. The system never claims 100% certainty. Terminology uses *AI likelihood*, *Human-like likelihood*, *Detection confidence*, and *Evidence signals*.
2. **Explainability First**: Every score provides verifiable evidence:
   - Stylometric sentence-level burstiness and cadence
   - Type-Token Ratio (vocabulary diversity)
   - Error Level Analysis (ELA) for image compression anomalies
   - EXIF camera hardware tags vs synthetic diffusion dimension matrices
   - Acoustic vocoder cutoffs and phoneme-to-viseme lip sync
3. **Reproducibility & Auditability**: Every result records immutable model versioning (`modelName`, `modelVersion`, `pipelineVersion`) and calculates cryptographic SHA-256 digests.
4. **Resilient Local & Cloud Topology**: Cloud-native (Vercel + Render + MongoDB Atlas + Redis) with local fallbacks for development.

---

## 3. Modality Forensic Engines

### A. Text & Document Intelligence
- **Tokenization & Sentence Segmentation**: Regex-based boundaries handling formal formatting.
- **Stylometrics**:
  - Sentence length variation ($\sigma$) measuring natural human burstiness vs uniform AI cadence.
  - Vocabulary richness ($TTR = |V| / N$).
  - Redundancy repetition score via bigram entropy.
  - Readability indices (Flesch-Kincaid formula).
- **Synthetic Marker Evaluation**: Detecting high-frequency transitional markers common to LLM instruction tuning.
- **Sentence-Level Classification**: Color-coded categorization into `AI-like signal`, `Human-like signal`, and `Uncertain`.

### B. Image Forensics
- **EXIF Extraction**: Checks for camera hardware capture metadata (Make, Model, Lens, ISO).
- **Error Level Analysis (ELA)**: Re-saves image at 90% quality to detect compression gradient discontinuities across spliced or generated regions.
- **Diffusion Matrix Detection**: Recognizes square dimensions (512x512, 1024x1024) characteristic of diffusion models.

### C. Audio Intelligence
- **Vocoder & Bandwidth Inspection**: Detects high-frequency cutoffs typical of synthetic neural vocoders.
- **Acoustic Naturalness**: Evaluates breath pauses and pitch variation.

### D. Video Forensics
- **Frame Extraction**: Samples keyframes for facial boundary temporal stability.
- **Lip-Sync Temporal Alignment**: Evaluates audio-visual phoneme synchronization.

---

## 4. Multi-Tenant Role-Based Access Control (RBAC)

The platform supports organizational hierarchy:
- **Admin**: Full workspace configuration, billing, member management, API key rotation, audit log access.
- **Manager**: Team coordination, case assignments, organizational reports.
- **Analyst**: Creation of forensic analyses, sentence inspection, report generation.
- **Member**: Read-only inspection of shared organizational cases.

Permissions are strictly validated on the Node/Express backend on every request.
