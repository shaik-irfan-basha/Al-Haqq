<div align="center">

# 🕌 Al-Haqq

### **The Ultimate Islamic Knowledge Platform**

> *"And say: My Lord, increase me in knowledge."* — Qur'an 20:114

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-al--haqq-0E3B2E?style=for-the-badge)](https://al-haqq-official.netlify.app)
[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Flutter](https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)](https://flutter.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-C7A24D?style=for-the-badge)](LICENSE)

**Clear. Authentic. Timeless.**

Discover the divine wisdom of Islam through verified sources, beautiful presentation, and sacred simplicity.

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 📖 Sacred Texts
- **The Noble Qur'an** — Complete 114 Surahs with multi-language translations, transliteration, and gapless audio recitation
- **Hadith Collections** — 60,000+ authentic narrations from 17 books including Kutub al-Sittah
- **Full-Text Search** — Instant search across all Quranic verses and Hadith

</td>
<td width="50%">

### 🤖 Basira AI
- **Islamic AI Assistant** — Get answers grounded strictly in Qur'an and Sunnah
- **Source Citations** — Every response includes verifiable references
- **Powered by Gemini Pro** — State-of-the-art language understanding

</td>
</tr>
<tr>
<td width="50%">

### 🕋 Tools & Utilities
- **Prayer Times** — Accurate salah timings with geolocation
- **Zakat Calculator** — Gold, Silver, Cash & Asset calculations
- **Qibla Finder** — AR-style direction finder
- **Inheritance Calculator** — Sharia-compliant distribution

</td>
<td width="50%">

### 🎨 Premium Design
- **Glassmorphism & Gradients** — Modern, elegant UI
- **Framer Motion Animations** — Fluid, polished transitions
- **Dark Mode** — Automatic system-preference detection
- **Fully Responsive** — Optimized for every screen size

</td>
</tr>
</table>

---

## 🏗️ Architecture

This is a **pnpm monorepo** with the following structure:

```
al-haqq/
├── apps/
│   ├── web/              → Next.js 14 PWA  (App Router, SSG)
│   ├── mobile/           → Flutter App     (iOS, Android, Desktop)
│   └── api/              → Express.js API  (REST, AI endpoints)
├── packages/
│   ├── database/         → Supabase schema, seeds & migrations
│   ├── ai-basira/        → AI prompts & retrieval logic
│   └── shared/           → Shared types & utilities
├── data/                 → Raw Quran SQL & Hadith JSON sources
└── docs/                 → Contributing, setup & architecture docs
```

---

## 🛠️ Tech Stack

| Layer        | Technology                                         |
| ------------ | -------------------------------------------------- |
| **Frontend** | Next.js 14, React 18, Tailwind CSS, Framer Motion  |
| **Mobile**   | Flutter 3, Dart, Riverpod                           |
| **Backend**  | Node.js, Express.js                                 |
| **Database** | Supabase (PostgreSQL), pgvector for semantic search |
| **AI**       | Google Gemini Pro, RAG pipeline                     |
| **Hosting**  | Vercel (Web), Railway (API)                         |

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** ≥ 20 &nbsp;·&nbsp; **pnpm** ≥ 9 &nbsp;·&nbsp; **Git**

### 1. Clone & Install

```bash
git clone https://github.com/shaik-irfan-basha/Al-Haqq.git
cd Al-Haqq
pnpm install
```

### 2. Environment Setup

```bash
cp apps/web/.env.local.example apps/web/.env.local
```

Add your [Supabase](https://supabase.com) and [Gemini](https://ai.google.dev) keys to `.env.local`.

> **Note:** The app works without Supabase credentials — it falls back to the public [AlQuran Cloud API](https://alquran.cloud/api) for Quranic text.

### 3. Run

```bash
pnpm dev              # Web app → http://localhost:3000
pnpm dev:api          # API     → http://localhost:4000
```

---

## 🚀 Deployment

### Web (Vercel — Recommended)

1. Push to GitHub
2. Import into [Vercel](https://vercel.com)
3. Set **Root Directory** → `apps/web`
4. Add environment variables in Vercel dashboard
5. Deploy ✅

### API (Railway / Render)

- **Build**: `pnpm build` (inside `apps/api`)
- **Start**: `node dist/index.js`

### Mobile

- [Android Deployment Guide](https://docs.flutter.dev/deployment/android)
- [iOS Deployment Guide](https://docs.flutter.dev/deployment/ios)

---

## 🤝 Contributing

We welcome contributions! See [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch — `git checkout -b feature/amazing-feature`
3. Commit your changes — `git commit -m 'feat: add amazing feature'`
4. Push & open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

<div align="center">

### 👨‍💻 Author

<img src="apps/web/public/author.jpg" alt="Shaik Irfan Basha" width="120" style="border-radius: 50%; border: 4px solid #C7A24D;" />

**Shaik Irfan Basha**
*AI Developer & Software Engineer*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/shaik-irfan-basha)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat-square&logo=github&logoColor=white)](https://github.com/shaik-irfan-basha)
[![Email](https://img.shields.io/badge/Email-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:muhammadirfanbasha@gmail.com)

---

Made with ❤️ for the Ummah &nbsp;·&nbsp; © 2026 Al-Haqq

</div>
