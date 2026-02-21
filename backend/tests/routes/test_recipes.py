"""
Tests for recipe generation routes.
"""
import pytest
from fastapi.testclient import TestClient
from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock

from main import app
from models.recipe import Recipe, Ingredient
from routes.recipes import get_llm_service


client = TestClient(app)


@pytest.fixture
def mock_recipe():
    """Fixture providing a sample recipe for testing."""
    return Recipe(
        id="test-recipe-123",
        title="Delicious Pasta Carbonara",
        description="A classic Italian pasta dish with eggs, cheese, and bacon.",
        ingredients=[
            Ingredient(name="pasta", quantity="400", unit="g"),
            Ingredient(name="eggs", quantity="4", unit=None),
            Ingredient(name="parmesan cheese", quantity="100", unit="g"),
            Ingredient(name="bacon", quantity="200", unit="g")
        ],
        instructions=[
            "Step 1: Boil pasta in salted water until al dente",
            "Step 2: Fry bacon until crispy",
            "Step 3: Mix eggs and cheese in a bowl",
            "Step 4: Combine hot pasta with bacon and egg mixture",
            "Step 5: Serve immediately with extra cheese"
        ],
        cooking_time_minutes=25,
        servings=4,
        difficulty="medium",
        cuisine_type="Italian",
        dietary_tags=[],
        image_url=None,
        created_at=datetime.now(timezone.utc),
        embedding=None
    )


@pytest.fixture
def mock_llm_service():
    """Fixture providing a mocked LLM service."""
    service = MagicMock()
    service.generate_recipe = AsyncMock()
    return service


class TestRecipeGeneration:
    """Test suite for POST /api/recipes/generate endpoint."""
    
    def test_generate_recipe_success(self, mock_llm_service, mock_recipe):
        """Test successful recipe generation with valid input."""
        # Mock the LLM service to return a recipe
        mock_llm_service.generate_recipe.return_value = mock_recipe
        
        # Override dependency
        app.dependency_overrides[get_llm_service] = lambda: mock_llm_service
        
        try:
            # Make request
            response = client.post(
                "/api/recipes/generate",
                json={
                    "ingredients": ["pasta", "eggs", "cheese", "bacon"],
                    "dietary_restrictions": [],
                    "cuisine_type": "Italian",
                    "difficulty": "medium"
                }
            )
            
            # Assert response
            assert response.status_code == 200
            data = response.json()
            
            # Verify response structure
            assert "data" in data
            assert "meta" in data
            assert "timestamp" in data["meta"]
            
            # Verify recipe data
            recipe_data = data["data"]
            assert recipe_data["title"] == "Delicious Pasta Carbonara"
            assert recipe_data["difficulty"] == "medium"
            assert recipe_data["cuisine_type"] == "Italian"
            assert len(recipe_data["ingredients"]) == 4
            assert len(recipe_data["instructions"]) == 5
            
            # Verify LLM service was called correctly
            mock_llm_service.generate_recipe.assert_called_once_with(
                ingredients=["pasta", "eggs", "cheese", "bacon"],
                dietary_restrictions=[],
                cuisine_type="Italian",
                difficulty="medium"
            )
        finally:
            # Clean up dependency override
            app.dependency_overrides.clear()
    
    def test_generate_recipe_minimal_input(self, mock_llm_service, mock_recipe):
        """Test recipe generation with only required fields."""
        mock_llm_service.generate_recipe.return_value = mock_recipe
        app.dependency_overrides[get_llm_service] = lambda: mock_llm_service
        
        try:
            response = client.post(
                "/api/recipes/generate",
                json={
                    "ingredients": ["tomatoes", "onions"]
                }
            )
            
            assert response.status_code == 200
            data = response.json()
            assert "data" in data
            assert "meta" in data
            
            # Verify defaults were used
            mock_llm_service.generate_recipe.assert_called_once_with(
                ingredients=["tomatoes", "onions"],
                dietary_restrictions=[],
                cuisine_type=None,
                difficulty=None
            )
        finally:
            app.dependency_overrides.clear()
    
    def test_generate_recipe_with_dietary_restrictions(self, mock_llm_service, mock_recipe):
        """Test recipe generation with dietary restrictions."""
        # Modify mock recipe to be vegetarian
        mock_recipe.dietary_tags = ["vegetarian", "gluten-free"]
        mock_llm_service.generate_recipe.return_value = mock_recipe
        app.dependency_overrides[get_llm_service] = lambda: mock_llm_service
        
        try:
            response = client.post(
                "/api/recipes/generate",
                json={
                    "ingredients": ["tofu", "vegetables", "rice"],
                    "dietary_restrictions": ["vegetarian", "gluten-free"]
                }
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data["data"]["dietary_tags"] == ["vegetarian", "gluten-free"]
            
            mock_llm_service.generate_recipe.assert_called_once_with(
                ingredients=["tofu", "vegetables", "rice"],
                dietary_restrictions=["vegetarian", "gluten-free"],
                cuisine_type=None,
                difficulty=None
            )
        finally:
            app.dependency_overrides.clear()
    
    def test_generate_recipe_missing_ingredients(self, mock_llm_service):
        """Test that request fails when ingredients are missing."""
        # Override dependency even though we won't use it
        app.dependency_overrides[get_llm_service] = lambda: mock_llm_service
        
        try:
            response = client.post(
                "/api/recipes/generate",
                json={
                    "dietary_restrictions": ["vegan"]
                }
            )
            
            assert response.status_code == 422  # Validation error
        finally:
            app.dependency_overrides.clear()
    
    def test_generate_recipe_empty_ingredients(self, mock_llm_service):
        """Test that request fails when ingredients list is empty."""
        # Override dependency even though we won't use it
        app.dependency_overrides[get_llm_service] = lambda: mock_llm_service
        
        try:
            response = client.post(
                "/api/recipes/generate",
                json={
                    "ingredients": []
                }
            )
            
            assert response.status_code == 422  # Validation error
        finally:
            app.dependency_overrides.clear()
    
    def test_generate_recipe_invalid_difficulty(self, mock_llm_service):
        """Test that request fails with invalid difficulty level."""
        # Override dependency even though we won't use it
        app.dependency_overrides[get_llm_service] = lambda: mock_llm_service
        
        try:
            response = client.post(
                "/api/recipes/generate",
                json={
                    "ingredients": ["chicken", "rice"],
                    "difficulty": "super-hard"  # Invalid value
                }
            )
            
            assert response.status_code == 422  # Validation error
        finally:
            app.dependency_overrides.clear()
    
    def test_generate_recipe_value_error(self, mock_llm_service):
        """Test handling of ValueError from LLM service."""
        mock_llm_service.generate_recipe.side_effect = ValueError("Invalid prompt format")
        app.dependency_overrides[get_llm_service] = lambda: mock_llm_service
        
        try:
            response = client.post(
                "/api/recipes/generate",
                json={
                    "ingredients": ["pasta", "sauce"]
                }
            )
            
            assert response.status_code == 400
            data = response.json()
            assert "Invalid request" in data["detail"]
        finally:
            app.dependency_overrides.clear()
    
    def test_generate_recipe_timeout_error(self, mock_llm_service):
        """Test handling of TimeoutError from LLM service."""
        mock_llm_service.generate_recipe.side_effect = TimeoutError("Request timed out")
        app.dependency_overrides[get_llm_service] = lambda: mock_llm_service
        
        try:
            response = client.post(
                "/api/recipes/generate",
                json={
                    "ingredients": ["beef", "potatoes"]
                }
            )
            
            assert response.status_code == 504
            data = response.json()
            assert "timed out" in data["detail"].lower()
        finally:
            app.dependency_overrides.clear()
    
    def test_generate_recipe_connection_error(self, mock_llm_service):
        """Test handling of ConnectionError from LLM service."""
        mock_llm_service.generate_recipe.side_effect = ConnectionError("Network error")
        app.dependency_overrides[get_llm_service] = lambda: mock_llm_service
        
        try:
            response = client.post(
                "/api/recipes/generate",
                json={
                    "ingredients": ["fish", "lemon"]
                }
            )
            
            assert response.status_code == 503
            data = response.json()
            assert "unavailable" in data["detail"].lower()
        finally:
            app.dependency_overrides.clear()
    
    def test_generate_recipe_runtime_error(self, mock_llm_service):
        """Test handling of RuntimeError from LLM service."""
        mock_llm_service.generate_recipe.side_effect = RuntimeError("LLM API failure")
        app.dependency_overrides[get_llm_service] = lambda: mock_llm_service
        
        try:
            response = client.post(
                "/api/recipes/generate",
                json={
                    "ingredients": ["chicken", "vegetables"]
                }
            )
            
            assert response.status_code == 500
            data = response.json()
            assert "generation failed" in data["detail"].lower()
        finally:
            app.dependency_overrides.clear()
    
    def test_generate_recipe_unexpected_error(self, mock_llm_service):
        """Test handling of unexpected errors."""
        mock_llm_service.generate_recipe.side_effect = Exception("Unexpected error")
        app.dependency_overrides[get_llm_service] = lambda: mock_llm_service
        
        try:
            response = client.post(
                "/api/recipes/generate",
                json={
                    "ingredients": ["eggs", "milk"]
                }
            )
            
            assert response.status_code == 500
            data = response.json()
            assert "Unexpected error" in data["detail"]
        finally:
            app.dependency_overrides.clear()
    
    def test_generate_recipe_response_format(self, mock_llm_service, mock_recipe):
        """Test that response follows API standards format."""
        mock_llm_service.generate_recipe.return_value = mock_recipe
        app.dependency_overrides[get_llm_service] = lambda: mock_llm_service
        
        try:
            response = client.post(
                "/api/recipes/generate",
                json={
                    "ingredients": ["pasta", "tomatoes"]
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
            assert timestamp.endswith("Z") or "+" in timestamp or "-" in timestamp[-6:]
        finally:
            app.dependency_overrides.clear()
    
    def test_generate_recipe_all_cuisines(self, mock_llm_service, mock_recipe):
        """Test recipe generation with various cuisine types."""
        cuisines = ["Italian", "Mexican", "Asian", "French", "Indian"]
        app.dependency_overrides[get_llm_service] = lambda: mock_llm_service
        
        try:
            for cuisine in cuisines:
                mock_recipe.cuisine_type = cuisine
                mock_llm_service.generate_recipe.return_value = mock_recipe
                
                response = client.post(
                    "/api/recipes/generate",
                    json={
                        "ingredients": ["chicken", "rice"],
                        "cuisine_type": cuisine
                    }
                )
                
                assert response.status_code == 200
                data = response.json()
                assert data["data"]["cuisine_type"] == cuisine
        finally:
            app.dependency_overrides.clear()
    
    def test_generate_recipe_all_difficulties(self, mock_llm_service, mock_recipe):
        """Test recipe generation with all difficulty levels."""
        difficulties = ["easy", "medium", "hard"]
        app.dependency_overrides[get_llm_service] = lambda: mock_llm_service
        
        try:
            for difficulty in difficulties:
                mock_recipe.difficulty = difficulty
                mock_llm_service.generate_recipe.return_value = mock_recipe
                
                response = client.post(
                    "/api/recipes/generate",
                    json={
                        "ingredients": ["pasta", "sauce"],
                        "difficulty": difficulty
                    }
                )
                
                assert response.status_code == 200
                data = response.json()
                assert data["data"]["difficulty"] == difficulty
        finally:
            app.dependency_overrides.clear()


@pytest.fixture
def mock_supabase_service():
    """Fixture providing a mocked Supabase service."""
    service = MagicMock()
    service.get_recipe = AsyncMock()
    service.list_recipes = AsyncMock()
    return service


class TestRecipeRetrieval:
    """Test suite for GET /api/recipes/{recipe_id} endpoint."""
    
    def test_get_recipe_success(self, mock_supabase_service, mock_recipe):
        """Test successful recipe retrieval by ID."""
        from routes.recipes import get_supabase_service
        
        # Mock the Supabase service to return a recipe
        mock_supabase_service.get_recipe.return_value = mock_recipe
        
        # Override dependency
        app.dependency_overrides[get_supabase_service] = lambda: mock_supabase_service
        
        try:
            # Make request
            response = client.get("/api/recipes/test-recipe-123")
            
            # Assert response
            assert response.status_code == 200
            data = response.json()
            
            # Verify response structure
            assert "data" in data
            assert "meta" in data
            assert "timestamp" in data["meta"]
            
            # Verify recipe data
            recipe_data = data["data"]
            assert recipe_data["id"] == "test-recipe-123"
            assert recipe_data["title"] == "Delicious Pasta Carbonara"
            assert recipe_data["difficulty"] == "medium"
            
            # Verify Supabase service was called correctly
            mock_supabase_service.get_recipe.assert_called_once_with("test-recipe-123")
        finally:
            # Clean up dependency override
            app.dependency_overrides.clear()
    
    def test_get_recipe_not_found(self, mock_supabase_service):
        """Test recipe retrieval when recipe doesn't exist."""
        from routes.recipes import get_supabase_service
        
        # Mock the Supabase service to return None
        mock_supabase_service.get_recipe.return_value = None
        
        # Override dependency
        app.dependency_overrides[get_supabase_service] = lambda: mock_supabase_service
        
        try:
            # Make request
            response = client.get("/api/recipes/nonexistent-recipe")
            
            # Assert 404 response
            assert response.status_code == 404
            data = response.json()
            assert "not found" in data["detail"].lower()
            assert "nonexistent-recipe" in data["detail"]
            
            # Verify Supabase service was called
            mock_supabase_service.get_recipe.assert_called_once_with("nonexistent-recipe")
        finally:
            app.dependency_overrides.clear()
    
    def test_get_recipe_server_error(self, mock_supabase_service):
        """Test handling of server errors during recipe retrieval."""
        from routes.recipes import get_supabase_service
        
        # Mock the Supabase service to raise an exception
        mock_supabase_service.get_recipe.side_effect = Exception("Database connection failed")
        
        # Override dependency
        app.dependency_overrides[get_supabase_service] = lambda: mock_supabase_service
        
        try:
            # Make request
            response = client.get("/api/recipes/test-recipe-123")
            
            # Assert 500 response
            assert response.status_code == 500
            data = response.json()
            assert "Error retrieving recipe" in data["detail"]
        finally:
            app.dependency_overrides.clear()
    
    def test_get_recipe_response_format(self, mock_supabase_service, mock_recipe):
        """Test that response follows API standards format."""
        from routes.recipes import get_supabase_service
        
        mock_supabase_service.get_recipe.return_value = mock_recipe
        app.dependency_overrides[get_supabase_service] = lambda: mock_supabase_service
        
        try:
            response = client.get("/api/recipes/test-recipe-123")
            
            assert response.status_code == 200
            data = response.json()
            
            # Verify standardized response format
            assert set(data.keys()) == {"data", "meta"}
            assert "timestamp" in data["meta"]
            
            # Verify timestamp is ISO-8601 format
            timestamp = data["meta"]["timestamp"]
            assert "T" in timestamp
            assert timestamp.endswith("Z") or "+" in timestamp or "-" in timestamp[-6:]
        finally:
            app.dependency_overrides.clear()


class TestRecipeList:
    """Test suite for GET /api/recipes endpoint."""
    
    def test_list_recipes_default_pagination(self, mock_supabase_service, mock_recipe):
        """Test listing recipes with default pagination parameters."""
        from routes.recipes import get_supabase_service
        
        # Create multiple mock recipes
        recipes = [
            Recipe(**{**mock_recipe.model_dump(), "id": f"recipe-{i}", "title": f"Recipe {i}"})
            for i in range(5)
        ]
        mock_supabase_service.list_recipes.return_value = recipes
        
        # Override dependency
        app.dependency_overrides[get_supabase_service] = lambda: mock_supabase_service
        
        try:
            # Make request without query params
            response = client.get("/api/recipes")
            
            # Assert response
            assert response.status_code == 200
            data = response.json()
            
            # Verify response structure
            assert "data" in data
            assert "meta" in data
            assert "timestamp" in data["meta"]
            assert "limit" in data["meta"]
            assert "offset" in data["meta"]
            assert "count" in data["meta"]
            
            # Verify default pagination
            assert data["meta"]["limit"] == 10
            assert data["meta"]["offset"] == 0
            assert data["meta"]["count"] == 5
            
            # Verify recipe data
            assert len(data["data"]) == 5
            assert data["data"][0]["id"] == "recipe-0"
            
            # Verify Supabase service was called with defaults
            mock_supabase_service.list_recipes.assert_called_once_with(limit=10, offset=0)
        finally:
            app.dependency_overrides.clear()
    
    def test_list_recipes_custom_pagination(self, mock_supabase_service, mock_recipe):
        """Test listing recipes with custom pagination parameters."""
        from routes.recipes import get_supabase_service
        
        # Create mock recipes
        recipes = [
            Recipe(**{**mock_recipe.model_dump(), "id": f"recipe-{i}", "title": f"Recipe {i}"})
            for i in range(20, 25)
        ]
        mock_supabase_service.list_recipes.return_value = recipes
        
        # Override dependency
        app.dependency_overrides[get_supabase_service] = lambda: mock_supabase_service
        
        try:
            # Make request with custom pagination
            response = client.get("/api/recipes?limit=5&offset=20")
            
            # Assert response
            assert response.status_code == 200
            data = response.json()
            
            # Verify custom pagination
            assert data["meta"]["limit"] == 5
            assert data["meta"]["offset"] == 20
            assert data["meta"]["count"] == 5
            
            # Verify Supabase service was called with custom params
            mock_supabase_service.list_recipes.assert_called_once_with(limit=5, offset=20)
        finally:
            app.dependency_overrides.clear()
    
    def test_list_recipes_empty_result(self, mock_supabase_service):
        """Test listing recipes when no recipes exist."""
        from routes.recipes import get_supabase_service
        
        # Mock empty list
        mock_supabase_service.list_recipes.return_value = []
        
        # Override dependency
        app.dependency_overrides[get_supabase_service] = lambda: mock_supabase_service
        
        try:
            # Make request
            response = client.get("/api/recipes")
            
            # Assert response
            assert response.status_code == 200
            data = response.json()
            
            # Verify empty data
            assert data["data"] == []
            assert data["meta"]["count"] == 0
        finally:
            app.dependency_overrides.clear()
    
    def test_list_recipes_limit_validation(self, mock_supabase_service):
        """Test that limit parameter is validated (1-50)."""
        from routes.recipes import get_supabase_service
        
        app.dependency_overrides[get_supabase_service] = lambda: mock_supabase_service
        
        try:
            # Test limit too low
            response = client.get("/api/recipes?limit=0")
            assert response.status_code == 422  # Validation error
            
            # Test limit too high
            response = client.get("/api/recipes?limit=100")
            assert response.status_code == 422  # Validation error
            
            # Test valid limits
            mock_supabase_service.list_recipes.return_value = []
            
            response = client.get("/api/recipes?limit=1")
            assert response.status_code == 200
            
            response = client.get("/api/recipes?limit=50")
            assert response.status_code == 200
        finally:
            app.dependency_overrides.clear()
    
    def test_list_recipes_offset_validation(self, mock_supabase_service):
        """Test that offset parameter is validated (>= 0)."""
        from routes.recipes import get_supabase_service
        
        app.dependency_overrides[get_supabase_service] = lambda: mock_supabase_service
        
        try:
            # Test negative offset
            response = client.get("/api/recipes?offset=-1")
            assert response.status_code == 422  # Validation error
            
            # Test valid offset
            mock_supabase_service.list_recipes.return_value = []
            response = client.get("/api/recipes?offset=0")
            assert response.status_code == 200
            
            response = client.get("/api/recipes?offset=100")
            assert response.status_code == 200
        finally:
            app.dependency_overrides.clear()
    
    def test_list_recipes_server_error(self, mock_supabase_service):
        """Test handling of server errors during recipe listing."""
        from routes.recipes import get_supabase_service
        
        # Mock the Supabase service to raise an exception
        mock_supabase_service.list_recipes.side_effect = Exception("Database connection failed")
        
        # Override dependency
        app.dependency_overrides[get_supabase_service] = lambda: mock_supabase_service
        
        try:
            # Make request
            response = client.get("/api/recipes")
            
            # Assert 500 response
            assert response.status_code == 500
            data = response.json()
            assert "Error listing recipes" in data["detail"]
        finally:
            app.dependency_overrides.clear()
    
    def test_list_recipes_response_format(self, mock_supabase_service, mock_recipe):
        """Test that response follows API standards format."""
        from routes.recipes import get_supabase_service
        
        recipes = [mock_recipe]
        mock_supabase_service.list_recipes.return_value = recipes
        app.dependency_overrides[get_supabase_service] = lambda: mock_supabase_service
        
        try:
            response = client.get("/api/recipes")
            
            assert response.status_code == 200
            data = response.json()
            
            # Verify standardized response format
            assert set(data.keys()) == {"data", "meta"}
            assert "timestamp" in data["meta"]
            assert "limit" in data["meta"]
            assert "offset" in data["meta"]
            assert "count" in data["meta"]
            
            # Verify timestamp is ISO-8601 format
            timestamp = data["meta"]["timestamp"]
            assert "T" in timestamp
            assert timestamp.endswith("Z") or "+" in timestamp or "-" in timestamp[-6:]
            
            # Verify data is a list
            assert isinstance(data["data"], list)
        finally:
            app.dependency_overrides.clear()
    
    def test_list_recipes_max_limit(self, mock_supabase_service, mock_recipe):
        """Test listing recipes with maximum allowed limit."""
        from routes.recipes import get_supabase_service
        
        # Create 50 mock recipes
        recipes = [
            Recipe(**{**mock_recipe.model_dump(), "id": f"recipe-{i}", "title": f"Recipe {i}"})
            for i in range(50)
        ]
        mock_supabase_service.list_recipes.return_value = recipes
        
        # Override dependency
        app.dependency_overrides[get_supabase_service] = lambda: mock_supabase_service
        
        try:
            # Make request with max limit
            response = client.get("/api/recipes?limit=50")
            
            # Assert response
            assert response.status_code == 200
            data = response.json()
            
            # Verify max limit
            assert data["meta"]["limit"] == 50
            assert data["meta"]["count"] == 50
            assert len(data["data"]) == 50
            
            # Verify Supabase service was called with max limit
            mock_supabase_service.list_recipes.assert_called_once_with(limit=50, offset=0)
        finally:
            app.dependency_overrides.clear()
