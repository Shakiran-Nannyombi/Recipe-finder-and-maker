"""
Recipe generation and management routes for FlavorForge AI.
"""
from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone
from typing import Dict, Any

from models.recipe import Recipe, RecipeGenerationRequest
from services.llm_service import LLMService

# Create router for recipe endpoints
router = APIRouter(prefix="/api/recipes", tags=["recipes"])


def get_llm_service() -> LLMService:
    """Dependency to get LLM service instance."""
    return LLMService()


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
