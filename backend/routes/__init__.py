"""
API routes for Recipe AI.

This package contains all API route handlers organized by feature.
"""
from .recipes import router as recipes_router

__all__ = ["recipes_router"]
