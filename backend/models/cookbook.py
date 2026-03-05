from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Cookbook(BaseModel):
    id: Optional[str] = None
    title: str
    author: str
    description: str
    image_url: Optional[str] = None
    rating: float = 0.0
    recipes_count: int = 0
    difficulty: str  # beginner, intermediate, advanced
    cuisine_type: str
    tags: List[str] = []
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class CookbookSearch(BaseModel):
    query: Optional[str] = None
    category: Optional[str] = None
    difficulty: Optional[str] = None
    min_rating: Optional[float] = None
    limit: int = 20
