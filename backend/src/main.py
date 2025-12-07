from fastapi import FastAPI
from src.api import content_routes, rag_routes
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Physical AI & Humanoid Robotics RAG API",
    description="API for the Physical AI & Humanoid Robotics Book RAG chatbot system",
    version="1.0.0"
)

# Include API routes
app.include_router(content_routes.router, prefix="/api/content", tags=["content"])
app.include_router(rag_routes.router, prefix="/api/rag", tags=["rag"])

@app.get("/")
def read_root():
    return {"message": "Physical AI & Humanoid Robotics RAG API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("src.main:app", host="0.0.0.0", port=port, reload=True)