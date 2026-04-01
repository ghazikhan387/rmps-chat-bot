# RMPSU AI Tour Guide - Project Logic

## Overview
This is a Next.js 16 application that serves as an AI-powered virtual campus guide for Raja Mahendra Pratap Singh University. It uses RAG (Retrieval-Augmented Generation) for accurate, context-aware answers from university documents.

---

## File Structure

### Configuration Files

#### `package.json`
**Purpose:** Defines project dependencies and scripts.
- **Dependencies:** AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/huggingface`), Supabase (`@supabase/ssr`, `@supabase/supabase-js`), HuggingFace inference, UI libraries (framer-motion, lucide-react, tailwindcss-animate)
- **Scripts:** `dev`, `build`, `start`, `lint`

#### `next.config.ts`
**Purpose:** Next.js configuration (currently minimal, placeholder for future config)

#### `tsconfig.json`
**Purpose:** TypeScript configuration for the project

#### `eslint.config.mjs`
**Purpose:** ESLint configuration for code linting

#### `postcss.config.mjs`
**Purpose:** PostCSS configuration for Tailwind CSS processing

#### `.env.local` / `.env.example`
**Purpose:** Environment variables (Supabase URL/keys, HuggingFace API key, OpenAI API key)

---

### Database Schema

#### `supabase/schema.sql`
**Purpose:** PostgreSQL database schema with pgvector extension for vector similarity search.

**Tables:**
1. **`users`** - Extends Supabase Auth users (id, name, email, auth_provider)
2. **`chats`** - Stores chat sessions (id, user_id, title, created_at)
3. **`messages`** - Stores individual messages per chat (id, chat_id, role, content, timestamp)
4. **`knowledge_base`** - RAG document storage with vector embeddings (id, content, embedding, source, metadata)

**Functions:**
- `match_knowledge_documents(query_embedding, match_threshold, match_count)` - RPC function for cosine similarity search using pgvector (`<=>` operator)

**Triggers:**
- `handle_new_user()` - Auto-creates user profile when new user signs up via Google OAuth

---

### Supabase Utilities

#### `src/utils/supabase/server.ts`
**Purpose:** Creates a Supabase client for server-side operations (API routes, Server Components).
- Uses `@supabase/ssr`'s `createServerClient`
- Handles cookies via Next.js `cookies()` API
- Returns authenticated client for database operations

#### `src/utils/supabase/client.ts`
**Purpose:** Creates a Supabase client for client-side (browser) operations.
- Uses `@supabase/ssr`'s `createBrowserClient`
- No cookie handling needed (browser handles automatically)

---

### Middleware

#### `src/middleware.ts`
**Purpose:** Auth guard for protected routes.
- Creates Supabase server client to check authentication
- **Redirects unauthenticated users** from `/chat` to `/login`
- Uses matcher to apply to all routes except static files (`_next/static`, `_next/image`, `favicon.ico`, images)

---

### Application Pages

#### `src/app/layout.tsx`
**Purpose:** Root layout component.
- Imports Geist/Geist Mono fonts
- Applies global CSS (`globals.css`)
- Sets metadata (title, description)
- Applies "dark" class and Neo-Geo theme CSS variables

#### `src/app/page.tsx`
**Purpose:** Landing page (home).
- Renders: `Hero` → `ValueProp` → `Features` → `ChatPreview` → Footer
- No authentication required

#### `src/app/chat/page.tsx`
**Purpose:** Main chat interface (protected route).
- **Features:**
  - Sidebar with chat history list
  - Create new chat functionality
  - Load previous chat history
  - Real-time streaming chat using Vercel AI SDK's `useChat` hook
  - Saves messages to Supabase `messages` table
  - Neo-Geo themed UI with grid background
  - Logout functionality

#### `src/app/login/page.tsx`
**Purpose:** Google OAuth login page.
- Single button to initiate Google OAuth via Supabase
- Redirects to `/auth/callback?next=/chat` after success
- Framer Motion animations for entrance

#### `src/app/admin/ingest/page.tsx`
**Purpose:** Admin page for uploading knowledge base content.
- Form with source name and markdown content fields
- POSTs to `/api/ingest` endpoint
- Shows success/error status messages

---

### API Routes

#### `src/app/api/chat/route.ts`
**Purpose:** Handles chat message streaming.
1. Gets authenticated user
2. Saves user message to database
3. **Generates query embedding** using HuggingFace sentence-transformers model
4. **Performs vector search** in Supabase `knowledge_base` table via RPC
5. **Constructs system prompt** with retrieved context
6. **Streams LLM response** using HuggingFace Llama 3 model via Vercel AI SDK
7. Saves assistant response to database on completion

#### `src/app/api/ingest/route.ts`
**Purpose:** Handles knowledge base content ingestion.
1. Authenticates admin user
2. **Chunks content** into ~1000 char paragraphs
3. **Generates OpenAI embeddings** for each chunk
4. **Inserts chunks with embeddings** into `knowledge_base` table

#### `src/app/auth/callback/route.ts`
**Purpose:** OAuth callback handler.
1. Exchanges auth code for session via Supabase
2. Redirects to `/chat` (or specified `next` param)
3. Redirects to home with error on failure

---

### UI Components

#### `src/components/ui/index.ts`
**Purpose:** Barrel export for all UI components.

#### `src/components/ui/Hero.tsx`
**Purpose:** Landing page hero section.
- Animated gradient orbs
- Headline with gradient text
- CTA buttons: "Start Exploring" → `/chat`, "How it Works" → `#features`
- Framer Motion animations

#### `src/components/ui/Features.tsx`
**Purpose:** Features grid section.
- 4 feature cards: Natural Conversations, Grounded Knowledge, Instant Retrieval, Campus Navigation
- Scroll-triggered animations via Framer Motion `whileInView`

#### `src/components/ui/ValueProp.tsx`
**Purpose:** Value proposition section.
- List of benefits with checkmarks
- Animated geometric visual element
- Side-by-side layout (text + visual)

#### `src/components/ui/ChatPreview.tsx`
**Purpose:** Interactive chat interface preview.
- Mock chat window UI (not functional)
- Shows sample Q&A conversation
- Demo input field (disabled)

---

### Global Styles

#### `src/app/globals.css`
**Purpose:** Tailwind CSS configuration and global styles.
- Imports Tailwind CSS v4 with `@import "tailwindcss"`
- Adds `tailwindcss-animate` plugin
- Defines `@custom-variant dark` for theme switching
- Sets up Neo-Geo theme with CSS custom properties
- Light/dark mode color variables
- `.bg-grid-pattern` utility for grid background
- `.neo-box` utility class with decorative corners

---

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Animations | Framer Motion |
| Icons | Lucide React |
| Auth | Supabase Auth (Google OAuth) |
| Database | Supabase (PostgreSQL + pgvector) |
| AI Chat | Vercel AI SDK |
| LLM | HuggingFace Llama 3 |
| Embeddings | HuggingFace Sentence-Transformers (query), OpenAI text-embedding-3-small (ingest) |
| Vector Search | pgvector cosine similarity |

---

## Data Flow

### Chat Flow
```
User → chat/page.tsx → api/chat/route.ts
                            ↓
                    HuggingFace Embedding
                            ↓
                    Supabase Vector Search (pgvector)
                            ↓
                    LLM (Llama 3) + Context
                            ↓
                    Streaming Response → User
```

### Ingestion Flow
```
Admin → admin/ingest/page.tsx → api/ingest/route.ts
                                        ↓
                                OpenAI Embedding
                                        ↓
                                Supabase knowledge_base table
```
