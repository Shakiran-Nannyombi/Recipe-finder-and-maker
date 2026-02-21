"""
Inventory management routes for Recipe AI.
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone

from services.supabase_service import SupabaseService
from models.inventory import UserInventory, InventoryItem
from models.auth import User
from routes.auth import get_current_user

router = APIRouter(prefix="/api/inventory", tags=["inventory"])


def get_supabase_service() -> SupabaseService:
    """Dependency to get Supabase service instance."""
    return SupabaseService()


class AddItemRequest(BaseModel):
    """Request model for adding an item to inventory."""
    ingredient_name: str
    quantity: Optional[str] = None


@router.get("")
async def get_inventory(
    current_user: User = Depends(get_current_user),
    supabase_service: SupabaseService = Depends(get_supabase_service)
):
    """
    Get authenticated user's inventory.
    """
    user_id = current_user.id
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
async def add_inventory_item(
    request: AddItemRequest,
    current_user: User = Depends(get_current_user),
    supabase_service: SupabaseService = Depends(get_supabase_service)
):
    """
    Add an item to authenticated user's inventory.
    """
    user_id = current_user.id
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
async def remove_inventory_item(
    ingredient_name: str,
    current_user: User = Depends(get_current_user),
    supabase_service: SupabaseService = Depends(get_supabase_service)
):
    """
    Remove an item from authenticated user's inventory.
    """
    user_id = current_user.id
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
async def match_recipes_with_inventory(
    current_user: User = Depends(get_current_user),
    supabase_service: SupabaseService = Depends(get_supabase_service)
):
    """
    Match recipes with authenticated user's current inventory.
    """
    user_id = current_user.id
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
