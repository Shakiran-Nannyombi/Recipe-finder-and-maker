"""
Recipe generation and management routes for FlavorForge AI.
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from datetime import datetime, timezone
from typing import Dict, Any

from models.recipe import Recipe, RecipeGenerationRequest
from services.llm_service import LLMService
from services.supabase_service import SupabaseService

# Create router for recipe endpoints
router = APIRouter(prefix="/api/recipes", tags=["recipes"])


def get_llm_service() -> LLMService:
    """Dependency to get LLM service instance."""
    return LLMService()


def get_supabase_service() -> SupabaseService:
    """Dependency to get Supabase service instance."""
    return SupabaseService()


@router.post("/generate")
async def generate_recipe(
    request: RecipeGenerationRequest,
    llm_service: LLMService = Depends(get_llm_service)
) -> Dict[str, Any]:
    """
    Generate a recipe based on available ingredients and preferences.
    
    Args:
        request: Recipe generation request with ingredients and preferences
        llm_service: LLM service instance (injected)
        
    Returns:
        Standardized response with generated recipe and metadata
        
    Raises:
        HTTPException: 400 for invalid input, 500 for generation failures
    """
    try:
        # Generate recipe using LLM service
        recipe = await llm_service.generate_recipe(
            ingredients=request.ingredients,
            dietary_restrictions=request.dietary_restrictions,
            cuisine_type=request.cuisine_type,
            difficulty=request.difficulty
        )
        
        # Return standardized response format
        return {
            "data": recipe.model_dump(),
            "meta": {
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        }
    
    except ValueError as e:
        # Handle validation errors and invalid inputs
        raise HTTPException(
            status_code=400,
            detail=f"Invalid request: {str(e)}"
        )
    
    except TimeoutError as e:
        # Handle timeout errors
        raise HTTPException(
            status_code=504,
            detail=f"Recipe generation timed out: {str(e)}"
        )
    
    except ConnectionError as e:
        # Handle connection errors
        raise HTTPException(
            status_code=503,
            detail=f"Service temporarily unavailable: {str(e)}"
        )
    
    except RuntimeError as e:
        # Handle LLM service errors
        raise HTTPException(
            status_code=500,
            detail=f"Recipe generation failed: {str(e)}"
        )
    
    except Exception as e:
        # Catch-all for unexpected errors
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(e)}"
        )


@router.get("/{recipe_id}")
async def get_recipe(
    recipe_id: str,
    supabase_service: SupabaseService = Depends(get_supabase_service)
) -> Dict[str, Any]:
    """
    Retrieve a single recipe by ID.
    
    Args:
        recipe_id: Unique recipe identifier
        supabase_service: Supabase service instance (injected)
        
    Returns:
        Standardized response with recipe data and metadata
        
    Raises:
        HTTPException: 404 if recipe not found, 500 for server errors
    """
    try:
        # Retrieve recipe from Supabase
        recipe = await supabase_service.get_recipe(recipe_id)
        
        if recipe is None:
            raise HTTPException(
                status_code=404,
                detail=f"Recipe with id '{recipe_id}' not found"
            )
        
        # Return standardized response format
        return {
            "data": recipe.model_dump(),
            "meta": {
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        }
    
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    
    except Exception as e:
        # Handle unexpected errors
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving recipe: {str(e)}"
        )


@router.get("")
async def list_recipes(
    limit: int = Query(10, ge=1, le=50, description="Maximum number of recipes to return"),
    offset: int = Query(0, ge=0, description="Number of recipes to skip"),
    supabase_service: SupabaseService = Depends(get_supabase_service)
) -> Dict[str, Any]:
    """
    List recipes with pagination.
    
    Args:
        limit: Maximum number of recipes to return (1-50, default: 10)
        offset: Number of recipes to skip (default: 0)
        supabase_service: Supabase service instance (injected)
        
    Returns:
        Standardized response with list of recipes and metadata
        
    Raises:
        HTTPException: 500 for server errors
    """
    try:
        # Retrieve recipes from Supabase
        recipes = await supabase_service.list_recipes(limit=limit, offset=offset)
        
        # Return standardized response format
        return {
            "data": [recipe.model_dump() for recipe in recipes],
            "meta": {
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "limit": limit,
                "offset": offset,
                "count": len(recipes)
            }
        }
    
    except Exception as e:
        # Handle unexpected errors
        raise HTTPException(
            status_code=500,
            detail=f"Error listing recipes: {str(e)}"
        )
