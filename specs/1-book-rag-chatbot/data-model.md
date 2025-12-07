# Data Model: Physical AI & Humanoid Robotics Book + RAG Chatbot

**Date**: 2025-12-07

## Core Entities

### Book Chapter
- **Fields**:
  - id (string): Unique identifier for the chapter
  - title (string): Chapter title
  - content (string): Markdown content of the chapter
  - wordCount (integer): Number of words in the chapter
  - sources (array): List of APA-cited sources used in the chapter
  - diagrams (array): List of diagram/file references
  - codeExamples (array): List of runnable code examples
  - createdAt (datetime): Creation timestamp
  - updatedAt (datetime): Last update timestamp

- **Relationships**:
  - One-to-many with ContentChunk (for RAG indexing)
  - One-to-many with Exercise (hands-on exercises)

- **Validation rules**:
  - Title must be 5-100 characters
  - Content must be between 1,200-2,000 words for individual modules
  - Sources must include at least 3 references
  - All technical claims must be verifiable against documentation

### Content Chunk
- **Fields**:
  - id (string): Unique identifier for the chunk
  - chapterId (string): Reference to parent chapter
  - content (string): Chunked content for vector indexing
  - embedding (array): Vector embedding of the content
  - sourceUrl (string): URL reference to original content location
  - createdAt (datetime): Creation timestamp

- **Relationships**:
  - Many-to-one with Book Chapter
  - One-to-many with Vector Embedding

- **Validation rules**:
  - Content must be between 100-500 words for optimal RAG performance
  - Must have valid embedding before storage
  - Source URL must be valid and point to book content

### Vector Embedding
- **Fields**:
  - id (string): Unique identifier for the embedding
  - contentChunkId (string): Reference to parent content chunk
  - vector (array): High-dimensional vector representation
  - metadata (object): Additional information (source, chapter, etc.)
  - createdAt (datetime): Creation timestamp

- **Relationships**:
  - Many-to-one with Content Chunk

- **Validation rules**:
  - Vector must have correct dimensions (1536 for OpenAI ada-002)
  - Must be associated with a valid content chunk

### RAG Conversation
- **Fields**:
  - id (string): Unique identifier for the conversation
  - userId (string): User identifier (anonymous for book readers)
  - queries (array): List of user queries and system responses
  - createdAt (datetime): Creation timestamp
  - updatedAt (datetime): Last interaction timestamp

- **Relationships**:
  - One-to-many with RAG Query

- **Validation rules**:
  - Must not store personal information
  - Queries must be sanitized for security

### RAG Query
- **Fields**:
  - id (string): Unique identifier for the query
  - conversationId (string): Reference to parent conversation
  - queryText (string): Original user query
  - responseText (string): AI-generated response
  - sources (array): List of source references used in response
  - timestamp (datetime): When query was made

- **Relationships**:
  - Many-to-one with RAG Conversation
  - Many-to-many with Content Chunk (through response sources)

- **Validation rules**:
  - Response must only contain information from book content
  - Sources must be properly attributed

## State Transitions

### Chapter Publication Workflow
1. **Draft**: Chapter is being written, content is incomplete
2. **Review**: Chapter is complete, awaiting fact-checking and citation verification
3. **Published**: Chapter has passed all quality checks and is available in the book

### Content Chunk Processing
1. **Created**: Content chunk is generated from book chapter
2. **Embedding Pending**: Awaiting vector embedding generation
3. **Embedded**: Vector embedding is complete and stored
4. **Indexed**: Chunk is available for RAG queries

## Data Validation Rules

### Book Content Validation
- All chapters must have proper APA citations (minimum 3 per chapter)
- Technical claims must be verifiable against official documentation
- Code examples must be runnable and include setup instructions
- Content must pass plagiarism checks (0% tolerance)

### RAG System Validation
- Responses must only contain information from indexed book content
- Source attribution must be accurate and complete
- Vector embeddings must be properly generated and stored
- Query responses must be under 1.5s P95 response time