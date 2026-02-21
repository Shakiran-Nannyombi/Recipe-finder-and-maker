# Design: Recipe Core Feature

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         React Frontend                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Recipe     │  │   Search     │  │    Inventory         │  │
│  │  Generator   │  │     UI       │  │    Manager           │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
└─────────┼──────────────────┼─────────────────────┼──────────────┘
          │                  │                     │
          │ HTTP/JSON        │ HTTP/JSON           │ HTTP/JSON
          │                  │                     │
┌─────────▼──────────────────▼─────────────────────▼──────────────┐
│                      FastAPI Backend                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Recipe     │  │   Search     │  │    Inventory         │  │
│  │   Router     │  │   Router     │  │    Router            │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                  │                     │               │
│  ┌──────▼──────────────────▼─────────────────────▼───────────┐  │
│  │                  Service Layer                             │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐ │  │
│  │  │   Bedrock   │  │   Vector     │  │    DynamoDB      │ │  │
│  │  │   Service   │  │   Search     │  │    Service       │ │  │
│  │  └──────┬──────┘  └──────┬───────┘  └──────────┬───────┘ │  │
│  └─────────┼─────────────────┼─────────────────────┼─────────┘  │
└────────────┼─────────────────┼─────────────────────┼────────────┘
             │                 │                     │
             │                 │                     │
    ┌────────▼────────┐  ┌─────▼──────┐    ┌───────▼────────┐
    │  Hugging Face   │  │  Pinecone  │    │   Supabase     │
    │  via LlamaIndex │  │  (Vectors) │    │   (Storage)    │
    └─────────────────┘  └────────────┘    └────────────────┘
```

## Data Models

### Recipe Model
```python
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Ingredient(BaseModel):
    name: str
    quantity: str
    unit: Optional[str] = None

class Recipe(BaseModel):
    id: str
    title: str
    description: str
    ingredients: List[Ingredient]
    instructions: List[str]
    cooking_time_minutes: int
    servings: int
    difficulty: str = Field(..., pattern="^(easy|medium|hard)$")
    cuisine_type: Optional[str] = None
    dietary_tags: List[str] = []
    image_url: Optional[str] = None
    created_at: datetime
    embedding: Optional[List[float]] = None  # For vector search
```

### Recipe Generation Request
```python
class RecipeGenerationRequest(BaseModel):
    ingredients: List[str] = Field(..., min_items=1)
    dietary_restrictions: List[str] = []
    cuisine_type: Optional[str] = None
    difficulty: Optional[str] = Field(None, pattern="^(easy|medium|hard)$")
```

### Search Request
```python
class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1)
    available_ingredients: Optional[List[str]] = None
    limit: int = Field(10, ge=1, le=50)
```

### Inventory Model
```python
class InventoryItem(BaseModel):
    ingredient_name: str
    quantity: Optional[str] = None
    added_at: datetime

class UserInventory(BaseModel):
    user_id: str
    items: List[InventoryItem]
    updated_at: datetime
```

## API Endpoints

### Recipe Generation
```
POST /api/recipes/generate
Request Body: RecipeGenerationRequest
Response: { "data": Recipe, "meta": { "timestamp": "..." } }
```

### Recipe Search
```
POST /api/recipes/search
Request Body: SearchRequest
Response: { "data": List[Recipe], "meta": { "timestamp": "...", "total": int } }
```

### Get Recipe by ID
```
GET /api/recipes/{recipe_id}
Response: { "data": Recipe, "meta": { "timestamp": "..." } }
```

### Inventory Management
```
GET /api/inventory
Response: { "data": UserInventory, "meta": { "timestamp": "..." } }

POST /api/inventory/items
Request Body: { "ingredient_name": str, "quantity": str }
Response: { "data": InventoryItem, "meta": { "timestamp": "..." } }

DELETE /api/inventory/items/{ingredient_name}
Response: { "data": { "deleted": true }, "meta": { "timestamp": "..." } }
```

### Recipe Matching
```
POST /api/recipes/match-inventory
Request Body: { "user_id": str }
Response: { "data": { "exact_matches": List[Recipe], "partial_matches": List[Recipe] }, "meta": { "timestamp": "..." } }
```

## Service Layer Design

### LLM Service
```python
class LLMService:
    def __init__(self, model_name: str = "meta-llama/Llama-2-7b-chat-hf"):
        from llama_index.llms.huggingface import HuggingFaceLLM
        self.llm = HuggingFaceLLM(model_name=model_name)
    
    async def generate_recipe(
        self, 
        ingredients: List[str],
        dietary_restrictions: List[str] = [],
        cuisine_type: Optional[str] = None,
        difficulty: Optional[str] = None
    ) -> Recipe:
        """Generate recipe using Hugging Face model via LlamaIndex"""
        prompt = self._build_prompt(ingredients, dietary_restrictions, cuisine_type, difficulty)
        response = await self._invoke_model(prompt)
        return self._parse_recipe_response(response)
    
    def _build_prompt(self, ...) -> str:
        """Build structured prompt for LLM"""
        pass
    
    async def _invoke_model(self, prompt: str) -> dict:
        """Call Hugging Face model via LlamaIndex"""
        pass
```

### Vector Search Service
```python
class VectorSearchService:
    def __init__(self, pinecone_api_key: str, pinecone_environment: str):
        from pinecone import Pinecone
        self.pc = Pinecone(api_key=pinecone_api_key)
        self.index = self.pc.Index("recipes")
        self.embeddings_model = self._load_embeddings_model()
    
    async def search_recipes(
        self, 
        query: str, 
        limit: int = 10
    ) -> List[Recipe]:
        """Semantic search using Pinecone vector embeddings"""
        query_embedding = await self._get_embedding(query)
        results = await self._similarity_search(query_embedding, limit)
        return results
    
    async def _get_embedding(self, text: str) -> List[float]:
        """Generate embedding for text using sentence-transformers"""
        pass
    
    async def _similarity_search(self, embedding: List[float], limit: int) -> List[Recipe]:
        """Find similar recipes using Pinecone"""
        pass
```

### Supabase Service
```python
class SupabaseService:
    def __init__(self, supabase_url: str, supabase_key: str):
        from supabase import create_client
        self.client = create_client(supabase_url, supabase_key)
    
    async def save_recipe(self, recipe: Recipe) -> Recipe:
        """Save recipe to Supabase"""
        pass
    
    async def get_recipe(self, recipe_id: str) -> Optional[Recipe]:
        """Retrieve recipe by ID"""
        pass
    
    async def list_recipes(self, limit: int = 10, offset: int = 0) -> List[Recipe]:
        """List recipes with pagination"""
        pass
    
    async def save_inventory(self, inventory: UserInventory) -> UserInventory:
        """Save user inventory"""
        pass
    
    async def get_inventory(self, user_id: str) -> Optional[UserInventory]:
        """Retrieve user inventory"""
        pass
```

## Frontend Component Structure

```
frontend/src/
├── components/
│   ├── RecipeGenerator/
│   │   ├── IngredientInput.tsx
│   │   ├── PreferencesForm.tsx
│   │   └── GeneratedRecipe.tsx
│   ├── RecipeSearch/
│   │   ├── SearchBar.tsx
│   │   ├── RecipeCard.tsx
│   │   └── RecipeGrid.tsx
│   └── Inventory/
│       ├── InventoryList.tsx
│       ├── AddIngredient.tsx
│       └── RecipeMatches.tsx
├── hooks/
│   ├── useRecipeGenerator.ts
│   ├── useRecipeSearch.ts
│   └── useInventory.ts
├── services/
│   └── api.ts
└── pages/
    ├── Home.tsx
    ├── Generator.tsx
    ├── Search.tsx
    └── Inventory.tsx
```

## Error Handling Strategy

### Backend Error Handling
```python
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse

class APIError(Exception):
    def __init__(self, status_code: int, message: str):
        self.status_code = status_code
        self.message = message

@app.exception_handler(APIError)
async def api_error_handler(request: Request, exc: APIError):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "message": exc.message,
                "status_code": exc.status_code
            },
            "meta": {
                "timestamp": datetime.utcnow().isoformat()
            }
        }
    )
```

### Frontend Error Handling
- Display user-friendly error messages
- Retry logic for transient failures
- Fallback UI for service unavailability
- Toast notifications for errors

## Security Implementation

### Environment Configuration
```yaml
# Required Environment Variables
SUPABASE_URL: "https://your-project.supabase.co"
SUPABASE_KEY: "your-anon-key"
PINECONE_API_KEY: "your-pinecone-api-key"
PINECONE_ENVIRONMENT: "your-pinecone-environment"
HF_MODEL_NAME: "meta-llama/Llama-2-7b-chat-hf"
HF_API_TOKEN: "optional-for-gated-models"
```

### CORS Configuration
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL")],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["*"],
)
```

## Deployment Architecture

### Docker Configuration
```dockerfile
# Backend Dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### AWS App Runner Configuration
- Auto-scaling: 1-10 instances
- Health check: /health endpoint
- Environment variables from AWS Secrets Manager
- VPC connector for DynamoDB access

## Testing Strategy

### Backend Testing
- Unit tests with pytest and FastAPI TestClient
- Mock Hugging Face/LlamaIndex calls using custom mocks
- Mock Supabase and Pinecone operations in tests
- API contract tests

### Frontend Testing
- Component tests with Vitest and React Testing Library
- Mock API responses
- E2E tests for critical user flows

## Performance Optimization

### Caching Strategy
- Cache frequently accessed recipes in memory
- Cache embeddings to avoid recomputation
- Use Supabase connection pooling for read-heavy operations

### Async Operations
- All I/O operations are async
- Parallel API calls where possible
- Background tasks for non-critical operations
