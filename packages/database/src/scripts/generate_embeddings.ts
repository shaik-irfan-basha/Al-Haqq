import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

import fs from 'fs';

// Load env from root (assuming running from monorepo root)
console.log('CWD:', process.cwd());
console.log('Checking .env.local:', fs.existsSync('.env.local'));

dotenv.config(); // Loads .env
dotenv.config({ path: '.env.local' }); // Loads .env.local

// Debug: Log if keys are found (partially masked)
const mask = (s?: string) => s ? `${s.slice(0, 5)}...` : 'MISSING';
console.log(`Env Check: SUPABASE_URL=${mask(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)}`);
console.log(`Env Check: GEMINI_KEY=${mask(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY)}`);

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !GEMINI_KEY) {
    console.error('Missing environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

async function generateEmbeddings() {
    console.log('🚀 Starting embedding generation...');

    // 1. Fetch Ayahs with Translation (English)
    // We'll use the english translation for searching
    const { data: ayahs, error } = await supabase
        .from('quran_translations')
        .select(`
            ayah_id,
            translation_text,
            ayahs!inner (
                surah_id,
                ayah_number,
                surahs!inner (
                    english_name,
                    number
                )
            )
        `)
        .eq('language_code', 'en')
        .order('ayah_id', { ascending: true }); // Limit for testing if needed: .limit(100)

    if (error) {
        console.error('Error fetching ayahs:', error);
        return;
    }

    console.log(`📝 Found ${ayahs.length} ayahs to embed.`);

    // 2. Process in batches
    const BATCH_SIZE = 100; // Gemini supports up to 100 in batchEmbedContents? Limit is often lower for text. Let's try 50.
    const CHUNK_SIZE = 10;
    let processed = 0;

    // FOR DEMO: Only embed first 5 Surahs and last 10 Surahs to save time/cost
    const filteredAyahs = ayahs.filter((a: any) => {
        const surah = Array.isArray(a.ayahs) ? a.ayahs[0]?.surahs : a.ayahs?.surahs;
        // Check for array nesting in surahs too just in case
        const surahNum = Array.isArray(surah) ? surah[0]?.number : surah?.number;
        return surahNum <= 5 || surahNum >= 104;
    });
    console.log(`ℹ️ Optimization: Processing ${filteredAyahs.length} ayahs (Surah 1-5 & 104-114) for demo.`);

    const embeddingModel = genAI.getGenerativeModel({ model: "models/text-embedding-004" });

    for (let i = 0; i < filteredAyahs.length; i += CHUNK_SIZE) {
        const batch = filteredAyahs.slice(i, i + CHUNK_SIZE);

        try {
            // Prepare requests for batchEmbedContents
            // The SDK logic might vary, let's stick to sequential single requests if batch is tricky without types.
            // Actually, let's just do sequential to be 100% safe on rate limits (15 RPM free tier).
            // Sleep 4 seconds between requests = 15 RPM.

            for (const item of batch) {
                const ayahData = Array.isArray(item.ayahs) ? item.ayahs[0] : item.ayahs;
                const surahData = Array.isArray(ayahData.surahs) ? ayahData.surahs[0] : ayahData.surahs;

                const text = `Quran Surah ${surahData.number} (${surahData.english_name}) Verse ${ayahData.ayah_number}: ${item.translation_text}`;

                const result = await embeddingModel.embedContent(text);
                const embedding = result.embedding.values;

                await supabase
                    .from('content_embeddings')
                    .upsert({
                        content_type: 'ayah',
                        content_id: item.ayah_id,
                        language: 'en',
                        embedding: embedding
                    }, { onConflict: 'content_type, content_id, language' });

                process.stdout.write('.');
                await new Promise(r => setTimeout(r, 2000)); // 2s delay = ~30 RPM (burst) or safe.
            }
        } catch (e) {
            console.error('Error in batch:', e);
        }

        processed += batch.length;
        console.log(`\n✅ Processed ${processed}/${filteredAyahs.length}`);
    }

    console.log('🎉 Embedding generation complete!');
}

generateEmbeddings().catch(console.error);
