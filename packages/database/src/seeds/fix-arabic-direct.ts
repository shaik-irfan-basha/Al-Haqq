import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../../../');

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

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const DATA_DIR = path.join(projectRoot, 'data/Quran');

// Arabic text data - directly from SQL
const ARABIC_FATIHA = [
    { sura: 1, aya: 1, text: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ' },
    { sura: 1, aya: 2, text: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ' },
    { sura: 1, aya: 3, text: 'ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ' },
    { sura: 1, aya: 4, text: 'مَـٰلِكِ يَوْمِ ٱلدِّينِ' },
    { sura: 1, aya: 5, text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ' },
    { sura: 1, aya: 6, text: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ' },
    { sura: 1, aya: 7, text: 'صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ' },
];

async function main() {
    console.log('Starting Arabic Text Direct Fix...');

    // First get surah 1's ID
    const { data: surah1, error: surahError } = await supabase
        .from('surahs')
        .select('id')
        .eq('number', 1)
        .single();

    if (surahError || !surah1) {
        console.error('Could not find Surah 1:', surahError);
        process.exit(1);
    }

    console.log('Surah 1 ID:', surah1.id);

    // Get ayahs for surah 1
    const { data: ayahs, error: ayahsError } = await supabase
        .from('ayahs')
        .select('id, ayah_number, arabic_text')
        .eq('surah_id', surah1.id)
        .order('ayah_number');

    if (ayahsError) {
        console.error('Could not fetch ayahs:', ayahsError);
        process.exit(1);
    }

    console.log('Found ayahs:', ayahs?.length);
    console.log('First ayah current arabic_text:', ayahs?.[0]?.arabic_text);

    // Update each ayah with Arabic text
    for (const arabicData of ARABIC_FATIHA) {
        const ayah = ayahs?.find(a => a.ayah_number === arabicData.aya);
        if (!ayah) {
            console.warn(`Ayah ${arabicData.aya} not found`);
            continue;
        }

        const { error } = await supabase
            .from('ayahs')
            .update({ arabic_text: arabicData.text })
            .eq('id', ayah.id);

        if (error) {
            console.error(`Error updating ayah ${arabicData.aya}:`, error);
        } else {
            console.log(`Updated ayah ${arabicData.aya}: ${arabicData.text.substring(0, 30)}...`);
        }
    }

    // Verify the updates
    const { data: verifyAyahs, error: verifyError } = await supabase
        .from('ayahs')
        .select('ayah_number, arabic_text')
        .eq('surah_id', surah1.id)
        .order('ayah_number');

    console.log('\n--- Verification ---');
    verifyAyahs?.forEach(a => {
        console.log(`Ayah ${a.ayah_number}: ${a.arabic_text ? a.arabic_text.substring(0, 40) + '...' : 'NULL'}`);
    });

    console.log('\nDone!');
}

main().catch(err => {
    console.error('Fatal Error:', err);
    process.exit(1);
});
