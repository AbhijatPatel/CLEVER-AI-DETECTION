<div align="center">

<img src="./frontend/public/logo.jpg" alt="CLEVER AI Logo" width="180" style="border-radius: 24px; box-shadow: 0 10px 30px rgba(6, 182, 212, 0.3);" />

# 🛡️ CLEVER AI
### AI Content Intelligence & Digital Forensics Platform
**"Understand the authenticity of digital content."**

[![Live Frontend (Vercel)](https://img.shields.io/badge/Vercel-Live%20App-black?style=for-the-badge&logo=vercel)](https://frontend-kohl-five-69.vercel.app)
[![Live API (Render)](https://img.shields.io/badge/Render-API%20Gateway-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://clever-ai-api.onrender.com/api/v1/health)
[![AI Engine (FastAPI)](https://img.shields.io/badge/FastAPI-Forensics%20Engine-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://clever-ai-engine.onrender.com/health)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/AbhijatPatel/CLEVER-AI-DETECTION)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

<br/>

[**🌐 Live Application**](https://frontend-kohl-five-69.vercel.app) • [**⚡ Try Live Demo**](https://frontend-kohl-five-69.vercel.app/demo) • [**📖 API Documentation**](https://clever-ai-api.onrender.com/api-docs) • [**🐛 Report Bug**](https://github.com/AbhijatPatel/CLEVER-AI-DETECTION/issues)

</div>

---

## 📌 Executive Summary

**Clever AI** is an enterprise-grade multi-modal content intelligence and digital forensics SaaS platform. Rather than acting as a black-box percentage counter that claims "100% mathematical certainty", Clever AI functions as a **forensic evidence workbench** that extracts explainable signals across text, documents, images, audio, and video to augment human investigators, academic integrity bodies, legal analysts, and enterprise trust & safety teams.

---

## 🌐 Live Production Deployments

| Component | Platform | Endpoint / URL | Operational Status |
| :--- | :--- | :--- | :--- |
| **Frontend Web App** | **Vercel** | [https://frontend-kohl-five-69.vercel.app](https://frontend-kohl-five-69.vercel.app) | 🟢 **Live (HTTP 200)** |
| **Interactive Demo** | **Vercel** | [https://frontend-kohl-five-69.vercel.app/demo](https://frontend-kohl-five-69.vercel.app/demo) | 🟢 **Live (No auth needed)** |
| **API Gateway** | **Render** | [https://clever-ai-api.onrender.com/api/v1/health](https://clever-ai-api.onrender.com/api/v1/health) | 🟢 **Live (Express TS)** |
| **Forensics Engine** | **Render** | [https://clever-ai-engine.onrender.com/health](https://clever-ai-engine.onrender.com/health) | 🟢 **Live (FastAPI Python)** |
| **Swagger UI** | **Render** | [https://clever-ai-api.onrender.com/api-docs](https://clever-ai-api.onrender.com/api-docs) | 🟢 **Live OpenAPI 3.0** |

---

## 🔬 Multi-Modal Forensic Capabilities

```
                                  ┌───────────────────────────┐
                                  │   DIGITAL MEDIA INPUT     │
                                  └─────────────┬─────────────┘
                                                │
         ┌──────────────────┬───────────────────┼───────────────────┬──────────────────┐
         ▼                  ▼                   ▼                   ▼                  ▼
   ┌───────────┐      ┌───────────┐       ┌───────────┐       ┌───────────┐      ┌───────────┐
   │   TEXT    │      │ DOCUMENTS │       │  IMAGES   │       │   AUDIO   │      │   VIDEO   │
   │ Perplexity│      │ Structure │       │  Camera   │       │ Synthetic │      │ Frame-by- │
   │Burstiness │      │ Revision  │       │   EXIF    │       │  Vocoder  │      │   Frame   │
   │ Stylometry│      │ Page Maps │       │    ELA    │       │  Mel-Spec │      │ Deepfake  │
   └───────────┘      └───────────┘       └───────────┘       └───────────┘      └───────────┘
```

### 1. 📝 Text Intelligence & Stylometry
- **Perplexity & Burstiness Gauges**: Analyzes sentence-level token prediction variance and structural cadence.
- **Type-Token Ratio (TTR)**: Vocabulary richness and lexical diversity profiling.
- **Repetitive N-Gram Analysis**: Identifies statistical artifacts and syntactic loops characteristic of LLM generators.
- **Transitional Marker Density**: Detects disproportionate distribution of formal transitional conjunctions.
- **Interactive Sentence Heatmap**: Click-to-inspect sentence triage (Green = Human, Amber = Mixed, Red = AI-dominant).

### 2. 📑 Document Forensics (`.pdf`, `.docx`, `.txt`)
- **Metadata Extraction**: Identifies author software, creator timestamps, and PDF editing history.
- **Page-Level Segmentation**: Granular inspection mapped across pages and multi-column layouts.
- **Revision Artifacts**: Discrepancies between visible text layers and internal object streams.

### 3. 🖼️ Image Forensics & Manipulation
- **Error Level Analysis (ELA)**: Compression rate differential mapping across JPEG/PNG quantization blocks.
- **Camera EXIF Verification**: Cross-references hardware tags, camera serials, lens parameters, and software editing signatures.
- **Resolution & Aspect Ratio Heuristics**: Detects standard diffusion generation dimensions (e.g., Midjourney, DALL-E, Stable Diffusion defaults).

### 4. 🎙️ Synthetic Audio & Speech
- **Neural Vocoder Detection**: Identifies spectral artifacts, cutoffs above 16kHz, and phase mismatches.
- **Acoustic Modulation Analysis**: Measures unnatural micro-pitch stability and lack of human breathing cadence.

### 5. 🎥 Video & Deepfake Analysis
- **Temporal Consistency**: Frame-to-frame boundary jitter and spatial coherence testing.
- **Facial Landmark Warping**: Blending artifacts around facial perimeters, eyes, and teeth.
- **Audio-Visual Lip Sync Discrepancies**: Phoneme-to-viseme timing correlation analysis.

---

## 🏛️ System Architecture

```
                   ┌─────────────────────────────────────────┐
                   │           INVESTIGATOR / CLIENT         │
                   └────────────────────┬────────────────────┘
                                        │
                                        ▼
                   ┌─────────────────────────────────────────┐
                   │          VERCEL (EDGE RUNTIME)          │
                   │   Next.js 14 App Router • Tailwind CSS  │
                   │  Sentence Heatmaps • Real-time Charts   │
                   └────────────────────┬────────────────────┘
                                        │ HTTPS / REST API
                                        ▼
                   ┌─────────────────────────────────────────┐
                   │          RENDER (API GATEWAY)           │
                   │      Node.js 20 • Express • TypeScript  │
                   │   JWT Auth • RBAC • Rate Limiter • Zod   │
                   └──────┬───────────────────┬──────────────┘
                          │                   │
         ┌────────────────┴──────┐            │ Redis Job Queue
         ▼                       ▼            ▼
  ┌──────────────┐       ┌──────────────┐   ┌──────────────────────┐
  │ MongoDB Atlas│       │ AWS S3 / MinIO│   │ RENDER (BULL WORKER) │
  │ Immutable    │       │ Forensic     │   │ Asynchronous File    │
  │ Audit Trail  │       │ Artifacts    │   │ Processing Pipeline  │
  └──────────────┘       └──────────────┘   └──────────┬───────────┘
                                                       │
                                                       ▼
                                            ┌──────────────────────┐
                                            │ RENDER (AI SERVICE)  │
                                            │ Python 3.11• FastAPI │
                                            │ ELA•NLP•Stylometrics │
                                            └──────────────────────┘
```

---

## 💻 Tech Stack Overview

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS, Lucide React, Dynamic CSS Animations |
| **Backend API** | Node.js, Express.js, TypeScript, Mongoose, JWT (HttpOnly Cookies), Zod, Helmet |
| **AI Forensics** | Python 3.11, FastAPI, Uvicorn, Pillow (ELA), Scikit-Learn, NumPy, PyPDF, python-docx |
| **Background Processing** | BullMQ, Redis 7, Standalone Worker Daemon |
| **Data & Storage** | MongoDB Atlas (Multi-Tenant Schemas), AWS S3 / Local Storage Provider |
| **Forensic Export** | PDFKit (13-Section Certified Legal Audit PDF Reports) |
| **DevOps & CI/CD** | Vercel, Render Blueprints, Docker & Docker Compose, GitHub Actions |

---

## ⚡ Quickstart Guide

### Option 1: Docker Compose (All-in-One Local Stack)

```bash
# Clone the repository
git clone https://github.com/AbhijatPatel/CLEVER-AI-DETECTION.git
cd CLEVER-AI-DETECTION

# Launch all 6 services with one command
docker-compose up -d --build
```

- **Frontend Workbench:** `http://localhost:3000`
- **Express API Gateway:** `http://localhost:5000`
- **FastAPI Forensics Engine:** `http://localhost:8000`
- **Swagger Documentation:** `http://localhost:5000/api-docs`

---

### Option 2: Bare-Metal Local Development

#### Prerequisites
- Node.js >= 20.x
- Python >= 3.11
- MongoDB & Redis instances running locally

#### 1. Start Python Forensics Engine
```bash
cd ai-service
pip install -r requirements.txt
python main.py
# Runs on http://localhost:8000
```

#### 2. Start Backend API Gateway
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:5000
```

#### 3. Start Next.js Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

---

## 🧪 Testing & Verification Suite

### Automated Backend Tests (Jest & Supertest)
```bash
cd backend
npm test
```
```text
PASS tests/api.test.ts
  Clever AI Backend API — Health & Security Tests
    √ GET /api/v1/health → returns 200 with healthy status (66 ms)
    √ GET /api/v1/ready → returns 200 with ready flag (15 ms)
    √ GET /api/v1/auth/me (unauthenticated) → returns 401 (17 ms)
    √ POST /api/v1/analysis/text (unauthenticated) → returns 401 (46 ms)
    √ POST /api/v1/auth/register with invalid email → returns 400 (40 ms)
    √ POST /api/v1/auth/login with missing credentials → returns 400 (22 ms)
    √ GET /api/v1/analysis with fake Bearer token → returns 401 (10 ms)

Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
```

### Next.js Production Build Test
```bash
cd frontend
npm run build
```
```text
✓ Compiled successfully
✓ Generating static pages (18/18)
```

---

## 📋 Certified 13-Section Forensic PDF Reports

Every forensic investigation conducted on Clever AI can be exported as a certified, tamper-evident 13-section audit document:

1. **Executive Forensic Summary**: High-level verdict, confidence classification, and probability spread.
2. **File & Artifact Information**: File name, byte size, MIME type, and structural classification.
3. **Cryptographic Integrity Digest**: SHA-256 and MD5 fingerprinting of analyzed artifacts.
4. **Investigation Configuration**: Model version, threshold tolerances, and active inspection engines.
5. **Detection Likelihood Distribution**: Probability breakdown (`Human`, `AI-Generated`, `Hybrid/Transformed`).
6. **Sentence-Level Heatmap Audit**: Granular sentence-by-sentence telemetry table.
7. **Stylometric Profile**: Lexical diversity (TTR), sentence burstiness, and syntactic cadence.
8. **Repetition & Perplexity Index**: Frequency spectrum of repetitive n-grams.
9. **Provenance & Header Metadata**: EXIF, author software, and modification timeline.
10. **Evidence Signal Matrix**: Ranked list of positive and negative anomaly indicators.
11. **Model Governance & Explainability**: Disclosure of algorithms, heuristic weights, and calibration data.
12. **Investigator Guidance Notes**: Recommended next steps and manual review protocols.
13. **Chain of Custody & Legal Disclaimer**: Timestamped examiner sign-off and legal evidentiary disclaimers.

---

## 🔒 Security, Compliance & Ethical AI

- **Zero Content Training Policy**: User text, documents, and media submitted for analysis are **NEVER** used to train AI models.
- **Role-Based Access Control (RBAC)**: Strict permission boundaries for `Admin`, `Manager`, `Analyst`, and `Member`.
- **Cryptographic Reset Tokens**: Secure SHA-256 hashed password reset flow with automated session invalidation.
- **Immutable Audit Logging**: Every login, report export, file upload, and permission change is recorded with request IDs and IP addresses.
- **C2PA Standard Ready**: Architected to ingest and verify Content Authenticity Initiative (C2PA) cryptographic manifests.

---

## ⚖️ Legal & Forensic Disclaimer

> **IMPORTANT FORENSIC NOTICE:** Automated content detection tools provide probabilistic statistical indicators and forensic evidence signals. They are designed to assist human analysts, investigators, and reviewers. Clever AI does not claim 100% mathematical certainty. Analysis outputs should always be evaluated alongside contextual evidence, human editorial review, and proper chain of custody procedures.

---

## 📄 License & Attribution

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for complete terms.

Designed and developed for **Clever AI Technologies**.  
Maintained by [Abhijat Patel](https://github.com/AbhijatPatel).
