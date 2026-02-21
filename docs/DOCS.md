# Recipe AI - Documentation Hub

Welcome to the Recipe AI documentation! This page serves as a central hub for all project documentation.

---

## Quick Navigation

### Getting Started
- **[README.md](../README.md)** - Project overview, features, and quick start
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed local development setup

### Development
- **[GUIDELINES.md](GUIDELINES.md)** - Development standards and best practices
  - Code conventions (Python & TypeScript)
  - Testing standards
  - Security policies
  - API design patterns
  - Git workflow

### Deployment
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide
  - Vercel (Frontend)
  - Render (Backend)
  - Supabase setup
  - Pinecone configuration

### Technical Details
- **[PROMPT.md](PROMPT.md)** - Project requirements and specifications

### Backend Documentation
- **[backend/README.md](../backend/README.md)** - Backend-specific setup and API details

### Frontend Documentation
- **[frontend/README.md](../frontend/README.md)** - Frontend-specific setup and component structure

---

## Documentation by Topic

### Architecture & Design

**Technology Stack:**
- Frontend: React 18 + TypeScript + Tailwind CSS + Vite
- Backend: FastAPI + Python 3.13 + Pydantic v2
- AI/ML: Hugging Face (via LlamaIndex)
- Database: Supabase (PostgreSQL)
- Vector Search: Pinecone
- Deployment: Vercel (frontend) + Render (backend)

**Key Documents:**
- [GUIDELINES.md](GUIDELINES.md) - Project structure

---

### Setup & Installation

**For Local Development:**
1. Read [SETUP_GUIDE.md](SETUP_GUIDE.md) for complete setup instructions
2. Follow [README.md](../README.md) for quick start

**For Production Deployment:**
1. Read [DEPLOYMENT.md](DEPLOYMENT.md) for deployment guide

---

### Development Workflow

**Before You Start:**
- Read [GUIDELINES.md](GUIDELINES.md) for coding standards
- Review [GUIDELINES.md](GUIDELINES.md) for Git conventions

**Writing Code:**
- Follow [GUIDELINES.md](GUIDELINES.md) for code conventions
- Use [GUIDELINES.md](GUIDELINES.md) for API standards

**Testing:**
- Backend: [GUIDELINES.md](GUIDELINES.md) - Backend testing
- Frontend: [GUIDELINES.md](GUIDELINES.md) - Frontend testing

**Committing:**
- Use [GUIDELINES.md](GUIDELINES.md) commit message format

---

### Security & Best Practices

**Security Policies:**
- [GUIDELINES.md](GUIDELINES.md) - Security policies
- Environment variable management
- API key rotation
- Input validation with Pydantic

**Best Practices:**
- [GUIDELINES.md](GUIDELINES.md) - Code conventions
- [GUIDELINES.md](GUIDELINES.md) - Testing standards

---

### Testing

**Backend Testing (Pytest):**
```bash
cd backend
pytest
pytest --cov=. --cov-report=html
```

**Frontend Testing (Vitest):**
```bash
cd frontend
npm test
npm run test:coverage
```

**Testing Guidelines:**
- [GUIDELINES.md#testing-standards](GUIDELINES.md#testing-standards)

---

### 🐛 Troubleshooting

**Deployment Issues:**
- [DEPLOYMENT_FIXES.md](DEPLOYMENT_FIXES.md) - Common deployment problems and solutions

**Build Errors:**
- Frontend TypeScript errors: See [DEPLOYMENT_FIXES.md#frontend-typescript-configuration](DEPLOYMENT_FIXES.md)
- Backend Python errors: See [DEPLOYMENT_FIXES.md#backend-python-compatibility](DEPLOYMENT_FIXES.md)

**Runtime Issues:**
- Check [DEPLOYMENT.md#troubleshooting](DEPLOYMENT.md#troubleshooting)

---

### 📊 Project Status

**Live Deployments:**
- Frontend: https://recipeaiug.vercel.app/
- Backend: https://recipe-ai-og2y.onrender.com

**Repository:**
- GitHub: https://github.com/Shakiran-Nannyombi/Recipe-finder-and-maker

---

## 🤝 Contributing

Want to contribute? Great! Here's how:

1. **Read the Guidelines**: Start with [GUIDELINES.md](GUIDELINES.md)
2. **Set Up Locally**: Follow [SETUP_GUIDE.md](SETUP_GUIDE.md)
3. **Make Changes**: Follow coding standards in [GUIDELINES.md#code-conventions](GUIDELINES.md#code-conventions)
4. **Test Your Code**: Run tests as described in [GUIDELINES.md#testing-standards](GUIDELINES.md#testing-standards)
5. **Commit**: Use format from [COMMIT_INSTRUCTIONS.md](COMMIT_INSTRUCTIONS.md)
6. **Submit PR**: Follow [GUIDELINES.md#pull-request-process](GUIDELINES.md#pull-request-process)

---

## 📞 Support

- **Issues**: Open an issue on GitHub
- **Questions**: Check existing documentation first
- **Deployment Help**: See [DEPLOYMENT_FIXES.md](DEPLOYMENT_FIXES.md)

---

## 📝 Documentation Maintenance

This documentation is maintained alongside the codebase. When making changes:

1. Update relevant documentation files
2. Keep this hub (DOCS.md) in sync
3. Update README.md navigation if needed
4. Commit documentation changes with code changes

---

**Last Updated**: 2024  
**Maintained By**: Recipe AI Team

---

[⬆️ Back to Top](#recipe-ai---documentation-hub-)
