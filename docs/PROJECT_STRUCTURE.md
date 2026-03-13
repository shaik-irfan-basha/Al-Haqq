# Project Structure

> Architectural overview of the Al-Haqq monorepo.

---

## Directory Layout

```
al-haqq/
│
├── apps/
│   ├── web/                    # 🌐 Next.js 14 Web Application
│   │   ├── public/             #    Static assets (icons, manifest)
│   │   └── src/
│   │       ├── app/            #    App Router pages
│   │       │   ├── quran/      #      Surah list + Ayah reader
│   │       │   ├── hadith/     #      Collection browser + Chapter view
│   │       │   ├── basira/     #      AI chat interface
│   │       │   └── tools/      #      Prayer, Zakat, Qibla, Inheritance
│   │       ├── components/     #    Shared UI (Navbar, Footer)
│   │       ├── data/           #    Local static data (surahs, collections)
│   │       ├── features/       #    Feature-specific components
│   │       └── lib/            #    Utilities (Supabase client, helpers)
│   │
│   ├── mobile/                 # 📱 Flutter App (Phase 6 — scaffolded)
│   └── api/                    # ⚙️ Express.js REST API
│
├── packages/
│   ├── database/               # 🗄️ Database layer
│   │   ├── schema.sql          #    PostgreSQL schema (tables, RLS, indexes)
│   │   └── src/seeds/          #    Data seeding scripts
│   ├── ai-basira/              # 🤖 AI prompt engineering & RAG logic
│   └── shared/                 # 📦 Shared TypeScript types & utilities
│
├── data/                       # 📊 Raw data sources
│   ├── Quran/                  #    SQL files (translations per language)
│   └── Hadith/                 #    JSON files (17 hadith collections)
│
├── docs/                       # 📚 Documentation
│   ├── CONTRIBUTING.md
│   ├── GETTING_STARTED.md
│   └── PROJECT_STRUCTURE.md    #    ← You are here
│
├── vercel.json                 # Vercel deployment config
├── pnpm-workspace.yaml         # Workspace definition
└── README.md                   # Project overview
```

---

## Key Technologies

| Component       | Technology                                    | Purpose                          |
| --------------- | --------------------------------------------- | -------------------------------- |
| **Framework**   | Next.js 14 (App Router)                       | SSG/SSR, routing, API routes     |
| **Language**    | TypeScript                                    | Type safety across the stack     |
| **Styling**     | Tailwind CSS + CSS Variables + Framer Motion  | Design system & animations       |
| **Database**    | Supabase (PostgreSQL)                         | Data storage, auth, RLS          |
| **AI**          | Google Gemini Pro                             | Basira AI assistant              |
| **Search**      | pgvector (768-dim embeddings)                 | Semantic search across content   |
| **State**       | React Hooks + Context + localStorage          | Client-side state management     |

---

## Data Flow

```
┌──────────────┐     ┌───────────────┐     ┌──────────────┐
│  Next.js App │────▶│  Supabase DB  │◀────│  Seed Scripts│
│  (Client)    │     │  (PostgreSQL) │     │  (data/)     │
└──────┬───────┘     └───────────────┘     └──────────────┘
       │
       │ fallback
       ▼
┌──────────────┐
│ AlQuran Cloud│
│ Public API   │
└──────────────┘
```

---

## Development Commands

```bash
pnpm dev          # Start web app (localhost:3000)
pnpm dev:api      # Start API server (localhost:4000)
pnpm build        # Production build
pnpm lint         # Lint all packages
pnpm db:seed      # Seed Quran & Hadith data into Supabase
pnpm clean        # Remove node_modules & build artifacts
```
