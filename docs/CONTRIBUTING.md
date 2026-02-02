# Contributing to Al-Haqq

First off, thank you for considering contributing to Al-Haqq! It's people like you that make the Islamic digital ecosystem better.

## Project Philosophy

Al-Haqq aims to be the definitive, open-source Islamic knowledge platform.
- **Authenticity First**: We never compromise on data accuracy. All content must be sourced.
- **Premium Design**: We believe Islamic software deserves the highest quality of UI/UX (Ihsan).
- **Privacy Focused**: We minimize data collection and respect user privacy.

## Getting Started

1.  **Fork the repository**
2.  **Clone it locally**:
    ```bash
    git clone https://github.com/your-username/al-haqq.git
    cd al-haqq
    ```
3.  **Install dependencies**:
    ```bash
    pnpm install
    ```
    (We use `pnpm` for efficient package management)
4.  **Set up environment**:
    Copy `.env.example` to `.env` and fill in necessary keys (Supabase, Gemini).
5.  **Run development server**:
    ```bash
    pnpm dev
    ```

## Project Structure

- `apps/web`: The Next.js frontend application.
- `packages/database`: Database schema, seeds, and types.
- `data`: Raw SQL/JSON data sources.

## data Guidelines

- **Quran**: We use Uthmani script (Hafs).
- **Translations**: Must be from reputable centers (e.g., King Fahd Complex).
- **Hadith**: Must include grading (Sahih, Hasan, etc.).

## Submitting Changes

1.  Create a new branch: `git checkout -b feature/amazing-feature`
2.  Commit your changes: `git commit -m 'feat: Add amazing feature'`
3.  Push to the branch: `git push origin feature/amazing-feature`
4.  Open a Pull Request.

## Code of Conduct

Be respectful, humble, and helpful. We are building for the sake of Allah and the Ummah.
