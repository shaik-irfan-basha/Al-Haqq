# Contributing to Al-Haqq

Jazak'Allahu Khairan for considering contributing to Al-Haqq! Together we can build the best Islamic knowledge platform.

---

## 🌟 Project Philosophy

| Principle              | Description                                                                   |
| ---------------------- | ----------------------------------------------------------------------------- |
| **Authenticity First** | All content must be sourced from verified, scholarly references                |
| **Premium Design**     | Islamic software deserves the highest quality of UI/UX (*Ihsan*)              |
| **Privacy Focused**    | Minimal data collection; user privacy is sacred                               |
| **Open Source**        | Knowledge should be accessible to all                                         |

---

## 🚀 Getting Started

```bash
# 1. Fork & clone
git clone https://github.com/your-username/Al-Haqq.git
cd Al-Haqq

# 2. Install dependencies (pnpm required)
pnpm install

# 3. Set up environment
cp apps/web/.env.local.example apps/web/.env.local
# Edit .env.local with your Supabase and Gemini keys

# 4. Start dev server
pnpm dev
```

---

## 📁 Key Directories

| Directory              | Purpose                                    |
| ---------------------- | ------------------------------------------ |
| `apps/web/`            | Next.js 14 frontend application            |
| `apps/api/`            | Express.js backend API                     |
| `packages/database/`   | Database schema, seeds & types             |
| `data/`                | Raw SQL/JSON data sources                  |
| `docs/`                | Documentation                              |

---

## 📜 Data Guidelines

- **Qur'an** — Uthmani script (Hafs reading) only
- **Translations** — Must be from reputable centers (e.g., King Fahd Complex, Sahih International)
- **Hadith** — Must include grading (Sahih, Hasan, Da'if, etc.) with chain references where available

---

## 🔀 Submitting Changes

1. **Branch** — `git checkout -b feature/amazing-feature`
2. **Commit** — Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `refactor:`
3. **Push** — `git push origin feature/amazing-feature`
4. **PR** — Open a Pull Request with a clear description of changes

### PR Checklist

- [ ] Code builds without errors (`pnpm build`)
- [ ] No lint warnings (`pnpm lint`)
- [ ] New data is properly sourced and attributed
- [ ] UI changes are responsive and work in dark mode

---

## 🤲 Code of Conduct

Be respectful, humble, and helpful. We are building for the sake of Allah and the benefit of the Ummah. Differences of opinion in fiqh should be noted, not debated.
