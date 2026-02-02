
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Load environment variables robustly
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

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    console.error('Available Envs:', Object.keys(process.env).filter(k => k.includes('SUPABASE')));
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const DUAS_DATA = [
    {
        category: 'Morning & Evening',
        arabic_text: 'الحَمْدُ للهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
        transliteration: 'Alhamdu lillahil-lathee ahyana ba\'da ma amatana wa-ilayhin-nushoor',
        translation: 'All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.',
        source: 'Bukhari 6312, Muslim 2711',
        audio_url: null
    },
    {
        category: 'Morning & Evening',
        arabic_text: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
        transliteration: 'Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namootu wa ilaykan-nushoor',
        translation: 'O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die and unto You is our resurrection.',
        source: 'Tirmidhi 3391',
        audio_url: null
    },
    {
        category: 'Sleep',
        arabic_text: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        transliteration: 'Bismika Allahumma amootu wa-ahya',
        translation: 'In Your Name, O Allah, I die and I live.',
        source: 'Bukhari 6324',
        audio_url: null
    },
    {
        category: 'Travel',
        arabic_text: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
        transliteration: 'Subhanal-lathee sakhkhara lana hatha wama kunna lahu muqrineen, wa-inna ila rabbina lamunqaliboon',
        translation: 'Glory is to Him Who has subjected this to us, and we were not able to do it. And surely to our Lord we will return.',
        source: 'Quran 43:13-14',
        audio_url: null
    },
    {
        category: 'Distress',
        arabic_text: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ',
        transliteration: 'Allahumma inni a\'oodhu bika minal-hammi wal-hazani, wal-\'ajzi wal-kasali, wal-bukhli wal-jubni, wa dala\'id-dayni, wa ghalabatir-rijal',
        translation: 'O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debts and being overpowered by men.',
        source: 'Bukhari 6369',
        audio_url: null
    },
    {
        category: 'Forgiveness',
        arabic_text: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
        transliteration: 'Allahumma anta Rabbee la ilaha illa ant, khalaqtanee wa-ana \'abduk, wa-ana \'ala \'ahdika wa-wa\'dika mas-tata\'t, a\'oodhu bika min sharri ma sana\'t, aboo-u laka bini\'matika \'alay, wa-aboo-u bizambee, faghfir lee fa-innahu la yaghfiruz-zunooba illa ant',
        translation: 'O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant, and I abide to Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me and I acknowledge my sin to You, so forgive me. For verily, no one forgives sins except You.',
        source: 'Bukhari 6306 (Sayyidul Istighfar)',
        audio_url: null
    },
    {
        category: 'Entering Mosque',
        arabic_text: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
        transliteration: 'Allahummaf-tah lee abwaba rahmatik',
        translation: 'O Allah, open the gates of Your mercy for me.',
        source: 'Muslim 713',
        audio_url: null
    },
    {
        category: 'Exiting Mosque',
        arabic_text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
        transliteration: 'Allahumma innee as-aluka min fadlik',
        translation: 'O Allah, I ask You from Your bounty.',
        source: 'Muslim 713',
        audio_url: null
    },
    {
        category: 'Protection',
        arabic_text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
        transliteration: 'Bismillahil-lathee la yadurru ma\'as-mihi shay-on fil-ardi wala fis-sama-i wahuwas-samee\'ul-\'aleem',
        translation: 'In the Name of Allah with Whose Name there is protection against every kind of harm in the earth or in the heaven, and He is the All-Hearing and All-Knowing.',
        source: 'Abu Dawud 5088',
        audio_url: null
    },
    {
        category: 'Food',
        arabic_text: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
        transliteration: 'Alhamdu lillahil-lathee at\'amana wa-saqana wa-ja\'alana muslimeen',
        translation: 'All praise is due to Allah who fed us and gave us drink and made us Muslims.',
        source: 'Tirmidhi 3457',
        audio_url: null
    },
    {
        category: 'After Prayer',
        arabic_text: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ، وَشُكْرِكَ، وَحُسْنِ عِبَادَتِكَ',
        transliteration: 'Allahumma a\'inni \'ala dhikrika, wa shukrika, wa husni \'ibadatik',
        translation: 'O Allah, help me to remember You, to thank You, and to worship You in the best of manners.',
        source: 'Abu Dawud 1522',
        audio_url: null
    },
    {
        category: 'Knowledge',
        arabic_text: 'رَبِّ زِدْنِي عِلْمًا',
        transliteration: 'Rabbi zidnee \'ilma',
        translation: 'My Lord, increase me in knowledge.',
        source: 'Quran 20:114',
        audio_url: null
    },
    {
        category: 'Health',
        arabic_text: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ',
        transliteration: 'Allahumma \'afinee fee badanee, Allahumma \'afinee fee sam\'ee, Allahumma \'afinee fee basaree, la ilaha illa ant',
        translation: 'O Allah, make me healthy in my body. O Allah, preserve for me my hearing. O Allah, preserve for me my sight. There is none worthy of worship but You.',
        source: 'Abu Dawud 5090',
        audio_url: null
    },
    {
        category: 'Before Wudu',
        arabic_text: 'بِسْمِ ٱللَّٰهِ',
        transliteration: 'Bismillah',
        translation: 'In the name of Allah.',
        source: 'Abu Dawud 101',
        audio_url: null
    },
    {
        category: 'After Wudu',
        arabic_text: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
        transliteration: 'Ash-hadu an la ilaha illallahu wahdahu la shareeka lah, wa-ash-hadu anna Muhammadan \'abduhu wa-rasooluh',
        translation: 'I bear witness that none has the right to be worshipped but Allah alone, Who has no partner; and I bear witness that Muhammad is His slave and His Messenger.',
        source: 'Muslim 234',
        audio_url: null
    },
    {
        category: 'Home',
        arabic_text: 'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
        transliteration: 'Bismillahi walajna, wa bismillahi kharajna, wa \'ala Rabbina tawakkalna',
        translation: 'In the Name of Allah we enter, in the Name of Allah we leave, and upon our Lord we depend.',
        source: 'Abu Dawud 5096',
        audio_url: null
    },
    {
        category: 'Rain',
        arabic_text: 'اللَّهُمَّ صَيِّبًا نَافِعًا',
        transliteration: 'Allahumma sayyiban nafi\'a',
        translation: 'O Allah, may it be a beneficial rain.',
        source: 'Bukhari 1032',
        audio_url: null
    },
    {
        category: 'Hearing Thunder',
        arabic_text: 'سُبْحَانَ الَّذِي يُسَبِّحُ الرَّعْدُ بِحَمْدِهِ وَالْمَلَائِكَةُ مِنْ خِيفَتِهِ',
        transliteration: 'Subhanal-lathee yusabbihur-ra\'du bihamdihi wal-mala-ikatu min kheefatih',
        translation: 'Glory is to Him Whom thunder glorifies with His praise, and the angels glorify Him out of awe of Him.',
        source: 'Muwatta Malik 1801',
        audio_url: null
    }
];

async function seedDuas() {
    console.log('🌱 Seeding Duas...');

    // Clear existing for clean seed (optional, or just upsert)
    // await supabase.from('duas').delete().neq('id', 0);

    for (const dua of DUAS_DATA) {
        const { error } = await supabase
            .from('duas')
            .upsert(dua, { onConflict: 'arabic_text' } as any); // Assuming unique enough or just insert

        if (error) {
            console.error('Error seeding dua:', error.message);
        }
    }

    console.log(`✅ Seeded ${DUAS_DATA.length} duas.`);
}

seedDuas();
