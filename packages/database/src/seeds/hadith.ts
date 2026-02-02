/**
 * Hadith Data Seeder
 * Imports Hadith collections from JSON files into Supabase
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env.local' });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface HadithJSON {
    id: number;
    metadata: {
        arabic: { title: string; author?: string };
        english: { title: string; author?: string };
    };
    chapters: Array<{
        id: number;
        bookId: number;
        arabic: string;
        english: string;
    }>;
    hadiths: Array<{
        id: number;
        idInBook: number;
        chapterId: number;
        bookId: number;
        arabic: string;
        english: {
            narrator?: string;
            text: string;
        };
    }>;
}

// Map file names to slugs
const FILE_TO_SLUG: Record<string, string> = {
    'bukhari.json': 'bukhari',
    'muslim.json': 'muslim',
    'abudawud.json': 'abudawud',
    'tirmidhi.json': 'tirmidhi',
    'nasai.json': 'nasai',
    'ibnmajah.json': 'ibnmajah',
    'malik.json': 'malik',
    'ahmed.json': 'ahmed',
    'darimi.json': 'darimi',
    'nawawi40.json': 'nawawi40',
    'qudsi40.json': 'qudsi40',
    'riyad_assalihin.json': 'riyad_assalihin',
    'bulugh_almaram.json': 'bulugh_almaram',
    'mishkat_almasabih.json': 'mishkat_almasabih',
    'aladab_almufrad.json': 'aladab_almufrad',
    'shamail_muhammadiyah.json': 'shamail_muhammadiyah',
    'shahwaliullah40.json': 'shahwaliullah40',
};

/**
 * Import a single hadith collection
 */
async function importHadithCollection(filePath: string, slug: string): Promise<number> {
    console.log(`\n📥 Importing ${slug}...`);

    const content = fs.readFileSync(filePath, 'utf-8');
    const data: HadithJSON = JSON.parse(content);

    // Upsert book data
    const bookPayload = {
        slug,
        arabic_title: data.metadata.arabic.title,
        english_title: data.metadata.english.title,
        author_arabic: data.metadata.arabic.author,
        author_english: data.metadata.english.author,
    };

    const { data: book, error: bookError } = await supabase
        .from('hadith_books')
        .upsert(bookPayload, { onConflict: 'slug' })
        .select('id')
        .single();

    if (bookError || !book) {
        console.error(`  ❌ Failed to upsert book: ${slug}`, bookError?.message);
        return 0;
    }

    const bookId = book.id;

    // Import chapters
    console.log(`  📚 Importing ${data.chapters?.length || 0} chapters...`);

    if (data.chapters && data.chapters.length > 0) {
        const chapters = data.chapters
            .filter(ch => ch.id !== undefined && ch.id !== null)
            .map(ch => ({
                book_id: bookId,
                chapter_number: ch.id,
                arabic_title: ch.arabic || null,
                english_title: ch.english || null,
            }));

        if (chapters.length > 0) {
            const { error: chapterError } = await supabase
                .from('hadith_chapters')
                .upsert(chapters, { onConflict: 'book_id,chapter_number' });

            if (chapterError) {
                console.error(`  ⚠ Chapter insert error:`, chapterError.message);
            }
        }
    }

    // Get chapter IDs mapping
    const { data: chaptersFromDB } = await supabase
        .from('hadith_chapters')
        .select('id, chapter_number')
        .eq('book_id', bookId);

    const chapterMap = new Map(
        chaptersFromDB?.map(ch => [ch.chapter_number, ch.id]) || []
    );

    // Import hadiths
    console.log(`  📜 Importing ${data.hadiths?.length || 0} hadiths...`);

    if (!data.hadiths || data.hadiths.length === 0) {
        console.log(`  ⚠ No hadiths found in file`);
        return 0;
    }

    const hadiths = data.hadiths.map(h => ({
        book_id: bookId,
        chapter_id: chapterMap.get(h.chapterId) || null,
        hadith_number: h.idInBook || h.id,
        arabic_text: h.arabic || '',
        english_narrator: h.english?.narrator || null,
        english_text: h.english?.text || '',
        grade: null, // Will be added later if available
        reference: `${slug}:${h.idInBook || h.id}`,
    }));

    // Insert in batches
    const batchSize = 50;
    let inserted = 0;

    for (let i = 0; i < hadiths.length; i += batchSize) {
        const batch = hadiths.slice(i, i + batchSize);
        process.stdout.write(`\r  ⏳ Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(hadiths.length / batchSize)}...`);

        const { error } = await supabase
            .from('hadiths')
            .upsert(batch, {
                onConflict: 'book_id,hadith_number',
                ignoreDuplicates: false
            });

        if (error) {
            console.error(`\n  ❌ Hadith insert error (batch ${Math.floor(i / batchSize) + 1}):`, error.message);
        } else {
            inserted += batch.length;
        }
    }
    process.stdout.write('\n');

    // Update book total_hadiths
    await supabase
        .from('hadith_books')
        .update({ total_hadiths: hadiths.length })
        .eq('id', bookId);

    console.log(`  ✓ Inserted ${inserted} hadiths`);
    return inserted;
}

/**
 * Main seeder function
 */
async function seedHadith() {
    console.log('🕌 Al-Haqq Hadith Seeder');
    console.log('=========================\n');

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const dataDir = path.resolve(__dirname, '../../../../data/Hadith');

    // Verify data directory exists
    if (!fs.existsSync(dataDir)) {
        console.error(`❌ Data directory not found: ${dataDir}`);
        process.exit(1);
    }

    try {
        // Get list of JSON files
        const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
        console.log(`📁 Found ${files.length} hadith files\n`);

        let totalImported = 0;

        for (const file of files) {
            const slug = FILE_TO_SLUG[file];
            if (!slug) {
                console.warn(`⚠ Unknown file: ${file}, skipping...`);
                continue;
            }

            const filePath = path.join(dataDir, file);
            const count = await importHadithCollection(filePath, slug);
            totalImported += count;
        }

        console.log('\n✅ Hadith seeding complete!');
        console.log(`   Total hadiths imported: ${totalImported}`);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

// Export for main seed script
export { seedHadith };

// Run if called directly via CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    seedHadith();
}
