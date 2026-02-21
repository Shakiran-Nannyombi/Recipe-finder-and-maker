"""
Inventory management routes for FlavorForge AI.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone

from services.supabase_service import SupabaseService
from models.inventory import UserInventory, InventoryItem

router = APIRouter(prefix="/api/inventory", tags=["inventory"])

# Initialize Supabase service
supabase_service = SupabaseService()


class AddItemRequest(BaseModel):
    """Request model for adding an item to inventory."""
    ingredient_name: str
    quantity: Optional[str] = None


@router.get("")
async def get_inventory(user_id: str = "default_user"):
    """
    Get user's inventory.
    
    Args:
        user_id: User identifier (defaults to 'default_user')
        
    Returns:
        User's inventory with standardized response format
    """
    try:
        inventory = await supabase_service.get_inventory(user_id)
        
        if inventory is None:
            # Return empty inventory if not found
            inventory = UserInventory(
                user_id=user_id,
                items=[],
                updated_at=datetime.now(timezone.utc)
            )
        
        return {
            "data": inventory.model_dump(),
            "meta": {
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/items")
async def add_inventory_item(request: AddItemRequest, user_id: str = "default_user"):
    """
    Add an item to user's inventory.
    
    Args:
        request: AddItemRequest with ingredient_name and optional quantity
        user_id: User identifier (defaults to 'default_user')
        
    Returns:
        Added item with standardized response format
    """
    try:
        inventory = await supabase_service.add_item(
            user_id=user_id,
            ingredient_name=request.ingredient_name,
            quantity=request.quantity
        )
        
        # Find the added/updated item
        added_item = next(
            (item for item in inventory.items 
             if item.ingredient_name.lower() == request.ingredient_name.lower()),
            None
        )
        
        return {
            "data": added_item.model_dump() if added_item else None,
            "meta": {
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/items/{ingredient_name}")
async def remove_inventory_item(ingredient_name: str, user_id: str = "default_user"):
    """
    Remove an item from user's inventory.
    
    Args:
        ingredient_name: Name of the ingredient to remove
        user_id: User identifier (defaults to 'default_user')
        
    Returns:
        Deletion confirmation with standardized response format
    """
    try:
        await supabase_service.remove_item(user_id=user_id, ingredient_name=ingredient_name)
        
        return {
            "data": {
                "deleted": True,
                "ingredient_name": ingredient_name
            },
            "meta": {
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        }
    except Exception as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/match-recipes")
async def match_recipes_with_inventory(user_id: str = "default_user"):
    """
    Match recipes with user's current inventory.
    
    Args:
        user_id: User identifier (defaults to 'default_user')
        
    Returns:
        Exact and partial recipe matches with standardized response format
    """
    try:
        matches = await supabase_service.match_recipes_with_inventory(user_id)
        
        return {
            "data": {
                "exact_matches": [recipe.model_dump() for recipe in matches["exact_matches"]],
                "partial_matches": matches["partial_matches"]
            },
            "meta": {
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
