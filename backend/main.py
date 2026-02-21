"""
Recipe AI - FastAPI Backend
Main application entry point
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone

from routes.recipes import router as recipes_router
from routes.inventory import router as inventory_router

app = FastAPI(
    title="Recipe AI",
    description="AI-powered recipe generation and search API",
    version="1.0.0"
)

# Register routers
app.include_router(recipes_router)
app.include_router(inventory_router)

# Configure CORS middleware
# In production, this should be restricted to the frontend domain only
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "data": {
            "message": "Welcome to Recipe AI API",
            "version": "1.0.0"
        },
        "meta": {
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint for AWS App Runner"""
    return {
        "data": {
            "status": "healthy",
            "service": "Recipe AI"
        },
        "meta": {
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    }
