# Getting Started with Al-Haqq

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or later
- **pnpm** 9.x or later
- **Git**

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/al-haqq.git
cd al-haqq
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment

Create environment file for the web app:

```bash
cp apps/web/.env.local.example apps/web/.env.local
```

Edit `apps/web/.env.local` with your credentials:

```env
# Supabase (required for database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google Gemini (for Basira AI)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start web app in development mode |
| `pnpm dev:api` | Start API server |
| `pnpm build` | Build for production |
| `pnpm lint` | Run ESLint |

---

## Project Structure

```
apps/web/
├── src/
│   ├── app/           # Next.js App Router
│   │   ├── quran/     # Quran pages
│   │   ├── hadith/    # Hadith pages
│   │   ├── basira/    # AI chat
│   │   └── ...
│   ├── components/    # React components
│   │   └── layout/    # Navbar, Footer
│   ├── data/          # Static JSON data
│   └── lib/           # Utilities (supabase.ts)
└── public/            # Static assets
```

---

## Database Setup

### Option A: Use Supabase Cloud (Recommended)

1. Create a project at [supabase.com](https://supabase.com)
2. Run the schema from `packages/database/schema.sql`
3. Add your credentials to `.env.local`

### Option B: Local Development (No Database)

The app will work without a database using local JSON data. Features like search and multi-language translations will be limited.

---

## Getting API Keys

### Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → API
4. Copy the URL and anon key

### Gemini API
1. Go to [ai.google.dev](https://ai.google.dev)
2. Get an API key
3. Add to `.env.local`

---

## Troubleshooting

### "Module not found" errors
```bash
pnpm install
```

### Database not connecting
- Ensure `.env.local` has correct Supabase credentials
- Restart the dev server after changing env vars

### Basira AI not responding
- Check that `NEXT_PUBLIC_GEMINI_API_KEY` is set
- Verify the API key is valid at [ai.google.dev](https://ai.google.dev)
