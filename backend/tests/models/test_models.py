"""
Tests for Pydantic models in Recipe AI.
"""
import pytest
from pydantic import ValidationError
from models import RecipeGenerationRequest, Recipe, Ingredient, SearchRequest


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



class TestSearchRequest:
    """Test suite for SearchRequest model validation."""

    def test_valid_request_minimal(self):
        """Test valid request with only required fields."""
        request = SearchRequest(query="pasta recipes")
        assert request.query == "pasta recipes"
        assert request.available_ingredients is None
        assert request.limit == 10  # Default value

    def test_valid_request_full(self):
        """Test valid request with all fields populated."""
        request = SearchRequest(
            query="chicken dinner",
            available_ingredients=["chicken", "rice", "broccoli"],
            limit=25
        )
        assert request.query == "chicken dinner"
        assert request.available_ingredients == ["chicken", "rice", "broccoli"]
        assert request.limit == 25

    def test_empty_query_fails(self):
        """Test that empty query string raises validation error."""
        with pytest.raises(ValidationError) as exc_info:
            SearchRequest(query="")
        
        errors = exc_info.value.errors()
        assert any("query" in str(error["loc"]) for error in errors)

    def test_missing_query_fails(self):
        """Test that missing query field raises validation error."""
        with pytest.raises(ValidationError) as exc_info:
            SearchRequest()
        
        errors = exc_info.value.errors()
        assert any("query" in str(error["loc"]) for error in errors)

    def test_limit_default_value(self):
        """Test limit defaults to 10."""
        request = SearchRequest(query="test")
        assert request.limit == 10

    def test_limit_minimum_boundary(self):
        """Test limit minimum value of 1."""
        request = SearchRequest(query="test", limit=1)
        assert request.limit == 1

    def test_limit_maximum_boundary(self):
        """Test limit maximum value of 50."""
        request = SearchRequest(query="test", limit=50)
        assert request.limit == 50

    def test_limit_below_minimum_fails(self):
        """Test that limit below 1 raises validation error."""
        with pytest.raises(ValidationError) as exc_info:
            SearchRequest(query="test", limit=0)
        
        errors = exc_info.value.errors()
        assert any("limit" in str(error["loc"]) for error in errors)

    def test_limit_above_maximum_fails(self):
        """Test that limit above 50 raises validation error."""
        with pytest.raises(ValidationError) as exc_info:
            SearchRequest(query="test", limit=51)
        
        errors = exc_info.value.errors()
        assert any("limit" in str(error["loc"]) for error in errors)

    def test_available_ingredients_optional(self):
        """Test available_ingredients is optional and can be None."""
        request = SearchRequest(query="pasta")
        assert request.available_ingredients is None

    def test_available_ingredients_empty_list(self):
        """Test available_ingredients can be an empty list."""
        request = SearchRequest(query="pasta", available_ingredients=[])
        assert request.available_ingredients == []
        assert isinstance(request.available_ingredients, list)

    def test_available_ingredients_single_item(self):
        """Test available_ingredients with single ingredient."""
        request = SearchRequest(query="pasta", available_ingredients=["tomato"])
        assert len(request.available_ingredients) == 1
        assert request.available_ingredients[0] == "tomato"

    def test_available_ingredients_multiple_items(self):
        """Test available_ingredients with multiple ingredients."""
        ingredients = ["chicken", "rice", "broccoli", "garlic", "onion"]
        request = SearchRequest(query="dinner", available_ingredients=ingredients)
        assert request.available_ingredients == ingredients
        assert len(request.available_ingredients) == 5

    def test_query_with_special_characters(self):
        """Test query with special characters is accepted."""
        request = SearchRequest(query="pasta & meatballs!")
        assert request.query == "pasta & meatballs!"

    def test_query_with_numbers(self):
        """Test query with numbers is accepted."""
        request = SearchRequest(query="30-minute meals")
        assert request.query == "30-minute meals"

    def test_query_with_unicode(self):
        """Test query with unicode characters is accepted."""
        request = SearchRequest(query="crème brûlée")
        assert request.query == "crème brûlée"

    def test_model_json_serialization(self):
        """Test model can be serialized to JSON."""
        request = SearchRequest(
            query="vegetarian recipes",
            available_ingredients=["tofu", "spinach"],
            limit=20
        )
        json_data = request.model_dump()
        
        assert json_data["query"] == "vegetarian recipes"
        assert json_data["available_ingredients"] == ["tofu", "spinach"]
        assert json_data["limit"] == 20

    def test_model_json_deserialization(self):
        """Test model can be created from JSON data."""
        json_data = {
            "query": "quick breakfast",
            "available_ingredients": ["eggs", "bread", "milk"],
            "limit": 15
        }
        request = SearchRequest(**json_data)
        
        assert request.query == "quick breakfast"
        assert request.available_ingredients == ["eggs", "bread", "milk"]
        assert request.limit == 15

    def test_whitespace_only_query_accepted(self):
        """Test that whitespace-only query is accepted (Pydantic v2 behavior)."""
        request = SearchRequest(query="   ")
        assert request.query == "   "
        # Note: min_length counts characters, not trimmed length

    def test_query_with_leading_trailing_whitespace(self):
        """Test query with leading/trailing whitespace is accepted."""
        request = SearchRequest(query="  pasta recipes  ")
        assert request.query == "  pasta recipes  "

    def test_limit_string_coercion(self):
        """Test that limit as string is coerced to int (Pydantic v2 behavior)."""
        request = SearchRequest(query="test", limit="10")
        assert request.limit == 10
        assert isinstance(request.limit, int)
        # Note: Pydantic v2 automatically coerces valid string numbers to int

    def test_negative_limit_fails(self):
        """Test that negative limit raises validation error."""
        with pytest.raises(ValidationError) as exc_info:
            SearchRequest(query="test", limit=-5)
        
        errors = exc_info.value.errors()
        assert any("limit" in str(error["loc"]) for error in errors)

    def test_available_ingredients_with_whitespace(self):
        """Test ingredients with whitespace are accepted."""
        request = SearchRequest(
            query="dinner",
            available_ingredients=["chicken breast", "brown rice", "green beans"]
        )
        assert len(request.available_ingredients) == 3
        assert "chicken breast" in request.available_ingredients
