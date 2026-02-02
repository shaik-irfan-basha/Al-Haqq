# Al-Haqq Data Files

This directory contains the source data for the Al-Haqq platform.

## Structure

```
data/
├── Quran/          # SQL files with Quran translations
│   ├── Quran_English.sql
│   ├── Quran_Urdu.sql
│   ├── Quran_Telugu.sql    # MVP languages
│   └── ...                 # Other languages
│
└── Hadith/         # JSON files with Hadith collections
    ├── bukhari.json
    ├── muslim.json
    └── ...                 # 17 collections total
```

## MVP Languages

The following languages are prioritized for MVP:

1. **English** - Anchor language
2. **Urdu** - Large Muslim audience
3. **Telugu** - Regional differentiator

## Data Format

### Quran SQL Files

Each SQL file contains INSERT statements with:
- `index` - Unique ID
- `sura` - Surah number (1-114)
- `aya` - Ayah number
- `text` - Translation text

### Hadith JSON Files

Each JSON file contains:
- `metadata` - Book title and author
- `chapters` - Chapter information
- `hadiths` - Individual hadith entries with Arabic and English text

## Usage

Run the seeder from the project root:

```bash
pnpm db:seed
```

This will import all data into Supabase.
