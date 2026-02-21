"""
Data models for FlavorForge AI.

This package contains Pydantic models for request/response validation
and data structures used throughout the application.
"""
from .recipe import Ingredient, Recipe, RecipeGenerationRequest
from .inventory import InventoryItem, UserInventory

__all__ = ["Ingredient", "Recipe", "RecipeGenerationRequest", "InventoryItem", "UserInventory"]
