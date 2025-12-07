from sqlalchemy import Column, String, Text, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .base import Base


class ContentChunk(Base):
    __tablename__ = "content_chunks"

    id = Column(String, primary_key=True, index=True)
    chapter_id = Column(String, ForeignKey("chapters.id"), nullable=False)
    content = Column(Text, nullable=False)  # Chunked content for vector indexing
    embedding = Column(JSON, nullable=True)  # Vector embedding of the content
    source_url = Column(String, nullable=False)  # URL reference to original content location
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship to Chapter
    chapter = relationship("Chapter", back_populates="content_chunks")

    def __repr__(self):
        return f"<ContentChunk(id='{self.id}', chapter_id='{self.chapter_id}')>"


# Add relationship to Chapter model
# Relationship will be handled via string reference to avoid circular import