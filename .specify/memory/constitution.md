<!--
Sync Impact Report:
Version change: N/A → 1.0.0
Added sections: All principles and sections specific to Book + RAG Chatbot project
Removed sections: None (new constitution)
Modified principles: N/A (new constitution)
Templates requiring updates:
- .specify/templates/plan-template.md ✅ updated
- .specify/templates/spec-template.md ✅ updated
- .specify/templates/tasks-template.md ✅ updated
- .specify/templates/commands/*.md ✅ updated
Follow-up TODOs: None
-->
# Book + RAG Chatbot on Physical AI & Humanoid Robotics Constitution

## Core Principles

### High Accuracy and Verified Sources
All content must be based on verified sources (ROS 2, Gazebo, NVIDIA Isaac docs + research papers); No unverified claims allowed

### Clear Writing for Students
Content must be written for CS/AI students with Grade 10–12 readability level; Complex concepts explained with examples

### Reproducible Code and Simulations
All code examples and simulations must be reproducible; Full setup instructions included; Tested on Ubuntu + ROS 2

### Zero Plagiarism
All content must be original with proper APA citations; 50%+ peer-reviewed sources; All claims traceable to documentation or papers

### Test-First Implementation (NON-NEGOTIABLE)
All code components must have tests before implementation; TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced

### GitHub Pages Deployment
All deliverables must be deployable via GitHub Pages; Documentation and chatbot must be accessible online

## Technical Constraints and Standards
Technology Stack: OpenAI Agents/ChatKit, FastAPI, Neon Postgres, Qdrant Cloud, Docusaurus; Deployment: GitHub Pages; Platform: Ubuntu + ROS 2; Minimum 20 references with APA citations; Word count: 10,000–15,000

## Development Workflow and Success Criteria
Workflow: Spec-Kit Plus + Claude Code methodology; Book Structure: 8–10 chapters covering ROS 2, Gazebo/Unity, NVIDIA Isaac, VLA, Humanoid Robotics, Capstone; RAG Chatbot: Answers only from book content, supports text-selection Q&A, embedded in Docusaurus site; Success: 0% plagiarism, all facts sourced, RAG chatbot works reliably, book builds/deployed successfully, capstone demo with humanoid robot executing voice-command task in simulation

## Governance
Constitution supersedes all other practices; All PRs/reviews must verify compliance with accuracy, readability, and source requirements; Amendments require documentation and approval; Code reviews must verify originality and proper citations

**Version**: 1.0.0 | **Ratified**: 2025-12-07 | **Last Amended**: 2025-12-07