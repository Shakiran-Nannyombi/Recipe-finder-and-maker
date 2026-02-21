"""
Unit tests for LLM Service with mocked Hugging Face Inference API calls.
"""
import pytest
import json
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime
from pydantic import ValidationError

from services.llm_service import LLMService
from models.recipe import Recipe, Ingredient


class TestLLMServiceInitialization:
    """Test LLMService initialization."""
    
    @patch('services.llm_service.InferenceClient')
    def test_init_with_defaults(self, mock_client):
        """Test initialization with default parameters."""
        service = LLMService(api_token="test_token")
        
        assert service.model_name == "mistralai/Mistral-7B-Instruct-v0.2"
        assert service.api_token == "test_token"
        mock_client.assert_called_once_with(token="test_token")
        
    @patch('services.llm_service.InferenceClient')
    def test_init_with_custom_model(self, mock_client):
        """Test initialization with custom model name."""
        custom_model = "meta-llama/Llama-2-13b-chat-hf"
        service = LLMService(model_name=custom_model, api_token="test_token")
        
        assert service.model_name == custom_model
        mock_client.assert_called_once_with(token="test_token")
    
    @patch('services.llm_service.InferenceClient')
    def test_init_with_api_token(self, mock_client):
        """Test initialization with API token."""
        token = "test_token_123"
        service = LLMService(api_token=token)
        
        assert service.api_token == token
        mock_client.assert_called_once_with(token=token)
    
    def test_init_without_api_token(self):
        """Test initialization fails without API token."""
        with pytest.raises(ValueError, match="HF_API_TOKEN is required"):
            LLMService()


class TestPromptBuilder:
    """Test prompt building functionality."""
    
    @patch('services.llm_service.InferenceClient')
    def test_build_prompt_basic(self, mock_client):
        """Test basic prompt building with only ingredients."""
        service = LLMService(api_token="test_token")
        ingredients = ["chicken", "rice", "onions"]
        
        prompt = service._build_prompt(ingredients)
        
        assert "chicken" in prompt
        assert "rice" in prompt
        assert "onions" in prompt
        assert "professional chef" in prompt.lower()
        assert "JSON" in prompt
    
    @patch('services.llm_service.InferenceClient')
    def test_build_prompt_with_dietary_restrictions(self, mock_client):
        """Test prompt building with dietary restrictions."""
        service = LLMService(api_token="test_token")
        ingredients = ["tofu", "vegetables"]
        dietary = ["vegan", "gluten-free"]
        
        prompt = service._build_prompt(ingredients, dietary_restrictions=dietary)
        
        assert "vegan" in prompt
        assert "gluten-free" in prompt
        assert "Dietary Restrictions" in prompt
    
    @patch('services.llm_service.InferenceClient')
    def test_build_prompt_with_cuisine_type(self, mock_client):
        """Test prompt building with cuisine type."""
        service = LLMService(api_token="test_token")
        ingredients = ["pasta", "tomatoes"]
        
        prompt = service._build_prompt(ingredients, cuisine_type="Italian")
        
        assert "Italian" in prompt
        assert "Cuisine Type" in prompt
    
    @patch('services.llm_service.InferenceClient')
    def test_build_prompt_with_difficulty(self, mock_client):
        """Test prompt building with difficulty level."""
        service = LLMService(api_token="test_token")
        ingredients = ["eggs", "flour"]
        
        prompt = service._build_prompt(ingredients, difficulty="easy")
        
        assert "easy" in prompt
        assert "Difficulty Level" in prompt
    
    @patch('services.llm_service.InferenceClient')
    def test_build_prompt_all_parameters(self, mock_client):
        """Test prompt building with all parameters."""
        service = LLMService(api_token="test_token")
        ingredients = ["chicken", "rice"]
        dietary = ["low-carb"]
        cuisine = "Asian"
        difficulty = "medium"
        
        prompt = service._build_prompt(
            ingredients,
            dietary_restrictions=dietary,
            cuisine_type=cuisine,
            difficulty=difficulty
        )
        
        assert "chicken" in prompt
        assert "low-carb" in prompt
        assert "Asian" in prompt
        assert "medium" in prompt


class TestModelInvocation:
    """Test model invocation with error handling."""
    
    @patch('services.llm_service.InferenceClient')
    @pytest.mark.asyncio
    async def test_invoke_model_success(self, mock_client_class):
        """Test successful model invocation."""
        # Setup mock response
        mock_client = Mock()
        mock_client.text_generation = Mock(return_value="Test response")
        mock_client_class.return_value = mock_client
        
        service = LLMService(api_token="test_token")
        result = await service._invoke_model("Test prompt")
        
        assert result == "Test response"
        mock_client.text_generation.assert_called_once()
    
    @patch('services.llm_service.InferenceClient')
    @pytest.mark.asyncio
    async def test_invoke_model_empty_prompt(self, mock_client):
        """Test model invocation with empty prompt."""
        service = LLMService(api_token="test_token")
        
        with pytest.raises(ValueError, match="Prompt cannot be empty"):
            await service._invoke_model("")
    
    @patch('services.llm_service.InferenceClient')
    @pytest.mark.asyncio
    async def test_invoke_model_invalid_temperature(self, mock_client):
        """Test model invocation with invalid temperature."""
        service = LLMService(api_token="test_token")
        
        with pytest.raises(ValueError, match="Temperature must be between 0 and 1"):
            await service._invoke_model("Test", temperature=1.5)
    
    @patch('services.llm_service.InferenceClient')
    @pytest.mark.asyncio
    async def test_invoke_model_invalid_max_tokens(self, mock_client):
        """Test model invocation with invalid max_tokens."""
        service = LLMService(api_token="test_token")
        
        with pytest.raises(ValueError, match="max_tokens must be positive"):
            await service._invoke_model("Test", max_tokens=-1)
    
    @patch('services.llm_service.InferenceClient')
    @pytest.mark.asyncio
    async def test_invoke_model_timeout_error(self, mock_client_class):
        """Test model invocation with timeout error."""
        mock_client = Mock()
        mock_client.text_generation = Mock(side_effect=Exception("Request timed out"))
        mock_client_class.return_value = mock_client
        
        service = LLMService(api_token="test_token")
        
        with pytest.raises(TimeoutError, match="LLM request timed out"):
            await service._invoke_model("Test")
    
    @patch('services.llm_service.InferenceClient')
    @pytest.mark.asyncio
    async def test_invoke_model_connection_error(self, mock_client_class):
        """Test model invocation with connection error."""
        mock_client = Mock()
        mock_client.text_generation = Mock(side_effect=Exception("Connection failed"))
        mock_client_class.return_value = mock_client
        
        service = LLMService(api_token="test_token")
        
        with pytest.raises(ConnectionError, match="Network error"):
            await service._invoke_model("Test")
    
    @patch('services.llm_service.InferenceClient')
    @pytest.mark.asyncio
    async def test_invoke_model_rate_limit_error(self, mock_client_class):
        """Test model invocation with rate limit error."""
        mock_client = Mock()
        mock_client.text_generation = Mock(side_effect=Exception("Rate limit exceeded"))
        mock_client_class.return_value = mock_client
        
        service = LLMService(api_token="test_token")
        
        with pytest.raises(RuntimeError, match="rate limit"):
            await service._invoke_model("Test")
    
    @patch('services.llm_service.InferenceClient')
    @pytest.mark.asyncio
    async def test_invoke_model_auth_error(self, mock_client_class):
        """Test model invocation with authentication error."""
        mock_client = Mock()
        mock_client.text_generation = Mock(side_effect=Exception("Authentication failed"))
        mock_client_class.return_value = mock_client
        
        service = LLMService(api_token="test_token")
        
        with pytest.raises(RuntimeError, match="authentication failed"):
            await service._invoke_model("Test")


class TestResponseParsing:
    """Test response parsing functionality."""
    
    @patch('services.llm_service.InferenceClient')
    def test_parse_valid_recipe_response(self, mock_client):
        """Test parsing a valid recipe response."""
        service = LLMService(api_token="test_token")
        
        valid_response = json.dumps({
            "title": "Chicken Rice Bowl",
            "description": "A delicious and healthy chicken rice bowl.",
            "ingredients": [
                {"name": "chicken breast", "quantity": "2", "unit": "pieces"},
                {"name": "rice", "quantity": "1", "unit": "cup"}
            ],
            "instructions": [
                "Cook the rice according to package instructions",
                "Season and grill the chicken"
            ],
            "cooking_time_minutes": 30,
            "servings": 2,
            "difficulty": "easy",
            "cuisine_type": "Asian",
            "dietary_tags": ["high-protein"]
        })
        
        recipe = service._parse_recipe_response(valid_response)
        
        assert isinstance(recipe, Recipe)
        assert recipe.title == "Chicken Rice Bowl"
        assert len(recipe.ingredients) == 2
        assert len(recipe.instructions) == 2
        assert recipe.cooking_time_minutes == 30
        assert recipe.servings == 2
        assert recipe.difficulty == "easy"
    
    @patch('services.llm_service.InferenceClient')
    def test_parse_recipe_with_markdown_wrapper(self, mock_client):
        """Test parsing recipe wrapped in markdown code blocks."""
        service = LLMService(api_token="test_token")
        
        recipe_json = {
            "title": "Test Recipe",
            "description": "Test description",
            "ingredients": [{"name": "test", "quantity": "1", "unit": "cup"}],
            "instructions": ["Step 1"],
            "cooking_time_minutes": 20,
            "servings": 2,
            "difficulty": "easy"
        }
        
        wrapped_response = f"```json\n{json.dumps(recipe_json)}\n```"
        
        recipe = service._parse_recipe_response(wrapped_response)
        
        assert recipe.title == "Test Recipe"
    
    @patch('services.llm_service.InferenceClient')
    def test_parse_recipe_invalid_json(self, mock_client):
        """Test parsing invalid JSON response."""
        service = LLMService(api_token="test_token")
        
        invalid_response = "This is not valid JSON"
        
        with pytest.raises(ValueError, match="Failed to parse JSON"):
            service._parse_recipe_response(invalid_response)
    
    @patch('services.llm_service.InferenceClient')
    def test_parse_recipe_missing_required_fields(self, mock_client):
        """Test parsing response with missing required fields."""
        service = LLMService(api_token="test_token")
        
        incomplete_response = json.dumps({
            "title": "Test Recipe",
            "description": "Test"
            # Missing other required fields
        })
        
        with pytest.raises(ValueError, match="Missing required fields"):
            service._parse_recipe_response(incomplete_response)
    
    @patch('services.llm_service.InferenceClient')
    def test_parse_recipe_invalid_difficulty(self, mock_client):
        """Test parsing recipe with invalid difficulty level."""
        service = LLMService(api_token="test_token")
        
        invalid_response = json.dumps({
            "title": "Test Recipe",
            "description": "Test description",
            "ingredients": [{"name": "test", "quantity": "1", "unit": "cup"}],
            "instructions": ["Step 1"],
            "cooking_time_minutes": 20,
            "servings": 2,
            "difficulty": "super-hard"  # Invalid difficulty
        })
        
        with pytest.raises(ValueError, match="Invalid difficulty level"):
            service._parse_recipe_response(invalid_response)
    
    @patch('services.llm_service.InferenceClient')
    def test_parse_recipe_invalid_ingredient_format(self, mock_client):
        """Test parsing recipe with invalid ingredient format."""
        service = LLMService(api_token="test_token")
        
        invalid_response = json.dumps({
            "title": "Test Recipe",
            "description": "Test description",
            "ingredients": ["invalid string instead of object"],
            "instructions": ["Step 1"],
            "cooking_time_minutes": 20,
            "servings": 2,
            "difficulty": "easy"
        })
        
        with pytest.raises(ValueError, match="Invalid ingredient format"):
            service._parse_recipe_response(invalid_response)
    
    @patch('services.llm_service.InferenceClient')
    def test_parse_recipe_invalid_instructions_format(self, mock_client):
        """Test parsing recipe with invalid instructions format."""
        service = LLMService(api_token="test_token")
        
        invalid_response = json.dumps({
            "title": "Test Recipe",
            "description": "Test description",
            "ingredients": [{"name": "test", "quantity": "1", "unit": "cup"}],
            "instructions": "Should be a list, not a string",
            "cooking_time_minutes": 20,
            "servings": 2,
            "difficulty": "easy"
        })
        
        with pytest.raises(ValueError, match="Instructions must be a list"):
            service._parse_recipe_response(invalid_response)


class TestGenerateRecipe:
    """Test the main generate_recipe method."""
    
    @patch('llama_index.llms.huggingface.HuggingFaceLLM')
    @pytest.mark.asyncio
    async def test_generate_recipe_success(self, mock_hf_llm):
        """Test successful recipe generation end-to-end."""
        # Setup mock
        valid_recipe_json = {
            "title": "Chicken Stir Fry",
            "description": "Quick and easy chicken stir fry",
            "ingredients": [
                {"name": "chicken", "quantity": "500", "unit": "g"},
                {"name": "vegetables", "quantity": "2", "unit": "cups"}
            ],
            "instructions": [
                "Cut chicken into pieces",
                "Stir fry with vegetables"
            ],
            "cooking_time_minutes": 25,
            "servings": 4,
            "difficulty": "easy",
            "cuisine_type": "Asian"
        }
        
        mock_response = Mock()
        mock_response.text = json.dumps(valid_recipe_json)
        
        mock_llm_instance = Mock()
        mock_llm_instance.complete = Mock(return_value=mock_response)
        mock_hf_llm.return_value = mock_llm_instance
        
        service = LLMService()
        recipe = await service.generate_recipe(
            ingredients=["chicken", "vegetables"],
            cuisine_type="Asian",
            difficulty="easy"
        )
        
        assert isinstance(recipe, Recipe)
        assert recipe.title == "Chicken Stir Fry"
        assert recipe.cuisine_type == "Asian"
        assert recipe.difficulty == "easy"
        assert len(recipe.ingredients) == 2
        assert len(recipe.instructions) == 2
    
    @patch('llama_index.llms.huggingface.HuggingFaceLLM')
    @pytest.mark.asyncio
    async def test_generate_recipe_with_dietary_restrictions(self, mock_hf_llm):
        """Test recipe generation with dietary restrictions."""
        valid_recipe_json = {
            "title": "Vegan Buddha Bowl",
            "description": "Healthy vegan bowl",
            "ingredients": [
                {"name": "quinoa", "quantity": "1", "unit": "cup"},
                {"name": "chickpeas", "quantity": "1", "unit": "can"}
            ],
            "instructions": ["Cook quinoa", "Add chickpeas"],
            "cooking_time_minutes": 30,
            "servings": 2,
            "difficulty": "easy",
            "dietary_tags": ["vegan", "gluten-free"]
        }
        
        mock_response = Mock()
        mock_response.text = json.dumps(valid_recipe_json)
        
        mock_llm_instance = Mock()
        mock_llm_instance.complete = Mock(return_value=mock_response)
        mock_hf_llm.return_value = mock_llm_instance
        
        service = LLMService()
        recipe = await service.generate_recipe(
            ingredients=["quinoa", "chickpeas"],
            dietary_restrictions=["vegan", "gluten-free"]
        )
        
        assert "vegan" in recipe.dietary_tags
        assert "gluten-free" in recipe.dietary_tags


class TestRetryLogic:
    """Test retry logic for transient failures."""
    
    @patch('llama_index.llms.huggingface.HuggingFaceLLM')
    def test_is_retryable_error_timeout(self, mock_hf_llm):
        """Test that TimeoutError is identified as retryable."""
        service = LLMService()
        error = TimeoutError("Request timed out")
        
        assert service._is_retryable_error(error) is True
    
    @patch('llama_index.llms.huggingface.HuggingFaceLLM')
    def test_is_retryable_error_connection(self, mock_hf_llm):
        """Test that ConnectionError is identified as retryable."""
        service = LLMService()
        error = ConnectionError("Connection failed")
        
        assert service._is_retryable_error(error) is True
    
    @patch('llama_index.llms.huggingface.HuggingFaceLLM')
    def test_is_retryable_error_rate_limit(self, mock_hf_llm):
        """Test that rate limit errors are identified as retryable."""
        service = LLMService()
        error = RuntimeError("Rate limit exceeded")
        
        assert service._is_retryable_error(error) is True
    
    @patch('llama_index.llms.huggingface.HuggingFaceLLM')
    def test_is_retryable_error_throttle(self, mock_hf_llm):
        """Test that throttle errors are identified as retryable."""
        service = LLMService()
        error = RuntimeError("Request throttled")
        
        assert service._is_retryable_error(error) is True
    
    @patch('llama_index.llms.huggingface.HuggingFaceLLM')
    def test_is_retryable_error_non_retryable(self, mock_hf_llm):
        """Test that non-retryable errors are identified correctly."""
        service = LLMService()
        error = RuntimeError("Authentication failed")
        
        assert service._is_retryable_error(error) is False
    
    @patch('llama_index.llms.huggingface.HuggingFaceLLM')
    @pytest.mark.asyncio
    async def test_retry_success_on_second_attempt(self, mock_hf_llm):
        """Test successful retry after one failure."""
        mock_response = Mock()
        mock_response.text = "Success response"
        
        mock_llm_instance = Mock()
        # First call fails with timeout, second succeeds
        mock_llm_instance.complete = Mock(
            side_effect=[
                Exception("Request timed out"),
                mock_response
            ]
        )
        mock_hf_llm.return_value = mock_llm_instance
        
        service = LLMService(max_retries=3, initial_retry_delay=0.01)
        result = await service._invoke_model_with_retry("Test prompt")
        
        assert result == "Success response"
        assert mock_llm_instance.complete.call_count == 2
    
    @patch('llama_index.llms.huggingface.HuggingFaceLLM')
    @pytest.mark.asyncio
    async def test_retry_success_on_third_attempt(self, mock_hf_llm):
        """Test successful retry after two failures."""
        mock_response = Mock()
        mock_response.text = "Success response"
        
        mock_llm_instance = Mock()
        # First two calls fail, third succeeds
        mock_llm_instance.complete = Mock(
            side_effect=[
                Exception("Connection failed"),
                Exception("Request timed out"),
                mock_response
            ]
        )
        mock_hf_llm.return_value = mock_llm_instance
        
        service = LLMService(max_retries=3, initial_retry_delay=0.01)
        result = await service._invoke_model_with_retry("Test prompt")
        
        assert result == "Success response"
        assert mock_llm_instance.complete.call_count == 3
    
    @patch('llama_index.llms.huggingface.HuggingFaceLLM')
    @pytest.mark.asyncio
    async def test_retry_exhausted_timeout(self, mock_hf_llm):
        """Test that retries are exhausted after max attempts with timeout."""
        mock_llm_instance = Mock()
        mock_llm_instance.complete = Mock(
            side_effect=Exception("Request timed out")
        )
        mock_hf_llm.return_value = mock_llm_instance
        
        service = LLMService(max_retries=3, initial_retry_delay=0.01)
        
        with pytest.raises(TimeoutError, match="timed out"):
            await service._invoke_model_with_retry("Test prompt")
        
        # Should try initial + 3 retries = 4 times
        assert mock_llm_instance.complete.call_count == 4
    
    @patch('llama_index.llms.huggingface.HuggingFaceLLM')
    @pytest.mark.asyncio
    async def test_retry_exhausted_connection(self, mock_hf_llm):
        """Test that retries are exhausted after max attempts with connection error."""
        mock_llm_instance = Mock()
        mock_llm_instance.complete = Mock(
            side_effect=Exception("Connection failed")
        )
        mock_hf_llm.return_value = mock_llm_instance
        
        service = LLMService(max_retries=3, initial_retry_delay=0.01)
        
        with pytest.raises(ConnectionError, match="Network error"):
            await service._invoke_model_with_retry("Test prompt")
        
        assert mock_llm_instance.complete.call_count == 4
    
    @patch('llama_index.llms.huggingface.HuggingFaceLLM')
    @pytest.mark.asyncio
    async def test_retry_exhausted_rate_limit(self, mock_hf_llm):
        """Test that retries are exhausted after max attempts with rate limit."""
        mock_llm_instance = Mock()
        mock_llm_instance.complete = Mock(
            side_effect=Exception("Rate limit exceeded")
        )
        mock_hf_llm.return_value = mock_llm_instance
        
        service = LLMService(max_retries=3, initial_retry_delay=0.01)
        
        with pytest.raises(RuntimeError, match="rate limit"):
            await service._invoke_model_with_retry("Test prompt")
        
        assert mock_llm_instance.complete.call_count == 4
    
    @patch('llama_index.llms.huggingface.HuggingFaceLLM')
    @pytest.mark.asyncio
    async def test_retry_non_retryable_error_immediate_failure(self, mock_hf_llm):
        """Test that non-retryable errors fail immediately without retries."""
        mock_llm_instance = Mock()
        mock_llm_instance.complete = Mock(
            side_effect=Exception("Authentication failed")
        )
        mock_hf_llm.return_value = mock_llm_instance
        
        service = LLMService(max_retries=3, initial_retry_delay=0.01)
        
        with pytest.raises(RuntimeError, match="authentication failed"):
            await service._invoke_model_with_retry("Test prompt")
        
        # Should only try once, no retries for non-retryable errors
        assert mock_llm_instance.complete.call_count == 1
    
    @patch('llama_index.llms.huggingface.HuggingFaceLLM')
    @pytest.mark.asyncio
    async def test_retry_exponential_backoff(self, mock_hf_llm):
        """Test that exponential backoff delays are applied correctly."""
        import time
        
        mock_llm_instance = Mock()
        mock_llm_instance.complete = Mock(
            side_effect=Exception("Request timed out")
        )
        mock_hf_llm.return_value = mock_llm_instance
        
        service = LLMService(max_retries=2, initial_retry_delay=0.1)
        
        start_time = time.time()
        
        with pytest.raises(TimeoutError):
            await service._invoke_model_with_retry("Test prompt")
        
        elapsed_time = time.time() - start_time
        
        # Expected delays: 0.1s (first retry) + 0.2s (second retry) = 0.3s minimum
        # Allow some tolerance for execution time
        assert elapsed_time >= 0.25
    
    @patch('llama_index.llms.huggingface.HuggingFaceLLM')
    @pytest.mark.asyncio
    async def test_retry_custom_max_retries(self, mock_hf_llm):
        """Test custom max_retries configuration."""
        mock_llm_instance = Mock()
        mock_llm_instance.complete = Mock(
            side_effect=Exception("Connection failed")
        )
        mock_hf_llm.return_value = mock_llm_instance
        
        service = LLMService(max_retries=5, initial_retry_delay=0.01)
        
        with pytest.raises(ConnectionError):
            await service._invoke_model_with_retry("Test prompt")
        
        # Should try initial + 5 retries = 6 times
        assert mock_llm_instance.complete.call_count == 6
    
    @patch('llama_index.llms.huggingface.HuggingFaceLLM')
    @pytest.mark.asyncio
    async def test_generate_recipe_with_retry_success(self, mock_hf_llm):
        """Test end-to-end recipe generation with retry logic."""
        valid_recipe_json = {
            "title": "Retry Test Recipe",
            "description": "Recipe generated after retry",
            "ingredients": [
                {"name": "test ingredient", "quantity": "1", "unit": "cup"}
            ],
            "instructions": ["Test step"],
            "cooking_time_minutes": 20,
            "servings": 2,
            "difficulty": "easy"
        }
        
        mock_response = Mock()
        mock_response.text = json.dumps(valid_recipe_json)
        
        mock_llm_instance = Mock()
        # First call fails, second succeeds
        mock_llm_instance.complete = Mock(
            side_effect=[
                Exception("Request timed out"),
                mock_response
            ]
        )
        mock_hf_llm.return_value = mock_llm_instance
        
        service = LLMService(max_retries=3, initial_retry_delay=0.01)
        recipe = await service.generate_recipe(
            ingredients=["test ingredient"]
        )
        
        assert isinstance(recipe, Recipe)
        assert recipe.title == "Retry Test Recipe"
        assert mock_llm_instance.complete.call_count == 2
