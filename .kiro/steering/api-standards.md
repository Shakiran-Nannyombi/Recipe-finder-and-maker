# API Standards

- Use FastAPI `APIRouter` for modularity.
- All responses must follow: `{ "data": {}, "meta": { "timestamp": "ISO-8601" } }`.
- Error handling: Use custom HTTPException handlers.
