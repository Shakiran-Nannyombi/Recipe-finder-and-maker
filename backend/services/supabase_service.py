"""
Supabase service for recipe storage and retrieval.
"""
import os
from typing import List, Optional
from datetime import datetime, timezone
from supabase import create_client, Client
from models.recipe import Recipe, Ingredient
from models.inventory import UserInventory, InventoryItem


class SupabaseService:
    """Service for managing recipe storage in Supabase."""
    
    def __init__(self, supabase_url: Optional[str] = None, supabase_key: Optional[str] = None):
        """
        Initialize Supabase client.
        
        Args:
            supabase_url: Supabase project URL (defaults to SUPABASE_URL env var)
            supabase_key: Supabase API key (defaults to SUPABASE_KEY env var)
        """
        self.supabase_url = supabase_url or os.getenv("SUPABASE_URL")
        self.supabase_key = supabase_key or os.getenv("SUPABASE_KEY")
        
        if not self.supabase_url or not self.supabase_key:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be provided or set as environment variables")
        
        self.client: Client = create_client(self.supabase_url, self.supabase_key)
    
    async def save_recipe(self, recipe: Recipe) -> Recipe:
        """
        Save a recipe to Supabase.
        
        Args:
            recipe: Recipe object to save
            
        Returns:
            Saved Recipe object
            
        Raises:
            Exception: If save operation fails
        """
        try:
            # Convert Recipe to dict for Supabase
            recipe_data = {
                "id": recipe.id,
                "title": recipe.title,
                "description": recipe.description,
                "ingredients": [ing.model_dump() for ing in recipe.ingredients],
                "instructions": recipe.instructions,
                "cooking_time_minutes": recipe.cooking_time_minutes,
                "servings": recipe.servings,
                "difficulty": recipe.difficulty,
                "cuisine_type": recipe.cuisine_type,
                "dietary_tags": recipe.dietary_tags,
                "image_url": recipe.image_url,
                "created_at": recipe.created_at.isoformat(),
                "embedding": recipe.embedding
            }
            
            # Insert or update recipe
            response = self.client.table("recipes").upsert(recipe_data).execute()
            
            if not response.data:
                raise Exception("Failed to save recipe to Supabase")
            
            return recipe
            
        except Exception as e:
            raise Exception(f"Error saving recipe to Supabase: {str(e)}")
    
    async def get_recipe(self, recipe_id: str) -> Optional[Recipe]:
        """
        Retrieve a recipe by ID from Supabase.
        
        Args:
            recipe_id: Unique recipe identifier
            
        Returns:
            Recipe object if found, None otherwise
            
        Raises:
            Exception: If retrieval operation fails
        """
        try:
            response = self.client.table("recipes").select("*").eq("id", recipe_id).execute()
            
            if not response.data or len(response.data) == 0:
                return None
            
            recipe_data = response.data[0]
            
            # Convert dict back to Recipe object
            return Recipe(
                id=recipe_data["id"],
                title=recipe_data["title"],
                description=recipe_data["description"],
                ingredients=[Ingredient(**ing) for ing in recipe_data["ingredients"]],
                instructions=recipe_data["instructions"],
                cooking_time_minutes=recipe_data["cooking_time_minutes"],
                servings=recipe_data["servings"],
                difficulty=recipe_data["difficulty"],
                cuisine_type=recipe_data.get("cuisine_type"),
                dietary_tags=recipe_data.get("dietary_tags", []),
                image_url=recipe_data.get("image_url"),
                created_at=datetime.fromisoformat(recipe_data["created_at"]),
                embedding=recipe_data.get("embedding")
            )
            
        except Exception as e:
            raise Exception(f"Error retrieving recipe from Supabase: {str(e)}")
    
    async def list_recipes(self, limit: int = 10, offset: int = 0) -> List[Recipe]:
        """
        List recipes with pagination.
        
        Args:
            limit: Maximum number of recipes to return (default: 10)
            offset: Number of recipes to skip (default: 0)
            
        Returns:
            List of Recipe objects
            
        Raises:
            Exception: If list operation fails
        """
        try:
            response = (
                self.client.table("recipes")
                .select("*")
                .order("created_at", desc=True)
                .range(offset, offset + limit - 1)
                .execute()
            )
            
            if not response.data:
                return []
            
            recipes = []
            for recipe_data in response.data:
                recipe = Recipe(
                    id=recipe_data["id"],
                    title=recipe_data["title"],
                    description=recipe_data["description"],
                    ingredients=[Ingredient(**ing) for ing in recipe_data["ingredients"]],
                    instructions=recipe_data["instructions"],
                    cooking_time_minutes=recipe_data["cooking_time_minutes"],
                    servings=recipe_data["servings"],
                    difficulty=recipe_data["difficulty"],
                    cuisine_type=recipe_data.get("cuisine_type"),
                    dietary_tags=recipe_data.get("dietary_tags", []),
                    image_url=recipe_data.get("image_url"),
                    created_at=datetime.fromisoformat(recipe_data["created_at"]),
                    embedding=recipe_data.get("embedding")
                )
                recipes.append(recipe)
            
            return recipes
            
        except Exception as e:
            raise Exception(f"Error listing recipes from Supabase: {str(e)}")

    async def save_inventory(self, inventory: UserInventory) -> UserInventory:
        """
        Save user inventory to Supabase.
        
        Args:
            inventory: UserInventory object to save
            
        Returns:
            Saved UserInventory object
            
        Raises:
            Exception: If save operation fails
        """
        try:
            # Convert UserInventory to dict for Supabase
            inventory_data = {
                "user_id": inventory.user_id,
                "items": [
                    {
                        "ingredient_name": item.ingredient_name,
                        "quantity": item.quantity,
                        "added_at": item.added_at.isoformat()
                    }
                    for item in inventory.items
                ],
                "updated_at": inventory.updated_at.isoformat()
            }
            
            # Insert or update inventory
            response = self.client.table("inventory").upsert(inventory_data).execute()
            
            if not response.data:
                raise Exception("Failed to save inventory to Supabase")
            
            return inventory
            
        except Exception as e:
            raise Exception(f"Error saving inventory to Supabase: {str(e)}")
    
    async def get_inventory(self, user_id: str) -> Optional[UserInventory]:
        """
        Retrieve user inventory from Supabase.
        
        Args:
            user_id: Unique user identifier
            
        Returns:
            UserInventory object if found, None otherwise
            
        Raises:
            Exception: If retrieval operation fails
        """
        try:
            response = self.client.table("inventory").select("*").eq("user_id", user_id).execute()
            
            if not response.data or len(response.data) == 0:
                return None
            
            inventory_data = response.data[0]
            
            # Convert dict back to UserInventory object
            return UserInventory(
                user_id=inventory_data["user_id"],
                items=[
                    InventoryItem(
                        ingredient_name=item["ingredient_name"],
                        quantity=item.get("quantity"),
                        added_at=datetime.fromisoformat(item["added_at"])
                    )
                    for item in inventory_data["items"]
                ],
                updated_at=datetime.fromisoformat(inventory_data["updated_at"])
            )
            
        except Exception as e:
            raise Exception(f"Error retrieving inventory from Supabase: {str(e)}")
    
    async def add_item(self, user_id: str, ingredient_name: str, quantity: Optional[str] = None) -> UserInventory:
        """
        Add an item to user inventory.
        
        Args:
            user_id: Unique user identifier
            ingredient_name: Name of the ingredient to add
            quantity: Optional quantity of the ingredient
            
        Returns:
            Updated UserInventory object
            
        Raises:
            Exception: If add operation fails
        """
        try:
            # Get existing inventory or create new one
            inventory = await self.get_inventory(user_id)
            
            if inventory is None:
                # Create new inventory
                inventory = UserInventory(
                    user_id=user_id,
                    items=[],
                    updated_at=datetime.now(timezone.utc)
                )
            
            # Check if item already exists
            existing_item = next(
                (item for item in inventory.items if item.ingredient_name.lower() == ingredient_name.lower()),
                None
            )
            
            if existing_item:
                # Update existing item
                existing_item.quantity = quantity
                existing_item.added_at = datetime.now(timezone.utc)
            else:
                # Add new item
                new_item = InventoryItem(
                    ingredient_name=ingredient_name,
                    quantity=quantity,
                    added_at=datetime.now(timezone.utc)
                )
                inventory.items.append(new_item)
            
            # Update timestamp
            inventory.updated_at = datetime.now(timezone.utc)
            
            # Save to Supabase
            return await self.save_inventory(inventory)
            
        except Exception as e:
            raise Exception(f"Error adding item to inventory: {str(e)}")
    
    async def remove_item(self, user_id: str, ingredient_name: str) -> UserInventory:
        """
        Remove an item from user inventory.
        
        Args:
            user_id: Unique user identifier
            ingredient_name: Name of the ingredient to remove
            
        Returns:
            Updated UserInventory object
            
        Raises:
            Exception: If remove operation fails or inventory not found
        """
        try:
            # Get existing inventory
            inventory = await self.get_inventory(user_id)
            
            if inventory is None:
                raise Exception(f"Inventory not found for user {user_id}")
            
            # Find and remove the item
            original_length = len(inventory.items)
            inventory.items = [
                item for item in inventory.items 
                if item.ingredient_name.lower() != ingredient_name.lower()
            ]
            
            if len(inventory.items) == original_length:
                raise Exception(f"Ingredient '{ingredient_name}' not found in inventory")
            
            # Update timestamp
            inventory.updated_at = datetime.now(timezone.utc)
            
            # Save to Supabase
            return await self.save_inventory(inventory)
            
        except Exception as e:
            raise Exception(f"Error removing item from inventory: {str(e)}")
    
    async def match_recipes_with_inventory(self, user_id: str) -> dict:
        """
        Match recipes with user's inventory.
        
        Args:
            user_id: Unique user identifier
            
        Returns:
            Dictionary with exact_matches and partial_matches lists
            
        Raises:
            Exception: If matching operation fails
        """
        try:
            # Get user inventory
            inventory = await self.get_inventory(user_id)
            
            if inventory is None or len(inventory.items) == 0:
                return {"exact_matches": [], "partial_matches": []}
            
            # Get inventory ingredient names (lowercase for comparison)
            inventory_ingredients = {item.ingredient_name.lower() for item in inventory.items}
            
            # Get all recipes
            all_recipes = await self.list_recipes(limit=100)  # Adjust limit as needed
            
            exact_matches = []
            partial_matches = []
            
            for recipe in all_recipes:
                # Get recipe ingredient names (lowercase for comparison)
                recipe_ingredients = {ing.name.lower() for ing in recipe.ingredients}
                
                # Calculate match percentage
                matching_ingredients = inventory_ingredients.intersection(recipe_ingredients)
                match_percentage = len(matching_ingredients) / len(recipe_ingredients) if recipe_ingredients else 0
                
                if match_percentage == 1.0:
                    # 100% match - all ingredients available
                    exact_matches.append(recipe)
                elif match_percentage >= 0.8:
                    # 80%+ match - partial match
                    missing_ingredients = recipe_ingredients - inventory_ingredients
                    # Add missing ingredients info to recipe (as a temporary attribute)
                    recipe_dict = recipe.model_dump()
                    recipe_dict["missing_ingredients"] = list(missing_ingredients)
                    recipe_dict["match_percentage"] = match_percentage
                    partial_matches.append(recipe_dict)
            
            return {
                "exact_matches": exact_matches,
                "partial_matches": partial_matches
            }
            
        except Exception as e:
            raise Exception(f"Error matching recipes with inventory: {str(e)}")
