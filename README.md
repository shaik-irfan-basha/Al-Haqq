# 🕌 Al-Haqq | The Ultimate Islamic Knowledge Platform

> **Clear. Authentic. Timeless.**  
> Discover the divine wisdom of Islam through verified sources, beautiful presentation, and sacred simplicity.

[![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge&logo=vercel)](https://al-haqq.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Stack-Next.js%2014%20|%20Flutter%20|%20Express-blue?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

## 🌟 Overview

**Al-Haqq** is a comprehensive Islamic Digital Ecosystem designed to provide accessible, authentic, and aesthetically pleasing access to sacred texts and tools. It operates as a monorepo containing:

*   **🌐 Web Platform**: A Next.js 14 Progressive Web App (PWA) for desktop and mobile web.
*   **📱 Mobile App**: A high-performance Flutter application for iOS and Android.
*   **⚙️ Backend API**: A robust Node.js/Express REST API powering the ecosystem.

Built with a **Feature-Based Architecture (FBA)** and "Best of All Time" engineering standards, it ensures seamless scalability and maintenance.

## 🚀 Key Features

### 📖 Sacred Texts
*   **The Noble Qur'an**: Complete 114 Surahs with 10+ translations, transliterations, and gapless audio.
*   **Hadith Collections**: 60,000+ narrations from Bukhari, Muslim, and other authentic books.
*   **Search**: Ultra-fast search across Quran and Hadith.

### 🤖 Smart Intelligence
*   **Basira AI**: Advanced Islamic AI assistant providing strictly referenced answers from Quran and Sunnah.

### 🕋 Tools & Utilities
*   **Prayer Times**: Accurate timings with geolocation and manual adjustment.
*   **Zakat Calculator**: Precise calculations for Gold, Silver, Cash, and Assets.
*   **Qibla Finder**: AR-style Qibla direction.
*   **Inheritance Calculator**: Sharia-compliant inheritance distribution.

### 🎨 Next-Gen UI/UX
*   **Futuristic Design**: Glassmorphism, smooth gradients, and noise textures.
*   **Motion**: Fluid transitions powered by Framer Motion (Web) and Flutter Animations (Mobile).
*   **Responsive**: Optimized for every screen size.

---

## 🏗️ Project Structure

This is a **Monorepo** managed by `pnpm` workspaces.

```
al-haqq/
├── apps/
│   ├── web/             # Next.js 14 Web Application
│   ├── mobile/          # Flutter Mobile Application
│   └── api/             # Express.js Backend API
├── packages/
│   ├── database/        # Shared Database schema & Prisma/Supabase clients
│   ├── ai-basira/       # Shared AI logic and prompts
│   └── shared/          # Shared TypeScript types and utilities
└── docs/                # Documentation
```

---

## 🛠️ Tech Stack

### 🌐 Web (`apps/web`)
*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
*   **Styling**: Tailwind CSS + Framer Motion
*   **State**: React Hooks + Context

### 📱 Mobile (`apps/mobile`)
*   **Framework**: [Flutter](https://flutter.dev/)
*   **Language**: Dart 3
*   **State**: Riverpod / Bloc

### ⚙️ Backend (`apps/api`)
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: Supabase (PostgreSQL)
*   **AI**: Google Generative AI (Gemini Pro)

---

## ⚡ Getting Started

### Prerequisites
*   **Node.js**: v20+
*   **pnpm**: v9+ (Recommended)
*   **Flutter SDK**: v3.0+ (For mobile development)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/shaik-irfan-basha/Al-Haqq.git
    cd AL-HAQQ
    ```

2.  **Install JS Dependencies (Web & API)**
    ```bash
    pnpm install
    ```

3.  **Install Mobile Dependencies**
    ```bash
    cd apps/mobile
    flutter pub get
    cd ../..
    ```

4.  **Environment Setup**
    Create `.env` files in `apps/web` and `apps/api` based on their `.env.example` files.

### 🏃‍♂️ Running the Apps

#### Web Development
Runs the Next.js web app at [http://localhost:3000](http://localhost:3000).
```bash
pnpm dev
# OR specific command:
pnpm --filter @al-haqq/web dev
```

#### Backend API
Runs the Express API at [http://localhost:4000](http://localhost:4000).
```bash
pnpm dev:api
```

#### Mobile App
Launches the Flutter app on your connected device or emulator.
```bash
cd apps/mobile
flutter run
```

---

## 🚀 Deployment

### 🌐 Web Deployment (Next.js)

**Recommended: Git Integration (Vercel/Netlify)**
1.  Push your code to GitHub.
2.  Import the project into Vercel or Netlify.
3.  Set the Root Directory to `apps/web`.
4.  The build command `next build` and output directory `out` (or `.next`) will be auto-detected.

**Manual Upload (Netlify Drop)**
> [!IMPORTANT]
> If using Netlify Drop, you must build the project locally first and upload the **output** folder, not the source code.

1.  Run the build command:
    ```bash
    pnpm build
    ```
2.  Navigate to `apps/web/out`.
3.  Drag the **`out`** folder into Netlify Drop.
    *   *Do not drag the root `AL-HAQQ` folder or `apps/web` folder.*

### ⚙️ API Deployment
Deploy the `apps/api` directory to a Node.js hosting provider like **Railway**, **Render**, or **Heroku**.
*   **Build Command**: `pnpm build` (inside `apps/api`)
*   **Start Command**: `node dist/index.js`

### 📱 Mobile Deployment
Follow the official Flutter guides to build for stores:
*   [Build for Android](https://docs.flutter.dev/deployment/android)
*   [Build for iOS](https://docs.flutter.dev/deployment/ios)

---

## 🤝 Contributing

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes
4.  Push to the Branch
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

<div align="center">
  <img src="apps/web/public/author.jpg" alt="Shaik Irfan Basha" width="120" style="border-radius: 50%; border: 4px solid #C7A24D;" />
  <h3>Shaik Irfan Basha</h3>
  <p><i>AI Developer & Software Engineer</i></p>
  
  <a href="https://www.linkedin.com/in/shaik-irfan-basha">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="https://github.com/shaik-irfan-basha">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="mailto:muhammadirfanbasha@gmail.com">
    <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" />
  </a>
</div>

<div align="center">
  <br />
  <p><i>"And say: My Lord, increase me in knowledge." — Quran 20:114</i></p>
  <p>Made with ❤️ for the Ummah | © 2026 Al-Haqq</p>
</div>
