import os
import time
import uuid
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from schemas.analysis import TextAnalysisRequest
from providers.base import BaseModelProvider
from providers.mock_provider import MockModelProvider
from providers.nlp_provider import NlpForensicsProvider
from providers.image_provider import ImageForensicsProvider
from providers.media_provider import MediaForensicsProvider
from pipelines.document_parser import extract_document_text

load_dotenv()

app = FastAPI(
    title="Clever AI - Content Intelligence & Digital Forensics Engine",
    description="Explainable multi-modal AI detection and digital forensics service",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, configured to backend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Provider selection
PROVIDER_MODE = os.getenv("MODEL_PROVIDER", "heuristic").lower()

if PROVIDER_MODE == "mock":
    text_provider: BaseModelProvider = MockModelProvider()
    image_provider: BaseModelProvider = MockModelProvider()
    media_provider: BaseModelProvider = MockModelProvider()
else:
    text_provider = NlpForensicsProvider()
    image_provider = ImageForensicsProvider()
    media_provider = MediaForensicsProvider()

@app.middleware("http")
async def add_process_time_and_request_id(request: Request, call_next):
    req_id = request.headers.get("x-request-id", str(uuid.uuid4()))
    request.state.request_id = req_id
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    response.headers["x-request-id"] = req_id
    response.headers["x-process-time-ms"] = str(round(duration * 1000, 2))
    return response

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "clever-ai-engine",
        "timestamp": time.time(),
        "providerMode": PROVIDER_MODE,
        "isDemo": text_provider.is_mock
    }

@app.get("/ready")
async def readiness_check():
    return {
        "ready": True,
        "activeProviders": {
            "text": text_provider.name,
            "image": image_provider.name,
            "media": media_provider.name
        }
    }

@app.get("/api/v1/models")
async def list_models():
    return {
        "providerMode": PROVIDER_MODE,
        "isDemoMode": text_provider.is_mock,
        "models": [
            {"name": text_provider.name, "version": text_provider.version, "modality": "text", "isMock": text_provider.is_mock},
            {"name": image_provider.name, "version": image_provider.version, "modality": "image", "isMock": image_provider.is_mock},
            {"name": media_provider.name, "version": media_provider.version, "modality": "audio/video", "isMock": media_provider.is_mock},
        ]
    }

@app.post("/api/v1/analyze/text")
async def analyze_text_endpoint(payload: TextAnalysisRequest):
    try:
        result = await text_provider.analyze_text(payload.text, payload.metadata)
        analysis_id = str(uuid.uuid4())
        return {
            "id": analysis_id,
            "title": payload.title or "Text Analysis",
            "modality": "text",
            "status": "COMPLETED",
            "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "completedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text analysis failed: {str(e)}")

@app.post("/api/v1/analyze/document")
async def analyze_document_endpoint(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None)
):
    try:
        content = await file.read()
        extracted_text, doc_metadata = extract_document_text(content, file.filename or "document")
        result = await text_provider.analyze_text(extracted_text, doc_metadata)
        
        # Merge document specific metadata into provenance
        result["provenance"]["metadataEntries"].update(doc_metadata)
        result["provenance"]["sourceOrigin"] = f"Document File ({file.filename})"
        result["integrity"]["mimeType"] = file.content_type or "application/octet-stream"
        
        analysis_id = str(uuid.uuid4())
        return {
            "id": analysis_id,
            "title": title or file.filename or "Document Analysis",
            "modality": "document",
            "status": "COMPLETED",
            "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "completedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            **result
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Document analysis failed: {str(e)}")

@app.post("/api/v1/analyze/image")
async def analyze_image_endpoint(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None)
):
    try:
        content = await file.read()
        result = await image_provider.analyze_image(content)
        analysis_id = str(uuid.uuid4())
        return {
            "id": analysis_id,
            "title": title or file.filename or "Image Forensics",
            "modality": "image",
            "status": "COMPLETED",
            "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "completedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            **result
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image forensics failed: {str(e)}")

@app.post("/api/v1/analyze/audio")
async def analyze_audio_endpoint(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None)
):
    try:
        content = await file.read()
        result = await media_provider.analyze_audio(content)
        analysis_id = str(uuid.uuid4())
        return {
            "id": analysis_id,
            "title": title or file.filename or "Audio Analysis",
            "modality": "audio",
            "status": "COMPLETED",
            "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "completedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio analysis failed: {str(e)}")

@app.post("/api/v1/analyze/video")
async def analyze_video_endpoint(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None)
):
    try:
        content = await file.read()
        result = await media_provider.analyze_video(content)
        analysis_id = str(uuid.uuid4())
        return {
            "id": analysis_id,
            "title": title or file.filename or "Video Forensics",
            "modality": "video",
            "status": "COMPLETED",
            "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "completedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Video forensics failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
