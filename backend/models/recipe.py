"""
Recipe data models for FlavorForge AI.
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class Ingredient(BaseModel):
    """Model for recipe ingredient with quantity and unit."""
    name: str
    quantity: str
    unit: Optional[str] = None


class Recipe(BaseModel):
    """Model for a complete recipe with all details."""
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


class RecipeGenerationRequest(BaseModel):
    """Model for recipe generation request with user preferences."""
    ingredients: List[str] = Field(..., min_length=1, description="List of available ingredients (at least 1 required)")
    dietary_restrictions: List[str] = Field(default_factory=list, description="Dietary restrictions (e.g., vegetarian, vegan, gluten-free)")
    cuisine_type: Optional[str] = Field(None, description="Preferred cuisine type (e.g., Italian, Mexican, Asian)")
    difficulty: Optional[str] = Field(None, pattern="^(easy|medium|hard)$", description="Recipe difficulty level")


class SearchRequest(BaseModel):
    """Model for recipe search request with semantic query and filters."""
    query: str = Field(..., min_length=1, description="Natural language search query")
    available_ingredients: Optional[List[str]] = Field(None, description="Optional list of available ingredients for filtering")
    limit: int = Field(10, ge=1, le=50, description="Maximum number of results to return (1-50)")
