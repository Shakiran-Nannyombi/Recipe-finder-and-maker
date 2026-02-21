"""
Tests for Pydantic models in FlavorForge AI.
"""
import pytest
from pydantic import ValidationError
from models import RecipeGenerationRequest, Recipe, Ingredient


class TestRecipeGenerationRequest:
    """Test suite for RecipeGenerationRequest model validation."""

    def test_valid_request_minimal(self):
        """Test valid request with only required fields."""
        request = RecipeGenerationRequest(
            ingredients=["chicken", "rice", "tomatoes"]
        )
        assert request.ingredients == ["chicken", "rice", "tomatoes"]
        assert request.dietary_restrictions == []
        assert request.cuisine_type is None
        assert request.difficulty is None

    def test_valid_request_full(self):
        """Test valid request with all fields populated."""
        request = RecipeGenerationRequest(
            ingredients=["chicken", "rice", "tomatoes"],
            dietary_restrictions=["gluten-free", "dairy-free"],
            cuisine_type="Italian",
            difficulty="medium"
        )
        assert request.ingredients == ["chicken", "rice", "tomatoes"]
        assert request.dietary_restrictions == ["gluten-free", "dairy-free"]
        assert request.cuisine_type == "Italian"
        assert request.difficulty == "medium"

    def test_valid_difficulty_levels(self):
        """Test all valid difficulty levels are accepted."""
        for difficulty in ["easy", "medium", "hard"]:
            request = RecipeGenerationRequest(
                ingredients=["chicken"],
                difficulty=difficulty
            )
            assert request.difficulty == difficulty

    def test_empty_ingredients_list_fails(self):
        """Test that empty ingredients list raises validation error."""
        with pytest.raises(ValidationError) as exc_info:
            RecipeGenerationRequest(ingredients=[])
        
        errors = exc_info.value.errors()
        assert any("ingredients" in str(error["loc"]) for error in errors)

    def test_missing_ingredients_fails(self):
        """Test that missing ingredients field raises validation error."""
        with pytest.raises(ValidationError) as exc_info:
            RecipeGenerationRequest()
        
        errors = exc_info.value.errors()
        assert any("ingredients" in str(error["loc"]) for error in errors)

    def test_invalid_difficulty_fails(self):
        """Test that invalid difficulty level raises validation error."""
        with pytest.raises(ValidationError) as exc_info:
            RecipeGenerationRequest(
                ingredients=["chicken"],
                difficulty="super-hard"
            )
        
        errors = exc_info.value.errors()
        assert any("difficulty" in str(error["loc"]) for error in errors)

    def test_single_ingredient(self):
        """Test request with single ingredient is valid."""
        request = RecipeGenerationRequest(ingredients=["egg"])
        assert len(request.ingredients) == 1
        assert request.ingredients[0] == "egg"

    def test_many_ingredients(self):
        """Test request with many ingredients is valid."""
        ingredients = [f"ingredient_{i}" for i in range(20)]
        request = RecipeGenerationRequest(ingredients=ingredients)
        assert len(request.ingredients) == 20

    def test_empty_dietary_restrictions_default(self):
        """Test dietary_restrictions defaults to empty list."""
        request = RecipeGenerationRequest(ingredients=["chicken"])
        assert request.dietary_restrictions == []
        assert isinstance(request.dietary_restrictions, list)

    def test_multiple_dietary_restrictions(self):
        """Test multiple dietary restrictions are accepted."""
        restrictions = ["vegetarian", "gluten-free", "nut-free", "dairy-free"]
        request = RecipeGenerationRequest(
            ingredients=["tofu"],
            dietary_restrictions=restrictions
        )
        assert request.dietary_restrictions == restrictions

    def test_cuisine_type_optional(self):
        """Test cuisine_type is optional and can be None."""
        request = RecipeGenerationRequest(ingredients=["chicken"])
        assert request.cuisine_type is None

    def test_various_cuisine_types(self):
        """Test various cuisine types are accepted."""
        cuisines = ["Italian", "Mexican", "Asian", "French", "Indian"]
        for cuisine in cuisines:
            request = RecipeGenerationRequest(
                ingredients=["chicken"],
                cuisine_type=cuisine
            )
            assert request.cuisine_type == cuisine

    def test_model_json_serialization(self):
        """Test model can be serialized to JSON."""
        request = RecipeGenerationRequest(
            ingredients=["chicken", "rice"],
            dietary_restrictions=["gluten-free"],
            cuisine_type="Asian",
            difficulty="easy"
        )
        json_data = request.model_dump()
        
        assert json_data["ingredients"] == ["chicken", "rice"]
        assert json_data["dietary_restrictions"] == ["gluten-free"]
        assert json_data["cuisine_type"] == "Asian"
        assert json_data["difficulty"] == "easy"

    def test_model_json_deserialization(self):
        """Test model can be created from JSON data."""
        json_data = {
            "ingredients": ["beef", "potatoes"],
            "dietary_restrictions": ["dairy-free"],
            "cuisine_type": "American",
            "difficulty": "medium"
        }
        request = RecipeGenerationRequest(**json_data)
        
        assert request.ingredients == ["beef", "potatoes"]
        assert request.dietary_restrictions == ["dairy-free"]
        assert request.cuisine_type == "American"
        assert request.difficulty == "medium"

    def test_case_sensitive_difficulty(self):
        """Test difficulty validation is case-sensitive."""
        with pytest.raises(ValidationError):
            RecipeGenerationRequest(
                ingredients=["chicken"],
                difficulty="Easy"  # Should be lowercase
            )

    def test_whitespace_in_ingredients(self):
        """Test ingredients with whitespace are accepted."""
        request = RecipeGenerationRequest(
            ingredients=["chicken breast", "brown rice", "cherry tomatoes"]
        )
        assert len(request.ingredients) == 3
        assert "chicken breast" in request.ingredients
