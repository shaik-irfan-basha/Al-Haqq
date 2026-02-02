# Al-Haqq Mobile App

Flutter-based cross-platform mobile application for iOS, Android, Windows, macOS, and Linux.

## Status: 🚧 Scaffolded (Phase 6)

This directory will contain the Flutter app. According to the roadmap, Flutter development begins in **Phase 6 (Weeks 25-32)**.

## Setup Instructions (When Ready)

```bash
# Create Flutter project
flutter create --org com.alhaqq --project-name al_haqq .

# Get dependencies
flutter pub get

# Run on device
flutter run
```

## Planned Structure

```
mobile/
├── lib/
│   ├── main.dart
│   ├── app/
│   │   ├── app.dart
│   │   └── routes.dart
│   ├── core/
│   │   ├── api/
│   │   ├── storage/
│   │   └── theme/
│   ├── features/
│   │   ├── quran/
│   │   ├── hadith/
│   │   ├── basira/
│   │   ├── prayer/
│   │   └── settings/
│   └── shared/
│       ├── widgets/
│       └── utils/
├── assets/
│   ├── fonts/
│   └── images/
├── android/
├── ios/
├── windows/
├── macos/
└── linux/
```

## Features Planned

- 📖 Quran reader with audio
- 📜 Hadith browser
- 🤖 AI Basira chat
- 🕌 Prayer times & Qibla
- 📚 Memorization tools
- ☁️ Cloud sync
- 📱 Offline mode

## Why Flutter?

- Single codebase for all platforms
- Native performance
- Excellent Arabic/RTL support
- 20+ year maintainability
- Offline-first capability
