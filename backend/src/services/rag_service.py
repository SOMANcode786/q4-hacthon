from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
import logging
import uuid

from ..models.chapter import Chapter
from ..models.content_chunk import ContentChunk
from ..services.content_chunk_service import ContentChunkService
from ..services.openai_client import OpenAIClient
from ..services.vector_store import VectorStore

logger = logging.getLogger(__name__)


class RAGService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.content_chunk_service = ContentChunkService(db)
        self.openai_client = OpenAIClient()
        self.vector_store = VectorStore()

    async def answer_question(self, question: str, chapter_ids: List[str] = None) -> Dict[str, Any]:
        """
        Answer a question using RAG (Retrieval-Augmented Generation)
        """
        try:
            # Search for relevant content chunks
            relevant_chunks = await self.content_chunk_service.search_content_chunks(
                question,
                chapter_ids if chapter_ids else []
            )

            if not relevant_chunks:
                return {
                    "answer": "I couldn't find any relevant information to answer your question.",
                    "sources": [],
                    "context": []
                }

            # Prepare context from the most relevant chunks
            context = "\n\n".join([chunk['content'] for chunk in relevant_chunks[:5]])  # Use top 5 chunks
            sources = list(set([chunk['source_url'] for chunk in relevant_chunks]))

            # Generate answer using OpenAI
            prompt = f"""
            Answer the following question based on the provided context.

            Context: {context}

            Question: {question}

            Answer:
            """

            answer = await self.openai_client.generate_response(prompt)

            return {
                "answer": answer,
                "sources": sources,
                "context": [chunk['content'] for chunk in relevant_chunks[:3]]  # Return top 3 contexts
            }
        except Exception as e:
            logger.error(f"Error in answer_question: {str(e)}")
            raise e

    async def chat(self, message: str, conversation_id: str = None, chapter_ids: List[str] = None) -> Dict[str, Any]:
        """
        Handle a chat conversation with the RAG system
        """
        try:
            # Generate a new conversation ID if not provided
            if not conversation_id:
                conversation_id = str(uuid.uuid4())

            # Search for relevant content chunks
            relevant_chunks = await self.content_chunk_service.search_content_chunks(
                message,
                chapter_ids if chapter_ids else []
            )

            if not relevant_chunks:
                return {
                    "response": "I couldn't find any relevant information to respond to your message. I can help you with questions about Physical AI and Humanoid Robotics based on the educational content.",
                    "conversation_id": conversation_id,
                    "sources": []
                }

            # Prepare context from the most relevant chunks
            context = "\n\n".join([chunk['content'] for chunk in relevant_chunks[:5]])  # Use top 5 chunks
            sources = list(set([chunk['source_url'] for chunk in relevant_chunks]))

            # Generate response using OpenAI
            prompt = f"""
            You are an AI assistant for a Physical AI & Humanoid Robotics educational platform.
            Answer the following message based on the provided context and your general knowledge.

            Context: {context}

            User message: {message}

            Assistant response:
            """

            response = await self.openai_client.generate_response(prompt)

            return {
                "response": response,
                "conversation_id": conversation_id,
                "sources": sources
            }
        except Exception as e:
            logger.error(f"Error in chat: {str(e)}")
            raise e