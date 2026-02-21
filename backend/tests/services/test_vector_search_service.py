"""
Tests for VectorSearchService with mocked Pinecone and sentence-transformers.
"""
import pytest
import sys
from unittest.mock import Mock, patch, MagicMock

# Mock sentence_transformers and pinecone modules before any imports
sys.modules['sentence_transformers'] = MagicMock()
sys.modules['pinecone'] = MagicMock()

from services.vector_search_service import VectorSearchService


@pytest.fixture
def mock_pinecone():
    """Mock Pinecone client and index."""
    with patch('services.vector_search_service.Pinecone') as mock_pc:
        mock_index = Mock()
        mock_pc_instance = Mock()
        mock_pc_instance.Index.return_value = mock_index
        mock_pc.return_value = mock_pc_instance
        yield mock_pc, mock_index


@pytest.fixture
def mock_sentence_transformer():
    """Mock SentenceTransformer model."""
    with patch('services.vector_search_service.SentenceTransformer') as mock_st:
        mock_model = Mock()
        mock_st.return_value = mock_model
        yield mock_model


@pytest.fixture
def vector_service(mock_pinecone, mock_sentence_transformer):
    """Create VectorSearchService with mocked dependencies."""
    mock_pc, mock_index = mock_pinecone
    service = VectorSearchService(
        pinecone_api_key="test-api-key",
        index_name="recipes",
        embedding_model_name="all-MiniLM-L6-v2"
    )
    return service


class TestVectorSearchServiceInitialization:
    """Test VectorSearchService initialization."""
    
    def test_init_with_credentials(self, mock_pinecone, mock_sentence_transformer):
        """Test initialization with provided credentials."""
        mock_pc, mock_index = mock_pinecone
        
        service = VectorSearchService(
            pinecone_api_key="test-key"
        )
        
        assert service.pinecone_api_key == "test-key"
        assert service.index_name == "recipes"
        assert service.embedding_model_name == "all-MiniLM-L6-v2"
        mock_pc.assert_called_once_with(api_key="test-key")
    
    def test_init_with_env_vars(self, mock_pinecone, mock_sentence_transformer, monkeypatch):
        """Test initialization with environment variables."""
        monkeypatch.setenv("PINECONE_API_KEY", "env-key")
        
        service = VectorSearchService()
        
        assert service.pinecone_api_key == "env-key"
    
    def test_init_missing_api_key(self, mock_pinecone, mock_sentence_transformer):
        """Test initialization fails without API key."""
        with pytest.raises(ValueError, match="PINECONE_API_KEY must be provided"):
            VectorSearchService(
                pinecone_api_key=None
            )
    
    def test_init_pinecone_connection_failure(self, mock_sentence_transformer):
        """Test initialization handles Pinecone connection failure."""
        with patch('services.vector_search_service.Pinecone') as mock_pc:
            mock_pc.side_effect = Exception("Connection failed")
            
            with pytest.raises(RuntimeError, match="Failed to initialize Pinecone connection"):
                VectorSearchService(
                    pinecone_api_key="test-key"
                )


class TestEmbeddingGeneration:
    """Test embedding generation functionality."""
    
    @pytest.mark.asyncio
    async def test_generate_embedding_success(self, vector_service, mock_sentence_transformer):
        """Test successful embedding generation."""
        # Mock embedding output
        mock_embedding = [0.1, 0.2, 0.3, 0.4, 0.5]
        mock_array = Mock()
        mock_array.tolist.return_value = mock_embedding
        mock_sentence_transformer.encode.return_value = mock_array
        
        result = await vector_service.generate_embedding("test query")
        
        assert result == mock_embedding
        mock_sentence_transformer.encode.assert_called_once_with("test query", convert_to_tensor=False)
    
    @pytest.mark.asyncio
    async def test_generate_embedding_empty_text(self, vector_service):
        """Test embedding generation with empty text."""
        with pytest.raises(ValueError, match="Text cannot be empty"):
            await vector_service.generate_embedding("")
    
    @pytest.mark.asyncio
    async def test_generate_embedding_whitespace_only(self, vector_service):
        """Test embedding generation with whitespace-only text."""
        with pytest.raises(ValueError, match="Text cannot be empty"):
            await vector_service.generate_embedding("   ")
    
    @pytest.mark.asyncio
    async def test_generate_embedding_caching(self, vector_service, mock_sentence_transformer):
        """Test that embeddings are cached for identical texts."""
        mock_embedding = [0.1, 0.2, 0.3]
        mock_array = Mock()
        mock_array.tolist.return_value = mock_embedding
        mock_sentence_transformer.encode.return_value = mock_array
        
        # Generate embedding twice for same text
        result1 = await vector_service.generate_embedding("test query")
        result2 = await vector_service.generate_embedding("test query")
        
        assert result1 == result2
        # Should only call encode once due to caching
        assert mock_sentence_transformer.encode.call_count == 1
    
    @pytest.mark.asyncio
    async def test_generate_embedding_strips_whitespace(self, vector_service, mock_sentence_transformer):
        """Test that whitespace is stripped before caching."""
        mock_embedding = [0.1, 0.2, 0.3]
        mock_array = Mock()
        mock_array.tolist.return_value = mock_embedding
        mock_sentence_transformer.encode.return_value = mock_array
        
        result1 = await vector_service.generate_embedding("  test query  ")
        result2 = await vector_service.generate_embedding("test query")
        
        assert result1 == result2
        # Should only call encode once due to caching (after stripping)
        assert mock_sentence_transformer.encode.call_count == 1
    
    @pytest.mark.asyncio
    async def test_generate_embedding_model_failure(self, vector_service, mock_sentence_transformer):
        """Test handling of model failure during embedding generation."""
        mock_sentence_transformer.encode.side_effect = Exception("Model error")
        
        with pytest.raises(RuntimeError, match="Failed to generate embedding"):
            await vector_service.generate_embedding("test query")
    
    def test_clear_embedding_cache(self, vector_service, mock_sentence_transformer):
        """Test clearing the embedding cache."""
        mock_embedding = [0.1, 0.2, 0.3]
        mock_array = Mock()
        mock_array.tolist.return_value = mock_embedding
        mock_sentence_transformer.encode.return_value = mock_array
        
        # Generate embedding
        vector_service._get_embedding_cached("test")
        
        # Clear cache
        vector_service.clear_embedding_cache()
        
        # Generate again - should call encode again
        vector_service._get_embedding_cached("test")
        
        assert mock_sentence_transformer.encode.call_count == 2


class TestSimilaritySearch:
    """Test Pinecone similarity search functionality."""
    
    @pytest.mark.asyncio
    async def test_similarity_search_success(self, vector_service, mock_pinecone):
        """Test successful similarity search."""
        _, mock_index = mock_pinecone
        
        # Mock Pinecone query response
        mock_match1 = Mock()
        mock_match1.id = "recipe-1"
        mock_match1.score = 0.95
        mock_match1.metadata = {"title": "Pasta"}
        
        mock_match2 = Mock()
        mock_match2.id = "recipe-2"
        mock_match2.score = 0.87
        mock_match2.metadata = {"title": "Pizza"}
        
        mock_results = Mock()
        mock_results.matches = [mock_match1, mock_match2]
        mock_index.query.return_value = mock_results
        
        query_embedding = [0.1, 0.2, 0.3]
        results = await vector_service.similarity_search(query_embedding, limit=10)
        
        assert len(results) == 2
        assert results[0]["id"] == "recipe-1"
        assert results[0]["score"] == 0.95
        assert results[0]["metadata"]["title"] == "Pasta"
        assert results[1]["id"] == "recipe-2"
        assert results[1]["score"] == 0.87
        
        mock_index.query.assert_called_once_with(
            vector=query_embedding,
            top_k=10,
            include_metadata=True
        )
    
    @pytest.mark.asyncio
    async def test_similarity_search_with_filter(self, vector_service, mock_pinecone):
        """Test similarity search with metadata filter."""
        _, mock_index = mock_pinecone
        
        mock_results = Mock()
        mock_results.matches = []
        mock_index.query.return_value = mock_results
        
        query_embedding = [0.1, 0.2, 0.3]
        filter_dict = {"difficulty": "easy"}
        
        await vector_service.similarity_search(
            query_embedding,
            limit=5,
            filter_dict=filter_dict
        )
        
        mock_index.query.assert_called_once_with(
            vector=query_embedding,
            top_k=5,
            include_metadata=True,
            filter=filter_dict
        )
    
    @pytest.mark.asyncio
    async def test_similarity_search_empty_results(self, vector_service, mock_pinecone):
        """Test similarity search with no results."""
        _, mock_index = mock_pinecone
        
        mock_results = Mock()
        mock_results.matches = []
        mock_index.query.return_value = mock_results
        
        query_embedding = [0.1, 0.2, 0.3]
        results = await vector_service.similarity_search(query_embedding)
        
        assert results == []
    
    @pytest.mark.asyncio
    async def test_similarity_search_invalid_embedding(self, vector_service):
        """Test similarity search with invalid embedding."""
        with pytest.raises(ValueError, match="query_embedding must be a non-empty list"):
            await vector_service.similarity_search([])
        
        with pytest.raises(ValueError, match="query_embedding must be a non-empty list"):
            await vector_service.similarity_search(None)
    
    @pytest.mark.asyncio
    async def test_similarity_search_invalid_limit(self, vector_service):
        """Test similarity search with invalid limit."""
        query_embedding = [0.1, 0.2, 0.3]
        
        with pytest.raises(ValueError, match="limit must be between 1 and 50"):
            await vector_service.similarity_search(query_embedding, limit=0)
        
        with pytest.raises(ValueError, match="limit must be between 1 and 50"):
            await vector_service.similarity_search(query_embedding, limit=51)
    
    @pytest.mark.asyncio
    async def test_similarity_search_pinecone_failure(self, vector_service, mock_pinecone):
        """Test handling of Pinecone query failure."""
        _, mock_index = mock_pinecone
        mock_index.query.side_effect = Exception("Pinecone error")
        
        query_embedding = [0.1, 0.2, 0.3]
        
        with pytest.raises(RuntimeError, match="Pinecone similarity search failed"):
            await vector_service.similarity_search(query_embedding)


class TestSearchRecipes:
    """Test high-level recipe search functionality."""
    
    @pytest.mark.asyncio
    async def test_search_recipes_success(self, vector_service, mock_sentence_transformer, mock_pinecone):
        """Test successful recipe search."""
        _, mock_index = mock_pinecone
        
        # Mock embedding generation
        mock_embedding = [0.1, 0.2, 0.3]
        mock_array = Mock()
        mock_array.tolist.return_value = mock_embedding
        mock_sentence_transformer.encode.return_value = mock_array
        
        # Mock Pinecone results
        mock_match = Mock()
        mock_match.id = "recipe-1"
        mock_match.score = 0.95
        mock_match.metadata = {"title": "Pasta"}
        
        mock_results = Mock()
        mock_results.matches = [mock_match]
        mock_index.query.return_value = mock_results
        
        results = await vector_service.search_recipes("pasta recipe", limit=10)
        
        assert len(results) == 1
        assert results[0]["id"] == "recipe-1"
        assert results[0]["score"] == 0.95
    
    @pytest.mark.asyncio
    async def test_search_recipes_empty_query(self, vector_service):
        """Test search with empty query."""
        with pytest.raises(ValueError, match="Search query cannot be empty"):
            await vector_service.search_recipes("")
    
    @pytest.mark.asyncio
    async def test_search_recipes_whitespace_query(self, vector_service):
        """Test search with whitespace-only query."""
        with pytest.raises(ValueError, match="Search query cannot be empty"):
            await vector_service.search_recipes("   ")
    
    @pytest.mark.asyncio
    async def test_search_recipes_with_filter(self, vector_service, mock_sentence_transformer, mock_pinecone):
        """Test recipe search with metadata filter."""
        _, mock_index = mock_pinecone
        
        mock_embedding = [0.1, 0.2, 0.3]
        mock_array = Mock()
        mock_array.tolist.return_value = mock_embedding
        mock_sentence_transformer.encode.return_value = mock_array
        
        mock_results = Mock()
        mock_results.matches = []
        mock_index.query.return_value = mock_results
        
        filter_dict = {"cuisine_type": "Italian"}
        await vector_service.search_recipes("pasta", limit=5, filter_dict=filter_dict)
        
        mock_index.query.assert_called_once()
        call_kwargs = mock_index.query.call_args[1]
        assert call_kwargs["filter"] == filter_dict


class TestUpsertRecipeEmbedding:
    """Test recipe embedding upsert functionality."""
    
    @pytest.mark.asyncio
    async def test_upsert_recipe_embedding_success(self, vector_service, mock_sentence_transformer, mock_pinecone):
        """Test successful recipe embedding upsert."""
        _, mock_index = mock_pinecone
        
        # Mock embedding generation
        mock_embedding = [0.1, 0.2, 0.3]
        mock_array = Mock()
        mock_array.tolist.return_value = mock_embedding
        mock_sentence_transformer.encode.return_value = mock_array
        
        recipe_id = "recipe-123"
        recipe_text = "Delicious pasta with tomato sauce"
        metadata = {"title": "Pasta", "difficulty": "easy"}
        
        await vector_service.upsert_recipe_embedding(recipe_id, recipe_text, metadata)
        
        mock_index.upsert.assert_called_once()
        upsert_args = mock_index.upsert.call_args[1]["vectors"]
        assert len(upsert_args) == 1
        assert upsert_args[0][0] == recipe_id
        assert upsert_args[0][1] == mock_embedding
        assert upsert_args[0][2] == metadata
    
    @pytest.mark.asyncio
    async def test_upsert_recipe_embedding_without_metadata(self, vector_service, mock_sentence_transformer, mock_pinecone):
        """Test upsert without metadata."""
        _, mock_index = mock_pinecone
        
        mock_embedding = [0.1, 0.2, 0.3]
        mock_array = Mock()
        mock_array.tolist.return_value = mock_embedding
        mock_sentence_transformer.encode.return_value = mock_array
        
        await vector_service.upsert_recipe_embedding("recipe-123", "test recipe")
        
        mock_index.upsert.assert_called_once()
        upsert_args = mock_index.upsert.call_args[1]["vectors"]
        assert upsert_args[0][2] == {}  # Empty metadata
    
    @pytest.mark.asyncio
    async def test_upsert_recipe_embedding_empty_id(self, vector_service):
        """Test upsert with empty recipe ID."""
        with pytest.raises(ValueError, match="recipe_id cannot be empty"):
            await vector_service.upsert_recipe_embedding("", "test recipe")
    
    @pytest.mark.asyncio
    async def test_upsert_recipe_embedding_empty_text(self, vector_service):
        """Test upsert with empty recipe text."""
        with pytest.raises(ValueError, match="recipe_text cannot be empty"):
            await vector_service.upsert_recipe_embedding("recipe-123", "")
    
    @pytest.mark.asyncio
    async def test_upsert_recipe_embedding_pinecone_failure(self, vector_service, mock_sentence_transformer, mock_pinecone):
        """Test handling of Pinecone upsert failure."""
        _, mock_index = mock_pinecone
        
        mock_embedding = [0.1, 0.2, 0.3]
        mock_array = Mock()
        mock_array.tolist.return_value = mock_embedding
        mock_sentence_transformer.encode.return_value = mock_array
        
        mock_index.upsert.side_effect = Exception("Upsert failed")
        
        with pytest.raises(RuntimeError, match="Failed to upsert recipe embedding"):
            await vector_service.upsert_recipe_embedding("recipe-123", "test recipe")


class TestEdgeCases:
    """Test edge cases and error scenarios."""
    
    @pytest.mark.asyncio
    async def test_search_with_special_characters(self, vector_service, mock_sentence_transformer, mock_pinecone):
        """Test search with special characters in query."""
        _, mock_index = mock_pinecone
        
        mock_embedding = [0.1, 0.2, 0.3]
        mock_array = Mock()
        mock_array.tolist.return_value = mock_embedding
        mock_sentence_transformer.encode.return_value = mock_array
        
        mock_results = Mock()
        mock_results.matches = []
        mock_index.query.return_value = mock_results
        
        # Should handle special characters gracefully
        results = await vector_service.search_recipes("pasta & meatballs (Italian)")
        assert results == []
    
    @pytest.mark.asyncio
    async def test_search_with_very_long_query(self, vector_service, mock_sentence_transformer, mock_pinecone):
        """Test search with very long query."""
        _, mock_index = mock_pinecone
        
        mock_embedding = [0.1, 0.2, 0.3]
        mock_array = Mock()
        mock_array.tolist.return_value = mock_embedding
        mock_sentence_transformer.encode.return_value = mock_array
        
        mock_results = Mock()
        mock_results.matches = []
        mock_index.query.return_value = mock_results
        
        long_query = "pasta " * 100
        results = await vector_service.search_recipes(long_query)
        assert results == []
