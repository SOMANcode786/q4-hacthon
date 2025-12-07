---
id: 3
title: Create Book RAG Chatbot Plan
stage: plan
date: 2025-12-07
surface: agent
model: claude-sonnet-4-5-20250929
feature: book-rag-chatbot
branch: 1-book-rag-chatbot
user: Claude
command: /sp.plan
labels: [book,rag-chatbot,physical-ai,humanoid-robotics,planning,architecture]
links:
  spec: specs/1-book-rag-chatbot/spec.md
  plan: specs/1-book-rag-chatbot/plan.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/1-book-rag-chatbot/plan.md
 - specs/1-book-rag-chatbot/research.md
 - specs/1-book-rag-chatbot/data-model.md
 - specs/1-book-rag-chatbot/quickstart.md
 - specs/1-book-rag-chatbot/contracts/rag-api.yaml
tests:
 - none
---

## Prompt

```text
/sp.plan

Create:
- Architecture sketch for the full system:
  - Docusaurus book (content + chapters)
  - RAG chatbot pipeline (FastAPI → Qdrant → Neon → OpenAI Agents)
  - Integration layer for in-book chatbot widget
- Section structure for all book modules:
  - Module 1: ROS 2 (Robotic Nervous System)
  - Module 2: Digital Twin (Gazebo & Unity)
  - Module 3: AI-Robot Brain (NVIDIA Isaac)
  - Module 4: Vision-Language-Action (VLA)
  - Capstone: Autonomous Humanoid Pipeline
- Research approach:
  - Research-concurrent method: gather sources while writing each module
  - Use official ROS, NVIDIA Isaac, Gazebo, Unity, and OpenAI documentation
  - Minimum 20 APA-cited sources across the book
- Quality validation:
  - Continuous plagiarism checks (0% tolerance)
  - Factual verification against primary docs
  - Build verification: Docusaurus builds cleanly
  - RAG chatbot responds ONLY from book text

Decisions needing documentation:
- Docusaurus theme and layout
  Options: Classic theme vs. Custom UI
  Tradeoff: Classic = speed; Custom = better UX
- RAG storage method
  Options: Qdrant Cloud vs. local Qdrant
  Tradeoff: Cloud = scalable, Local = easier testing
- Embedding model
  Options: OpenAI text-embedding vs. open-source models
  Tradeoff: Accuracy vs. cost and independence
- Chatbot interaction model
  Options: Floating widget vs. page-embedded chat
  Tradeoff: Visibility vs. minimal UI disruption
- Synthetic data generation approach (Module 3)
  Options: Isaac Sim vs. custom Unity pipeline
  Tradeoff: NVIDIA acceleration vs. easier customization

Testing strategy:
- Book validation:
  - Check all chapters compile in Docusaurus
  - Verify links, citations, code blocks, diagrams
  - Cross-check claims with APA-cited sources
- RAG chatbot validation:
  - Accuracy test: 20 queries benchmarked
  - Source-bound test: chatbot must answer only from book text
  - Latency test: P95 response time < 1.5s
  - Vector integrity: embeddings correctly stored in Qdrant
- Deployment validation:
  - GitHub Pages automatic deployment
  - FastAPI backend reachable via HTTPS
  - Environment variables secured

Project phases (required):
1. **Research Phase**
   - Gather sources for ROS 2, Gazebo, Unity, Isaac, VLA
   - Build small test simulations

2. **Foundation Phase**
   - Initialize Docusaurus project
   - Configure Spec-Kit Plus + Claude Code
   - Define file structure for all chapters

3. **Analysis Phase**
   - Deep technical exploration
   - Build sample ROS packages, Gazebo worlds, Isaac Sim scenes
   - Document insights and validate implementations

4. **Synthesis Phase**
   - Write full book modules with citations
   - Build the RAG system (FastAPI + Qdrant + Neon + OpenAI Agents)
   - Integrate chatbot into the Docusaurus site
   - Final review, QA, and deployment

End of /sp.plan
```

## Response snapshot

Created comprehensive implementation plan for the Physical AI & Humanoid Robotics Book + RAG Chatbot project. Generated: plan.md with architecture and technical context, research.md with architecture decisions and technology research, data-model.md with core entities for book content and RAG system, quickstart.md with setup and deployment instructions, and rag-api.yaml contract defining the RAG chatbot API. All artifacts align with project constitution principles including high accuracy, reproducible code, zero plagiarism, and GitHub Pages deployment.

## Outcome

- ✅ Impact: Complete planning artifacts created with architecture, data models, and API contracts
- 🧪 Tests: none
- 📁 Files: Created plan.md, research.md, data-model.md, quickstart.md, and rag-api.yaml in specs/1-book-rag-chatbot/
- 🔁 Next prompts: Ready for task generation phase with /sp.tasks
- 🧠 Reflection: Planning addresses all architectural decisions and validation requirements

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): All constitution checks validated as complete
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Generate implementation tasks with /sp.tasks