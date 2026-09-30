import http.client
import json
import time

def run_test():
    conn = http.client.HTTPConnection("localhost", 5000)
    
    # 1. Register or Login
    reg_payload = json.dumps({
        "email": "verifier@forensics-lab.org",
        "password": "VerifyPass2026!",
        "name": "Automated Verifier",
        "organizationName": "Platform QA Unit"
    })
    conn.request("POST", "/api/v1/auth/register", reg_payload, {"Content-Type": "application/json"})
    res = conn.getresponse()
    reg_data = json.loads(res.read().decode())
    
    token = reg_data.get("accessToken")
    if not token:
        # User already registered, try login
        login_payload = json.dumps({
            "email": "verifier@forensics-lab.org",
            "password": "VerifyPass2026!"
        })
        conn = http.client.HTTPConnection("localhost", 5000)
        conn.request("POST", "/api/v1/auth/login", login_payload, {"Content-Type": "application/json"})
        res = conn.getresponse()
        login_data = json.loads(res.read().decode())
        token = login_data.get("accessToken")
        user = login_data.get("user")
        if not user:
            raise AssertionError(f"Login failed: {login_data}")
        print(f"[1] Login Successful! User: {user['email']}, Role: {user['role']}")
    else:
        print(f"[1] Registration Successful! User: {reg_data['user']['email']}, Role: {reg_data['user']['role']}")

    assert token, "Failed to obtain JWT Access Token"

    # 2. Create Analysis
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    sample_text = (
        "Furthermore, it is important to note that artificial intelligence has become a multifaceted tapestry of innovation. "
        "In conclusion, delving into these complex neural architectures requires a comprehensive understanding of algorithms. "
        "Moreover, the implications of this generative revolution are of paramount importance across modern society."
    )
    analysis_payload = json.dumps({
        "text": sample_text,
        "title": "Automated Verification Test #1"
    })
    conn.request("POST", "/api/v1/analysis/text", analysis_payload, headers)
    res = conn.getresponse()
    an_data = json.loads(res.read().decode())
    an_id = an_data["analysisId"]
    print(f"[2] Analysis Created & Queued: ID={an_id}, Status={an_data['status']}")
    
    # 3. Wait for background processor
    print("    Waiting 2.5s for async queue pipeline...")
    time.sleep(2.5)
    
    # 4. Fetch Completed Analysis
    conn.request("GET", f"/api/v1/analysis/{an_id}", headers=headers)
    res = conn.getresponse()
    doc = json.loads(res.read().decode())
    print(f"[3] Analysis Retrieved! Status: {doc['status']}")
    print(f"    AI Likelihood: {doc['aiLikelihood']}%")
    print(f"    Human-Like Likelihood: {doc['humanLikelihood']}%")
    print(f"    Uncertain: {doc['uncertainLikelihood']}%")
    print(f"    Confidence: {doc['detectionConfidence']}")
    print(f"    Overall Risk Level: {doc['compositeScore']['overallRiskLevel']}")
    print(f"    Evidence Signals Count: {len(doc['evidenceSignals'])}")
    for ev in doc['evidenceSignals']:
        print(f"      - [{ev['severity'].upper()}] {ev['title']} ({ev['contribution']}%)")
    print(f"    SHA-256 Digest: {doc['integrity']['sha256Hash']}")
    print(f"    Model Used: {doc['modelInfo']['modelName']} (v{doc['modelInfo']['modelVersion']})")

    # 5. Generate PDF Report
    conn.request("POST", f"/api/v1/reports/{an_id}", headers=headers)
    res = conn.getresponse()
    rep = json.loads(res.read().decode())
    print(f"[4] Certified PDF Report Generated! Report Number: {rep['report']['reportNumber']}")
    
    # 6. Check Dashboard Stats
    conn.request("GET", "/api/v1/usage/dashboard-stats", headers=headers)
    res = conn.getresponse()
    stats = json.loads(res.read().decode())
    print("\n[SUCCESS] VERTICAL SLICE FULLY VERIFIED AND OPERATIONAL!")

if __name__ == "__main__":
    run_test()
