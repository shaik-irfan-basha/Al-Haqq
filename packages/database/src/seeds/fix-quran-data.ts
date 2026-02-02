
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../../../');

console.log('Searching for env files in:', projectRoot);

const envPaths = [
    path.join(projectRoot, 'apps/web/.env.local'),
    path.join(projectRoot, '.env.local'),
    path.join(projectRoot, '.env')
];

for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
        console.log('Loading env from:', envPath);
        dotenv.config({ path: envPath });
    }
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL; // Fallback to public var if needed
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY; // Fallback

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    console.error('Available Envs:', Object.keys(process.env).filter(k => k.includes('SUPABASE')));
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const DATA_DIR = path.join(projectRoot, 'data/Quran');

interface UpdateData {
    id: number;
    arabic_text: string;
}

interface InsertData {
    ayah_id: number;
    language_code: string;
    translator: string;
    translation_text: string;
}

async function main() {
    console.log('Starting Quran Data Fixer...');
    console.log('Data Directory:', DATA_DIR);

    // 1. Load Surah Map (number -> id)
    console.log('Loading Surah Map...');
    const { data: surahs, error: surahError } = await supabase
        .from('surahs')
        .select('id, number');

    if (surahError) {
        throw new Error(`Failed to load surahs: ${surahError.message}`);
    }

    const surahMap = new Map<number, number>(); // number -> id
    surahs?.forEach((s: any) => surahMap.set(s.number, s.id));
    console.log(`Loaded ${surahMap.size} surahs.`);

    // 2. Load Ayah Map (surah_id, ayah_number -> id)
    console.log('Loading Ayah Map (this might take a moment)...');
    const { data: ayahs, error: ayahsError } = await supabase
        .from('ayahs')
        .select('id, surah_id, ayah_number');

    if (ayahsError) {
        throw new Error(`Failed to load ayahs: ${ayahsError.message}`);
    }

    const ayahMap = new Map<string, number>(); // "surah_id:ayah_number" -> id
    ayahs?.forEach((a: any) => ayahMap.set(`${a.surah_id}:${a.ayah_number}`, a.id));
    console.log(`Loaded ${ayahMap.size} ayahs.`);

    // 3. Fix Arabic Text
    await fixArabicText(surahMap, ayahMap);

    // 4. Fix Translations (Malayalam & Tamil)
    await fixTranslation('Quran_Malayalam.sql', 'ml', 'Abdul Hameed & Parappoor', surahMap, ayahMap);
    await fixTranslation('Quran_Tamil.sql', 'ta', 'Jan Turst Foundation', surahMap, ayahMap);

    console.log('All fixes completed successfully!');
}

async function fixArabicText(surahMap: Map<number, number>, ayahMap: Map<string, number>) {
    console.log('\n--- Fixing Arabic Text ---');
    const content = fs.readFileSync(path.join(DATA_DIR, 'Quran_Arabic.sql'), 'utf-8');

    // Pattern: (index, sura, aya, 'text')
    // We need to handle potential escaped quotes in text, though usually Quran text is clean.
    // The previous regex was: \((\d+), (\d+), (\d+), '(.+?)'\)
    const regex = /\((\d+),\s*(\d+),\s*(\d+),\s*'(.+?)'\)/g;

    let match;
    let count = 0;
    const updates: UpdateData[] = [];

    while ((match = regex.exec(content)) !== null) {
        const [_, indexStr, suraStr, ayaStr, text] = match;
        const sura = parseInt(suraStr);
        const aya = parseInt(ayaStr);

        const surahId = surahMap.get(sura);
        if (!surahId) {
            console.error(`Surah not found for number ${sura}`);
            continue;
        }

        const ayahId = ayahMap.get(`${surahId}:${aya}`);
        if (!ayahId) {
            // If ayah missing, we might need to insert it? 
            // Ideally ayahs should exist. If seeds ran partially, they might exist.
            // For now, log missing.
            // console.warn(`Ayah not found: Surah ${sura}, Ayah ${aya}`);
            continue;
        }

        updates.push({
            id: ayahId,
            arabic_text: text
        });

        count++;
    }

    console.log(`Found ${count} Arabic verses to update.`);

    // Batch update
    const BATCH_SIZE = 100;
    for (let i = 0; i < updates.length; i += BATCH_SIZE) {
        const batch = updates.slice(i, i + BATCH_SIZE);
        const { error } = await supabase
            .from('ayahs')
            .upsert(batch, { onConflict: 'id' }); // Using upsert to update by ID

        if (error) {
            console.error(`Error updating batch ${i}:`, error);
        } else {
            process.stdout.write(`\rUpdated ${Math.min(i + BATCH_SIZE, updates.length)}/${updates.length} verses...`);
        }
    }
    console.log('\nArabic text update complete.');
}

async function fixTranslation(filename: string, langCode: string, translatorName: string, surahMap: Map<number, number>, ayahMap: Map<string, number>) {
    console.log(`\n--- Fixing Translation: ${filename} (${langCode}) ---`);
    if (!fs.existsSync(path.join(DATA_DIR, filename))) {
        console.warn(`File not found: ${filename}, skipping.`);
        return;
    }

    const content = fs.readFileSync(path.join(DATA_DIR, filename), 'utf-8');

    // Pattern: (index, sura, aya, 'text')
    const regex = /\((\d+),\s*(\d+),\s*(\d+),\s*'(.+?)'\)/g;

    let match;
    let count = 0;
    const inserts: InsertData[] = [];

    while ((match = regex.exec(content)) !== null) {
        const [_, indexStr, suraStr, ayaStr, text] = match;
        const sura = parseInt(suraStr);
        const aya = parseInt(ayaStr);

        const surahId = surahMap.get(sura);
        if (!surahId) continue;

        const ayahId = ayahMap.get(`${surahId}:${aya}`);
        if (!ayahId) continue;

        inserts.push({
            ayah_id: ayahId,
            language_code: langCode,
            translator: translatorName,
            translation_text: text
        });

        count++;
    }

    console.log(`Found ${count} translation verses.`);

    // Batch insert
    const BATCH_SIZE = 1000; // Larger batch for inserts
    for (let i = 0; i < inserts.length; i += BATCH_SIZE) {
        const batch = inserts.slice(i, i + BATCH_SIZE);
        const { error } = await supabase
            .from('quran_translations')
            .upsert(batch, { onConflict: 'ayah_id, language_code, translator' });

        if (error) {
            console.error(`Error inserting batch ${i}:`, error);
        } else {
            process.stdout.write(`\rInserted ${Math.min(i + BATCH_SIZE, inserts.length)}/${inserts.length} translations...`);
        }
    }
    console.log(`\n${langCode} translation update complete.`);
}

main().catch(err => {
    console.error('Fatal Error:', err);
    process.exit(1);
});
