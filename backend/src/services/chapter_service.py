from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, delete
from ..models.chapter import Chapter
from ..lib.errors import ContentNotFoundException


class ChapterService:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def create_chapter(self, chapter_data: Dict[str, Any]) -> Chapter:
        """Create a new chapter"""
        chapter = Chapter(**chapter_data)
        self.db_session.add(chapter)
        await self.db_session.commit()
        await self.db_session.refresh(chapter)
        return chapter

    async def get_chapter_by_id(self, chapter_id: str) -> Optional[Chapter]:
        """Get a chapter by its ID"""
        result = await self.db_session.execute(
            select(Chapter).where(Chapter.id == chapter_id)
        )
        chapter = result.scalar_one_or_none()
        return chapter

    async def get_all_chapters(self) -> List[Chapter]:
        """Get all chapters"""
        result = await self.db_session.execute(
            select(Chapter).order_by(Chapter.id)
        )
        chapters = result.scalars().all()
        return chapters

    async def update_chapter(self, chapter_id: str, chapter_data: Dict[str, Any]) -> Optional[Chapter]:
        """Update a chapter"""
        # Check if chapter exists
        chapter = await self.get_chapter_by_id(chapter_id)
        if not chapter:
            return None

        # Update chapter with provided data
        for key, value in chapter_data.items():
            setattr(chapter, key, value)

        await self.db_session.commit()
        await self.db_session.refresh(chapter)
        return chapter

    async def delete_chapter(self, chapter_id: str) -> bool:
        """Delete a chapter"""
        chapter = await self.get_chapter_by_id(chapter_id)
        if not chapter:
            return False

        await self.db_session.delete(chapter)
        await self.db_session.commit()
        return True

    async def get_chapter_by_title(self, title: str) -> Optional[Chapter]:
        """Get a chapter by its title"""
        result = await self.db_session.execute(
            select(Chapter).where(Chapter.title == title)
        )
        chapter = result.scalar_one_or_none()
        return chapter

    async def get_chapters_by_word_count_range(self, min_words: int, max_words: int) -> List[Chapter]:
        """Get chapters within a specific word count range"""
        result = await self.db_session.execute(
            select(Chapter)
            .where(Chapter.word_count >= min_words)
            .where(Chapter.word_count <= max_words)
            .order_by(Chapter.word_count)
        )
        chapters = result.scalars().all()
        return chapters