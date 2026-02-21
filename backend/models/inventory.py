"""
Inventory data models for Recipe AI.
"""
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class InventoryItem(BaseModel):
    """Model for a single inventory item."""
    ingredient_name: str
    quantity: Optional[str] = None
    added_at: datetime


class UserInventory(BaseModel):
    """Model for user's complete inventory."""
    user_id: str
    items: List[InventoryItem]
    updated_at: datetime
