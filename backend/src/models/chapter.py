from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .base import Base


class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)  # Markdown content
    word_count = Column(Integer, nullable=False)
    sources = Column(JSON, nullable=False)  # List of APA-cited sources
    diagrams = Column(JSON, nullable=True)  # List of diagram/file references
    code_examples = Column(JSON, nullable=True)  # List of runnable code examples
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship to ContentChunk
    content_chunks = relationship("ContentChunk", order_by="ContentChunk.id", back_populates="chapter")

    def __repr__(self):
        return f"<Chapter(id='{self.id}', title='{self.title}')>"