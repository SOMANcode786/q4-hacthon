import os
from typing import List, Dict, Any
import logging
from qdrant_client import QdrantClient
from qdrant_client.http import models
from qdrant_client.http.models import PointStruct
from dotenv import load_dotenv
import random

load_dotenv()

logger = logging.getLogger(__name__)


class VectorStore:
    def __init__(self):
        qdrant_url = os.getenv("QDRANT_URL", "http://localhost:6333")
        qdrant_api_key = os.getenv("QDRANT_API_KEY")

        try:
            if qdrant_api_key:
                self.client = QdrantClient(url=qdrant_url, api_key=qdrant_api_key)
            else:
                self.client = QdrantClient(url=qdrant_url)

            # Collection name for content chunks
            self.collection_name = "content_chunks"
            self._init_collection()
            self.is_available = True
        except Exception as e:
            logger.error(f"Error connecting to Qdrant: {str(e)}")
            logger.warning("Qdrant not available, using mock storage")
            self.client = None
            self.is_available = False

    def _init_collection(self):
        """
        Initialize the Qdrant collection if it doesn't exist
        """
        try:
            # Check if collection exists
            collections = self.client.get_collections()
            collection_exists = any(col.name == self.collection_name for col in collections.collections)

            if not collection_exists:
                # Create collection with vector configuration
                self.client.recreate_collection(
                    collection_name=self.collection_name,
                    vectors_config=models.VectorParams(
                        size=1536,  # Default size for OpenAI embeddings
                        distance=models.Distance.COSINE
                    )
                )
                logger.info(f"Created Qdrant collection: {self.collection_name}")
            else:
                logger.info(f"Qdrant collection {self.collection_name} already exists")
        except Exception as e:
            logger.error(f"Error initializing Qdrant collection: {str(e)}")
            raise e

    async def store_embedding(self, id: str, embedding: List[float], payload: Dict[str, Any]):
        """
        Store an embedding in the vector store, with fallback to mock storage
        """
        if not self.is_available:
            logger.warning("Qdrant not available, skipping embedding storage")
            # In a real implementation, you might want to store this in a local database
            return

        try:
            points = [PointStruct(
                id=id,
                vector=embedding,
                payload=payload
            )]

            self.client.upsert(
                collection_name=self.collection_name,
                points=points
            )
            logger.info(f"Stored embedding for ID: {id}")
        except Exception as e:
            logger.error(f"Error storing embedding: {str(e)}")
            raise e

    async def search_similar(self, query_embedding: List[float], limit: int = 10) -> List[Dict[str, Any]]:
        """
        Search for similar embeddings in the vector store, with fallback to mock search
        """
        if not self.is_available:
            logger.warning("Qdrant not available, returning mock search results")
            # Return mock search results for development
            mock_results = []
            for i in range(min(limit, 3)):  # Return up to 3 mock results
                mock_results.append({
                    "id": f"mock_chunk_{i}",
                    "score": random.uniform(0.5, 0.9),
                    "payload": {
                        "content": f"This is mock content result {i} for development purposes. In production, this would come from the vector database based on your query.",
                        "source_url": f"https://example.com/mock-source-{i}",
                        "chapter_id": f"mock-chapter-{i}"
                    }
                })
            return mock_results

        try:
            results = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_embedding,
                limit=limit
            )

            return [
                {
                    "id": result.id,
                    "score": result.score,
                    "payload": result.payload
                }
                for result in results
            ]
        except Exception as e:
            logger.error(f"Error searching embeddings: {str(e)}")
            # Return mock results when search fails
            mock_results = []
            for i in range(min(limit, 2)):  # Return up to 2 mock results
                mock_results.append({
                    "id": f"mock_chunk_error_{i}",
                    "score": random.uniform(0.3, 0.7),
                    "payload": {
                        "content": f"Error occurred during search: {str(e)[:100]}... This is a mock result due to the error. In production, this would come from the vector database.",
                        "source_url": f"https://example.com/error-source-{i}",
                        "chapter_id": f"error-chapter-{i}"
                    }
                })
            return mock_results

    async def delete_embedding(self, id: str):
        """
        Delete an embedding by ID, with fallback for mock storage
        """
        if not self.is_available:
            logger.warning("Qdrant not available, skipping embedding deletion")
            return

        try:
            self.client.delete(
                collection_name=self.collection_name,
                points_selector=models.PointIdsList(
                    points=[id]
                )
            )
            logger.info(f"Deleted embedding for ID: {id}")
        except Exception as e:
            logger.error(f"Error deleting embedding: {str(e)}")
            raise e