# Al-Haqq Mobile App

> Cross-platform Flutter application for iOS, Android, Windows, macOS & Linux.

---

## 📋 Status

| Phase   | Timeline          | Status        |
| ------- | ----------------- | ------------- |
| Phase 6 | Weeks 25–32       | 🚧 Scaffolded |

Flutter development begins after the web platform is stable.

---

## 🚀 Setup (When Ready)

```bash
# Create Flutter project
flutter create --org com.alhaqq --project-name al_haqq .

# Install dependencies
flutter pub get

# Run on connected device
flutter run
```

---

## 📁 Planned Architecture

```
lib/
├── main.dart                 # App entry point
├── app/
│   ├── app.dart              # MaterialApp configuration
│   └── routes.dart           # Named route definitions
├── core/
│   ├── api/                  # REST API client (Dio/http)
│   ├── storage/              # Local storage (Hive/SQLite)
│   └── theme/                # Design tokens, colors, typography
├── features/
│   ├── quran/                # Quran reader + audio
│   ├── hadith/               # Hadith browser
│   ├── basira/               # AI chat interface
│   ├── prayer/               # Prayer times + Qibla
│   └── settings/             # User preferences
└── shared/
    ├── widgets/              # Reusable UI components
    └── utils/                # Helper functions
```

---

## ✨ Planned Features

| Feature               | Description                                        |
| --------------------- | -------------------------------------------------- |
| 📖 Quran Reader       | Full Quran with audio, translations & tafsir       |
| 📜 Hadith Browser     | Search & browse all 17 collections                 |
| 🤖 Basira AI          | Islamic AI chat with source citations              |
| 🕌 Prayer Times       | GPS-based salah timings with notifications          |
| 🧭 Qibla Compass      | AR-style Qibla direction finder                    |
| 📚 Memorization       | Hifz tracker with spaced repetition                |
| ☁️ Cloud Sync         | Cross-device bookmarks, notes & progress           |
| 📱 Offline Mode       | Full functionality without internet                |

---

## 🤔 Why Flutter?

- **Single codebase** — 6 platforms from one Dart codebase
- **Native performance** — Compiled to ARM/x64, no bridge
- **Excellent RTL** — First-class Arabic & Urdu support
- **Rich animations** — Custom painters, implicit & explicit
- **Offline-first** — Built-in SQLite and local storage
