from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from ..models.chapter import Chapter
from ..models.content_chunk import ContentChunk
from ..services.chapter_service import ChapterService
from ..services.content_chunk_service import ContentChunkService
from ..models.base import get_db
from ..lib.errors import ContentNotFoundException, handle_rag_exception
from pydantic import BaseModel
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


# Pydantic models for request/response
class ChapterRequest(BaseModel):
    id: str
    title: str
    content: str
    word_count: int
    sources: List[str]
    diagrams: List[str] = []
    code_examples: List[str] = []


class ChapterResponse(BaseModel):
    id: str
    title: str
    content: str
    word_count: int
    sources: List[str]
    diagrams: List[str]
    code_examples: List[str]


class ContentChunkRequest(BaseModel):
    id: str
    chapter_id: str
    content: str
    embedding: List[float] = []
    source_url: str


class ContentChunkResponse(BaseModel):
    id: str
    chapter_id: str
    content: str
    embedding: List[float] = []
    source_url: str


@router.get("/chapters", response_model=List[ChapterResponse])
async def get_all_chapters(db: AsyncSession = Depends(get_db)):
    """Get all book chapters"""
    try:
        service = ChapterService(db)
        chapters = await service.get_all_chapters()
        return chapters
    except Exception as e:
        logger.error(f"Error getting all chapters: {str(e)}")
        raise handle_rag_exception(ContentNotFoundException("Failed to retrieve chapters"))


@router.get("/chapters/{chapter_id}", response_model=ChapterResponse)
async def get_chapter_by_id(chapter_id: str, db: AsyncSession = Depends(get_db)):
    """Get a specific chapter by ID"""
    try:
        service = ChapterService(db)
        chapter = await service.get_chapter_by_id(chapter_id)
        if not chapter:
            raise ContentNotFoundException(f"Chapter with ID {chapter_id} not found")
        return chapter
    except ContentNotFoundException:
        raise handle_rag_exception(ContentNotFoundException(f"Chapter with ID {chapter_id} not found"))
    except Exception as e:
        logger.error(f"Error getting chapter {chapter_id}: {str(e)}")
        raise handle_rag_exception(ContentNotFoundException(f"Failed to retrieve chapter {chapter_id}"))


@router.post("/chapters", response_model=ChapterResponse)
async def create_chapter(chapter_data: ChapterRequest, db: AsyncSession = Depends(get_db)):
    """Create a new chapter"""
    try:
        service = ChapterService(db)
        chapter = await service.create_chapter(chapter_data.dict())
        logger.info(f"Created chapter with ID: {chapter.id}")
        return chapter
    except Exception as e:
        logger.error(f"Error creating chapter: {str(e)}")
        raise handle_rag_exception(ContentNotFoundException(f"Failed to create chapter: {str(e)}"))


@router.put("/chapters/{chapter_id}", response_model=ChapterResponse)
async def update_chapter(chapter_id: str, chapter_data: ChapterRequest, db: AsyncSession = Depends(get_db)):
    """Update an existing chapter"""
    try:
        service = ChapterService(db)
        updated_chapter = await service.update_chapter(chapter_id, chapter_data.dict())
        if not updated_chapter:
            raise ContentNotFoundException(f"Chapter with ID {chapter_id} not found")
        logger.info(f"Updated chapter with ID: {chapter_id}")
        return updated_chapter
    except ContentNotFoundException:
        raise handle_rag_exception(ContentNotFoundException(f"Chapter with ID {chapter_id} not found"))
    except Exception as e:
        logger.error(f"Error updating chapter {chapter_id}: {str(e)}")
        raise handle_rag_exception(ContentNotFoundException(f"Failed to update chapter {chapter_id}"))


@router.delete("/chapters/{chapter_id}")
async def delete_chapter(chapter_id: str, db: AsyncSession = Depends(get_db)):
    """Delete a chapter"""
    try:
        service = ChapterService(db)
        success = await service.delete_chapter(chapter_id)
        if not success:
            raise ContentNotFoundException(f"Chapter with ID {chapter_id} not found")
        logger.info(f"Deleted chapter with ID: {chapter_id}")
        return {"message": "Chapter deleted successfully"}
    except ContentNotFoundException:
        raise handle_rag_exception(ContentNotFoundException(f"Chapter with ID {chapter_id} not found"))
    except Exception as e:
        logger.error(f"Error deleting chapter {chapter_id}: {str(e)}")
        raise handle_rag_exception(ContentNotFoundException(f"Failed to delete chapter {chapter_id}"))


@router.get("/chunks/chapter/{chapter_id}", response_model=List[ContentChunkResponse])
async def get_content_chunks_by_chapter(chapter_id: str, db: AsyncSession = Depends(get_db)):
    """Get all content chunks for a specific chapter"""
    try:
        service = ContentChunkService(db)
        chunks = await service.get_content_chunks_by_chapter_id(chapter_id)
        return chunks
    except Exception as e:
        logger.error(f"Error getting content chunks for chapter {chapter_id}: {str(e)}")
        raise handle_rag_exception(ContentNotFoundException(f"Failed to retrieve content chunks for chapter {chapter_id}"))