# Project Setup: Recipe AI

**App Name**: Recipe AI
**Description**: A high-performance AI-powered recipe discovery and maker application. It uses semantic search to find recipes and Amazon Bedrock to generate custom recipes based on available ingredients.
**Features**:

* **Smart Recipe Search**: Natural language search using vector embeddings.
* **AI Recipe Generator**: Create new recipes via Amazon Bedrock (Claude 3).
* **Ingredient Inventory**: "What's in my fridge" filter.
* **FastAPI Backend**: Robust, asynchronous Python API.
* **React Frontend**: Responsive, modern UI for meal planning.

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

### How to use this for your project:

1. **Live Action**: Copy and paste the block above into Kiro.
2. **The Reveal**: Show the audience how Kiro immediately builds the **12+ files** needed to start.
3. **Deployment**: Because the prompt includes the **MCP Pricing** and **App Runner** context, you can then ask Kiro: *"Now deploy the backend to AWS App Runner"* and it will know exactly which steering files to reference.