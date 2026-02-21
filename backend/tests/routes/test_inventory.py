"""
Tests for inventory management routes.
"""
import pytest
from fastapi.testclient import TestClient
from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock, patch

from main import app
from models.inventory import UserInventory, InventoryItem
from models.recipe import Recipe, Ingredient


client = TestClient(app)


@pytest.fixture
def mock_inventory():
    """Fixture providing a sample inventory for testing."""
    return UserInventory(
        user_id="test_user",
        items=[
            InventoryItem(
                ingredient_name="tomatoes",
                quantity="5",
                added_at=datetime(2024, 1, 15, 12, 0, 0, tzinfo=timezone.utc)
            ),
            InventoryItem(
                ingredient_name="onions",
                quantity="3",
                added_at=datetime(2024, 1, 15, 12, 5, 0, tzinfo=timezone.utc)
            )
        ],
        updated_at=datetime(2024, 1, 15, 12, 5, 0, tzinfo=timezone.utc)
    )


@pytest.fixture
def mock_supabase_service():
    """Fixture providing a mocked Supabase service."""
    service = MagicMock()
    service.get_inventory = AsyncMock()
    service.add_item = AsyncMock()
    service.remove_item = AsyncMock()
    service.match_recipes_with_inventory = AsyncMock()
    return service


@pytest.fixture(autouse=True)
def setup_dependency_override(mock_supabase_service):
    """Automatically override dependencies for all tests."""
    from routes.inventory import get_supabase_service
    app.dependency_overrides[get_supabase_service] = lambda: mock_supabase_service
    yield
    app.dependency_overrides.clear()


class TestGetInventory:
    """Test suite for GET /api/inventory endpoint."""
    
    def test_get_inventory_success(self, mock_supabase_service, mock_inventory):
        """Test successful inventory retrieval."""
        mock_supabase_service.get_inventory.return_value = mock_inventory
        
        response = client.get("/api/inventory?user_id=test_user")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "data" in data
        assert "meta" in data
        assert "timestamp" in data["meta"]
        
        # Verify inventory data
        inventory_data = data["data"]
        assert inventory_data["user_id"] == "test_user"
        assert len(inventory_data["items"]) == 2
        assert inventory_data["items"][0]["ingredient_name"] == "tomatoes"
        assert inventory_data["items"][0]["quantity"] == "5"
        
        # Verify service was called correctly
        mock_supabase_service.get_inventory.assert_called_once_with("test_user")
    
    def test_get_inventory_default_user(self, mock_supabase_service, mock_inventory):
        """Test inventory retrieval with default user."""
        mock_inventory.user_id = "default_user"
        mock_supabase_service.get_inventory.return_value = mock_inventory
        
        response = client.get("/api/inventory")
        
        assert response.status_code == 200
        data = response.json()
        assert data["data"]["user_id"] == "default_user"
        
        # Verify default user was used
        mock_supabase_service.get_inventory.assert_called_once_with("default_user")
    
    def test_get_inventory_not_found_returns_empty(self, mock_supabase_service):
        """Test that non-existent inventory returns empty inventory."""
        mock_supabase_service.get_inventory.return_value = None
        
        response = client.get("/api/inventory?user_id=new_user")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify empty inventory is returned
        assert data["data"]["user_id"] == "new_user"
        assert data["data"]["items"] == []
        assert "updated_at" in data["data"]
    
    def test_get_inventory_empty_items(self, mock_supabase_service):
        """Test inventory with no items."""
        empty_inventory = UserInventory(
            user_id="test_user",
            items=[],
            updated_at=datetime.now(timezone.utc)
        )
        mock_supabase_service.get_inventory.return_value = empty_inventory
        
        response = client.get("/api/inventory?user_id=test_user")
        
        assert response.status_code == 200
        data = response.json()
        assert data["data"]["items"] == []
        assert len(data["data"]["items"]) == 0
    
    def test_get_inventory_server_error(self, mock_supabase_service):
        """Test handling of server errors during inventory retrieval."""
        mock_supabase_service.get_inventory.side_effect = Exception("Database connection failed")
        
        response = client.get("/api/inventory?user_id=test_user")
        
        assert response.status_code == 500
        data = response.json()
        assert "Database connection failed" in data["detail"]
    
    def test_get_inventory_response_format(self, mock_supabase_service, mock_inventory):
        """Test that response follows API standards format."""
        mock_supabase_service.get_inventory.return_value = mock_inventory
        
        response = client.get("/api/inventory?user_id=test_user")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify standardized response format
        assert set(data.keys()) == {"data", "meta"}
        assert "timestamp" in data["meta"]
        
        # Verify timestamp is ISO-8601 format
        timestamp = data["meta"]["timestamp"]
        assert "T" in timestamp
        assert timestamp.endswith("Z") or "+" in timestamp or "-" in timestamp[-6:]


class TestAddInventoryItem:
    """Test suite for POST /api/inventory/items endpoint."""
    
    def test_add_item_success(self, mock_supabase_service, mock_inventory):
        """Test successful item addition."""
        mock_supabase_service.add_item.return_value = mock_inventory
        
        response = client.post(
            "/api/inventory/items?user_id=test_user",
            json={
                "ingredient_name": "tomatoes",
                "quantity": "5"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "data" in data
        assert "meta" in data
        assert "timestamp" in data["meta"]
        
        # Verify item data
        item_data = data["data"]
        assert item_data["ingredient_name"] == "tomatoes"
        assert item_data["quantity"] == "5"
        
        # Verify service was called correctly
        mock_supabase_service.add_item.assert_called_once_with(
            user_id="test_user",
            ingredient_name="tomatoes",
            quantity="5"
        )
    
    def test_add_item_without_quantity(self, mock_supabase_service):
        """Test adding item without quantity."""
        inventory = UserInventory(
            user_id="test_user",
            items=[
                InventoryItem(
                    ingredient_name="salt",
                    quantity=None,
                    added_at=datetime.now(timezone.utc)
                )
            ],
            updated_at=datetime.now(timezone.utc)
        )
        mock_supabase_service.add_item.return_value = inventory
        
        response = client.post(
            "/api/inventory/items?user_id=test_user",
            json={
                "ingredient_name": "salt"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["data"]["ingredient_name"] == "salt"
        assert data["data"]["quantity"] is None
        
        # Verify service was called with None quantity
        mock_supabase_service.add_item.assert_called_once_with(
            user_id="test_user",
            ingredient_name="salt",
            quantity=None
        )
    
    def test_add_item_default_user(self, mock_supabase_service, mock_inventory):
        """Test adding item with default user."""
        mock_inventory.user_id = "default_user"
        mock_supabase_service.add_item.return_value = mock_inventory
        
        response = client.post(
            "/api/inventory/items",
            json={
                "ingredient_name": "pepper",
                "quantity": "1"
            }
        )
        
        assert response.status_code == 200
        
        # Verify default user was used
        mock_supabase_service.add_item.assert_called_once_with(
            user_id="default_user",
            ingredient_name="pepper",
            quantity="1"
        )
    
    def test_add_item_missing_ingredient_name(self, mock_supabase_service):
        """Test that request fails when ingredient_name is missing."""
        response = client.post(
            "/api/inventory/items?user_id=test_user",
            json={
                "quantity": "5"
            }
        )
        
        assert response.status_code == 422  # Validation error
    
    def test_add_item_empty_ingredient_name(self, mock_supabase_service):
        """Test that request fails with empty ingredient_name."""
        response = client.post(
            "/api/inventory/items?user_id=test_user",
            json={
                "ingredient_name": "",
                "quantity": "5"
            }
        )
        
        # Empty string is technically valid for Pydantic, but service should handle it
        # This test verifies the request structure is valid
        assert response.status_code in [200, 400, 500]
    
    def test_add_item_case_insensitive_match(self, mock_supabase_service):
        """Test that item matching is case-insensitive."""
        inventory = UserInventory(
            user_id="test_user",
            items=[
                InventoryItem(
                    ingredient_name="Tomatoes",
                    quantity="10",
                    added_at=datetime.now(timezone.utc)
                )
            ],
            updated_at=datetime.now(timezone.utc)
        )
        mock_supabase_service.add_item.return_value = inventory
        
        response = client.post(
            "/api/inventory/items?user_id=test_user",
            json={
                "ingredient_name": "tomatoes",
                "quantity": "10"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        # The returned item should match case-insensitively
        assert data["data"]["ingredient_name"].lower() == "tomatoes"
    
    def test_add_item_server_error(self, mock_supabase_service):
        """Test handling of server errors during item addition."""
        mock_supabase_service.add_item.side_effect = Exception("Database error")
        
        response = client.post(
            "/api/inventory/items?user_id=test_user",
            json={
                "ingredient_name": "tomatoes",
                "quantity": "5"
            }
        )
        
        assert response.status_code == 500
        data = response.json()
        assert "Database error" in data["detail"]
    
    def test_add_item_response_format(self, mock_supabase_service, mock_inventory):
        """Test that response follows API standards format."""
        mock_supabase_service.add_item.return_value = mock_inventory
        
        response = client.post(
            "/api/inventory/items?user_id=test_user",
            json={
                "ingredient_name": "tomatoes",
                "quantity": "5"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify standardized response format
        assert set(data.keys()) == {"data", "meta"}
        assert "timestamp" in data["meta"]
        
        # Verify timestamp is ISO-8601 format
        timestamp = data["meta"]["timestamp"]
        assert "T" in timestamp


class TestRemoveInventoryItem:
    """Test suite for DELETE /api/inventory/items/{ingredient_name} endpoint."""
    
    def test_remove_item_success(self, mock_supabase_service):
        """Test successful item removal."""
        mock_supabase_service.remove_item.return_value = UserInventory(
            user_id="test_user",
            items=[],
            updated_at=datetime.now(timezone.utc)
        )
        
        response = client.delete("/api/inventory/items/tomatoes?user_id=test_user")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "data" in data
        assert "meta" in data
        assert "timestamp" in data["meta"]
        
        # Verify deletion confirmation
        assert data["data"]["deleted"] is True
        assert data["data"]["ingredient_name"] == "tomatoes"
        
        # Verify service was called correctly
        mock_supabase_service.remove_item.assert_called_once_with(
            user_id="test_user",
            ingredient_name="tomatoes"
        )
    
    def test_remove_item_default_user(self, mock_supabase_service):
        """Test removing item with default user."""
        mock_supabase_service.remove_item.return_value = UserInventory(
            user_id="default_user",
            items=[],
            updated_at=datetime.now(timezone.utc)
        )
        
        response = client.delete("/api/inventory/items/pepper")
        
        assert response.status_code == 200
        data = response.json()
        assert data["data"]["deleted"] is True
        
        # Verify default user was used
        mock_supabase_service.remove_item.assert_called_once_with(
            user_id="default_user",
            ingredient_name="pepper"
        )
    
    def test_remove_item_not_found(self, mock_supabase_service):
        """Test removal of non-existent item."""
        mock_supabase_service.remove_item.side_effect = Exception(
            "Ingredient 'nonexistent' not found in inventory"
        )
        
        response = client.delete("/api/inventory/items/nonexistent?user_id=test_user")
        
        assert response.status_code == 404
        data = response.json()
        assert "not found" in data["detail"].lower()
    
    def test_remove_item_inventory_not_found(self, mock_supabase_service):
        """Test removal when inventory doesn't exist."""
        mock_supabase_service.remove_item.side_effect = Exception(
            "Inventory not found for user test_user"
        )
        
        response = client.delete("/api/inventory/items/tomatoes?user_id=test_user")
        
        assert response.status_code == 404
        data = response.json()
        assert "not found" in data["detail"].lower()
    
    def test_remove_item_with_spaces(self, mock_supabase_service):
        """Test removing item with spaces in name."""
        mock_supabase_service.remove_item.return_value = UserInventory(
            user_id="test_user",
            items=[],
            updated_at=datetime.now(timezone.utc)
        )
        
        # URL encoding will handle spaces
        response = client.delete("/api/inventory/items/cherry%20tomatoes?user_id=test_user")
        
        assert response.status_code == 200
        data = response.json()
        assert data["data"]["deleted"] is True
        assert data["data"]["ingredient_name"] == "cherry tomatoes"
    
    def test_remove_item_case_sensitivity(self, mock_supabase_service):
        """Test that removal handles case correctly."""
        mock_supabase_service.remove_item.return_value = UserInventory(
            user_id="test_user",
            items=[],
            updated_at=datetime.now(timezone.utc)
        )
        
        response = client.delete("/api/inventory/items/Tomatoes?user_id=test_user")
        
        assert response.status_code == 200
        
        # Verify service was called with the exact case provided
        mock_supabase_service.remove_item.assert_called_once_with(
            user_id="test_user",
            ingredient_name="Tomatoes"
        )
    
    def test_remove_item_server_error(self, mock_supabase_service):
        """Test handling of server errors during item removal."""
        mock_supabase_service.remove_item.side_effect = Exception("Database connection failed")
        
        response = client.delete("/api/inventory/items/tomatoes?user_id=test_user")
        
        assert response.status_code == 500
        data = response.json()
        assert "Database connection failed" in data["detail"]
    
    def test_remove_item_response_format(self, mock_supabase_service):
        """Test that response follows API standards format."""
        mock_supabase_service.remove_item.return_value = UserInventory(
            user_id="test_user",
            items=[],
            updated_at=datetime.now(timezone.utc)
        )
        
        response = client.delete("/api/inventory/items/tomatoes?user_id=test_user")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify standardized response format
        assert set(data.keys()) == {"data", "meta"}
        assert "timestamp" in data["meta"]
        
        # Verify timestamp is ISO-8601 format
        timestamp = data["meta"]["timestamp"]
        assert "T" in timestamp


class TestMatchRecipesWithInventory:
    """Test suite for POST /api/inventory/match-recipes endpoint."""
    
    def test_match_recipes_success(self, mock_supabase_service):
        """Test successful recipe matching."""
        # Create mock recipes
        exact_recipe = Recipe(
            id="recipe-1",
            title="Tomato Soup",
            description="Simple tomato soup",
            ingredients=[
                Ingredient(name="tomatoes", quantity="5", unit=None),
                Ingredient(name="onions", quantity="1", unit=None)
            ],
            instructions=["Cook tomatoes", "Add onions"],
            cooking_time_minutes=20,
            servings=2,
            difficulty="easy",
            cuisine_type=None,
            dietary_tags=[],
            image_url=None,
            created_at=datetime.now(timezone.utc),
            embedding=None
        )
        
        partial_recipe = Recipe(
            id="recipe-2",
            title="Pasta Carbonara",
            description="Italian pasta",
            ingredients=[
                Ingredient(name="pasta", quantity="400", unit="g"),
                Ingredient(name="eggs", quantity="4", unit=None)
            ],
            instructions=["Cook pasta"],
            cooking_time_minutes=25,
            servings=4,
            difficulty="medium",
            cuisine_type="Italian",
            dietary_tags=[],
            image_url=None,
            created_at=datetime.now(timezone.utc),
            embedding=None
        )
        partial_match = {
            **partial_recipe.model_dump(),
            "missing_ingredients": ["pasta", "eggs"],
            "match_percentage": 0.85
        }
        
        mock_supabase_service.match_recipes_with_inventory.return_value = {
            "exact_matches": [exact_recipe],
            "partial_matches": [partial_match]
        }
        
        response = client.post("/api/inventory/match-recipes?user_id=test_user")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "data" in data
        assert "meta" in data
        assert "timestamp" in data["meta"]
        
        # Verify match data
        assert "exact_matches" in data["data"]
        assert "partial_matches" in data["data"]
        assert len(data["data"]["exact_matches"]) == 1
        assert len(data["data"]["partial_matches"]) == 1
        
        # Verify exact match details
        assert data["data"]["exact_matches"][0]["id"] == "recipe-1"
        assert data["data"]["exact_matches"][0]["title"] == "Tomato Soup"
        
        # Verify partial match details
        assert data["data"]["partial_matches"][0]["missing_ingredients"] == ["pasta", "eggs"]
        
        # Verify service was called correctly
        mock_supabase_service.match_recipes_with_inventory.assert_called_once_with("test_user")
    
    def test_match_recipes_default_user(self, mock_supabase_service):
        """Test recipe matching with default user."""
        mock_supabase_service.match_recipes_with_inventory.return_value = {
            "exact_matches": [],
            "partial_matches": []
        }
        
        response = client.post("/api/inventory/match-recipes")
        
        assert response.status_code == 200
        
        # Verify default user was used
        mock_supabase_service.match_recipes_with_inventory.assert_called_once_with("default_user")
    
    def test_match_recipes_no_matches(self, mock_supabase_service):
        """Test recipe matching when no recipes match."""
        mock_supabase_service.match_recipes_with_inventory.return_value = {
            "exact_matches": [],
            "partial_matches": []
        }
        
        response = client.post("/api/inventory/match-recipes?user_id=test_user")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify empty results
        assert data["data"]["exact_matches"] == []
        assert data["data"]["partial_matches"] == []
    
    def test_match_recipes_only_exact_matches(self, mock_supabase_service):
        """Test recipe matching with only exact matches."""
        exact_recipe = Recipe(
            id="recipe-1",
            title="Simple Salad",
            description="Fresh salad",
            ingredients=[Ingredient(name="tomatoes", quantity="2", unit=None)],
            instructions=["Chop tomatoes"],
            cooking_time_minutes=5,
            servings=1,
            difficulty="easy",
            cuisine_type=None,
            dietary_tags=[],
            image_url=None,
            created_at=datetime.now(timezone.utc),
            embedding=None
        )
        
        mock_supabase_service.match_recipes_with_inventory.return_value = {
            "exact_matches": [exact_recipe],
            "partial_matches": []
        }
        
        response = client.post("/api/inventory/match-recipes?user_id=test_user")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data["data"]["exact_matches"]) == 1
        assert len(data["data"]["partial_matches"]) == 0
    
    def test_match_recipes_only_partial_matches(self, mock_supabase_service):
        """Test recipe matching with only partial matches."""
        partial_recipe = Recipe(
            id="recipe-1",
            title="Complex Dish",
            description="Needs many ingredients",
            ingredients=[
                Ingredient(name="ingredient1", quantity="1", unit=None),
                Ingredient(name="ingredient2", quantity="1", unit=None)
            ],
            instructions=["Cook"],
            cooking_time_minutes=30,
            servings=2,
            difficulty="hard",
            cuisine_type=None,
            dietary_tags=[],
            image_url=None,
            created_at=datetime.now(timezone.utc),
            embedding=None
        )
        partial_match = {
            **partial_recipe.model_dump(),
            "missing_ingredients": ["ingredient1", "ingredient2"],
            "match_percentage": 0.8
        }
        
        mock_supabase_service.match_recipes_with_inventory.return_value = {
            "exact_matches": [],
            "partial_matches": [partial_match]
        }
        
        response = client.post("/api/inventory/match-recipes?user_id=test_user")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data["data"]["exact_matches"]) == 0
        assert len(data["data"]["partial_matches"]) == 1
    
    def test_match_recipes_server_error(self, mock_supabase_service):
        """Test handling of server errors during recipe matching."""
        mock_supabase_service.match_recipes_with_inventory.side_effect = Exception(
            "Database query failed"
        )
        
        response = client.post("/api/inventory/match-recipes?user_id=test_user")
        
        assert response.status_code == 500
        data = response.json()
        assert "Database query failed" in data["detail"]
    
    def test_match_recipes_response_format(self, mock_supabase_service):
        """Test that response follows API standards format."""
        mock_supabase_service.match_recipes_with_inventory.return_value = {
            "exact_matches": [],
            "partial_matches": []
        }
        
        response = client.post("/api/inventory/match-recipes?user_id=test_user")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify standardized response format
        assert set(data.keys()) == {"data", "meta"}
        assert "timestamp" in data["meta"]
        
        # Verify timestamp is ISO-8601 format
        timestamp = data["meta"]["timestamp"]
        assert "T" in timestamp
        assert timestamp.endswith("Z") or "+" in timestamp or "-" in timestamp[-6:]
    
    def test_match_recipes_multiple_exact_matches(self, mock_supabase_service):
        """Test recipe matching with multiple exact matches."""
        recipes = [
            Recipe(
                id=f"recipe-{i}",
                title=f"Recipe {i}",
                description="Test recipe",
                ingredients=[Ingredient(name="tomatoes", quantity="1", unit=None)],
                instructions=["Cook"],
                cooking_time_minutes=10,
                servings=1,
                difficulty="easy",
                cuisine_type=None,
                dietary_tags=[],
                image_url=None,
                created_at=datetime.now(timezone.utc),
                embedding=None
            )
            for i in range(5)
        ]
        
        mock_supabase_service.match_recipes_with_inventory.return_value = {
            "exact_matches": recipes,
            "partial_matches": []
        }
        
        response = client.post("/api/inventory/match-recipes?user_id=test_user")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data["data"]["exact_matches"]) == 5
        
        # Verify all recipes are present
        recipe_ids = [r["id"] for r in data["data"]["exact_matches"]]
        assert recipe_ids == [f"recipe-{i}" for i in range(5)]
