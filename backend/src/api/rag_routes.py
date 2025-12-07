from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
import logging

from ..models.chapter import Chapter
from ..models.content_chunk import ContentChunk
from ..models.base import get_db
from ..lib.errors import ContentNotFoundException, handle_rag_exception
from ..services.rag_service import RAGService
from ..services.content_chunk_service import ContentChunkService

router = APIRouter()
logger = logging.getLogger(__name__)


class QuestionRequest(BaseModel):
    question: str
    chapter_ids: List[str] = []


class AnswerResponse(BaseModel):
    answer: str
    sources: List[str]
    context: List[str]


class ChatRequest(BaseModel):
    message: str
    conversation_id: str = None
    chapter_ids: List[str] = []


class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    sources: List[str]


@router.post("/ask", response_model=AnswerResponse)
async def ask_question(request: QuestionRequest, db: AsyncSession = Depends(get_db)):
    """Ask a question and get an answer using RAG"""
    try:
        rag_service = RAGService(db)
        result = await rag_service.answer_question(request.question, request.chapter_ids)
        return result
    except Exception as e:
        logger.error(f"Error processing question: {str(e)}")
        raise handle_rag_exception(ContentNotFoundException(f"Failed to process question: {str(e)}"))


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, db: AsyncSession = Depends(get_db)):
    """Chat with the RAG system"""
    try:
        rag_service = RAGService(db)
        result = await rag_service.chat(request.message, request.conversation_id, request.chapter_ids)
        return result
    except Exception as e:
        logger.error(f"Error processing chat: {str(e)}")
        raise handle_rag_exception(ContentNotFoundException(f"Failed to process chat: {str(e)}"))


@router.post("/search", response_model=List[dict])
async def search_content(query: str, chapter_ids: List[str] = [], db: AsyncSession = Depends(get_db)):
    """Search for content chunks relevant to the query"""
    try:
        content_service = ContentChunkService(db)
        results = await content_service.search_content_chunks(query, chapter_ids)
        return results
    except Exception as e:
        logger.error(f"Error searching content: {str(e)}")
        raise handle_rag_exception(ContentNotFoundException(f"Failed to search content: {str(e)}"))