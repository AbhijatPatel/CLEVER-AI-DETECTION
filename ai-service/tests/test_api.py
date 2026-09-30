import sys
import os

# Add ai-service root to Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "providerMode" in data

def test_readiness_check():
    response = client.get("/ready")
    assert response.status_code == 200
    data = response.json()
    assert data["ready"] is True

def test_list_models():
    response = client.get("/api/v1/models")
    assert response.status_code == 200
    data = response.json()
    assert "models" in data
    assert len(data["models"]) >= 1

def test_analyze_text():
    sample_text = (
        "Furthermore, it is important to note that artificial intelligence has become a tapestry of innovation. "
        "In conclusion, delving into these complex systems requires a comprehensive understanding of algorithms. "
        "Moreover, the implications of this technology are multifaceted and of paramount importance."
    )
    response = client.post("/api/v1/analyze/text", json={"text": sample_text, "title": "Test AI Sample"})
    assert response.status_code == 200
    data = response.json()
    
    # Probabilistic likelihood checks
    assert "aiLikelihood" in data
    assert "humanLikelihood" in data
    assert "uncertainLikelihood" in data
    total_likelihood = data["aiLikelihood"] + data["humanLikelihood"] + data["uncertainLikelihood"]
    assert abs(total_likelihood - 100.0) < 1.0 # Sums to ~100%
    
    # Forensic structures
    assert "compositeScore" in data
    assert "evidenceSignals" in data
    assert len(data["evidenceSignals"]) >= 1
    assert "sentences" in data
    assert len(data["sentences"]) >= 1
    assert "writingFingerprint" in data
    assert "provenance" in data
    assert "integrity" in data
    assert "limitationsDisclaimer" in data
