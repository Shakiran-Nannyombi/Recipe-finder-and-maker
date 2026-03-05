from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models.cookbook import Cookbook, CookbookSearch
from datetime import datetime

router = APIRouter(prefix="/cookbooks", tags=["cookbooks"])

# Demo data - in production, this would come from a database
DEMO_COOKBOOKS = [
    {
        "id": "1",
        "title": "Mediterranean Delights",
        "author": "Chef Maria Santos",
        "description": "Explore the vibrant flavors of Mediterranean cuisine with 50+ authentic recipes.",
        "image_url": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
        "rating": 4.8,
        "recipes_count": 52,
        "difficulty": "intermediate",
        "cuisine_type": "Mediterranean",
        "tags": ["healthy", "seafood", "vegetables"],
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    },
    {
        "id": "2",
        "title": "Vegan Kitchen Essentials",
        "author": "Chef Alex Green",
        "description": "Master plant-based cooking with easy-to-follow recipes for every meal.",
        "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
        "rating": 4.9,
        "recipes_count": 68,
        "difficulty": "beginner",
        "cuisine_type": "International",
        "tags": ["vegan", "healthy", "quick"],
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    },
    {
        "id": "3",
        "title": "Asian Fusion Mastery",
        "author": "Chef Kenji Tanaka",
        "description": "Blend traditional Asian techniques with modern flavors in 75 innovative recipes.",
        "image_url": "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80",
        "rating": 4.7,
        "recipes_count": 75,
        "difficulty": "advanced",
        "cuisine_type": "Asian",
        "tags": ["fusion", "authentic", "spicy"],
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    },
    {
        "id": "4",
        "title": "Keto Made Simple",
        "author": "Chef Sarah Williams",
        "description": "Low-carb, high-flavor recipes that make keto lifestyle delicious and sustainable.",
        "image_url": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
        "rating": 4.6,
        "recipes_count": 45,
        "difficulty": "beginner",
        "cuisine_type": "American",
        "tags": ["keto", "low-carb", "healthy"],
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    },
    {
        "id": "5",
        "title": "French Pastry Perfection",
        "author": "Chef Pierre Dubois",
        "description": "Learn the art of French pastry with detailed techniques and classic recipes.",
        "image_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
        "rating": 4.9,
        "recipes_count": 38,
        "difficulty": "advanced",
        "cuisine_type": "French",
        "tags": ["baking", "desserts", "pastry"],
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    },
    {
        "id": "6",
        "title": "Quick Family Meals",
        "author": "Chef Emma Johnson",
        "description": "30-minute recipes that bring the whole family together at the dinner table.",
        "image_url": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
        "rating": 4.5,
        "recipes_count": 60,
        "difficulty": "beginner",
        "cuisine_type": "American",
        "tags": ["quick", "family-friendly", "budget"],
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }
]

@router.get("/", response_model=List[Cookbook])
async def get_cookbooks(
    query: str = None,
    category: str = None,
    difficulty: str = None,
    min_rating: float = None,
    limit: int = 20
):
    """
    Get all cookbooks with optional filtering
    """
    cookbooks = DEMO_COOKBOOKS.copy()
    
    # Filter by search query
    if query:
        query_lower = query.lower()
        cookbooks = [
            cb for cb in cookbooks
            if query_lower in cb["title"].lower() or
               query_lower in cb["author"].lower() or
               query_lower in cb["cuisine_type"].lower() or
               any(query_lower in tag.lower() for tag in cb["tags"])
        ]
    
    # Filter by difficulty
    if difficulty:
        cookbooks = [cb for cb in cookbooks if cb["difficulty"] == difficulty]
    
    # Filter by minimum rating
    if min_rating:
        cookbooks = [cb for cb in cookbooks if cb["rating"] >= min_rating]
    
    # Apply limit
    cookbooks = cookbooks[:limit]
    
    return cookbooks

@router.get("/{cookbook_id}", response_model=Cookbook)
async def get_cookbook(cookbook_id: str):
    """
    Get a specific cookbook by ID
    """
    cookbook = next((cb for cb in DEMO_COOKBOOKS if cb["id"] == cookbook_id), None)
    
    if not cookbook:
        raise HTTPException(status_code=404, detail="Cookbook not found")
    
    return cookbook

@router.post("/search", response_model=List[Cookbook])
async def search_cookbooks(search_params: CookbookSearch):
    """
    Search cookbooks with advanced filtering
    """
    cookbooks = DEMO_COOKBOOKS.copy()
    
    # Filter by search query
    if search_params.query:
        query_lower = search_params.query.lower()
        cookbooks = [
            cb for cb in cookbooks
            if query_lower in cb["title"].lower() or
               query_lower in cb["author"].lower() or
               query_lower in cb["cuisine_type"].lower()
        ]
    
    # Filter by category (trending, beginner, etc.)
    if search_params.category:
        if search_params.category == "trending":
            cookbooks = [cb for cb in cookbooks if cb["rating"] >= 4.7]
        elif search_params.category == "beginner":
            cookbooks = [cb for cb in cookbooks if cb["difficulty"] == "beginner"]
        elif search_params.category == "ai-recommended":
            cookbooks = [cb for cb in cookbooks if "healthy" in cb["tags"]]
    
    # Filter by difficulty
    if search_params.difficulty:
        cookbooks = [cb for cb in cookbooks if cb["difficulty"] == search_params.difficulty]
    
    # Filter by minimum rating
    if search_params.min_rating:
        cookbooks = [cb for cb in cookbooks if cb["rating"] >= search_params.min_rating]
    
    # Apply limit
    cookbooks = cookbooks[:search_params.limit]
    
    return cookbooks

@router.get("/recommendations/ai")
async def get_ai_recommendations(user_preferences: str = None):
    """
    Get AI-powered cookbook recommendations based on user preferences
    """
    # In production, this would use AI to analyze user preferences
    # For now, return highly-rated cookbooks
    recommended = [cb for cb in DEMO_COOKBOOKS if cb["rating"] >= 4.7]
    
    return {
        "recommendations": recommended[:4],
        "reason": "Based on your cooking history and preferences"
    }
