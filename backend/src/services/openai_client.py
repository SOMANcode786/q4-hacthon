import os
import openai
from typing import Dict, Any
import logging
from dotenv import load_dotenv
import random

load_dotenv()

logger = logging.getLogger(__name__)


class OpenAIClient:
    def __init__(self):
        # Initialize OpenAI client
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            logger.warning("OPENAI_API_KEY environment variable is not set")
            self.api_key = None
        else:
            self.api_key = api_key
            try:
                self.client = openai.AsyncOpenAI(api_key=api_key)
            except Exception as e:
                logger.error(f"Error initializing OpenAI client: {str(e)}")
                self.client = None

    async def generate_response(self, prompt: str, model: str = "gpt-3.5-turbo", max_tokens: int = 1000) -> str:
        """
        Generate a response from OpenAI API, with fallback to mock responses
        """
        if not self.api_key or not self.client:
            # Return a mock response for development purposes
            logger.warning("OpenAI API not available, returning mock response")
            mock_responses = [
                f"I understand you're asking about: '{prompt[:50]}...'. This is a simulated response for development purposes. In a production environment, this would connect to the OpenAI API to provide a real answer about Physical AI and Humanoid Robotics.",
                f"Thanks for your question about that topic. In the full implementation, I would analyze the content and provide a detailed response based on the course materials about Physical AI & Humanoid Robotics.",
                f"That's an interesting question about robotics! A complete answer would require access to the course content and OpenAI services to provide accurate, contextual information."
            ]
            return random.choice(mock_responses)

        try:
            response = await self.client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": "You are a helpful assistant for Physical AI and Humanoid Robotics education."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=max_tokens,
                temperature=0.7
            )

            return response.choices[0].message.content.strip()
        except Exception as e:
            logger.error(f"Error calling OpenAI API: {str(e)}")
            # Return a mock response when API fails
            return f"I'm having trouble connecting to the AI service right now. Error: {str(e)[:100]}... In a production environment, this would connect to the OpenAI API to provide a real answer about Physical AI and Humanoid Robotics."

    async def embed_text(self, text: str, model: str = "text-embedding-ada-002") -> list:
        """
        Generate embeddings for text using OpenAI API, with fallback to mock embeddings
        """
        if not self.api_key or not self.client:
            # Return a mock embedding for development purposes
            logger.warning("OpenAI API not available, returning mock embedding")
            # Return a mock embedding (1536-dimensional vector for text-embedding-ada-002)
            return [random.uniform(-0.1, 0.1) for _ in range(1536)]

        try:
            response = await self.client.embeddings.create(
                input=text,
                model=model
            )

            return response.data[0].embedding
        except Exception as e:
            logger.error(f"Error generating embeddings: {str(e)}")
            # Return a mock embedding when API fails
            return [random.uniform(-0.1, 0.1) for _ in range(1536)]