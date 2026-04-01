Product Requirements Document (PRD)
🧠 Product Name

RMPSU AI Tour Guide

🏫 Target Institution

Raja Mahendra Pratap Singh University

1. 🎯 Product Overview

RMPSU AI Tour Guide is an intelligent, conversational AI-powered chatbot platform designed to act as a virtual campus guide. It enables students, parents, and visitors to interact with university information in a natural, human-like way.

Instead of navigating complex websites, PDFs, or notices, users can simply ask questions and receive accurate, contextual, and real-time answers powered by a Retrieval-Augmented Generation (RAG) system.

The product is delivered through a single-page Neo-Geo themed landing experience, combining aesthetic precision with functional intelligence.

2. 🚀 Objectives
Primary Goals
Provide instant, accurate answers about RMPSU
Reduce dependency on:
Admin calls
Static websites
Manual information lookup
Create a 24/7 digital assistant
Secondary Goals
Improve user engagement
Enhance university branding
Serve as a future foundation for student services automation
3. 👥 Target Users
Core Personas
Prospective Students
Queries: admissions, courses, eligibility
Parents
Queries: safety, facilities, fees
Current Students
Queries: notices, syllabus, rules
Visitors
Queries: campus location, events, history
4. 💡 Core Features
4.1 AI Chatbot (RAG-Based)
Natural language interaction
Context-aware responses
Grounded in:
Website content
Prospectus PDFs
Notices
Syllabus files
Firecrawl Markdown data
Capabilities
Multi-turn conversations
Context retention within chat
Accurate, source-backed answers
4.2 Knowledge Base System
Data ingestion from:
Firecrawl scraped Markdown files
PDFs
Web pages
Processing Pipeline
Upload Markdown/PDF
Chunking (semantic splitting)
Embedding generation
Storage in vector DB (Supabase)
4.3 Chat History System
Persistent storage (like “DVD memory” concept)
Features:
Save all chats per user
Resume conversations
Timestamped history
Search past chats (optional future feature)
4.4 Authentication
Google Sign-In (primary)
Future:
Email/password
University login
4.5 One-Page Landing Experience
Fully scrollable single-page app
Sections:
Hero (AI introduction)
Value proposition
Live chatbot interface
Features breakdown
Trust indicators
CTA
5. 🎨 UX & Design Requirements (Neo-Geo System)
Design Philosophy
Inspired by mathematical precision + geometric harmony
Emotion: Calm intelligence + structured curiosity
Visual Principles
Grid-based layout
Repeating geometric motifs
Balanced symmetry
Controlled color bursts
Typography
Clean, modern, sharp
High readability
Slightly futuristic tone
Interaction Design
Smooth but precise animations
Snappy transitions (algorithmic feel)
Scroll-driven storytelling
Emotional Flow
Curiosity →
Fascination →
Clarity →
Trust →
Action
6. 🏗️ Technical Architecture
6.1 Frontend
React (Vite or Next.js recommended)
Features:
Chat UI
Auth UI
Scroll animations
Responsive design
6.2 Backend (Supabase)
PostgreSQL DB
Auth system
Storage (files + embeddings metadata)
Realtime subscriptions
6.3 AI Layer
RAG Pipeline
Embedding model (e.g., OpenAI / local)
Vector search (Supabase pgvector)
LLM response generation
Flow
User query
Convert → embedding
Retrieve relevant chunks
Inject into prompt
Generate response
6.4 Firecrawl Markdown Integration
Requirement

System must directly support Markdown ingestion

Flow
Input: .md files from Firecrawl
Process:
Clean formatting
Remove noise (nav/footer)
Chunk into semantic blocks
Store:
Raw text
Metadata (source URL, section)
Embeddings
7. 🗄️ Database Schema (Simplified)
Users Table
id
name
email
auth_provider
created_at
Chats Table
id
user_id
title
created_at
Messages Table
id
chat_id
role (user/assistant)
content
timestamp
Knowledge Base Table
id
content
embedding (vector)
source
metadata
8. 🔐 Security & Privacy
Secure authentication (OAuth)
Data encryption (Supabase default)
No sensitive personal data storage beyond necessary
Rate limiting for chatbot
9. 📊 Success Metrics
Usage Metrics
Daily active users
Avg session duration
Queries per session
Quality Metrics
Answer accuracy (manual sampling)
User satisfaction (feedback buttons)
System Metrics
Response latency
Retrieval accuracy
10. 🚧 MVP Scope
Must Have
Chatbot (RAG working)
Markdown ingestion
Chat history
Google login
One-page UI
Nice to Have
Voice input
Multi-language (Hindi/English)
Chat search
Admin dashboard
11. 🔮 Future Enhancements
Voice-based AI guide
WhatsApp integration
Admission assistant automation
Personalized student dashboards
Analytics for university admin
12. ⚠️ Risks & Mitigation
Risk	Solution
Incorrect AI answers	Strong RAG grounding
Poor data quality	Clean Firecrawl pipeline
Slow responses	Optimize vector search
User drop-off	Improve UI/UX flow
13. 🧭 Final Product Vision

A system where:

Users don’t search → they ask
Information is not static → it’s interactive
The university becomes digitally alive