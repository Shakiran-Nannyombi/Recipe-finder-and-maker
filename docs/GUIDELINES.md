# Recipe AI - Development Guidelines

This document outlines the development standards, best practices, and conventions for the Recipe AI project.

## Table of Contents

- [Product Overview](#product-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [API Standards](#api-standards)
- [Testing Standards](#testing-standards)
- [Security Policies](#security-policies)
- [Code Conventions](#code-conventions)
- [Git Workflow](#git-workflow)

---

## Product Overview

### Purpose
Recipe AI bridges the gap between available ingredients and culinary inspiration. It leverages generative AI to ensure users never waste food and always have access to personalized recipes.

### Key Features
- **AI Recipe Generation**: Create custom recipes using Hugging Face models via LlamaIndex
- **Semantic Recipe Search**: Natural language search powered by Pinecone vector embeddings
- **Ingredient Inventory Management**: Track ingredients and get recipe matches
- **Interactive React Dashboard**: Modern, responsive UI for meal planning

### Target Users
- Home cooks looking for recipe inspiration
- People wanting to reduce food waste
- Users seeking personalized recipe recommendations

---

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Testing**: Vitest + React Testing Library
- **Deployment**: Vercel

### Backend
- **Framework**: FastAPI (Python 3.12)
- **Data Validation**: Pydantic v2
- **Testing**: Pytest with FastAPI TestClient
- **Deployment**: Render

### AI/ML
- **LLM Provider**: Hugging Face
- **Framework**: LlamaIndex
- **Vector Search**: Pinecone

### Database & Storage
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage

---

## Project Structure

```
RecipeAI/
├── backend/                    # FastAPI application
│   ├── main.py                # Application entry point with CORS
│   ├── models/                # Pydantic data models
│   │   ├── recipe.py         # Recipe models
│   │   └── inventory.py      # Inventory models
│   ├── routes/                # API endpoints (modular routers)
│   │   ├── recipes.py        # Recipe CRUD & generation
│   │   ├── search.py         # Vector search endpoints
│   │   └── inventory.py      # Inventory management
│   ├── services/              # Business logic layer
│   │   ├── llm_service.py    # Hugging Face integration
│   │   ├── vector_search_service.py  # Pinecone integration
│   │   └── supabase_service.py       # Database operations
│   ├── tests/                 # Test suite
│   │   ├── conftest.py       # Pytest fixtures
│   │   ├── test_main.py      # API tests
│   │   ├── models/           # Model tests
│   │   ├── routes/           # Route tests
│   │   └── services/         # Service tests
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile            # Container configuration
│   └── .env.example          # Environment template
│
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   │   ├── RecipeGenerator/
│   │   │   ├── RecipeSearch/
│   │   │   └── Inventory/
│   │   ├── hooks/            # Custom React hooks
│   │   │   ├── useRecipeGenerator.ts
│   │   │   ├── useRecipeSearch.ts
│   │   │   └── useInventory.ts
│   │   ├── pages/            # Page components
│   │   │   ├── Generator.tsx
│   │   │   ├── Search.tsx
│   │   │   └── Inventory.tsx
│   │   ├── services/         # API client layer
│   │   │   ├── api.ts        # Base API configuration
│   │   │   ├── recipeApi.ts  # Recipe endpoints
│   │   │   └── inventoryApi.ts
│   │   ├── types/            # TypeScript type definitions
│   │   └── test/             # Test utilities
│   ├── public/               # Static assets
│   │   ├── RecipeAI.png     # Logo (favicon)
│   │   └── RecipeAI 1.svg   # Logo (SVG version)
│   ├── package.json          # Node dependencies
│   ├── vite.config.ts        # Vite configuration
│   ├── vitest.config.ts      # Test configuration
│   ├── tailwind.config.js    # Tailwind configuration
│   ├── Dockerfile            # Container configuration
│   ├── vercel.json           # Vercel deployment config
│   └── .env.example          # Environment template
│
├── .kiro/                     # Kiro AI configuration
│   ├── steering/             # Development guidelines
│   │   ├── product.md
│   │   ├── tech.md
│   │   ├── structure.md
│   │   ├── api-standards.md
│   │   ├── testing-standards.md
│   │   └── security-policies.md
│   ├── hooks/                # Agent hooks
│   └── specs/                # Feature specifications
│       └── recipe-core/      # Core recipe feature spec
│
├── render.yaml               # Render deployment config
├── supabase_schema.sql       # Database schema
├── DEPLOYMENT.md             # Deployment guide
├── SETUP_GUIDE.md            # Setup instructions
├── IMPLEMENTATION_SUMMARY.md # Technical details
├── GUIDELINES.md             # This file
└── README.md                 # Project overview
```

---

## API Standards

### Router Organization
- Use FastAPI `APIRouter` for modularity
- Group related endpoints in separate router files
- Mount routers in `main.py` with appropriate prefixes

### Response Format
All API responses must follow this structure:

```json
{
  "data": {
    // Response payload
  },
  "meta": {
    "timestamp": "2024-01-01T12:00:00Z"  // ISO-8601 format
  }
}
```

### Error Handling
- Use FastAPI's `HTTPException` for errors
- Implement custom exception handlers in `main.py`
- Return appropriate HTTP status codes:
  - `200`: Success
  - `201`: Created
  - `400`: Bad Request (validation errors)
  - `404`: Not Found
  - `500`: Internal Server Error

### Example Error Response
```json
{
  "detail": "Recipe not found",
  "status_code": 404
}
```

### CORS Configuration
- Restrict CORS to frontend domain in production
- Allow all origins in development
- Configure in `main.py` using `CORSMiddleware`

---

## Testing Standards

### Backend Testing (Pytest)

#### Test Structure
```python
# tests/routes/test_recipes.py
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_generate_recipe():
    response = client.post("/api/recipes/generate", json={
        "ingredients": ["chicken", "rice"],
        "dietary_restrictions": ["gluten-free"]
    })
    assert response.status_code == 200
    assert "data" in response.json()
```

#### Mocking External Services
- Mock all Hugging Face/LlamaIndex calls
- Mock all Supabase database calls
- Mock all Pinecone vector search calls
- Use `pytest-mock` or `unittest.mock`

#### Coverage Requirements
- Aim for 80%+ code coverage
- Run: `pytest --cov=. --cov-report=html`

### Frontend Testing (Vitest + React Testing Library)

#### Test Structure
```typescript
// src/components/RecipeGenerator/IngredientInput.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import IngredientInput from './IngredientInput';

describe('IngredientInput', () => {
  it('adds ingredient when form is submitted', () => {
    const onAdd = vi.fn();
    render(<IngredientInput ingredients={[]} onAdd={onAdd} onRemove={vi.fn()} />);
    
    const input = screen.getByPlaceholderText(/add an ingredient/i);
    fireEvent.change(input, { target: { value: 'tomato' } });
    fireEvent.submit(input.closest('form')!);
    
    expect(onAdd).toHaveBeenCalledWith('tomato');
  });
});
```

#### Mocking API Calls
- Mock all API calls using `vi.mock()`
- Test loading, success, and error states
- Use MSW (Mock Service Worker) for complex scenarios

#### Coverage Requirements
- Aim for 80%+ code coverage
- Run: `npm run test:coverage`

---

## Security Policies

### Environment Variables
- Never commit `.env` files
- Use `.env.example` as template
- Store secrets in deployment platform (Vercel/Render)

### API Keys
- Rotate API keys regularly
- Use environment-specific keys (dev/prod)
- Required keys:
  - `SUPABASE_URL`
  - `SUPABASE_KEY`
  - `PINECONE_API_KEY`
  - `PINECONE_ENVIRONMENT`
  - `HUGGINGFACE_API_KEY` (optional for gated models)

### Input Validation
- Use Pydantic models for all API inputs
- Validate data types, ranges, and formats
- Sanitize user inputs to prevent injection attacks

### CORS Configuration
- Production: Restrict to frontend domain only
- Development: Allow localhost origins
- Never use `allow_origins=["*"]` in production

### Authentication (Future)
- Implement JWT-based authentication
- Use Supabase Auth for user management
- Protect sensitive endpoints with middleware

---

## Code Conventions

### Python (Backend)

#### Style Guide
- Follow PEP 8
- Use type hints for all functions
- Maximum line length: 100 characters
- Use `black` for formatting
- Use `flake8` for linting

#### Naming Conventions
- Functions: `snake_case`
- Classes: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Private methods: `_leading_underscore`

#### Example
```python
from typing import List, Optional
from pydantic import BaseModel

class RecipeRequest(BaseModel):
    ingredients: List[str]
    dietary_restrictions: Optional[List[str]] = []
    cuisine_type: Optional[str] = None

async def generate_recipe(request: RecipeRequest) -> dict:
    """Generate a recipe based on ingredients and preferences."""
    # Implementation
    pass
```

### TypeScript (Frontend)

#### Style Guide
- Use TypeScript strict mode
- Prefer functional components with hooks
- Use named exports for components
- Maximum line length: 100 characters
- Use Prettier for formatting
- Use ESLint for linting

#### Naming Conventions
- Components: `PascalCase`
- Functions/Variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Types/Interfaces: `PascalCase`

#### Example
```typescript
interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
}

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="card">
      <h3>{recipe.title}</h3>
      {/* Component implementation */}
    </div>
  );
}
```

### CSS/Tailwind

#### Conventions
- Use Tailwind utility classes
- Create custom classes in `index.css` for reusable patterns
- Follow mobile-first responsive design
- Use semantic color names from theme

#### Example
```css
/* Custom utility classes */
.card {
  @apply bg-card rounded-lg shadow-md p-6 border border-border;
}

.btn-primary {
  @apply bg-gradient-primary text-text-light px-6 py-3 rounded-lg 
         font-semibold hover:scale-105 transition-transform duration-200;
}
```

---

## Git Workflow

### Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `hotfix/*`: Urgent production fixes

### Commit Messages
Follow conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(recipes): add dietary restriction filtering

Implement filtering logic for recipes based on user dietary restrictions.
Supports multiple restrictions (vegan, gluten-free, etc.)

Closes #123
```

```
fix(api): handle empty ingredient list error

Add validation to prevent API errors when ingredient list is empty.
Return appropriate error message to user.
```

### Pull Request Process
1. Create feature branch from `develop`
2. Implement changes with tests
3. Run test suite and ensure all pass
4. Update documentation if needed
5. Create PR with clear description
6. Request code review
7. Address review comments
8. Merge after approval

---

## Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Pinecone Documentation](https://docs.pinecone.io/)
- [LlamaIndex Documentation](https://docs.llamaindex.ai/)

---

## Contributing

When contributing to Recipe AI:

1. Read and follow these guidelines
2. Write tests for new features
3. Update documentation as needed
4. Follow the code style conventions
5. Submit PRs with clear descriptions
6. Be responsive to code review feedback

---

**Last Updated**: 2024
**Maintained By**: Recipe AI Team
