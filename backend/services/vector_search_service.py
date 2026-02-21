"""
Vector search service for semantic recipe search using Pinecone and sentence-transformers.
"""
import os
from typing import List, Optional, Dict
from functools import lru_cache
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone


class VectorSearchService:
    """Service for semantic recipe search using Pinecone vector embeddings."""
    
    def __init__(
        self,
        pinecone_api_key: Optional[str] = None,
        pinecone_environment: Optional[str] = None,
        index_name: str = "recipes",
        embedding_model_name: str = "all-MiniLM-L6-v2"
    ):
        """
        Initialize Pinecone vector search service.
        
        Args:
            pinecone_api_key: Pinecone API key (defaults to PINECONE_API_KEY env var)
            pinecone_environment: Pinecone environment (defaults to PINECONE_ENVIRONMENT env var)
            index_name: Name of the Pinecone index (default: "recipes")
            embedding_model_name: Sentence-transformers model name (default: "all-MiniLM-L6-v2")
            
        Raises:
            ValueError: If required credentials are not provided
            RuntimeError: If Pinecone connection fails
        """
        self.pinecone_api_key = pinecone_api_key or os.getenv("PINECONE_API_KEY")
        self.pinecone_environment = pinecone_environment or os.getenv("PINECONE_ENVIRONMENT")
        self.index_name = index_name
        self.embedding_model_name = embedding_model_name
        
        # Validate credentials
        if not self.pinecone_api_key:
            raise ValueError("PINECONE_API_KEY must be provided or set as environment variable")
        
        if not self.pinecone_environment:
            raise ValueError("PINECONE_ENVIRONMENT must be provided or set as environment variable")
        
        try:
            # Initialize Pinecone client
            self.pc = Pinecone(api_key=self.pinecone_api_key)
            
            # Connect to index
            self.index = self.pc.Index(self.index_name)
            
            # Load sentence-transformers model for embeddings
            self.embeddings_model = SentenceTransformer(self.embedding_model_name)
            
        except Exception as e:
            raise RuntimeError(f"Failed to initialize Pinecone connection: {str(e)}")
    
    @lru_cache(maxsize=1000)
    def _get_embedding_cached(self, text: str) -> tuple:
        """
        Generate embedding with caching (internal method for lru_cache compatibility).
        
        Args:
            text: Text to generate embedding for
            
        Returns:
            Tuple of embedding values (for hashability with lru_cache)
        """
        embedding = self.embeddings_model.encode(text, convert_to_tensor=False)
        return tuple(embedding.tolist())
    
    async def generate_embedding(self, text: str) -> List[float]:
        """
        Generate embedding for text using sentence-transformers.
        Uses caching to avoid recomputation of identical texts.
        
        Args:
            text: Text to generate embedding for
            
        Returns:
            List of float values representing the embedding vector
            
        Raises:
            ValueError: If text is empty
            RuntimeError: If embedding generation fails
        """
        if not text or not text.strip():
            raise ValueError("Text cannot be empty")
        
        try:
            # Use cached version and convert back to list
            embedding_tuple = self._get_embedding_cached(text.strip())
            return list(embedding_tuple)
            
        except Exception as e:
            raise RuntimeError(f"Failed to generate embedding: {str(e)}")
    
    async def similarity_search(
        self,
        query_embedding: List[float],
        limit: int = 10,
        filter_dict: Optional[Dict] = None
    ) -> List[Dict]:
        """
        Perform similarity search in Pinecone using query embedding.
        
        Args:
            query_embedding: Query vector embedding
            limit: Maximum number of results to return (default: 10)
            filter_dict: Optional metadata filters for Pinecone query
            
        Returns:
            List of search results with recipe IDs and scores
            
        Raises:
            ValueError: If query_embedding is invalid or limit is out of range
            RuntimeError: If Pinecone query fails
        """
        # Validate inputs
        if not query_embedding or not isinstance(query_embedding, list):
            raise ValueError("query_embedding must be a non-empty list")
        
        if limit < 1 or limit > 50:
            raise ValueError(f"limit must be between 1 and 50, got {limit}")
        
        try:
            # Query Pinecone index
            query_params = {
                "vector": query_embedding,
                "top_k": limit,
                "include_metadata": True
            }
            
            if filter_dict:
                query_params["filter"] = filter_dict
            
            results = self.index.query(**query_params)
            
            # Extract matches
            matches = []
            if hasattr(results, 'matches'):
                for match in results.matches:
                    matches.append({
                        "id": match.id,
                        "score": match.score,
                        "metadata": match.metadata if hasattr(match, 'metadata') else {}
                    })
            
            return matches
            
        except Exception as e:
            raise RuntimeError(f"Pinecone similarity search failed: {str(e)}")
    
    async def search_recipes(
        self,
        query: str,
        limit: int = 10,
        filter_dict: Optional[Dict] = None
    ) -> List[Dict]:
        """
        Search for recipes using semantic similarity.
        
        Args:
            query: Natural language search query
            limit: Maximum number of results to return (default: 10)
            filter_dict: Optional metadata filters for Pinecone query
            
        Returns:
            List of recipe search results with IDs and relevance scores
            
        Raises:
            ValueError: If query is empty or limit is invalid
            RuntimeError: If search operation fails
        """
        if not query or not query.strip():
            raise ValueError("Search query cannot be empty")
        
        try:
            # Generate embedding for query
            query_embedding = await self.generate_embedding(query)
            
            # Perform similarity search
            results = await self.similarity_search(
                query_embedding=query_embedding,
                limit=limit,
                filter_dict=filter_dict
            )
            
            return results
            
        except ValueError as e:
            # Re-raise validation errors
            raise
        except Exception as e:
            raise RuntimeError(f"Recipe search failed: {str(e)}")
    
    async def upsert_recipe_embedding(
        self,
        recipe_id: str,
        recipe_text: str,
        metadata: Optional[Dict] = None
    ) -> None:
        """
        Generate and store recipe embedding in Pinecone.
        
        Args:
            recipe_id: Unique recipe identifier
            recipe_text: Text representation of recipe for embedding
            metadata: Optional metadata to store with the vector
            
        Raises:
            ValueError: If recipe_id or recipe_text is empty
            RuntimeError: If upsert operation fails
        """
        if not recipe_id or not recipe_id.strip():
            raise ValueError("recipe_id cannot be empty")
        
        if not recipe_text or not recipe_text.strip():
            raise ValueError("recipe_text cannot be empty")
        
        try:
            # Generate embedding
            embedding = await self.generate_embedding(recipe_text)
            
            # Prepare upsert data
            upsert_data = [(recipe_id, embedding, metadata or {})]
            
            # Upsert to Pinecone
            self.index.upsert(vectors=upsert_data)
            
        except ValueError as e:
            # Re-raise validation errors
            raise
        except Exception as e:
            raise RuntimeError(f"Failed to upsert recipe embedding: {str(e)}")
    
    def clear_embedding_cache(self) -> None:
        """Clear the embedding cache."""
        self._get_embedding_cached.cache_clear()
