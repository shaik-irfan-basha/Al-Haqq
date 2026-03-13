# Getting Started with Al-Haqq

> Get up and running in under 5 minutes.

---

## Prerequisites

| Tool       | Version  | Install Link                                      |
| ---------- | -------- | ------------------------------------------------- |
| **Node.js**| ≥ 20.x   | [nodejs.org](https://nodejs.org/)                 |
| **pnpm**   | ≥ 9.x    | `npm install -g pnpm`                             |
| **Git**    | Latest   | [git-scm.com](https://git-scm.com/)              |

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/shaik-irfan-basha/Al-Haqq.git
cd Al-Haqq
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment

```bash
cp apps/web/.env.local.example apps/web/.env.local
```

Edit `apps/web/.env.local`:

```env
# Supabase (optional — app works without it via public API fallback)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Google Gemini (required for Basira AI only)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **💡 Tip:** The app works without Supabase — Quranic text loads from the public [AlQuran Cloud API](https://alquran.cloud/api) as a fallback. Supabase is only needed for multi-language translations and hadith data.

### 4. Start Development Server

```bash
pnpm dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## Available Commands

| Command        | Description                              |
| -------------- | ---------------------------------------- |
| `pnpm dev`     | Start web app at `localhost:3000`        |
| `pnpm dev:api` | Start API server at `localhost:4000`     |
| `pnpm build`   | Production build (all packages)          |
| `pnpm lint`    | Run ESLint across all packages           |
| `pnpm db:seed` | Seed database with Quran & Hadith data   |
| `pnpm clean`   | Remove all `node_modules` and build dirs |

---

## Project Structure

```
apps/web/src/
├── app/                # Next.js App Router
│   ├── quran/          # Quran reader (Surah list, Ayah view, Audio)
│   ├── hadith/         # Hadith browser (Collections, Chapters, Search)
│   ├── basira/         # AI assistant chat interface
│   ├── tools/          # Islamic tools (Prayer, Zakat, Qibla, etc.)
│   └── layout.tsx      # Root layout with Navbar + Footer
├── components/         # Shared React components
│   └── layout/         # Navbar, Footer, ThemeSwitcher
├── data/               # Local static data (Surahs, Hadith collections)
├── features/           # Feature-specific components (Audio player, etc.)
└── lib/                # Utilities (Supabase client, helpers)
```

---

## Database Setup

### Option A: Supabase Cloud *(Recommended)*

1. Create a free project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** and run `packages/database/schema.sql`
3. Seed data: `pnpm db:seed`
4. Copy your project URL + anon key into `.env.local`

### Option B: No Database *(Quick Start)*

The app works without a database! It uses:
- **Public API** for Quranic Arabic text + English translation
- **Local JSON** for Hadith collection metadata and Surah info

Advanced features (multi-language translations, bookmarks sync, semantic search) require Supabase.

---

## Getting API Keys

### Supabase

1. Go to [supabase.com](https://supabase.com) → Create new project
2. Navigate to **Settings → API**
3. Copy the **Project URL** and **anon/public key**

### Google Gemini

1. Go to [ai.google.dev](https://ai.google.dev)
2. Click "Get API Key"
3. Add to `.env.local` as `NEXT_PUBLIC_GEMINI_API_KEY`

---

## Troubleshooting

| Problem                         | Solution                                                  |
| ------------------------------- | --------------------------------------------------------- |
| `Module not found` errors       | Run `pnpm install` then restart dev server                |
| Database not connecting         | Check `.env.local` credentials; restart after changes     |
| Basira AI not responding        | Verify `NEXT_PUBLIC_GEMINI_API_KEY` is valid              |
| Build fails on hadith pages     | Ensure `hadith-collections.ts` IDs match `schema.sql`    |
| Quran text not showing          | Normal without Supabase — API fallback loads on refresh   |
