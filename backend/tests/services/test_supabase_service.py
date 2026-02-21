"""
Tests for SupabaseService.
"""
import pytest
from datetime import datetime
from unittest.mock import Mock, patch, MagicMock
from models.recipe import Recipe, Ingredient
from services.supabase_service import SupabaseService


@pytest.fixture
def mock_supabase_client():
    """Create a mock Supabase client."""
    with patch('services.supabase_service.create_client') as mock_create:
        mock_client = Mock()
        mock_create.return_value = mock_client
        yield mock_client


@pytest.fixture
def sample_recipe():
    """Create a sample recipe for testing."""
    return Recipe(
        id="recipe-123",
        title="Pasta Carbonara",
        description="Classic Italian pasta dish",
        ingredients=[
            Ingredient(name="pasta", quantity="400", unit="g"),
            Ingredient(name="eggs", quantity="4", unit="pieces"),
            Ingredient(name="bacon", quantity="200", unit="g")
        ],
        instructions=[
            "Boil pasta in salted water",
            "Fry bacon until crispy",
            "Mix eggs with cheese",
            "Combine all ingredients"
        ],
        cooking_time_minutes=30,
        servings=4,
        difficulty="medium",
        cuisine_type="Italian",
        dietary_tags=["high-protein"],
        image_url="https://example.com/carbonara.jpg",
        created_at=datetime(2024, 1, 15, 12, 0, 0),
        embedding=None
    )


@pytest.fixture
def supabase_service(mock_supabase_client):
    """Create SupabaseService instance with mocked client."""
    with patch.dict('os.environ', {'SUPABASE_URL': 'https://test.supabase.co', 'SUPABASE_KEY': 'test-key'}):
        service = SupabaseService()
        return service


class TestSupabaseServiceInit:
    """Tests for SupabaseService initialization."""
    
    def test_init_with_env_vars(self, mock_supabase_client):
        """Test initialization with environment variables."""
        with patch.dict('os.environ', {'SUPABASE_URL': 'https://test.supabase.co', 'SUPABASE_KEY': 'test-key'}):
            service = SupabaseService()
            assert service.supabase_url == 'https://test.supabase.co'
            assert service.supabase_key == 'test-key'
    
    def test_init_with_params(self, mock_supabase_client):
        """Test initialization with explicit parameters."""
        service = SupabaseService(
            supabase_url='https://custom.supabase.co',
            supabase_key='custom-key'
        )
        assert service.supabase_url == 'https://custom.supabase.co'
        assert service.supabase_key == 'custom-key'
    
    def test_init_missing_credentials(self):
        """Test initialization fails without credentials."""
        with patch.dict('os.environ', {}, clear=True):
            with pytest.raises(ValueError, match="SUPABASE_URL and SUPABASE_KEY must be provided"):
                SupabaseService()


class TestSaveRecipe:
    """Tests for save_recipe method."""
    
    @pytest.mark.asyncio
    async def test_save_recipe_success(self, supabase_service, sample_recipe, mock_supabase_client):
        """Test successful recipe save."""
        # Mock the Supabase response
        mock_response = Mock()
        mock_response.data = [{"id": "recipe-123"}]
        
        mock_table = Mock()
        mock_table.upsert.return_value.execute.return_value = mock_response
        mock_supabase_client.table.return_value = mock_table
        
        result = await supabase_service.save_recipe(sample_recipe)
        
        assert result == sample_recipe
        mock_supabase_client.table.assert_called_once_with("recipes")
        mock_table.upsert.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_save_recipe_with_embedding(self, supabase_service, sample_recipe, mock_supabase_client):
        """Test saving recipe with embedding vector."""
        sample_recipe.embedding = [0.1, 0.2, 0.3]
        
        mock_response = Mock()
        mock_response.data = [{"id": "recipe-123"}]
        
        mock_table = Mock()
        mock_table.upsert.return_value.execute.return_value = mock_response
        mock_supabase_client.table.return_value = mock_table
        
        result = await supabase_service.save_recipe(sample_recipe)
        
        assert result.embedding == [0.1, 0.2, 0.3]
    
    @pytest.mark.asyncio
    async def test_save_recipe_no_data_returned(self, supabase_service, sample_recipe, mock_supabase_client):
        """Test save fails when no data is returned."""
        mock_response = Mock()
        mock_response.data = None
        
        mock_table = Mock()
        mock_table.upsert.return_value.execute.return_value = mock_response
        mock_supabase_client.table.return_value = mock_table
        
        with pytest.raises(Exception, match="Failed to save recipe to Supabase"):
            await supabase_service.save_recipe(sample_recipe)
    
    @pytest.mark.asyncio
    async def test_save_recipe_exception(self, supabase_service, sample_recipe, mock_supabase_client):
        """Test save handles exceptions properly."""
        mock_table = Mock()
        mock_table.upsert.side_effect = Exception("Database error")
        mock_supabase_client.table.return_value = mock_table
        
        with pytest.raises(Exception, match="Error saving recipe to Supabase: Database error"):
            await supabase_service.save_recipe(sample_recipe)


class TestGetRecipe:
    """Tests for get_recipe method."""
    
    @pytest.mark.asyncio
    async def test_get_recipe_success(self, supabase_service, mock_supabase_client):
        """Test successful recipe retrieval."""
        mock_response = Mock()
        mock_response.data = [{
            "id": "recipe-123",
            "title": "Pasta Carbonara",
            "description": "Classic Italian pasta dish",
            "ingredients": [
                {"name": "pasta", "quantity": "400", "unit": "g"},
                {"name": "eggs", "quantity": "4", "unit": "pieces"}
            ],
            "instructions": ["Step 1", "Step 2"],
            "cooking_time_minutes": 30,
            "servings": 4,
            "difficulty": "medium",
            "cuisine_type": "Italian",
            "dietary_tags": ["high-protein"],
            "image_url": "https://example.com/carbonara.jpg",
            "created_at": "2024-01-15T12:00:00",
            "embedding": None
        }]
        
        mock_table = Mock()
        mock_table.select.return_value.eq.return_value.execute.return_value = mock_response
        mock_supabase_client.table.return_value = mock_table
        
        result = await supabase_service.get_recipe("recipe-123")
        
        assert result is not None
        assert result.id == "recipe-123"
        assert result.title == "Pasta Carbonara"
        assert len(result.ingredients) == 2
        mock_supabase_client.table.assert_called_once_with("recipes")
    
    @pytest.mark.asyncio
    async def test_get_recipe_not_found(self, supabase_service, mock_supabase_client):
        """Test retrieval when recipe doesn't exist."""
        mock_response = Mock()
        mock_response.data = []
        
        mock_table = Mock()
        mock_table.select.return_value.eq.return_value.execute.return_value = mock_response
        mock_supabase_client.table.return_value = mock_table
        
        result = await supabase_service.get_recipe("nonexistent-id")
        
        assert result is None
    
    @pytest.mark.asyncio
    async def test_get_recipe_exception(self, supabase_service, mock_supabase_client):
        """Test get handles exceptions properly."""
        mock_table = Mock()
        mock_table.select.side_effect = Exception("Database error")
        mock_supabase_client.table.return_value = mock_table
        
        with pytest.raises(Exception, match="Error retrieving recipe from Supabase: Database error"):
            await supabase_service.get_recipe("recipe-123")


class TestListRecipes:
    """Tests for list_recipes method."""
    
    @pytest.mark.asyncio
    async def test_list_recipes_success(self, supabase_service, mock_supabase_client):
        """Test successful recipe listing."""
        mock_response = Mock()
        mock_response.data = [
            {
                "id": "recipe-1",
                "title": "Recipe 1",
                "description": "Description 1",
                "ingredients": [{"name": "ingredient1", "quantity": "100", "unit": "g"}],
                "instructions": ["Step 1"],
                "cooking_time_minutes": 20,
                "servings": 2,
                "difficulty": "easy",
                "cuisine_type": "Italian",
                "dietary_tags": [],
                "image_url": None,
                "created_at": "2024-01-15T12:00:00",
                "embedding": None
            },
            {
                "id": "recipe-2",
                "title": "Recipe 2",
                "description": "Description 2",
                "ingredients": [{"name": "ingredient2", "quantity": "200", "unit": "g"}],
                "instructions": ["Step 1"],
                "cooking_time_minutes": 30,
                "servings": 4,
                "difficulty": "medium",
                "cuisine_type": "Mexican",
                "dietary_tags": ["vegan"],
                "image_url": None,
                "created_at": "2024-01-16T12:00:00",
                "embedding": None
            }
        ]
        
        mock_table = Mock()
        mock_table.select.return_value.order.return_value.range.return_value.execute.return_value = mock_response
        mock_supabase_client.table.return_value = mock_table
        
        result = await supabase_service.list_recipes(limit=10, offset=0)
        
        assert len(result) == 2
        assert result[0].id == "recipe-1"
        assert result[1].id == "recipe-2"
        mock_supabase_client.table.assert_called_once_with("recipes")
    
    @pytest.mark.asyncio
    async def test_list_recipes_with_pagination(self, supabase_service, mock_supabase_client):
        """Test recipe listing with pagination parameters."""
        mock_response = Mock()
        mock_response.data = []
        
        mock_table = Mock()
        mock_range = Mock()
        mock_range.execute.return_value = mock_response
        mock_order = Mock()
        mock_order.range.return_value = mock_range
        mock_select = Mock()
        mock_select.order.return_value = mock_order
        mock_table.select.return_value = mock_select
        mock_supabase_client.table.return_value = mock_table
        
        await supabase_service.list_recipes(limit=5, offset=10)
        
        # Verify pagination parameters
        mock_order.range.assert_called_once_with(10, 14)  # offset to offset + limit - 1
    
    @pytest.mark.asyncio
    async def test_list_recipes_empty(self, supabase_service, mock_supabase_client):
        """Test listing when no recipes exist."""
        mock_response = Mock()
        mock_response.data = []
        
        mock_table = Mock()
        mock_table.select.return_value.order.return_value.range.return_value.execute.return_value = mock_response
        mock_supabase_client.table.return_value = mock_table
        
        result = await supabase_service.list_recipes()
        
        assert result == []
    
    @pytest.mark.asyncio
    async def test_list_recipes_exception(self, supabase_service, mock_supabase_client):
        """Test list handles exceptions properly."""
        mock_table = Mock()
        mock_table.select.side_effect = Exception("Database error")
        mock_supabase_client.table.return_value = mock_table
        
        with pytest.raises(Exception, match="Error listing recipes from Supabase: Database error"):
            await supabase_service.list_recipes()



class TestSaveInventory:
    """Tests for save_inventory method."""
    
    @pytest.fixture
    def sample_inventory(self):
        """Create a sample inventory for testing."""
        from models.inventory import UserInventory, InventoryItem
        return UserInventory(
            user_id="user-123",
            items=[
                InventoryItem(
                    ingredient_name="tomatoes",
                    quantity="5",
                    added_at=datetime(2024, 1, 15, 12, 0, 0)
                ),
                InventoryItem(
                    ingredient_name="onions",
                    quantity="3",
                    added_at=datetime(2024, 1, 15, 12, 5, 0)
                )
            ],
            updated_at=datetime(2024, 1, 15, 12, 5, 0)
        )
    
    @pytest.mark.asyncio
    async def test_save_inventory_success(self, supabase_service, sample_inventory, mock_supabase_client):
        """Test successful inventory save."""
        mock_response = Mock()
        mock_response.data = [{"user_id": "user-123"}]
        
        mock_table = Mock()
        mock_table.upsert.return_value.execute.return_value = mock_response
        mock_supabase_client.table.return_value = mock_table
        
        result = await supabase_service.save_inventory(sample_inventory)
        
        assert result == sample_inventory
        mock_supabase_client.table.assert_called_once_with("inventory")
        mock_table.upsert.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_save_inventory_empty_items(self, supabase_service, mock_supabase_client):
        """Test saving inventory with no items."""
        from models.inventory import UserInventory
        empty_inventory = UserInventory(
            user_id="user-123",
            items=[],
            updated_at=datetime(2024, 1, 15, 12, 0, 0)
        )
        
        mock_response = Mock()
        mock_response.data = [{"user_id": "user-123"}]
        
        mock_table = Mock()
        mock_table.upsert.return_value.execute.return_value = mock_response
        mock_supabase_client.table.return_value = mock_table
        
        result = await supabase_service.save_inventory(empty_inventory)
        
        assert result.user_id == "user-123"
        assert len(result.items) == 0
    
    @pytest.mark.asyncio
    async def test_save_inventory_no_data_returned(self, supabase_service, sample_inventory, mock_supabase_client):
        """Test save fails when no data is returned."""
        mock_response = Mock()
        mock_response.data = None
        
        mock_table = Mock()
        mock_table.upsert.return_value.execute.return_value = mock_response
        mock_supabase_client.table.return_value = mock_table
        
        with pytest.raises(Exception, match="Failed to save inventory to Supabase"):
            await supabase_service.save_inventory(sample_inventory)
    
    @pytest.mark.asyncio
    async def test_save_inventory_exception(self, supabase_service, sample_inventory, mock_supabase_client):
        """Test save handles exceptions properly."""
        mock_table = Mock()
        mock_table.upsert.side_effect = Exception("Database error")
        mock_supabase_client.table.return_value = mock_table
        
        with pytest.raises(Exception, match="Error saving inventory to Supabase: Database error"):
            await supabase_service.save_inventory(sample_inventory)


class TestGetInventory:
    """Tests for get_inventory method."""
    
    @pytest.mark.asyncio
    async def test_get_inventory_success(self, supabase_service, mock_supabase_client):
        """Test successful inventory retrieval."""
        mock_response = Mock()
        mock_response.data = [{
            "user_id": "user-123",
            "items": [
                {
                    "ingredient_name": "tomatoes",
                    "quantity": "5",
                    "added_at": "2024-01-15T12:00:00"
                },
                {
                    "ingredient_name": "onions",
                    "quantity": "3",
                    "added_at": "2024-01-15T12:05:00"
                }
            ],
            "updated_at": "2024-01-15T12:05:00"
        }]
        
        mock_table = Mock()
        mock_table.select.return_value.eq.return_value.execute.return_value = mock_response
        mock_supabase_client.table.return_value = mock_table
        
        result = await supabase_service.get_inventory("user-123")
        
        assert result is not None
        assert result.user_id == "user-123"
        assert len(result.items) == 2
        assert result.items[0].ingredient_name == "tomatoes"
        assert result.items[0].quantity == "5"
        mock_supabase_client.table.assert_called_once_with("inventory")
    
    @pytest.mark.asyncio
    async def test_get_inventory_not_found(self, supabase_service, mock_supabase_client):
        """Test retrieval when inventory doesn't exist."""
        mock_response = Mock()
        mock_response.data = []
        
        mock_table = Mock()
        mock_table.select.return_value.eq.return_value.execute.return_value = mock_response
        mock_supabase_client.table.return_value = mock_table
        
        result = await supabase_service.get_inventory("nonexistent-user")
        
        assert result is None
    
    @pytest.mark.asyncio
    async def test_get_inventory_with_optional_quantity(self, supabase_service, mock_supabase_client):
        """Test retrieval with items that have no quantity."""
        mock_response = Mock()
        mock_response.data = [{
            "user_id": "user-123",
            "items": [
                {
                    "ingredient_name": "salt",
                    "quantity": None,
                    "added_at": "2024-01-15T12:00:00"
                }
            ],
            "updated_at": "2024-01-15T12:00:00"
        }]
        
        mock_table = Mock()
        mock_table.select.return_value.eq.return_value.execute.return_value = mock_response
        mock_supabase_client.table.return_value = mock_table
        
        result = await supabase_service.get_inventory("user-123")
        
        assert result is not None
        assert result.items[0].quantity is None
    
    @pytest.mark.asyncio
    async def test_get_inventory_exception(self, supabase_service, mock_supabase_client):
        """Test get handles exceptions properly."""
        mock_table = Mock()
        mock_table.select.side_effect = Exception("Database error")
        mock_supabase_client.table.return_value = mock_table
        
        with pytest.raises(Exception, match="Error retrieving inventory from Supabase: Database error"):
            await supabase_service.get_inventory("user-123")
