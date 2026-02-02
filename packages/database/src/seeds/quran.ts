/**
 * Quran Data Seeder
 * Imports Quran translations from SQL files into Supabase
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// All Available Languages
const TRANSLATIONS = [
    { file: 'Quran_English.sql', langCode: 'en', translator: 'Saheeh International' },
    { file: 'Quran_Urdu.sql', langCode: 'ur', translator: 'Urdu Translation' },
    { file: 'Quran_Telugu.sql', langCode: 'te', translator: 'Telugu Translation' },
    { file: 'Quran_Bengali.sql', langCode: 'bn', translator: 'Bengali Translation' },
    { file: 'Quran_Chinese.sql', langCode: 'zh', translator: 'Chinese Translation' },
    { file: 'Quran_Hindi.sql', langCode: 'hi', translator: 'Hindi Translation' },
    { file: 'Quran_Malayalam.sql', langCode: 'ml', translator: 'Malayalam Translation' },
    { file: 'Quran_Tamil.sql', langCode: 'ta', translator: 'Tamil Translation' },
];

interface AyahData {
    index: number;
    sura: number;
    aya: number;
    text: string;
}

/**
 * Parse SQL INSERT statements from Quran SQL file
 */
function parseQuranSQL(content: string, isKeyedFormat: boolean = false): AyahData[] {
    const ayahs: AyahData[] = [];
    const insertRegex = /\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*'((?:[^']|''|\\')*)'\s*\)/gi;

    let match;
    while ((match = insertRegex.exec(content)) !== null) {
        if (isKeyedFormat) {
            // Some files might have different structure, but based on inspection they seem standard
            // logic here might need adjustment if specific files fail
        }

        ayahs.push({
            index: parseInt(match[1]),
            sura: parseInt(match[2]),
            aya: parseInt(match[3]),
            text: match[4].replace(/''/g, "'").replace(/\\'/g, "'"),
        });
    }

    return ayahs;
}

/**
 * Get or create ayah records
 */
async function ensureAyahsExist(): Promise<Map<string, number>> {
    console.log('📖 Fetching surah data...');

    const { data: surahs, error: surahError } = await supabase
        .from('surahs')
        .select('id, number');

    if (surahError) throw surahError;

    const surahMap = new Map(surahs?.map(s => [s.number, s.id]) || []);
    const ayahMap = new Map<string, number>();

    // Check existing ayahs
    const { data: existingAyahs } = await supabase
        .from('ayahs')
        .select('id, surah_id, ayah_number');

    if (existingAyahs && existingAyahs.length > 0) {
        console.log(`Found ${existingAyahs.length} existing ayahs`);
        for (const ayah of existingAyahs) {
            for (const [surahNum, surahId] of surahMap) {
                if (surahId === ayah.surah_id) {
                    ayahMap.set(`${surahNum}:${ayah.ayah_number}`, ayah.id);
                    break;
                }
            }
        }
        return ayahMap;
    }

    console.log('Creating ayah records...');
    const { data: surahsWithAyahs } = await supabase
        .from('surahs')
        .select('id, number, total_ayahs');

    if (!surahsWithAyahs) throw new Error('No surahs found');

    for (const surah of surahsWithAyahs) {
        const ayahsToInsert: any[] = [];
        for (let i = 1; i <= surah.total_ayahs; i++) {
            ayahsToInsert.push({
                surah_id: surah.id,
                ayah_number: i,
                arabic_text: '',
            });
        }

        const batchSize = 100;
        for (let i = 0; i < ayahsToInsert.length; i += batchSize) {
            const batch = ayahsToInsert.slice(i, i + batchSize);
            const { data: inserted, error } = await supabase
                .from('ayahs')
                .insert(batch)
                .select('id, ayah_number');

            if (error) throw error;

            for (const ayah of inserted || []) {
                ayahMap.set(`${surah.number}:${ayah.ayah_number}`, ayah.id);
            }
        }
        console.log(`  ✓ Created ${surah.total_ayahs} ayahs for Surah ${surah.number}`);
    }

    return ayahMap;
}

/**
 * Seed Arabic text into the main ayahs table
 */
async function seedArabicText(dataDir: string, ayahMap: Map<string, number>): Promise<void> {
    console.log('\n📥 Seeding Arabic text...');
    const filePath = path.join(dataDir, 'Quran_Arabic.sql');

    if (!fs.existsSync(filePath)) {
        console.error('❌ Quran_Arabic.sql not found!');
        return;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const ayahs = parseQuranSQL(content);
    console.log(`  Parsed ${ayahs.length} Arabic verses`);

    const updates = ayahs.map(ayah => {
        const ayahId = ayahMap.get(`${ayah.sura}:${ayah.aya}`);
        if (!ayahId) return null;
        return {
            id: ayahId,
            arabic_text: ayah.text
        };
    }).filter(Boolean);

    // Update in batches
    const batchSize = 50;
    let updated = 0;

    for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, i + batchSize);
        process.stdout.write(`\r  ⏳ Updating batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(updates.length / batchSize)}...`);

        const { error } = await supabase
            .from('ayahs')
            .upsert(batch as any[], { onConflict: 'id' });

        if (error) {
            console.error(`\n  ❌ Error updating Arabic text:`, error.message);
        } else {
            updated += batch.length;
        }
    }
    console.log(`\n  ✓ Updated ${updated} ayahs with Arabic text`);
}

/**
 * Import a single translation file
 */
async function importTranslation(
    filePath: string,
    langCode: string,
    translator: string,
    ayahMap: Map<string, number>
): Promise<number> {
    console.log(`\n📥 Importing ${langCode} translation...`);

    const content = fs.readFileSync(filePath, 'utf-8');
    const ayahs = parseQuranSQL(content);

    console.log(`  Parsed ${ayahs.length} verses`);

    // Prepare translations
    const translations = ayahs.map(ayah => {
        const ayahId = ayahMap.get(`${ayah.sura}:${ayah.aya}`);
        if (!ayahId) return null;
        return {
            ayah_id: ayahId,
            language_code: langCode,
            translator: translator,
            translation_text: ayah.text,
        };
    }).filter(Boolean);

    // Insert in batches
    const batchSize = 100;
    let inserted = 0;

    for (let i = 0; i < translations.length; i += batchSize) {
        const batch = translations.slice(i, i + batchSize);
        process.stdout.write(`\r  ⏳ Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(translations.length / batchSize)}...`);

        const { error } = await supabase
            .from('quran_translations')
            .upsert(batch as any[], {
                onConflict: 'ayah_id,language_code,translator',
                ignoreDuplicates: true
            });

        if (error) {
            console.error(`\n  ❌ Error inserting batch:`, error.message);
        } else {
            inserted += batch.length;
        }
    }
    console.log(`\n  ✓ Inserted ${inserted} translations`);
    return inserted;
}

/**
 * Main seeder function
 */
async function seedQuran() {
    console.log('🕌 Al-Haqq Quran Seeder');
    console.log('========================\n');

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const dataDir = path.resolve(__dirname, '../../../../data/Quran');

    if (!fs.existsSync(dataDir)) {
        console.error(`❌ Data directory not found: ${dataDir}`);
        process.exit(1);
    }

    try {
        // Ensure ayahs exist
        const ayahMap = await ensureAyahsExist();
        console.log(`\n📊 Total ayahs in database: ${ayahMap.size}`);

        // Seed Arabic text first
        await seedArabicText(dataDir, ayahMap);

        // Import translations
        let totalImported = 0;

        for (const translation of TRANSLATIONS) {
            const filePath = path.join(dataDir, translation.file);

            if (!fs.existsSync(filePath)) {
                console.warn(`⚠ File not found: ${translation.file}`);
                continue;
            }

            const count = await importTranslation(
                filePath,
                translation.langCode,
                translation.translator,
                ayahMap
            );

            totalImported += count;
        }

        console.log('\n✅ Quran seeding complete!');
        console.log(`   Total translations imported: ${totalImported}`);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

// Export for main seed script
export { seedQuran };

// Run if called directly via CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    seedQuran();
}
