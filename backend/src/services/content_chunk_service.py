from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, delete
from ..models.content_chunk import ContentChunk
from ..lib.errors import ContentNotFoundException


class ContentChunkService:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def create_content_chunk(self, chunk_data: Dict[str, Any]) -> ContentChunk:
        """Create a new content chunk"""
        chunk = ContentChunk(**chunk_data)
        self.db_session.add(chunk)
        await self.db_session.commit()
        await self.db_session.refresh(chunk)
        return chunk

    async def get_content_chunk_by_id(self, chunk_id: str) -> Optional[ContentChunk]:
        """Get a content chunk by its ID"""
        result = await self.db_session.execute(
            select(ContentChunk).where(ContentChunk.id == chunk_id)
        )
        chunk = result.scalar_one_or_none()
        return chunk

    async def get_content_chunks_by_chapter_id(self, chapter_id: str) -> List[ContentChunk]:
        """Get all content chunks for a specific chapter"""
        result = await self.db_session.execute(
            select(ContentChunk)
            .where(ContentChunk.chapter_id == chapter_id)
            .order_by(ContentChunk.id)
        )
        chunks = result.scalars().all()
        return chunks

    async def update_content_chunk(self, chunk_id: str, chunk_data: Dict[str, Any]) -> Optional[ContentChunk]:
        """Update a content chunk"""
        # Check if chunk exists
        chunk = await self.get_content_chunk_by_id(chunk_id)
        if not chunk:
            return None

        # Update chunk with provided data
        for key, value in chunk_data.items():
            setattr(chunk, key, value)

        await self.db_session.commit()
        await self.db_session.refresh(chunk)
        return chunk

    async def delete_content_chunk(self, chunk_id: str) -> bool:
        """Delete a content chunk"""
        chunk = await self.get_content_chunk_by_id(chunk_id)
        if not chunk:
            return False

        await self.db_session.delete(chunk)
        await self.db_session.commit()
        return True

    async def get_all_content_chunks(self) -> List[ContentChunk]:
        """Get all content chunks"""
        result = await self.db_session.execute(
            select(ContentChunk).order_by(ContentChunk.id)
        )
        chunks = result.scalars().all()
        return chunks

    async def search_content_chunks(self, query: str, chapter_ids: List[str] = None) -> List[Dict[str, Any]]:
        """Search for content chunks relevant to the query using vector similarity"""
        from ..services.vector_store import VectorStore
        from ..services.openai_client import OpenAIClient

        # Initialize services
        openai_client = OpenAIClient()

        # Create embedding for the query
        query_embedding = await openai_client.embed_text(query)

        # Search in vector store
        vector_store = VectorStore()
        search_results = await vector_store.search_similar(query_embedding, limit=10)

        # Extract content chunks from search results
        results = []
        for result in search_results:
            payload = result['payload']
            results.append({
                'id': result['id'],
                'content': payload.get('content', ''),
                'source_url': payload.get('source_url', ''),
                'chapter_id': payload.get('chapter_id', ''),
                'score': result['score']
            })

        return results