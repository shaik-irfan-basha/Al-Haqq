# Al-Haqq Data Sources

> Raw Quran and Hadith data used to seed the Supabase database.

---

## 📁 Directory Structure

```
data/
├── Quran/                  # SQL INSERT files per language
│   ├── Quran_English.sql   # Sahih International translation
│   ├── Quran_Urdu.sql      # Urdu translation
│   ├── Quran_Telugu.sql    # Telugu translation
│   └── ...                 # Additional languages
│
└── Hadith/                 # JSON files per collection
    ├── bukhari.json        # Sahih al-Bukhari
    ├── muslim.json         # Sahih Muslim
    ├── abudawud.json       # Sunan Abu Dawud
    ├── tirmidhi.json       # Jami at-Tirmidhi
    ├── nasai.json          # Sunan an-Nasa'i
    ├── ibnmajah.json       # Sunan Ibn Majah
    └── ...                 # 17 collections total
```

---

## 🌍 MVP Languages

| Priority | Language    | Rationale                          |
| -------- | ----------- | ---------------------------------- |
| 1        | **English** | Anchor language, widest reach      |
| 2        | **Urdu**    | Largest Muslim language community  |
| 3        | **Telugu**  | Regional differentiator            |

---

## 📝 Data Formats

### Quran SQL Files

Each file contains `INSERT` statements targeting the `quran_translations` table:

| Column   | Type    | Description                    |
| -------- | ------- | ------------------------------ |
| `index`  | INT     | Unique row ID                  |
| `sura`   | INT     | Surah number (1–114)           |
| `aya`    | INT     | Ayah number within the Surah   |
| `text`   | TEXT    | Translation text               |

### Hadith JSON Files

Each JSON file follows this schema:

```json
{
  "metadata": {
    "name": "Sahih al-Bukhari",
    "author": "Imam Bukhari",
    "total_hadiths": 7563
  },
  "chapters": [
    { "number": 1, "arabic_title": "...", "english_title": "..." }
  ],
  "hadiths": [
    {
      "number": 1,
      "arabic_text": "...",
      "english_narrator": "Narrated ...",
      "english_text": "...",
      "grade": "Sahih"
    }
  ]
}
```

---

## 🚀 Usage

Seed all data into your Supabase database:

```bash
pnpm db:seed
```

This runs the seeding scripts in `packages/database/src/seeds/` which process all files in this directory and populate the corresponding database tables.

> **Note:** Ensure your `.env.local` has valid Supabase credentials before seeding.
