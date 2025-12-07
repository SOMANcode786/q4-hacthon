from sqlalchemy import Column, String, Text, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from .base import Base


class RAGQuery(Base):
    __tablename__ = "queries"

    id = Column(String, primary_key=True, index=True)
    conversation_id = Column(String, nullable=False)  # Could be a foreign key if conversation table exists
    query_text = Column(Text, nullable=False)
    response_text = Column(Text, nullable=False)
    sources = Column(JSON, nullable=False)  # List of source references used in response
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<RAGQuery(id='{self.id}', conversation_id='{self.conversation_id}')>"