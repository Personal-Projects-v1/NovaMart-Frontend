# Render Deployment Guide

## Issue
Render is failing with `next: not found` because your project structure is:
```
Frontend/              ← Git root
└── novamart-frontend/ ← Next.js app is here
    ├── package.json
    ├── next.config.ts
    └── src/
```

Render tries to run `npm run build` from the git root, but the Next.js app is in a subdirectory.

## Solution Options

### Option 1: Configure Root Directory in Render (Recommended)

When setting up the service in Render dashboard:

1. **Root Directory**: Set to `novamart-frontend`
2. **Build Command**: `npm install && npm run build`
3. **Start Command**: `npm start`
4. **Environment Variables**:
   - `NODE_VERSION` = `20.11.0`
   - `NEXT_PUBLIC_API_BASE_URL` = `http://localhost:8080/api/v1` (or your backend URL)

### Option 2: Use render.yaml Blueprint

Create `render.yaml` in the **git root** (`Frontend/render.yaml`):

```yaml
services:
  - type: web
    name: novamart-frontend
    env: node
    region: oregon
    plan: free
    rootDir: novamart-frontend
    buildCommand: npm install && npm run build
    startCommand: npm start
    healthCheckPath: /
    envVars:
      - key: NODE_VERSION
        value: 20.11.0
      - key: NEXT_PUBLIC_API_BASE_URL
        value: http://localhost:8080/api/v1
```

Then in Render:
- New → Blueprint
- Connect your GitHub repo
- Render will auto-detect the `render.yaml`

### Option 3: Restructure Repository (Alternative)

Move everything from `Frontend/novamart-frontend/` to `Frontend/`:

```bash
cd Frontend
mv novamart-frontend/* .
mv novamart-frontend/.* . 2>/dev/null || true
rm -rf novamart-frontend/
git add -A
git commit -m "Flatten directory structure for deployment"
git push
```

Then use normal Render settings without rootDir.

## Step-by-Step: Manual Configuration

### 1. In Render Dashboard

1. Go to https://dashboard.render.com
2. Click **New +** → **Web Service**
3. Connect your GitHub repository: `Personal-Projects-v1/NovaMart-Frontend`
4. Configure:
   - **Name**: `novamart-frontend`
   - **Root Directory**: `novamart-frontend` ⚠️ CRITICAL
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `dev`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 2. Add Environment Variables

In the Render service settings, add:

| Key | Value |
|-----|-------|
| `NODE_VERSION` | `20.11.0` |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8080/api/v1` |

### 3. Deploy

Click **Create Web Service** - Render will deploy automatically.

## Current Status

Your build is failing because:
```
==> Running build command 'npm run build'...
sh: 1: next: not found
```

This means:
1. Render is in the wrong directory (git root)
2. No `node_modules` exists (npm install didn't run)
3. Can't find the `next` command

**Fix**: Set `rootDir: novamart-frontend` in Render settings.

## Vercel vs Render

| Platform | Status | Notes |
|----------|--------|-------|
| **Vercel** | ✅ Should work | Auto-detects Next.js in subdirectories |
| **Render** | ❌ Needs config | Must specify `rootDir: novamart-frontend` |

## Recommendation

**Use Vercel** - It's designed for Next.js and handles subdirectories automatically:
1. Go to https://vercel.com
2. Import from GitHub
3. Select `Personal-Projects-v1/NovaMart-Frontend`
4. Vercel auto-detects `novamart-frontend/` subdirectory
5. Click Deploy

If you must use Render, set the `rootDir` setting.

## Testing Deployment Locally

Before deploying, verify the build works:

```bash
cd Frontend/novamart-frontend
npm install
npm run build
npm start
```

If this works, deployment will work too (with proper configuration).

## Common Errors

### Error: `next: not found`
**Cause**: Wrong directory or missing dependencies
**Fix**: Set `rootDir: novamart-frontend` in Render

### Error: `Module not found`
**Cause**: Missing dependencies
**Fix**: Ensure `npm install` runs before `npm run build`

### Error: Build timeout
**Cause**: Large dependencies, slow network
**Fix**: Use Vercel (faster build servers) or upgrade Render plan

## Environment Variables

For production backend connection:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-backend.onrender.com/api/v1
```

Replace with your actual backend URL once deployed.

## Quick Fix for Render

**Right now, in Render dashboard:**

1. Go to your service settings
2. Find **Root Directory**
3. Set it to: `novamart-frontend`
4. Save changes
5. Click **Manual Deploy** → **Deploy latest commit**

This should fix the `next: not found` error immediately.
