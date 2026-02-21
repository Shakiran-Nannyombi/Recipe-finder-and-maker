# Recipe AI - Backend

AI-powered recipe generation and search API built with FastAPI, Hugging Face, Supabase, and Pinecone.

## Features

- **AI Recipe Generation**: Generate custom recipes using Hugging Face models via LlamaIndex
- **Semantic Search**: Vector-based recipe search using Pinecone
- **Inventory Management**: Track ingredients and match recipes
- **Recipe Storage**: Persistent storage with Supabase (PostgreSQL)
- **RESTful API**: FastAPI with automatic OpenAPI documentation

## Prerequisites

Before you begin, ensure you have:

- Python 3.12 or higher
- pip (Python package manager)
- Git

## Required API Keys

You'll need accounts and API keys from the following services:

### 1. Supabase (Database & Storage)
- Sign up at: https://supabase.com
- Create a new project
- Get your credentials from: Project Settings → API
  - `SUPABASE_URL`: Your project URL
  - `SUPABASE_KEY`: Your anon/public key

**Database Setup:**
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

-- Create indexes for better performance
CREATE INDEX idx_recipes_created_at ON recipes(created_at DESC);
CREATE INDEX idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX idx_recipes_cuisine_type ON recipes(cuisine_type);
```

### 2. Pinecone (Vector Search)
- Sign up at: https://www.pinecone.io
- Create a new index with:
  - **Name**: `recipes`
  - **Dimensions**: `384` (for sentence-transformers/all-MiniLM-L6-v2)
  - **Metric**: `cosine`
- Get your credentials from: API Keys
  - `PINECONE_API_KEY`: Your API key
  - `PINECONE_ENVIRONMENT`: Your environment (e.g., `us-east-1-aws`)

### 3. Hugging Face (Optional - for gated models)
- Sign up at: https://huggingface.co
- Create access token at: https://huggingface.co/settings/tokens
- `HF_API_TOKEN`: Your access token (only needed for gated models like Llama)

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd FlavorForgeAI/backend
```

### 2. Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your actual credentials
nano .env  # or use your preferred editor
```

Fill in your actual values in `.env`:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-supabase-anon-key

# Pinecone Configuration
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_INDEX_NAME=recipes

# Hugging Face Configuration
HF_MODEL_NAME=meta-llama/Llama-2-7b-chat-hf
HF_API_TOKEN=your-huggingface-token  # Optional

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Running the Application

### Development Mode

```bash
# Make sure you're in the backend directory and virtual environment is activated
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

### Production Mode

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Documentation

Once the server is running, visit http://localhost:8000/docs for interactive API documentation.

### Key Endpoints

#### Recipe Generation
```http
POST /api/recipes/generate
Content-Type: application/json

{
  "ingredients": ["chicken", "rice", "tomatoes"],
  "dietary_restrictions": ["gluten-free"],
  "cuisine_type": "Italian",
  "difficulty": "easy"
}
```

#### Recipe Search
```http
POST /api/recipes/search
Content-Type: application/json

{
  "query": "quick pasta dinner",
  "limit": 10
}
```

#### Inventory Management
```http
# Get inventory
GET /api/inventory?user_id=default_user

# Add item
POST /api/inventory/items?user_id=default_user
Content-Type: application/json

{
  "ingredient_name": "chicken breast",
  "quantity": "500g"
}

# Remove item
DELETE /api/inventory/items/chicken%20breast?user_id=default_user

# Match recipes with inventory
POST /api/inventory/match-recipes?user_id=default_user
```

## Testing

### Run All Tests

```bash
# Make sure you're in the backend directory
pytest
```

### Run Tests with Coverage

```bash
pytest --cov=. --cov-report=html
```

### Run Specific Test File

```bash
pytest tests/services/test_supabase_service.py -v
```

## Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
├── .env                   # Your actual environment variables (gitignored)
├── models/                # Pydantic data models
│   ├── recipe.py
│   └── inventory.py
├── routes/                # API route handlers
│   ├── recipes.py
│   └── inventory.py
├── services/              # Business logic layer
│   ├── llm_service.py
│   ├── supabase_service.py
│   └── vector_search_service.py
└── tests/                 # Test suite
    ├── conftest.py
    ├── models/
    ├── routes/
    └── services/
```

## Docker Deployment

### Build Docker Image

```bash
docker build -t flavorforge-backend .
```

### Run Docker Container

```bash
docker run -p 8000:8000 \
  -e SUPABASE_URL=your-url \
  -e SUPABASE_KEY=your-key \
  -e PINECONE_API_KEY=your-key \
  -e PINECONE_ENVIRONMENT=your-env \
  flavorforge-backend
```

## AWS App Runner Deployment

### Prerequisites
- AWS CLI configured
- Docker image pushed to ECR or public registry

### Deploy Steps

1. **Create App Runner service** via AWS Console or CLI
2. **Configure environment variables** in App Runner
3. **Set health check** to `/health`
4. **Configure auto-scaling** (1-10 instances recommended)

## Troubleshooting

### Common Issues

#### "Module not found" errors
```bash
# Ensure virtual environment is activated
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

#### "Connection refused" to Supabase/Pinecone
- Verify your API keys are correct in `.env`
- Check your internet connection
- Ensure services are not experiencing downtime

#### Slow recipe generation
- Hugging Face models can be slow on first run (downloading models)
- Consider using smaller models for development
- Use caching for embeddings

#### CORS errors from frontend
- Add your frontend URL to `CORS_ORIGINS` in `.env`
- Restart the server after changing environment variables

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `SUPABASE_URL` | Yes | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_KEY` | Yes | Supabase anon key | `eyJhbGc...` |
| `PINECONE_API_KEY` | Yes | Pinecone API key | `abc123...` |
| `PINECONE_ENVIRONMENT` | Yes | Pinecone environment | `us-east-1-aws` |
| `PINECONE_INDEX_NAME` | No | Pinecone index name | `recipes` (default) |
| `HF_MODEL_NAME` | No | Hugging Face model | `meta-llama/Llama-2-7b-chat-hf` |
| `HF_API_TOKEN` | No | Hugging Face token | Only for gated models |
| `CORS_ORIGINS` | No | Allowed CORS origins | `http://localhost:5173` |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review API docs at `/docs` endpoint

## Related Documentation

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Pinecone Documentation](https://docs.pinecone.io/)
- [Hugging Face Documentation](https://huggingface.co/docs)
- [LlamaIndex Documentation](https://docs.llamaindex.ai/)
