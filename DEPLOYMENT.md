# Clever AI Production Deployment Guide

This guide provides end-to-end instructions for deploying the **Clever AI** platform into production using **Vercel** (Frontend) and **Render** (Node/Express API, FastAPI AI Engine, and BullMQ Worker), connected to **MongoDB Atlas** and **Redis Cloud**.

---

## Architecture Topology

```
Frontend (Vercel)
   │  HTTPS
   ▼
Backend Web Service (Render)
   ├── MongoDB Atlas (Primary Database)
   ├── Redis (BullMQ Queue)
   ├── AI Engine Service (Render Private/Web)
   └── Background Worker (Render Worker)
```

---

## Step 1: GitHub Repository Setup

1. Initialize git and commit the codebase:
   ```bash
   git init
   git add .
   git commit -m "feat: complete Clever AI production platform"
   git branch -M main
   git remote add origin https://github.com/YOUR_ORG/clever-ai.git
   git push -u origin main
   ```

---

## Step 2: MongoDB Atlas Setup

1. Create a free/dedicated cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Under **Network Access**, add `0.0.0.0/0` or whitelist your Render egress IP range.
3. Under **Database Access**, create a user `clever_admin` with read/write privileges.
4. Copy the connection string:
   `mongodb+srv://clever_admin:<password>@cluster0.mongodb.net/clever_ai?retryWrites=true&w=majority`

---

## Step 3: Redis Cloud Setup

1. Create a Redis instance on [Upstash](https://upstash.com) or [Redis Cloud](https://redis.io).
2. Copy the connection URL:
   `rediss://default:<password>@<host>:<port>`

---

## Step 4: Render Deployment (Using Blueprint or Manual)

Render automatically recognizes the included `render.yaml` blueprint.

### Option A: Render Blueprint (Recommended)
1. In Render Dashboard, click **New +** -> **Blueprint**.
2. Connect your GitHub repository `clever-ai`.
3. Render reads `render.yaml` and provisions:
   - `clever-ai-api` (Node/Express Web Service)
   - `clever-ai-engine` (FastAPI Python AI Web Service)
   - `clever-ai-worker` (Background Worker Service)
4. Fill in the prompted secret environment variables:
   - `MONGODB_URI`
   - `REDIS_URL`

### Option B: Manual Service Creation

#### 1. FastAPI AI Engine
- **Type**: Web Service
- **Root Directory**: `ai-service`
- **Environment**: Python 3.11+
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Health Check Path**: `/health`
- **Environment Variables**:
  - `MODEL_PROVIDER`: `production` or `heuristic` (or `mock` for demo testing)
  - `LOG_LEVEL`: `info`

#### 2. Express Backend API
- **Type**: Web Service
- **Root Directory**: `backend`
- **Environment**: Node
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Health Check Path**: `/api/v1/health`
- **Environment Variables**:
  - `NODE_ENV`: `production`
  - `PORT`: `10000`
  - `MONGODB_URI`: `<Atlas Connection String>`
  - `REDIS_URL`: `<Redis Connection URL>`
  - `AI_SERVICE_URL`: `<URL of clever-ai-engine>`
  - `FRONTEND_URL`: `https://clever-ai.vercel.app`
  - `JWT_SECRET`: `<Secure Random 64-char String>`
  - `JWT_REFRESH_SECRET`: `<Secure Random 64-char String>`

#### 3. BullMQ Worker Service
- **Type**: Background Worker
- **Root Directory**: `worker`
- **Environment**: Node
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `NODE_ENV`: `production`
  - `MONGODB_URI`: `<Atlas Connection String>`
  - `REDIS_URL`: `<Redis Connection URL>`
  - `AI_SERVICE_URL`: `<URL of clever-ai-engine>`

---

## Step 5: Vercel Frontend Deployment

1. Go to [Vercel Dashboard](https://vercel.com) and click **Add New Project**.
2. Import the `clever-ai` GitHub repository.
3. Configure the Project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
4. In **Environment Variables**, set:
   - `NEXT_PUBLIC_API_URL`: `https://clever-ai-api.onrender.com/api/v1`
5. Click **Deploy**.

---

## Step 6: CORS & Health Verification

1. Test Backend Health:
   ```bash
   curl -I https://clever-ai-api.onrender.com/api/v1/health
   # Expected: HTTP/2 200 {"status":"healthy"}
   ```
2. Test AI Engine Health:
   ```bash
   curl -I https://clever-ai-engine.onrender.com/health
   # Expected: HTTP/2 200 {"status":"healthy"}
   ```
3. Test CORS Preflight from Vercel:
   ```bash
   curl -H "Origin: https://clever-ai.vercel.app" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type,Authorization" \
        -X OPTIONS --verbose \
        https://clever-ai-api.onrender.com/api/v1/analysis/text
   ```

---

## Step 7: Troubleshooting

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **Cold Starts on Render Free Tier** | Free services spin down after 15m of inactivity | Upgrade to Render Starter, or use frontend polling with bounded backoff. |
| **CORS 403 Forbidden** | `FRONTEND_URL` on backend does not match Vercel URL | Update `FRONTEND_URL` in Render backend settings to match exact custom domain. |
| **PDF Report Download 404** | Ephemeral filesystem in container | In production, mount a Render Persistent Disk at `/app/reports` or use S3 storage provider. |
