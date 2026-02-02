# Project Structure

Al-Haqq is a monorepo containing the web application, database configuration, and documentation.

## Directory Layout

```
.
├── apps
│   └── web                 # Next.js 14 Web Application
│       ├── public          # Static assets
│       └── src
│           ├── app         # App Router pages (Quran, Hadith, Basira, etc.)
│           ├── components  # React components (UI, Layout, Features)
│           └── lib         # Utilities (Supabase client, API helpers)
│
├── packages
│   └── database            # Database Configuration
│       ├── src
│       │   └── seeds       # Seeding scripts (Quran, Hadith data)
│       └── schema.sql      # Database schema (Tables, RLS policies)
│
├── data                    # Raw Data Sources
│   ├── Quran               # SQL files for Quran text & translations
│   └── Hadith              # JSON files for Hadith collections
│
├── docs                    # Documentation
│   ├── CONTRIBUTING.md     # Guide for contributors
│   └── PROJECT_STRUCTURE.md# This file
│
└── README.md               # Main entry point
```

## Key Technologies

-   **Framework**: Next.js 14 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS + CSS Modules
-   **Database**: Supabase (PostgreSQL)
-   **AI**: Google Gemini Pro (Basira AI)
-   **State**: React Hooks + Context

## Development

Run `pnpm dev` to start the frontend.
Run `pnpm db:seed` to populate the database with Quran and Hadith data.
