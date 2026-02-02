const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local for keys
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnv = (key) => {
    const match = envContent.match(new RegExp(`${key}=(.+)`));
    return match ? match[1].trim() : null;
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    console.log('1. Fetching Surah 1...');

    // 1. Get Surah ID
    const { data: surah, error: surahError } = await supabase
        .from('surahs')
        .select('id, number, arabic_name')
        .eq('number', 1)
        .single();

    if (surahError) {
        console.error('Surah Fetch Error:', JSON.stringify(surahError, null, 2));
        return;
    }

    console.log('Surah Found:', surah.id);

    console.log('2. Fetching Ayahs...');
    // 2. Get Ayahs
    const { data: ayahs, error: ayahsError } = await supabase
        .from('ayahs')
        .select('id, ayah_number, arabic_text')
        .eq('surah_id', surah.id)
        .order('ayah_number');

    if (ayahsError) {
        console.error('Ayah Fetch Error:', JSON.stringify(ayahsError, null, 2));
        return;
    }

    console.log(`Ayahs Found: ${ayahs.length}`);

    if (ayahs.length > 0) {
        console.log('First Ayah Arabic Text:', `"${ayahs[0].arabic_text}"`);

        const firstAyah = ayahs[0];
        console.log('First Ayah Object:', JSON.stringify(firstAyah));

        // Detailed check
        const missingText = ayahs.filter(a => !a.arabic_text || a.arabic_text.trim() === '');
        if (missingText.length > 0) {
            console.error(`WARNING: ${missingText.length} ayahs are missing arabic text!`);
        } else {
            console.log('SUCCESS: All ayahs have arabic text content.');
        }
    } else {
        console.error('ERROR: No ayahs returned for Surah 1.');
    }
}

checkData().catch(e => console.error('Script Error:', e));
