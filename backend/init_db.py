import asyncio
import uuid
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os
import sys
import random

# Add the src directory to the path so we can import the models
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from src.models.base import Base
from src.models.chapter import Chapter
from src.models.content_chunk import ContentChunk

# Load environment variables
load_dotenv()

async def init_db():
    # Use a local SQLite database for development
    database_url = "sqlite+aiosqlite:///./physical_ai_rag.db"
    print(f"Using database URL: {database_url}")

    # Create async engine
    engine = create_async_engine(database_url)

    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Create async session
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    # Sample content for the RAG system
    sample_chapters = [
        {
            "id": "ch-physical-ai-intro",
            "title": "Introduction to Physical AI",
            "content": "# Introduction to Physical AI\n\nPhysical AI is a field that bridges the gap between digital artificial intelligence and physical interaction. It focuses on creating AI systems that can understand, interact with, and operate in the physical world effectively.\n\n## Key Concepts\n- Embodied intelligence\n- Digital-to-physical gap\n- Simulation-first design",
            "word_count": 150,
            "sources": [
                {
                    "title": "Physical AI: From Theory to Practice",
                    "author": "Smith, J.",
                    "year": 2023,
                    "url": "/docs/intro"
                }
            ]
        },
        {
            "id": "ch-ros2-nervous-system",
            "title": "The Robotic Nervous System (ROS 2)",
            "content": "# The Robotic Nervous System (ROS 2)\n\nROS 2 (Robot Operating System 2) provides the communication framework for robotic systems. It enables different components of a robot to communicate with each other through topics, services, and actions.\n\n## Core Components\n- Nodes\n- Topics\n- Services\n- Actions",
            "word_count": 200,
            "sources": [
                {
                    "title": "ROS 2 for Humanoid Robotics",
                    "author": "Johnson, A.",
                    "year": 2023,
                    "url": "/docs/module-2/ros2-intro"
                }
            ]
        },
        {
            "id": "ch-digital-twin",
            "title": "The Digital Twin (Gazebo & Unity)",
            "content": "# The Digital Twin (Gazebo & Unity)\n\nA digital twin is a virtual replica of a physical system. In robotics, digital twins allow for simulation-based development and testing before deploying to real hardware, reducing risks and costs.\n\n## Benefits\n- Safe testing environment\n- Cost reduction\n- Iterative development",
            "word_count": 180,
            "sources": [
                {
                    "title": "Digital Twins in Robotics",
                    "author": "Williams, R.",
                    "year": 2023,
                    "url": "/docs/module-3/digital-twin-intro"
                }
            ]
        },
        {
            "id": "ch-ai-brain",
            "title": "The AI-Robot Brain (NVIDIA Isaac)",
            "content": "# The AI-Robot Brain (NVIDIA Isaac)\n\nNVIDIA Isaac is a comprehensive robotics platform that includes simulation, navigation, manipulation, and AI capabilities. It provides tools for developing and deploying AI-powered robots.\n\n## Key Features\n- Isaac Sim\n- Isaac ROS\n- Navigation systems",
            "word_count": 170,
            "sources": [
                {
                    "title": "NVIDIA Isaac Platform Guide",
                    "author": "Chen, L.",
                    "year": 2023,
                    "url": "/docs/module-4/ai-robot-brain-intro"
                }
            ]
        }
    ]

    sample_content_chunks = [
        {
            "chapter_id": "ch-physical-ai-intro",
            "content": "Physical AI is a field that bridges the gap between digital artificial intelligence and physical interaction. It focuses on creating AI systems that can understand, interact with, and operate in the physical world effectively.",
            "source_url": "/docs/intro"
        },
        {
            "chapter_id": "ch-physical-ai-intro",
            "content": "Embodied intelligence refers to AI systems that exist within physical bodies and interact with the real world. This is crucial for humanoid robotics as it allows robots to learn from physical experiences and adapt to real-world conditions.",
            "source_url": "/docs/module-1/embodied-intelligence"
        },
        {
            "chapter_id": "ch-ros2-nervous-system",
            "content": "ROS 2 (Robot Operating System 2) provides the communication framework for robotic systems. It enables different components of a robot to communicate with each other through topics, services, and actions.",
            "source_url": "/docs/module-2/nodes-topics-services"
        },
        {
            "chapter_id": "ch-ros2-nervous-system",
            "content": "Nodes in ROS 2 are individual processes that perform computation. Topics are named buses over which nodes exchange messages. Services allow nodes to send a request and receive a response.",
            "source_url": "/docs/module-2/nodes-topics-services"
        },
        {
            "chapter_id": "ch-digital-twin",
            "content": "A digital twin is a virtual replica of a physical system. In robotics, digital twins allow for simulation-based development and testing before deploying to real hardware, reducing risks and costs.",
            "source_url": "/docs/module-3/digital-twin-intro"
        },
        {
            "chapter_id": "ch-ai-brain",
            "content": "NVIDIA Isaac is a comprehensive robotics platform that includes simulation, navigation, manipulation, and AI capabilities. It provides tools for developing and deploying AI-powered robots.",
            "source_url": "/docs/module-4/ai-robot-brain-intro"
        }
    ]

    # Insert sample data
    async with async_session() as session:
        # Add chapters
        for chap_data in sample_chapters:
            chapter = Chapter(
                id=chap_data["id"],
                title=chap_data["title"],
                content=chap_data["content"],
                word_count=chap_data["word_count"],
                sources=chap_data["sources"]
            )
            session.add(chapter)

        await session.commit()

        # Add content chunks
        for chunk_data in sample_content_chunks:
            chunk = ContentChunk(
                id=str(uuid.uuid4()),
                chapter_id=chunk_data["chapter_id"],
                content=chunk_data["content"],
                source_url=chunk_data["source_url"],
                embedding=None  # Will be populated by the system when needed
            )
            session.add(chunk)

        await session.commit()
        print("Database initialized successfully with sample data!")

    await engine.dispose()
    return True

if __name__ == "__main__":
    success = asyncio.run(init_db())
    if success:
        print("Database initialization completed successfully!")
    else:
        print("Database initialization failed!")
        sys.exit(1)