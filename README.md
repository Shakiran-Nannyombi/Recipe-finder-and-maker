# FlavorForge AI 🍳

A high-performance AI-powered recipe discovery and generation application. Uses semantic search to find recipes and Hugging Face models to generate custom recipes based on available ingredients.

## ✨ Features

* **Smart Recipe Search**: Natural language search using Pinecone vector embeddings
* **AI Recipe Generator**: Create custom recipes using Hugging Face models via LlamaIndex
* **Ingredient Inventory**: Track what's in your fridge and match recipes
* **FastAPI Backend**: Robust, asynchronous Python API
* **React Frontend**: Responsive, modern UI for meal planning
* **Supabase Storage**: Persistent recipe and inventory storage

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
uvicorn main:app --reload
```

Visit http://localhost:8000/docs for API documentation.

**📖 Detailed backend setup guide**: [backend/README.md](backend/README.md)

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your backend URL
npm run dev
```

Visit http://localhost:5173 for the application.

## 🔑 Required Services

You'll need API keys from:
1. **Supabase** - Database and storage (https://supabase.com)
2. **Pinecone** - Vector search (https://pinecone.io)
3. **Hugging Face** - AI models (https://huggingface.co) - Optional for gated models

See [backend/README.md](backend/README.md) for detailed setup instructions.

## 📁 Project Structure

```
FlavorForgeAI/
├── backend/               # FastAPI application
│   ├── main.py           # Application entry point
│   ├── models/           # Pydantic data models
│   ├── routes/           # API endpoints
│   ├── services/         # Business logic
│   └── tests/            # Test suite
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom hooks
│   │   ├── pages/        # Page components
│   │   └── services/     # API client
│   └── public/           # Static assets
└── .kiro/                # Kiro configuration
    ├── steering/         # Development guidelines
    ├── hooks/            # Agent hooks
    └── specs/            # Feature specifications
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
pytest --cov=. --cov-report=html
```

### Frontend Tests
```bash
cd frontend
npm test
npm run test:coverage
```

## 🐳 Docker Deployment

```bash
# Backend
cd backend
docker build -t flavorforge-backend .
docker run -p 8000:8000 flavorforge-backend

# Frontend
cd frontend
docker build -t flavorforge-frontend .
docker run -p 5173:5173 flavorforge-frontend
```

## 📚 API Documentation

Once the backend is running, interactive API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

You are setting up a specification-driven development environment with steering files, agent hooks, and MCP servers.

## PROJECT CONTEXT

* **Project Type**: Full-stack web application
* **Tech Stack**: React 18 (Vite), FastAPI (Python 3.12)
* **AWS Services**: App Runner (Deployment), Bedrock (AI), DynamoDB (Storage), S3 (Images)
* **Team Size**: Solo developer (Hackathon mode)
* **Security**: IAM-based, environment-variable driven
* **Target Users**: Home cooks and innovators in the Mjanga AI Challenge

## TASK 1: CREATE STRUCTURE

```
FlavorForgeAI/
├── .kiro/
│   ├── steering/          # 6 files: product, tech, structure, api-standards, testing-standards, security-policies
│   ├── hooks/             # 4 files: test-sync, documentation-update, security-scan, cost-check
│   └── specs/.gitkeep
├── backend/               # FastAPI application
├── frontend/              # React application
├── .vscode/mcp.json
├── .cursor/mcp.json
├── .gitignore
├── .env.example
└── README.md

```

## TASK 2: STEERING FILES

### .kiro/steering/product.md

```markdown
# Product Overview: FlavorForge AI
## Purpose
FlavorForge AI bridges the gap between available ingredients and culinary inspiration. It leverages generative AI to ensure users never waste food and always have access to personalized recipes.
## Key Features
- AI-driven recipe generation via Amazon Bedrock.
- FastAPI-powered search.
- Interactive React dashboard.

```

### .kiro/steering/tech.md

```markdown
# Technology Stack: FlavorForge AI
- **Frontend**: React, Tailwind CSS, Vite
- **Backend**: FastAPI, Pydantic v2
- **AI/ML**: Amazon Bedrock (Claude 3 Sonnet/Haiku)
- **Infrastructure**: AWS App Runner, S3, DynamoDB
- **MCPs**: aws-api, bedrock-kb, pricing, cloudwatch

```

### .kiro/steering/structure.md

```markdown
# Project Structure
- `backend/`: FastAPI source, routes, and services.
- `frontend/`: React components, hooks, and pages.
- `infrastructure/`: Dockerfiles and deployment manifests.

```

### .kiro/steering/api-standards.md

```markdown
# API Standards
- Use FastAPI `APIRouter` for modularity.
- All responses must follow: `{ "data": {}, "meta": { "timestamp": "ISO-8601" } }`.
- Error handling: Use custom HTTPException handlers.

```

### .kiro/steering/testing-standards.md

```markdown
# Testing Standards
- Backend: Pytest with FastAPI TestClient.
- Frontend: Vitest and React Testing Library.
- Mock all Bedrock API calls during unit tests.

```

### .kiro/steering/security-policies.md

```markdown
# Security Policies
- Zero-cred policy: Use IAM Roles for App Runner.
- Input Validation: Pydantic models for all API inputs.
- CORS: Restricted to the frontend domain.

```

## TASK 3: AGENT HOOKS (JSON)

* Create `.kiro/hooks/test-sync.kiro.hook` (Auto-test generation)
* Create `.kiro/hooks/documentation-update.kiro.hook` (Auto-OpenAPI updates)
* Create `.kiro/hooks/security-scan.kiro.hook` (Pre-deployment check)
* Create `.kiro/hooks/cost-check.kiro.hook` (AWS Pricing MCP integration)

## TASK 4: MCP CONFIGURATION

### .vscode/mcp.json

```json
{
  "mcpServers": {
    "awslabs.aws-api-mcp-server": { "command": "uvx", "args": ["awslabs.aws-api-mcp-server@latest"] },
    "awslabs.aws-pricing-mcp-server": { "command": "uvx", "args": ["awslabs.aws-pricing-mcp-server@latest"] },
    "awslabs.bedrock-kb-retrieval-mcp-server": { "command": "uvx", "args": ["awslabs.bedrock-kb-retrieval-mcp-server@latest"] }
  }
}

```

## TASK 5: INITIAL FEATURE SPEC

Create `.kiro/specs/recipe-core/` with:

1. **requirements.md**: Define the "Recipe Generator" and "Recipe Search" flows.
2. **design.md**: ASCII diagram of the API flow from React -> FastAPI -> Bedrock.
3. **tasks.md**:
* Task 1: Initialize FastAPI & React folders.
* Task 2: Create Bedrock Service wrapper.
* Task 3: Build React Recipe Search UI.
* Task 4: Dockerize and prepare for App Runner.



---

### How to use this for your session:

1. **Live Action**: Copy and paste the block above into Kiro.
2. **The Reveal**: Show the audience how Kiro immediately builds the **12+ files** needed to start.
3. **Deployment**: Because the prompt includes the **MCP Pricing** and **App Runner** context, you can then ask Kiro: *"Now deploy the backend to AWS App Runner"* and it will know exactly which steering files to reference.

**Would you like me to create the specific ASCII architecture diagram for your `design.md` file so you can copy-paste it as well?**