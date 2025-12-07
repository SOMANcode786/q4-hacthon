# Research: Physical AI & Humanoid Robotics Book + RAG Chatbot

**Date**: 2025-12-07

## Architecture Decisions

### Docusaurus Theme and Layout
- **Decision**: Use Docusaurus Classic theme with custom styling
- **Rationale**: Balances speed of development with good UX; can customize CSS for better appearance without complex React component development
- **Alternatives considered**:
  - Custom UI from scratch (rejected: too time-consuming)
  - Third-party themes (rejected: limited customization for chatbot integration)

### RAG Storage Method
- **Decision**: Qdrant Cloud
- **Rationale**: Provides scalability, managed service, and better performance for production use; easier to maintain than local instance
- **Alternatives considered**:
  - Local Qdrant (rejected: harder to scale and maintain in production)

### Embedding Model
- **Decision**: OpenAI text-embedding-ada-002
- **Rationale**: High accuracy, well-integrated with OpenAI ecosystem, proven reliability; important for RAG accuracy requirements
- **Alternatives considered**:
  - Open-source models like Sentence Transformers (rejected: may not meet 90%+ accuracy requirement)

### Chatbot Interaction Model
- **Decision**: Floating widget integrated into Docusaurus pages
- **Rationale**: Provides high visibility and accessibility while maintaining focus on book content; users can easily access help without leaving the page
- **Alternatives considered**:
  - Page-embedded chat (rejected: might disrupt reading experience)

### Synthetic Data Generation Approach (Module 3)
- **Decision**: NVIDIA Isaac Sim
- **Rationale**: Provides NVIDIA-accelerated simulation with photorealistic rendering and ground-truth annotation; aligns with chapter focus on Isaac ecosystem
- **Alternatives considered**:
  - Custom Unity pipeline (rejected: would require additional technology stack)

## Technology Research Findings

### Docusaurus Integration
- Docusaurus supports custom React components that can be integrated into MDX pages
- Floating widgets can be implemented using React portals
- GitHub Pages deployment is straightforward with Docusaurus

### RAG Pipeline Architecture
- FastAPI provides async capabilities for handling multiple concurrent requests
- Qdrant provides efficient vector similarity search
- OpenAI Agents framework allows for context-aware responses
- Neon Postgres can store metadata and conversation history

### ROS 2 Integration
- ROS 2 Humble Hawksbill is LTS and well-supported
- Gazebo Harmonic provides modern simulation capabilities
- Isaac Sim 2023.1+ supports latest features for synthetic data generation

## Implementation Patterns

### Book Content Structure
- Each chapter follows consistent format: introduction, concepts, examples, exercises
- Code examples use fenced code blocks with language-specific highlighting
- Diagrams embedded as static assets with descriptive alt text

### RAG Pipeline Flow
1. Book content processed and chunked into semantic segments
2. Embeddings generated using OpenAI text-embedding model
3. Vector storage in Qdrant with metadata linking to source chapters
4. Query processing through FastAPI endpoint
5. Similarity search and context retrieval
6. OpenAI response generation with source attribution

### Quality Assurance
- Automated plagiarism checks using text similarity algorithms
- Factual verification by cross-referencing with official documentation
- Build verification to ensure all links and code blocks work correctly