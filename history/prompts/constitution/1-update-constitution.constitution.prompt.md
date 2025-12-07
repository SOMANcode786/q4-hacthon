---
id: 1
title: Update Constitution
stage: constitution
date: 2025-12-07
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: Claude
command: /sp.constitution
labels: [constitution,book,rag-chatbot,physical-ai,humanoid-robotics]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - none
---

## Prompt

```text
/sp.constitution

Project: Book + RAG Chatbot on Physical AI & Humanoid Robotics

Core Principles:
- High accuracy using verified sources (ROS 2, Gazebo, NVIDIA Isaac docs + research papers)
- Clear writing for CS/AI students (Grade 10–12 readability)
- Reproducible code and simulations
- Zero plagiarism

Standards:
- APA citations
- 50%+ peer-reviewed sources
- All claims traceable to documentation or papers

Book Requirements:
- Built with Spec-Kit Plus + Claude Code
- Docusaurus book (8–10 chapters)
- Topics: ROS 2, Gazebo/Unity, NVIDIA Isaac, VLA, Humanoid Robotics, Capstone
- Must include diagrams, code, and sources
- Word count: 10,000–15,000
- Minimum 20 references

RAG Chatbot Requirements:
- Uses OpenAI Agents/ChatKit, FastAPI, Neon Postgres, Qdrant Cloud
- Answers only from book content
- Supports text-selection Q&A
- Must be embedded in the published Docusaurus site

Technical Constraints:
- GitHub Pages deployment
- All code tested on Ubuntu + ROS 2
- Full setup instructions included

Success Criteria:
- 0% plagiarism
- All facts sourced
- RAG chatbot works reliably
- Book builds & deploys successfully
- Capstone demo: humanoid robot executes a voice-command task in simulation

End of /sp.constitution
```

## Response snapshot

Updated the project constitution to reflect the Book + RAG Chatbot on Physical AI & Humanoid Robotics project requirements. The new constitution includes six core principles: High Accuracy and Verified Sources, Clear Writing for Students, Reproducible Code and Simulations, Zero Plagiarism, Test-First Implementation, and GitHub Pages Deployment. It also includes sections on Technical Constraints and Standards, Development Workflow and Success Criteria, and Governance.

## Outcome

- ✅ Impact: Created new project constitution with 6 core principles and governance structure
- 🧪 Tests: none
- 📁 Files: Updated .specify/memory/constitution.md with project-specific constitution
- 🔁 Next prompts: Plan and spec creation for book and RAG chatbot features
- 🧠 Reflection: Constitution properly captures project requirements and constraints

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin feature specification for book chapters