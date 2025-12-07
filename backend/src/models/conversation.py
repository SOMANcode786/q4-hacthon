from sqlalchemy import Column, String, DateTime, JSON
from sqlalchemy.sql import func
from .base import Base


class RAGConversation(Base):
    __tablename__ = "conversations"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, nullable=True)  # Anonymous for book readers
    queries = Column(JSON, nullable=False)  # List of user queries and system responses
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<RAGConversation(id='{self.id}', user_id='{self.user_id}')>"