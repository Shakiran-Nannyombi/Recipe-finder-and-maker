# Recipe AI 

A high-performance AI-powered recipe discovery and generation application. Uses semantic search to find recipes and Hugging Face models to generate custom recipes based on available ingredients.

## Features

* **Smart Recipe Search**: Natural language search using Pinecone vector embeddings
* **AI Recipe Generator**: Create custom recipes using Hugging Face models via LlamaIndex
* **Ingredient Inventory**: Track what's in your fridge and match recipes
* **FastAPI Backend**: Robust, asynchronous Python API
* **React Frontend**: Responsive, modern UI for meal planning
* **Supabase Storage**: Persistent recipe and inventory storage

## Quick Start

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

**Detailed backend setup guide**: [backend/README.md](backend/README.md)

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your backend URL
npm run dev
```

Visit http://localhost:5173 for the application.

## Required Services

You'll need API keys from:
1. **Supabase** - Database and storage (https://supabase.com)
2. **Pinecone** - Vector search (https://pinecone.io)
3. **Hugging Face** - AI models (https://huggingface.co) - Optional for gated models

See [backend/README.md](backend/README.md) for detailed setup instructions.

## Project Structure

```
RecipeAI/
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

## Testing

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

## Deployment

### Backend (Render)
The backend is deployed on Render. See `render.yaml` for configuration.

```bash
# Build and deploy via Render dashboard or CLI
render deploy
```

### Frontend (Vercel)
The frontend is deployed on Vercel. See `vercel.json` for configuration.

```bash
# Deploy via Vercel CLI
vercel --prod
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## API Documentation

Once the backend is running, interactive API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Architecture

Recipe AI follows a modern full-stack architecture:

- **Frontend**: React 18 with TypeScript, Tailwind CSS, deployed on Vercel
- **Backend**: FastAPI with Python 3.12, deployed on Render
- **AI/ML**: Hugging Face models via LlamaIndex for recipe generation
- **Database**: Supabase (PostgreSQL) for recipe and inventory storage
- **Vector Search**: Pinecone for semantic recipe search

## Documentation

- [Setup Guide](SETUP_GUIDE.md) - Detailed setup instructions
- [Deployment Guide](DEPLOYMENT.md) - Production deployment guide
- [Implementation Summary](IMPLEMENTATION_SUMMARY.md) - Technical implementation details
- [Guidelines](GUIDELINES.md) - Development guidelines and best practices

## Development Guidelines

See [GUIDELINES.md](GUIDELINES.md) for:
- Code standards and conventions
- Testing requirements
- Security policies
- API design patterns
- Project structure guidelines