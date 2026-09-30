# Clever AI Security Policy & Forensic Integrity Controls

Clever AI is engineered for digital evidence preservation, content authenticity, and enterprise compliance. This document outlines the security architecture and defensive controls implemented across all platform tiers.

---

## 1. Authentication & Session Management

- **Dual-Token Architecture**: Short-lived Access Tokens (JWT, 15m expiration) coupled with cryptographically signed Refresh Tokens (7d expiration).
- **Token Rotation**: Every refresh request rotates the active refresh token. Compromised or reused refresh tokens are immediately revoked.
- **Password Protection**: Passwords are salted and hashed using **bcrypt** (cost factor 12). Plaintext passwords are never logged, stored, or transmitted.
- **API Key Security**: Developer API keys are generated using 32 bytes of cryptographically secure pseudo-random entropy (`crypto.randomBytes(32)`). Only the SHA-256 hash is persisted in the database; the raw key is displayed to the user exactly once.

---

## 2. Server-Side Authorization (RBAC)

Authorization is strictly enforced server-side via `authenticateToken` and `requireRole` middleware. The client-side UI only reflects permissions; it is never trusted for access control.

Hierarchy:
1. **Admin**: Full tenant administration, billing, API key generation, member revocation, audit log review.
2. **Manager**: Team coordination, case assignments, organizational reports.
3. **Analyst**: Pipeline execution, sentence-level inspection, PDF report generation.
4. **Member**: Read-only observation of shared organizational dossiers.

---

## 3. Upload & File Security

Uploaded digital artifacts are subject to multi-layered defensive validation:
1. **MIME & Extension Enforcement**: Only permitted MIME types (PDF, DOCX, TXT, PNG, JPG, WEBP, MP3, WAV, M4A, MP4, WEBM, MOV) are accepted.
2. **File Size Enforcement**: Hard upper limit of 50MB per artifact enforced at the streaming gateway level.
3. **Randomized Storage Keys**: User-provided file names are scrubbed to eliminate directory traversal (`../`) attacks. Storage files use randomized UUID/timestamp prefixes.
4. **Non-Executable Storage**: Upload volumes are non-executable and sandboxed from application processes.

---

## 4. Cryptographic Integrity & Chain of Custody

Upon ingestion, every artifact generates a **SHA-256 cryptographic hash**:
```typescript
crypto.createHash('sha256').update(fileBuffer).digest('hex')
```
- The digest is permanently recorded in the analysis record and stamped on certified PDF reports.
- If a subsequent re-inspection reveals hash variance, the system flags a **Tamper Warning**.

---

## 5. Rate Limiting & Denial of Service Protection

- **API Rate Limiting**: Enforced via `express-rate-limit` (100 requests per 15-minute sliding window per IP address on public endpoints).
- **Helmet Security Headers**: Enforces `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security`, and referer policies.

---

## 6. Immutable Audit Logging

Every critical security event is recorded in the `audit_logs` collection:
- `LOGIN` & `LOGOUT`
- `FILE_UPLOAD`
- `ANALYSIS_CREATED` & `ANALYSIS_COMPLETED`
- `REPORT_GENERATED`
- `FILE_DELETED`
- `USER_CREATED` & `ROLE_CHANGED`
- `API_KEY_CREATED`

Records include timestamp, user ID, user email, organization ID, action, target resource, client IP, and request correlation IDs (`x-request-id`).

---

## 7. Zero Model Training Policy

- **No Training on User Data**: User submissions are processed strictly for real-time feature extraction. User content is never aggregated into training datasets for third-party or internal LLMs.
- **Data Purging**: Users and organizations can configure retention schedules (30, 90, 365 days, or immediate purge) from the Settings dashboard.

---

## 8. Responsible Vulnerability Disclosure

If you discover a security vulnerability within Clever AI, please report it to:
**security@clever.ai**

Please include:
- Description of the vulnerability
- Reproduction steps or proof of concept
- Potential impact assessment

We commit to validating submissions within 48 hours and will not pursue legal action against security researchers acting in good faith.
