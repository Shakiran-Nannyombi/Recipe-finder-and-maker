# FlavorForge AI - Complete Setup Guide

This guide will walk you through setting up FlavorForge AI from scratch, including all required services and API keys.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Service Setup](#service-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have:

- **Python 3.12+** installed ([Download](https://www.python.org/downloads/))
- **Node.js 18+** and npm installed ([Download](https://nodejs.org/))
- **Git** installed ([Download](https://git-scm.com/downloads))
- A code editor (VS Code recommended)
- Terminal/Command Prompt access

## Service Setup

### Step 1: Supabase (Database & Storage)

1. **Create Account**
   - Go to https://supabase.com
   - Click "Start your project"
   - Sign up with GitHub or email

2. **Create New Project**
   - Click "New Project"
   - Choose organization (or create one)
   - Enter project details:
     - Name: `flavorforge-ai`
     - Database Password: (save this securely)
     - Region: Choose closest to you
   - Click "Create new project"
   - Wait 2-3 minutes for setup

3. **Get API Credentials**
   - Go to Project Settings (gear icon) → API
   - Copy these values:
     - **Project URL**: `https://xxxxx.supabase.co`
     - **anon/public key**: `eyJhbGc...` (long string)
   - Save these for later

4. **Create Database Tables**
   - Go to SQL Editor (left sidebar)
   - Click "New query"
   - Paste this SQL:

```sql
-- Create recipes table
CREATE TABLE recipes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  ingredients JSONB NOT NULL,
  instructions JSONB NOT NULL,
  cooking_time_minutes INTEGER,
  servings INTEGER,
  difficulty TEXT,
  cuisine_type TEXT,
  dietary_tags JSONB,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  embedding JSONB
);

-- Create inventory table
CREATE TABLE inventory (
  user_id TEXT PRIMARY KEY,
  items JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX idx_recipes_created_at ON recipes(created_at DESC);
CREATE INDEX idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX idx_recipes_cuisine_type ON recipes(cuisine_type);
```

   - Click "Run" (or press Ctrl+Enter)
   - Verify "Success. No rows returned"

### Step 2: Pinecone (Vector Search)

1. **Create Account**
   - Go to https://www.pinecone.io
   - Click "Sign Up Free"
   - Sign up with email or Google

2. **Create Index**
   - Click "Create Index"
   - Enter details:
     - **Name**: `recipes`
     - **Dimensions**: `384`
     - **Metric**: `cosine`
     - **Cloud**: AWS
     - **Region**: Choose closest to you
   - Click "Create Index"
   - Wait for index to be ready (1-2 minutes)

3. **Get API Credentials**
   - Click "API Keys" in left sidebar
   - Copy these values:
     - **API Key**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
     - **Environment**: `us-east-1-aws` (or your region)
   - Save these for later

### Step 3: Hugging Face (Optional - for gated models)

1. **Create Account**
   - Go to https://huggingface.co
   - Click "Sign Up"
   - Create account with email

2. **Create Access Token** (only if using gated models like Llama)
   - Go to Settings → Access Tokens
   - Click "New token"
   - Name: `flavorforge-ai`
   - Type: Read
   - Click "Generate"
   - Copy token and save securely

## Backend Setup

### Step 1: Clone Repository

```bash
# Clone the repository
git clone <your-repo-url>
cd FlavorForgeAI

# Navigate to backend
cd backend
```

### Step 2: Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate it
# On Mac/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# You should see (venv) in your terminal prompt
```

### Step 3: Install Dependencies

```bash
# Install all required packages
pip install -r requirements.txt

# This will take 2-5 minutes
# You should see "Successfully installed..." messages
```

### Step 4: Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Open .env in your editor
nano .env  # or: code .env (VS Code) or notepad .env (Windows)
```

Fill in your actual values:

```env
# Supabase Configuration (from Step 1.3)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Pinecone Configuration (from Step 2.3)
PINECONE_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_INDEX_NAME=recipes

# Hugging Face Configuration (optional)
HF_MODEL_NAME=meta-llama/Llama-2-7b-chat-hf
HF_API_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxx

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

Save and close the file.

### Step 5: Run Backend

```bash
# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# You should see:
# INFO:     Uvicorn running on http://0.0.0.0:8000
# INFO:     Application startup complete.
```

### Step 6: Test Backend

Open your browser and visit:
- http://localhost:8000 - Should show welcome message
- http://localhost:8000/health - Should show `{"status": "healthy"}`
- http://localhost:8000/docs - Interactive API documentation

If all three work, your backend is ready! 🎉

## Frontend Setup

### Step 1: Navigate to Frontend

```bash
# Open a NEW terminal window (keep backend running)
cd FlavorForgeAI/frontend
```

### Step 2: Install Dependencies

```bash
# Install all packages
npm install

# This will take 2-5 minutes
```

### Step 3: Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Open .env in your editor
nano .env  # or: code .env or notepad .env
```

Fill in:

```env
VITE_API_URL=http://localhost:8000
```

Save and close.

### Step 4: Run Frontend

```bash
# Start development server
npm run dev

# You should see:
# VITE v5.x.x  ready in xxx ms
# ➜  Local:   http://localhost:5173/
```

### Step 5: Test Frontend

Open your browser and visit:
- http://localhost:5173

You should see the FlavorForge AI application! 🎉

## Testing

### Backend Tests

```bash
# In backend directory with venv activated
cd backend
source venv/bin/activate  # if not already activated

# Run all tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# View coverage report
open htmlcov/index.html  # Mac
start htmlcov/index.html  # Windows
```

### Frontend Tests

```bash
# In frontend directory
cd frontend

# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

## Deployment

### Docker Deployment

#### Backend

```bash
cd backend

# Build image
docker build -t flavorforge-backend .

# Run container
docker run -p 8000:8000 \
  -e SUPABASE_URL=your-url \
  -e SUPABASE_KEY=your-key \
  -e PINECONE_API_KEY=your-key \
  -e PINECONE_ENVIRONMENT=your-env \
  flavorforge-backend
```

#### Frontend

```bash
cd frontend

# Build image
docker build -t flavorforge-frontend .

# Run container
docker run -p 5173:5173 flavorforge-frontend
```

### AWS App Runner Deployment

1. **Push Docker image to ECR**
2. **Create App Runner service**
3. **Configure environment variables**
4. **Set health check to `/health`**
5. **Deploy**

See AWS documentation for detailed steps.

## Troubleshooting

### Backend Issues

#### "Module not found" errors
```bash
# Ensure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

#### "Connection refused" to Supabase
- Check your `SUPABASE_URL` and `SUPABASE_KEY` in `.env`
- Verify Supabase project is active
- Check internet connection

#### "Connection refused" to Pinecone
- Check your `PINECONE_API_KEY` in `.env`
- Verify Pinecone index exists and is ready
- Check `PINECONE_ENVIRONMENT` matches your region

#### Port 8000 already in use
```bash
# Find process using port 8000
lsof -i :8000  # Mac/Linux
netstat -ano | findstr :8000  # Windows

# Kill the process or use different port
uvicorn main:app --reload --port 8001
```

### Frontend Issues

#### "Cannot connect to backend"
- Ensure backend is running on http://localhost:8000
- Check `VITE_API_URL` in frontend `.env`
- Check browser console for CORS errors

#### Port 5173 already in use
```bash
# Use different port
npm run dev -- --port 3000
```

#### npm install fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Issues

#### Tables not created
- Re-run the SQL script in Supabase SQL Editor
- Check for error messages
- Verify you're in the correct project

#### Data not saving
- Check Supabase logs in Dashboard → Logs
- Verify API key has correct permissions
- Check backend logs for errors

## Next Steps

Once everything is running:

1. **Explore the API** at http://localhost:8000/docs
2. **Test recipe generation** with sample ingredients
3. **Try semantic search** with natural language queries
4. **Manage inventory** and match recipes
5. **Customize** the frontend UI
6. **Deploy** to production

## Getting Help

- **Backend Issues**: Check [backend/README.md](backend/README.md)
- **API Documentation**: http://localhost:8000/docs
- **GitHub Issues**: Open an issue on the repository
- **Service Documentation**:
  - [Supabase Docs](https://supabase.com/docs)
  - [Pinecone Docs](https://docs.pinecone.io/)
  - [FastAPI Docs](https://fastapi.tiangolo.com/)

## Checklist

Use this checklist to track your setup progress:

- [ ] Python 3.12+ installed
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Supabase account created
- [ ] Supabase project created
- [ ] Supabase tables created
- [ ] Supabase credentials saved
- [ ] Pinecone account created
- [ ] Pinecone index created
- [ ] Pinecone credentials saved
- [ ] Repository cloned
- [ ] Backend virtual environment created
- [ ] Backend dependencies installed
- [ ] Backend .env configured
- [ ] Backend running successfully
- [ ] Backend tests passing
- [ ] Frontend dependencies installed
- [ ] Frontend .env configured
- [ ] Frontend running successfully
- [ ] Frontend tests passing
- [ ] Application working end-to-end

Congratulations! You've successfully set up FlavorForge AI! 🎉
