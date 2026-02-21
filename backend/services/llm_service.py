"""
LLM Service for AI-powered recipe generation using Hugging Face via LlamaIndex.
"""
import json
import os
import uuid
import asyncio
from typing import List, Optional
from datetime import datetime
from pydantic import ValidationError

from models.recipe import Recipe, Ingredient


class LLMService:
    """Service for interacting with Hugging Face models via LlamaIndex to generate recipes."""
    
    def __init__(
        self, 
        model_name: Optional[str] = None,
        api_token: Optional[str] = None,
        max_retries: int = 3,
        initial_retry_delay: float = 1.0
    ):
        """
        Initialize LLM service with LlamaIndex and Hugging Face.
        
        Args:
            model_name: Hugging Face model name (defaults to Llama-2-7b-chat)
            api_token: Hugging Face API token (optional, for gated models)
            max_retries: Maximum number of retry attempts for transient failures (default: 3)
            initial_retry_delay: Initial delay in seconds for exponential backoff (default: 1.0)
        """
        from llama_index.llms.huggingface import HuggingFaceLLM
        
        self.model_name = model_name or os.getenv(
            "HF_MODEL_NAME", 
            "meta-llama/Llama-2-7b-chat-hf"
        )
        self.api_token = api_token or os.getenv("HF_API_TOKEN")
        self.max_retries = max_retries
        self.initial_retry_delay = initial_retry_delay
        
        # Initialize LlamaIndex with Hugging Face LLM
        self.llm = HuggingFaceLLM(
            model_name=self.model_name,
            tokenizer_name=self.model_name,
            context_window=4096,
            max_new_tokens=2048,
            generate_kwargs={"temperature": 0.7, "do_sample": True},
            device_map="auto",
        )
    
    def _build_prompt(
        self,
        ingredients: List[str],
        dietary_restrictions: List[str] = [],
        cuisine_type: Optional[str] = None,
        difficulty: Optional[str] = None
    ) -> str:
        """
        Build a structured prompt for recipe generation.
        
        Args:
            ingredients: List of available ingredients
            dietary_restrictions: List of dietary restrictions
            cuisine_type: Preferred cuisine type
            difficulty: Desired difficulty level
            
        Returns:
            Formatted prompt string for the LLM
        """
        prompt_parts = [
            "You are a professional chef assistant. Generate a detailed, creative recipe based on the following requirements:\n",
            f"Available Ingredients: {', '.join(ingredients)}"
        ]
        
        if dietary_restrictions:
            prompt_parts.append(f"Dietary Restrictions: {', '.join(dietary_restrictions)}")
        
        if cuisine_type:
            prompt_parts.append(f"Cuisine Type: {cuisine_type}")
        
        if difficulty:
            prompt_parts.append(f"Difficulty Level: {difficulty}")
        
        prompt_parts.extend([
            "\nIMPORTANT INSTRUCTIONS:",
            "- Create a recipe that primarily uses the provided ingredients",
            "- Respect all dietary restrictions strictly",
            "- Provide clear, step-by-step instructions",
            "- Include realistic cooking times and serving sizes",
            "- Return ONLY valid JSON with no additional text or explanation\n",
            "Required JSON format:",
            "{",
            '  "title": "Creative Recipe Name",',
            '  "description": "Brief, appetizing description (2-3 sentences)",',
            '  "ingredients": [',
            '    {"name": "ingredient name", "quantity": "amount", "unit": "measurement unit or null"}',
            '  ],',
            '  "instructions": [',
            '    "Step 1: Detailed instruction",',
            '    "Step 2: Detailed instruction"',
            '  ],',
            '  "cooking_time_minutes": 30,',
            '  "servings": 4,',
            '  "difficulty": "easy",',
            '  "cuisine_type": "cuisine style",',
            '  "dietary_tags": ["vegetarian", "gluten-free"]',
            "}"
        ])
        
        return "\n".join(prompt_parts)
    
    def _is_retryable_error(self, error: Exception) -> bool:
        """
        Determine if an error is retryable.
        
        Args:
            error: The exception to check
            
        Returns:
            True if the error is retryable, False otherwise
        """
        # Retryable error types
        if isinstance(error, (TimeoutError, ConnectionError)):
            return True
        
        # Check for rate limit errors in RuntimeError messages
        if isinstance(error, RuntimeError):
            error_msg = str(error).lower()
            if "rate limit" in error_msg or "throttl" in error_msg:
                return True
        
        return False
    
    async def _invoke_model_with_retry(
        self,
        prompt: str,
        max_tokens: int = 2048,
        temperature: float = 0.7,
        timeout: int = 10
    ) -> str:
        """
        Invoke model with retry logic and exponential backoff.
        
        Args:
            prompt: The prompt to send to the model
            max_tokens: Maximum tokens in response
            temperature: Sampling temperature (0.0-1.0)
            timeout: Request timeout in seconds
            
        Returns:
            Model response as string
            
        Raises:
            ValueError: If prompt is empty or parameters are invalid
            TimeoutError: If all retry attempts timeout
            ConnectionError: If all retry attempts fail with connection errors
            RuntimeError: For other LLM failures after all retries
        """
        last_error = None
        
        for attempt in range(self.max_retries + 1):
            try:
                # Attempt to invoke the model
                return await self._invoke_model(
                    prompt=prompt,
                    max_tokens=max_tokens,
                    temperature=temperature,
                    timeout=timeout
                )
            
            except (TimeoutError, ConnectionError, RuntimeError) as e:
                last_error = e
                
                # Check if this is a retryable error
                if not self._is_retryable_error(e):
                    # Non-retryable error, raise immediately
                    raise
                
                # If this was the last attempt, raise the error
                if attempt >= self.max_retries:
                    raise
                
                # Calculate exponential backoff delay
                delay = self.initial_retry_delay * (2 ** attempt)
                
                # Log retry attempt (in production, use proper logging)
                print(f"Retry attempt {attempt + 1}/{self.max_retries} after {delay}s due to: {str(e)}")
                
                # Wait before retrying
                await asyncio.sleep(delay)
        
        # This should never be reached, but just in case
        if last_error:
            raise last_error
        raise RuntimeError("Unexpected error in retry logic")
    
    async def _invoke_model(
        self,
        prompt: str,
        max_tokens: int = 2048,
        temperature: float = 0.7,
        timeout: int = 10
    ) -> str:
        """
        Invoke Hugging Face model via LlamaIndex with error handling.
        
        Args:
            prompt: The prompt to send to the model
            max_tokens: Maximum tokens in response
            temperature: Sampling temperature (0.0-1.0)
            timeout: Request timeout in seconds (default 10s per requirements)
            
        Returns:
            Model response as string
            
        Raises:
            ValueError: If prompt is empty or parameters are invalid
            TimeoutError: If request exceeds timeout limit
            ConnectionError: If network/connectivity issues occur
            RuntimeError: For other LLM failures
        """
        # Validate inputs
        if not prompt or not prompt.strip():
            raise ValueError("Prompt cannot be empty")
        
        if not 0 <= temperature <= 1:
            raise ValueError(f"Temperature must be between 0 and 1, got {temperature}")
        
        if max_tokens < 1:
            raise ValueError(f"max_tokens must be positive, got {max_tokens}")
        
        try:
            # Invoke model via LlamaIndex
            response = self.llm.complete(prompt)
            
            # Extract text from response
            if hasattr(response, 'text'):
                return response.text
            else:
                return str(response)
            
        except Exception as e:
            error_msg = str(e).lower()
            
            # Handle specific error types
            if "timeout" in error_msg or "timed out" in error_msg:
                raise TimeoutError(
                    f"LLM request timed out after {timeout}s: {str(e)}"
                ) from e
            elif "connection" in error_msg or "network" in error_msg:
                raise ConnectionError(
                    f"Network error connecting to Hugging Face: {str(e)}"
                ) from e
            elif "rate limit" in error_msg or "throttl" in error_msg:
                raise RuntimeError(
                    f"Hugging Face API rate limit exceeded: {str(e)}"
                ) from e
            elif "authentication" in error_msg or "unauthorized" in error_msg:
                raise RuntimeError(
                    f"Hugging Face authentication failed: {str(e)}"
                ) from e
            else:
                raise RuntimeError(
                    f"Unexpected error invoking LLM: {str(e)}"
                ) from e

    def _parse_recipe_response(self, response_text: str) -> Recipe:
        """
        Parse LLM response into Recipe model.
        
        Args:
            response_text: Raw text response from LLM
            
        Returns:
            Recipe: Validated Recipe model instance
            
        Raises:
            ValueError: If response format is invalid or JSON parsing fails
            ValidationError: If parsed data doesn't match Recipe model schema
        """
        try:
            # Clean response text
            recipe_text = response_text.strip()
            
            # LLM might wrap JSON in markdown code blocks, so handle that
            if recipe_text.startswith('```json'):
                recipe_text = recipe_text.split('```json')[1].split('```')[0].strip()
            elif recipe_text.startswith('```'):
                recipe_text = recipe_text.split('```')[1].split('```')[0].strip()
            
            # Parse JSON from the response text
            try:
                recipe_data = json.loads(recipe_text)
            except json.JSONDecodeError as e:
                raise ValueError(f"Failed to parse JSON from LLM response: {str(e)}")
            
            # Validate required fields
            required_fields = [
                'title', 'description', 'ingredients', 'instructions',
                'cooking_time_minutes', 'servings', 'difficulty'
            ]
            missing_fields = [f for f in required_fields if f not in recipe_data]
            if missing_fields:
                raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")
            
            # Parse ingredients into Ingredient models
            ingredients = []
            for ing_data in recipe_data['ingredients']:
                if not isinstance(ing_data, dict):
                    raise ValueError(f"Invalid ingredient format: {ing_data}")
                
                # Ensure required ingredient fields
                if 'name' not in ing_data or 'quantity' not in ing_data:
                    raise ValueError(f"Ingredient missing name or quantity: {ing_data}")
                
                ingredients.append(Ingredient(
                    name=ing_data['name'],
                    quantity=ing_data['quantity'],
                    unit=ing_data.get('unit')
                ))
            
            # Validate instructions is a list of strings
            if not isinstance(recipe_data['instructions'], list):
                raise ValueError("Instructions must be a list")
            
            if not all(isinstance(step, str) for step in recipe_data['instructions']):
                raise ValueError("All instruction steps must be strings")
            
            # Generate unique recipe ID and timestamp
            recipe_id = str(uuid.uuid4())
            created_at = datetime.utcnow()
            
            # Validate and normalize difficulty
            difficulty = recipe_data['difficulty'].lower()
            if difficulty not in ['easy', 'medium', 'hard']:
                raise ValueError(f"Invalid difficulty level: {difficulty}. Must be easy, medium, or hard")
            
            # Create Recipe model with validated data
            recipe = Recipe(
                id=recipe_id,
                title=recipe_data['title'],
                description=recipe_data['description'],
                ingredients=ingredients,
                instructions=recipe_data['instructions'],
                cooking_time_minutes=int(recipe_data['cooking_time_minutes']),
                servings=int(recipe_data['servings']),
                difficulty=difficulty,
                cuisine_type=recipe_data.get('cuisine_type'),
                dietary_tags=recipe_data.get('dietary_tags', []),
                image_url=recipe_data.get('image_url'),
                created_at=created_at,
                embedding=None  # Will be generated separately for vector search
            )
            
            return recipe
            
        except ValidationError as e:
            # Pydantic validation error
            raise ValidationError(f"Recipe validation failed: {str(e)}")
        
        except (KeyError, TypeError, AttributeError) as e:
            # Handle unexpected data structure issues
            raise ValueError(f"Invalid response structure: {str(e)}")
    
    async def generate_recipe(
        self,
        ingredients: List[str],
        dietary_restrictions: List[str] = [],
        cuisine_type: Optional[str] = None,
        difficulty: Optional[str] = None
    ) -> Recipe:
        """
        Generate a recipe using Hugging Face LLM via LlamaIndex.
        
        Args:
            ingredients: List of available ingredients
            dietary_restrictions: List of dietary restrictions
            cuisine_type: Preferred cuisine type
            difficulty: Desired difficulty level
            
        Returns:
            Recipe: Generated and validated recipe
            
        Raises:
            ValueError: If inputs are invalid or response parsing fails
            RuntimeError: If LLM invocation fails after all retries
        """
        # Build prompt
        prompt = self._build_prompt(
            ingredients=ingredients,
            dietary_restrictions=dietary_restrictions,
            cuisine_type=cuisine_type,
            difficulty=difficulty
        )
        
        # Invoke model with retry logic
        response_text = await self._invoke_model_with_retry(prompt)
        
        # Parse and validate response
        recipe = self._parse_recipe_response(response_text)
        
        return recipe
