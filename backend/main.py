"""
FlavorForge AI - FastAPI Backend
Main application entry point
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone

app = FastAPI(
    title="FlavorForge AI",
    description="AI-powered recipe generation and search API",
    version="1.0.0"
)

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
            "message": "Welcome to FlavorForge AI API",
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
            "service": "FlavorForge AI"
        },
        "meta": {
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    }
