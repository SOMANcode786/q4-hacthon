# Quickstart Guide: Physical AI & Humanoid Robotics Book + RAG Chatbot

**Date**: 2025-12-07

## Prerequisites

### System Requirements
- Ubuntu 20.04 or later (for ROS 2 and simulation components)
- Node.js 18+ and npm/yarn (for Docusaurus book)
- Python 3.11+ (for FastAPI backend)
- Docker and Docker Compose (for local development)
- NVIDIA GPU with CUDA 11.8+ (for Isaac Sim - optional for basic functionality)

### Development Tools
- Git for version control
- VS Code or similar IDE with Python/JavaScript extensions
- ROS 2 Humble Hawksbill installed
- OpenAI API key for RAG functionality

## Setting Up the Development Environment

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Set Up Book Environment (Docusaurus)
```bash
cd book
npm install
```

### 3. Set Up Backend Environment (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Set Up Environment Variables
Create `.env` files in both `book/` and `backend/` directories:

**book/.env:**
```
# No special environment variables needed for static book
```

**backend/.env:**
```
OPENAI_API_KEY=your_openai_api_key
QDRANT_URL=your_qdrant_cluster_url
QDRANT_API_KEY=your_qdrant_api_key
NEON_DATABASE_URL=your_neon_postgres_connection_string
```

## Running the Development Servers

### 1. Start the Book Server
```bash
cd book
npm start
```
The book will be available at `http://localhost:3000`

### 2. Start the Backend Server
```bash
cd backend
source venv/bin/activate
uvicorn src.api.main:app --reload --port 8000
```
The backend API will be available at `http://localhost:8000`

### 3. Running Both Together
For development, you may want to run both servers simultaneously. Consider using `tmux`, `screen`, or a process manager like `concurrently`.

## Building the Book for Production

### 1. Build Static Assets
```bash
cd book
npm run build
```

### 2. Serve Built Version Locally
```bash
npm run serve
```

## Running the RAG System

### 1. Index Book Content
```bash
cd backend
source venv/bin/activate
python -m src.services.indexer --book-content-path ../book/docs
```

### 2. Test the RAG API
```bash
curl -X POST http://localhost:8000/api/rag/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What is ROS 2?", "context": "chapter-1-introduction"}'
```

## Testing the System

### 1. Unit Tests
```bash
# Backend tests
cd backend
python -m pytest tests/unit/

# Frontend tests (if any)
cd book
npm test
```

### 2. Integration Tests
```bash
# Backend integration tests
cd backend
python -m pytest tests/integration/
```

## Deploying to GitHub Pages

### 1. Configure GitHub Actions
Ensure your repository has the necessary GitHub Actions workflow files for deployment. The workflow should:
- Build the Docusaurus book
- Deploy to GitHub Pages
- Update the RAG index when content changes

### 2. Manual Deployment
```bash
cd book
GIT_USER=<Your GitHub username> USE_SSH=true npm run deploy
```

## Adding New Book Content

### 1. Create a New Chapter
```bash
# In the book/docs directory
touch docs/module-x-new-topic.md
```

### 2. Add Chapter to Sidebar
Edit `book/sidebars.js` to include your new chapter in the navigation.

### 3. Index New Content
After adding new content, re-index it for the RAG system:
```bash
cd backend
python -m src.services.indexer --book-content-path ../book/docs --rebuild
```

## Troubleshooting

### Common Issues

1. **OpenAPI Key Not Working**
   - Verify your API key is correct
   - Check that your billing account is active
   - Ensure the key has proper permissions

2. **Qdrant Connection Issues**
   - Verify your Qdrant URL and API key
   - Check that your Qdrant cluster is active
   - Ensure network connectivity

3. **Docusaurus Build Errors**
   - Clear cache: `npm run clear`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check for syntax errors in MDX files

### Development Tips

- Use the development servers for real-time editing
- Test RAG queries with various prompts to ensure accuracy
- Verify all links and citations in your content
- Run plagiarism checks before finalizing content