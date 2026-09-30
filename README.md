<div align="center">

# 🛡️ CLEVER AI
### AI Content Intelligence & Digital Forensics Platform
**"Understand the authenticity of digital content."**

[![CI/CD Pipeline](https://github.com/clever-ai/clever-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/clever-ai/clever-ai/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688.svg)](https://fastapi.tiangolo.com)
[![Node.js](https://img.shields.io/badge/Node.js-Express%20TS-green.svg)](https://nodejs.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg)](https://docker.com)

</div>

---

## 📌 1. Product Vision

**Clever AI** is a serious, production-grade, multi-modal content intelligence and digital forensics SaaS platform. Rather than making black-box, definitive claims of "100% AI generation," Clever AI empowers investigators, educators, legal analysts, and enterprise security teams with **transparent, explainable evidence signals**.

### Core Modalities
1. **Text Intelligence**: Stylometrics, Type-Token Ratio (TTR), sentence length variation (burstiness), n-gram repetition, and transitional marker density.
2. **Document Forensics**: PDF and DOCX structural extraction, page-level mapping, and author/creator metadata verification.
3. **Image Forensics**: Camera EXIF hardware tags, Error Level Analysis (ELA) compression gradient inspection, and diffusion model dimension checks.
4. **Audio Forensics**: Synthetic voice indicators, neural vocoder frequency cutoffs, and acoustic modulation cadence.
5. **Video & Deepfake Analysis**: Frame-by-frame temporal consistency, facial boundary warping, and audio-visual lip sync coherence.

---

## 🏗️ 2. High-Level Architecture

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
                     │   API GATEWAY │
                     └───────┬───────┘
                             │
             ┌───────────────┼────────────────┐
             │               │                │
             ▼               ▼                ▼
      MongoDB Atlas        Redis         FastAPI Engine
      (Source of Record)  (BullMQ)       (Python / ML)
                                              │
                                              ▼
                                         Ensemble &
                                         Calibration
```

---

## 💻 3. Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend API**: Node.js, Express.js, TypeScript, Mongoose, JWT (access + refresh), bcrypt, Zod, OpenAPI/Swagger.
- **AI Engine**: Python 3.11, FastAPI, Uvicorn, Pillow, PyPDF, python-docx, Scikit-learn, NumPy.
- **Worker & Queue**: BullMQ, Redis, standalone worker service.
- **Database**: MongoDB Atlas.
- **Reporting**: PDFKit (Certified 13-section digital forensics audit reports).
- **Deployment**: Vercel (Frontend), Render (API, Engine, Worker), Docker Compose (Local Dev).

---

## 🚀 4. Quick Start & Local Development

### Prerequisites
- Node.js >= 20.x
- Python >= 3.11
- Docker Desktop (Optional for containerized run)

### Running with Docker Compose
```bash
# Clone the repository
git clone https://github.com/YOUR_ORG/clever-ai.git
cd clever-ai

# Start all 6 services (Frontend, Backend, AI Engine, Worker, MongoDB, Redis)
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API & Swagger: `http://localhost:5000/docs`
- AI Engine: `http://localhost:8000/docs`

### Running Locally without Docker

#### 1. Start AI Engine (FastAPI)
```bash
cd ai-service
pip install -r requirements.txt
python main.py
# Runs on http://localhost:8000
```

#### 2. Start Backend API
```bash
cd backend
npm install
npm run build
npm start
# Runs on http://localhost:5000
```

#### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
# Accessible at http://localhost:3000
```

---

## 🧪 5. Testing & Quality Verification

### Run AI Engine Tests
```bash
python -m pytest ai-service/tests/
```
Output:
```text
ai-service\tests\test_api.py .... [100%]
4 passed in 0.92s
```

### Run Backend Integration Tests
```bash
cd backend
npm test -- --runInBand --forceExit
```
Output:
```text
PASS tests/api.test.ts
  Clever AI Backend API Health & Security Tests
    √ GET /api/v1/health should return healthy status
    √ GET /api/v1/ready should return ready status
    √ Protected route /api/v1/auth/me should reject unauthenticated requests with 401
    √ POST /api/v1/auth/register should validate invalid email format
```

### Verify Frontend Production Build
```bash
cd frontend
npm run build
```
Output:
```text
✓ Compiled successfully
✓ Generating static pages (17/17)
```

---

## 📊 6. Model Evaluation & Explainability

Clever AI adheres strictly to truth in machine learning:
- **Never Fabricates Metrics**: When real ML models are in training or development, a labeled `MockModelProvider` is used, tagged with `isDemoAnalysis: true`.
- **Probabilistic Evidence**: AI-generation signals and human-like signals are reported as likelihood distributions summing to ~100%, with explicit confidence levels (*Low*, *Medium*, *High*).
- **Sentence-Level Highlighting**: Every sentence provides click-to-inspect evidence details, including vocabulary density and transitional phrasing.

---

## 📋 7. Certified Forensic PDF Reports

Every completed analysis job can be exported as a certified 13-section forensic PDF report:
1. Executive Forensic Summary
2. File Information
3. Analysis Configuration
4. Detection Likelihood Distribution
5. Sentence-Level Breakdown
6. Stylometric Writing Fingerprint
7. Provenance & Metadata Details
8. Cryptographic SHA-256 Digest
9. Key Forensic Evidence Signals
10. Model Information & Versioning
11. Mandatory Forensic Limitations Statement
12. Investigator Manual Review Guidance
13. Immutable Chain of Custody Footer

---

## 🔒 8. Security & Privacy Principles

- **Zero Content Training**: User documents are never ingested into model training datasets.
- **RBAC**: Multi-tenant organizations with Admin, Manager, Analyst, and Member roles enforced server-side.
- **SHA-256 Integrity**: Real-time cryptographic hashing verifies that artifacts have not been tampered with.
- **Audit Trails**: Every login, upload, analysis creation, and report export is immutably logged with request IDs.

---

## 📄 9. Mandatory Forensic Disclaimer

> **AI-content analysis is probabilistic and can produce false positives and false negatives. Results should be interpreted as evidence signals and reviewed in context rather than treated as definitive proof of authorship, manipulation, or AI generation.**

---

## 🗺️ 10. Roadmap

- [x] Phase 1 - Architecture, Foundation & Docker
- [x] Phase 2 - JWT & RBAC Authentication
- [x] Phase 3 - Forensics Operations Dashboard
- [x] Phase 4 - Text Intelligence & Stylometry Engine
- [x] Phase 5 - 13-Section Forensic PDF Report Generator
- [x] Phase 6 - Document Forensics (PDF & DOCX)
- [x] Phase 7 - Image Forensics (EXIF & Error Level Analysis)
- [x] Phase 8 - Audio & Video Forensics Pipelines
- [x] Phase 9 - Developer API & OpenAPI/Swagger Docs
- [x] Phase 10 - Enterprise Team & Immutable Audit Logs
- [ ] C2PA Content Credentials Signing Integration
- [ ] Hardware-Accelerated Video Frame OCR
