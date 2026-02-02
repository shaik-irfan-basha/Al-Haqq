'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, BookOpen, Calendar, MapPin, Users, Heart,
    Star, ChevronDown, Scroll, Crown, Sword, Moon, Sun, Baby, Home, Mountain
} from 'lucide-react';

interface SeerahEvent {
    id: string;
    year: string;
    hijriYear: string;
    title: string;
    arabicTitle: string;
    description: string;
    details: string[];
    location: string;
    icon: React.ElementType;
    color: 'primary' | 'gold';
    category: string;
}

const seerahTimeline: SeerahEvent[] = [
    {
        id: 'birth',
        year: '570 CE',
        hijriYear: '12 Rabi al-Awwal',
        title: 'Birth of the Prophet ﷺ',
        arabicTitle: 'مولد النبي ﷺ',
        description: 'Prophet Muhammad ﷺ was born in Makkah in the Year of the Elephant.',
        details: [
            'Born on Monday, 12th Rabi al-Awwal in the Year of the Elephant',
            'Father Abdullah had died before his birth',
            'Mother Aminah bint Wahb gave birth in Makkah',
            'Named Muhammad (The Praised One) by grandfather Abdul Muttalib',
            'Miraculous signs: light emerged, idols in Kaaba fell',
            'Grandfather made dua at the Kaaba for his blessing'
        ],
        location: 'Makkah',
        icon: Star,
        color: 'primary',
        category: 'Early Life'
    },
    {
        id: 'halimah',
        year: '570-574 CE',
        hijriYear: 'Age 0-4',
        title: 'With Halimah As-Sadiyah',
        arabicTitle: 'عند حليمة السعدية',
        description: 'Nursed by Halimah in the desert of Banu Sad.',
        details: [
            'Sent to desert for healthier upbringing as was Arab custom',
            'Halimah was from Banu Sad tribe',
            'Her family experienced great barakah (blessing) with him',
            'Their animals gave abundant milk, crops flourished',
            'Opening of the chest (Shaqq as-Sadr) by angels occurred',
            'Angels washed his heart with Zamzam and filled it with wisdom',
            'Returned to mother Aminah at age 4-5'
        ],
        location: 'Desert of Banu Sad',
        icon: Heart,
        color: 'gold',
        category: 'Early Life'
    },
    {
        id: 'mother-death',
        year: '576 CE',
        hijriYear: 'Age 6',
        title: 'Death of Mother Aminah',
        arabicTitle: 'وفاة أمه آمنة',
        description: 'His beloved mother passed away at Abwa during return from Madinah.',
        details: [
            'Aminah took him to visit relatives in Madinah',
            'She fell ill during the return journey',
            'Died at Abwa between Makkah and Madinah',
            'Young Muhammad ﷺ was deeply affected',
            'Umm Ayman (Barakah), the family servant, cared for him',
            'Taken to grandfather Abdul Muttalib in Makkah'
        ],
        location: 'Abwa',
        icon: Moon,
        color: 'primary',
        category: 'Early Life'
    },
    {
        id: 'grandfather-death',
        year: '578 CE',
        hijriYear: 'Age 8',
        title: 'Death of Abdul Muttalib',
        arabicTitle: 'وفاة عبد المطلب',
        description: 'Grandfather passed away; Abu Talib became guardian.',
        details: [
            'Abdul Muttalib deeply loved his grandson',
            'He would give him special place near the Kaaba',
            'On his deathbed, entrusted Muhammad to Abu Talib',
            'Abu Talib, his uncle, became his new guardian',
            'Abu Talib raised him with his own children',
            'Treated him better than his own sons'
        ],
        location: 'Makkah',
        icon: Users,
        color: 'gold',
        category: 'Early Life'
    },
    {
        id: 'syria-trip',
        year: '582 CE',
        hijriYear: 'Age 12',
        title: 'First Journey to Syria',
        arabicTitle: 'الرحلة الأولى إلى الشام',
        description: 'Trade journey with Abu Talib; met monk Bahira.',
        details: [
            'Abu Talib took him on trade caravan to Syria',
            'Christian monk Bahira in Busra recognized prophetic signs',
            'Saw a cloud shading him from sun',
            'Tree branches bent to shade him',
            'Bahira advised Abu Talib to protect him from Jews',
            'Returned safely to Makkah'
        ],
        location: 'Syria (Busra)',
        icon: Mountain,
        color: 'primary',
        category: 'Youth'
    },
    {
        id: 'hilf-fudul',
        year: '590 CE',
        hijriYear: 'Age 20',
        title: 'Hilf al-Fudul (Pact of Virtue)',
        arabicTitle: 'حلف الفضول',
        description: 'Participated in pact to protect the oppressed.',
        details: [
            'Alliance formed to protect victims of injustice',
            'Formed after a merchant was cheated by a noble',
            'Young Muhammad actively participated',
            'Promised to defend the weak and oppressed',
            'He later said he would join such a pact even in Islam',
            'Shows early concern for justice'
        ],
        location: 'Makkah',
        icon: Scroll,
        color: 'gold',
        category: 'Youth'
    },
    {
        id: 'khadijah-marriage',
        year: '595 CE',
        hijriYear: 'Age 25',
        title: 'Marriage to Khadijah',
        arabicTitle: 'الزواج من خديجة',
        description: 'Married the noble widow Khadijah bint Khuwaylid.',
        details: [
            'Worked as trader for wealthy widow Khadijah',
            'She was impressed by his honesty and character',
            'Known throughout Makkah as Al-Amin (The Trustworthy)',
            'Khadijah was 40, he was 25 years old',
            'She proposed marriage through a friend',
            'Happy marriage lasting 25 years until her death',
            'She bore him 6 children: Qasim, Abdullah, Zainab, Ruqayyah, Umm Kulthum, Fatimah'
        ],
        location: 'Makkah',
        icon: Crown,
        color: 'primary',
        category: 'Youth'
    },
    {
        id: 'kaaba-rebuild',
        year: '605 CE',
        hijriYear: 'Age 35',
        title: 'Rebuilding the Kaaba',
        arabicTitle: 'إعادة بناء الكعبة',
        description: 'Resolved dispute about placing the Black Stone.',
        details: [
            'Kaaba damaged by flood, Quraysh decided to rebuild',
            'Dispute arose over who would place the Black Stone',
            'Tribes nearly went to war over the honor',
            'Agreed to accept decision of first person to enter',
            'Muhammad ﷺ entered; they rejoiced at his trustworthiness',
            'He placed stone on a cloth, had each tribe hold a corner',
            'He placed the stone with his own hands',
            'Wisdom prevented bloodshed'
        ],
        location: 'Makkah (Kaaba)',
        icon: Home,
        color: 'gold',
        category: 'Youth'
    },
    {
        id: 'cave-hira',
        year: '610 CE',
        hijriYear: 'Age 40',
        title: 'First Revelation in Cave Hira',
        arabicTitle: 'نزول الوحي في غار حراء',
        description: 'Angel Jibreel revealed first verses of Quran.',
        details: [
            'Used to retreat to Cave Hira for meditation',
            'During Ramadan, Angel Jibreel appeared',
            'Commanded "Iqra" (Read) three times',
            'First five verses of Surah Al-Alaq revealed',
            'Trembling with fear, returned to Khadijah',
            'She comforted him and took him to Waraqah ibn Nawfal',
            'Waraqah confirmed he received the same message as Musa',
            'Beginning of 23 years of revelation'
        ],
        location: 'Cave Hira',
        icon: BookOpen,
        color: 'primary',
        category: 'Prophethood'
    },
    {
        id: 'first-muslims',
        year: '610 CE',
        hijriYear: 'Year 1 of Prophethood',
        title: 'First Believers Accept Islam',
        arabicTitle: 'أول المسلمين',
        description: 'Khadijah, Ali, Zayd, and Abu Bakr embrace Islam.',
        details: [
            'Khadijah was the first to believe, without hesitation',
            'Ali ibn Abi Talib, young cousin living with them',
            'Zayd ibn Harithah, freed slave and adopted son',
            'Abu Bakr As-Siddiq, close friend, immediately believed',
            'Abu Bakr brought others: Uthman, Zubayr, Talha, Abdur Rahman',
            'Secret meetings held at Dar al-Arqam'
        ],
        location: 'Makkah',
        icon: Users,
        color: 'gold',
        category: 'Prophethood'
    },
    {
        id: 'public-dawah',
        year: '613 CE',
        hijriYear: 'Year 3 of Prophethood',
        title: 'Public Preaching Begins',
        arabicTitle: 'الجهر بالدعوة',
        description: 'Commanded to preach openly; faced severe opposition.',
        details: [
            'After 3 years of secret dawah, commanded to go public',
            'Climbed Mount Safa and called the tribes',
            'Asked if they would believe if he warned of an army',
            'They said yes, for he was Al-Amin',
            'Announced his prophethood and warned of punishment',
            'Uncle Abu Lahab cursed him publicly',
            'Surah Al-Masad revealed about Abu Lahab',
            'Persecution of Muslims began intensely'
        ],
        location: 'Mount Safa, Makkah',
        icon: Sun,
        color: 'primary',
        category: 'Prophethood'
    },
    {
        id: 'persecution',
        year: '613-615 CE',
        hijriYear: 'Years 3-5',
        title: 'Persecution of Early Muslims',
        arabicTitle: 'اضطهاد المسلمين الأوائل',
        description: 'Believers faced torture; Bilal, Ammar\'s family persecuted.',
        details: [
            'Bilal was laid on hot sand with rocks on chest',
            'Said "Ahad, Ahad" (One, One) despite torture',
            'Ammar ibn Yasir\'s family tortured',
            'Sumayyah, first martyr in Islam, killed by Abu Jahl',
            'Yasir, her husband, also martyred',
            'Slaves and weak had no tribal protection',
            'Abu Bakr used wealth to free slaves like Bilal'
        ],
        location: 'Makkah',
        icon: Sword,
        color: 'gold',
        category: 'Makkah Period'
    },
    {
        id: 'abyssinia',
        year: '615 CE',
        hijriYear: 'Year 5',
        title: 'First Migration to Abyssinia',
        arabicTitle: 'الهجرة الأولى إلى الحبشة',
        description: '11 men and 4 women migrate to Christian Abyssinia.',
        details: [
            'Persecution became unbearable',
            'Prophet suggested migration to Abyssinia',
            'King Najashi (Negus) known for justice',
            '11 men and 4 women in first group',
            'Led by Uthman ibn Affan with wife Ruqayyah',
            'Quraysh sent delegation to bring them back',
            'Jafar ibn Abi Talib gave famous speech about Islam',
            'King protected Muslims, refused to hand them over'
        ],
        location: 'Abyssinia (Ethiopia)',
        icon: MapPin,
        color: 'primary',
        category: 'Makkah Period'
    },
    {
        id: 'hamza-umar',
        year: '616 CE',
        hijriYear: 'Year 6',
        title: 'Hamza and Umar Accept Islam',
        arabicTitle: 'إسلام حمزة وعمر',
        description: 'Two powerful men strengthen the Muslim community.',
        details: [
            'Hamza accepted Islam defending the Prophet from Abu Jahl',
            'He was a renowned warrior and hunter',
            'Umar initially went to kill the Prophet',
            'Heard his sister reciting Quran (Surah Taha)',
            'Heart softened, went to Prophet and accepted Islam',
            'Muslims could now pray openly at the Kaaba',
            'Umar\'s conversion was answer to Prophet\'s dua'
        ],
        location: 'Makkah',
        icon: Sword,
        color: 'gold',
        category: 'Makkah Period'
    },
    {
        id: 'boycott',
        year: '616-619 CE',
        hijriYear: 'Years 6-9',
        title: 'Boycott in Shi\'b Abi Talib',
        arabicTitle: 'حصار شعب أبي طالب',
        description: 'Three-year social and economic boycott.',
        details: [
            'Quraysh boycotted Banu Hashim clan completely',
            'No trade, marriage, or interaction allowed',
            'Document hung inside the Kaaba',
            'Muslims confined to a valley for 3 years',
            'Faced severe hunger, ate leaves and leather',
            'Children cried from hunger at night',
            'Document miraculously eaten by termites except Allah\'s name',
            'Boycott finally ended after 3 years'
        ],
        location: 'Shi\'b Abi Talib, Makkah',
        icon: Moon,
        color: 'primary',
        category: 'Makkah Period'
    },
    {
        id: 'year-of-sorrow',
        year: '619 CE',
        hijriYear: 'Year 10',
        title: 'Year of Sorrow (Aam al-Huzn)',
        arabicTitle: 'عام الحزن',
        description: 'Death of Khadijah and Abu Talib within days.',
        details: [
            'Khadijah passed away in Ramadan',
            'She was his comfort, supporter, and first believer',
            'Abu Talib died shortly after',
            'Lost his protector against Quraysh',
            'Abu Lahab became clan leader, withdrew protection',
            'Persecution intensified without protection',
            'Traveled to Taif seeking support',
            'Rejected and pelted with stones by people of Taif'
        ],
        location: 'Makkah and Taif',
        icon: Heart,
        color: 'gold',
        category: 'Makkah Period'
    },
    {
        id: 'isra-miraj',
        year: '620 CE',
        hijriYear: 'Year 10',
        title: 'Isra and Mi\'raj',
        arabicTitle: 'الإسراء والمعراج',
        description: 'Night Journey to Jerusalem and Ascension to Heavens.',
        details: [
            'Taken from Makkah to Al-Aqsa on Buraq',
            'Led all prophets in prayer at Al-Aqsa',
            'Ascended through seven heavens',
            'Met prophets: Adam, Isa, Yahya, Yusuf, Idris, Harun, Musa, Ibrahim',
            'Witnessed Paradise and Hell',
            'Reached Sidrat al-Muntaha, beyond which none had passed',
            'Spoke directly with Allah',
            'Five daily prayers prescribed (reduced from 50)',
            'Abu Bakr believed immediately, earned title As-Siddiq'
        ],
        location: 'Makkah → Jerusalem → Heavens',
        icon: Star,
        color: 'primary',
        category: 'Makkah Period'
    },
    {
        id: 'aqaba-first',
        year: '621 CE',
        hijriYear: 'Year 11',
        title: 'First Pledge of Aqaba',
        arabicTitle: 'بيعة العقبة الأولى',
        description: '12 men from Madinah pledge allegiance.',
        details: [
            'During Hajj, met people from Yathrib (Madinah)',
            '6 men accepted Islam previous year',
            'Returned with 12 men who pledged allegiance',
            'Pledged to worship Allah alone',
            'Not to steal, commit adultery, or kill children',
            'To obey the Prophet in all good matters',
            'Musab ibn Umair sent to teach them Islam',
            'Islam spread rapidly in Madinah'
        ],
        location: 'Aqaba, near Makkah',
        icon: Users,
        color: 'gold',
        category: 'Before Hijrah'
    },
    {
        id: 'aqaba-second',
        year: '622 CE',
        hijriYear: 'Year 12',
        title: 'Second Pledge of Aqaba',
        arabicTitle: 'بيعة العقبة الثانية',
        description: '73 men and 2 women pledge to protect the Prophet.',
        details: [
            '73 men and 2 women came from Madinah',
            'Met secretly at night during Hajj',
            'Pledged to protect Prophet as they protect their families',
            'Pledge included fighting if necessary',
            '12 leaders (naqibs) appointed',
            'Abbas (still not Muslim) witnessed as family representative',
            'Quraysh learned of the pledge but too late',
            'Migration to Madinah began immediately'
        ],
        location: 'Aqaba, near Makkah',
        icon: Scroll,
        color: 'primary',
        category: 'Before Hijrah'
    },
    {
        id: 'hijrah',
        year: '622 CE',
        hijriYear: '27 Safar - 12 Rabi al-Awwal',
        title: 'The Hijrah to Madinah',
        arabicTitle: 'الهجرة إلى المدينة',
        description: 'Migration from Makkah to Madinah; beginning of Islamic calendar.',
        details: [
            'Quraysh plotted to kill the Prophet',
            'Jibreel informed him; told to migrate',
            'Left Ali sleeping in his bed as decoy',
            'Left with Abu Bakr at night',
            'Hid in Cave Thawr for three days',
            'Quraysh searched everywhere; spider web and dove protected cave',
            '"Do not grieve, Allah is with us"',
            'Traveled via coastal route to avoid detection',
            'Arrived in Quba, built first mosque',
            'Entered Madinah on 12 Rabi al-Awwal',
            'People rejoiced singing "Tala\'al Badru Alayna"',
            'Start of Islamic Hijri calendar'
        ],
        location: 'Makkah → Cave Thawr → Quba → Madinah',
        icon: MapPin,
        color: 'gold',
        category: 'Hijrah'
    },
    {
        id: 'masjid-nabawi',
        year: '622 CE',
        hijriYear: '1 AH',
        title: 'Building of Masjid an-Nabawi',
        arabicTitle: 'بناء المسجد النبوي',
        description: 'Prophet\'s Mosque built; center of the Muslim community.',
        details: [
            'Camel stopped at land owned by two orphans',
            'Purchased the land for the mosque',
            'Prophet worked carrying bricks himself',
            'Simple structure: palm trunks, mud walls, palm leaf roof',
            'Rooms for his wives built adjacent',
            'Became center for worship, education, government',
            'Suffah platform for poor companions to live and learn'
        ],
        location: 'Madinah',
        icon: Home,
        color: 'primary',
        category: 'Madinah Period'
    },
    {
        id: 'brotherhood',
        year: '622 CE',
        hijriYear: '1 AH',
        title: 'Brotherhood Between Muhajirun and Ansar',
        arabicTitle: 'المؤاخاة بين المهاجرين والأنصار',
        description: 'Lasting bonds formed between Makkan and Madinan Muslims.',
        details: [
            'Migrants (Muhajirun) arrived with nothing',
            'Helpers (Ansar) shared everything with them',
            'Each Muhajir paired with an Ansar',
            'Ansar offered half their wealth and properties',
            'Some offered to divorce a wife so brother could marry',
            'Migrants preferred to work and earn',
            'Unity created strongest community',
            'Unique social system in history'
        ],
        location: 'Madinah',
        icon: Heart,
        color: 'gold',
        category: 'Madinah Period'
    },
    {
        id: 'constitution',
        year: '622 CE',
        hijriYear: '1 AH',
        title: 'Constitution of Madinah',
        arabicTitle: 'صحيفة المدينة',
        description: 'First written constitution establishing rights of all citizens.',
        details: [
            'Agreement between Muslims, Jews, and others',
            'All tribes formed one Ummah (nation)',
            'Freedom of religion guaranteed',
            'Mutual defense obligations',
            'Prophet recognized as leader and arbitrator',
            'Economic responsibilities defined',
            'First constitution in human history',
            'Model of pluralistic governance'
        ],
        location: 'Madinah',
        icon: Scroll,
        color: 'primary',
        category: 'Madinah Period'
    },
    {
        id: 'qibla-change',
        year: '624 CE',
        hijriYear: '2 AH',
        title: 'Change of Qibla to Kaaba',
        arabicTitle: 'تحويل القبلة',
        description: 'Direction of prayer changed from Jerusalem to Makkah.',
        details: [
            'Muslims initially prayed toward Jerusalem',
            'Prophet wished to face the Kaaba',
            'Revelation came during prayer at Masjid al-Qiblatayn',
            'Commanded to turn toward Masjid al-Haram',
            'Congregation turned mid-prayer',
            'Jews criticized the change',
            'Confirmed Islam as continuation of Ibrahim\'s religion',
            'Masjid al-Qiblatayn has two mihrabs to this day'
        ],
        location: 'Madinah',
        icon: Mountain,
        color: 'gold',
        category: 'Madinah Period'
    },
    {
        id: 'badr',
        year: '624 CE',
        hijriYear: '17 Ramadan, 2 AH',
        title: 'Battle of Badr',
        arabicTitle: 'غزوة بدر',
        description: 'First major battle; 313 Muslims defeat 1,000 Quraysh.',
        details: [
            'Muslims intended to intercept Quraysh trade caravan',
            'Caravan escaped, but army came from Makkah',
            '313 Muslims vs over 1,000 Quraysh warriors',
            'Prophet made long dua the night before',
            '"O Allah, if this small group perishes, You will not be worshipped"',
            'Allah sent 1,000 angels to assist',
            '70 Quraysh killed, 70 captured',
            '14 Muslims martyred',
            'Abu Jahl killed; major Quraysh leaders dead',
            'Called "Yawm al-Furqan" - Day of Criterion',
            'Decisive victory boosted Muslim morale'
        ],
        location: 'Wells of Badr',
        icon: Sword,
        color: 'primary',
        category: 'Battles'
    },
    {
        id: 'uhud',
        year: '625 CE',
        hijriYear: '7 Shawwal, 3 AH',
        title: 'Battle of Uhud',
        arabicTitle: 'غزوة أحد',
        description: 'Major battle with important lessons; Hamza martyred.',
        details: [
            'Quraysh returned with 3,000 warriors seeking revenge',
            '1,000 Muslims, but 300 hypocrites withdrew',
            'Archers positioned on hill with strict orders to stay',
            'Muslims winning initially, pushing back Quraysh',
            'Archers left position thinking battle won',
            'Khalid ibn Walid (not yet Muslim) attacked from behind',
            '70 Muslims martyred including Hamza',
            'Prophet injured: tooth broken, face wounded',
            'Rumor spread that Prophet was killed',
            'Lessons: obedience, patience, not seeking worldly gain',
            'Victory belongs to Allah alone'
        ],
        location: 'Mount Uhud, north of Madinah',
        icon: Sword,
        color: 'gold',
        category: 'Battles'
    },
    {
        id: 'khandaq',
        year: '627 CE',
        hijriYear: '5 AH',
        title: 'Battle of the Trench (Khandaq)',
        arabicTitle: 'غزوة الخندق',
        description: '10,000 confederates siege Madinah; defeated by trench strategy.',
        details: [
            'Coalition of Quraysh, other tribes, and Jewish Banu Nadir',
            '10,000 warriors marched on Madinah',
            'Salman al-Farisi suggested digging a trench',
            'Prophet worked digging alongside companions',
            'Miracles: rock split after Prophet\'s strike, little food fed many',
            'Siege lasted about a month',
            'Banu Qurayza Jews betrayed treaty, threatened from within',
            'Severe cold, hunger, and fear tested believers',
            'Allah sent wind and unseen forces',
            'Confederates retreated in disarray',
            'End of major Quraysh military threat',
            '"Now we will attack them, they will not attack us"'
        ],
        location: 'Madinah',
        icon: Sword,
        color: 'primary',
        category: 'Battles'
    },
    {
        id: 'hudaybiyyah',
        year: '628 CE',
        hijriYear: '6 AH',
        title: 'Treaty of Hudaybiyyah',
        arabicTitle: 'صلح الحديبية',
        description: 'Peace treaty enabling spread of Islam; called a clear victory.',
        details: [
            'Prophet intended to perform Umrah with 1,400 Muslims',
            'Quraysh blocked entry to Makkah',
            'Camped at Hudaybiyyah; negotiations began',
            'Uthman sent as envoy; rumor of his death led to Pledge of Ridwan',
            'Treaty terms seemed unfavorable to Muslims',
            'Umar questioned but Prophet confirmed wisdom',
            '10-year peace treaty signed',
            'Muslims to return that year, come next year',
            'Any Quraysh coming to Muslims must be returned',
            'Revealed as "Fath Mubeen" (Clear Victory)',
            'Islam spread rapidly during peace',
            'More converts in 2 years than previous 19'
        ],
        location: 'Hudaybiyyah',
        icon: Scroll,
        color: 'gold',
        category: 'Treaties'
    },
    {
        id: 'khaybar',
        year: '628 CE',
        hijriYear: '7 AH',
        title: 'Conquest of Khaybar',
        arabicTitle: 'فتح خيبر',
        description: 'Jewish fortress conquered; Ali distinguished himself.',
        details: [
            'Khaybar: fortified Jewish settlement plotting against Muslims',
            '1,400 Muslims marched against multiple fortresses',
            'Fortresses fell one by one',
            'Ali given the banner after others returned unsuccessful',
            'Despite eye infection, he conquered main fortress',
            'Safiyyah bint Huyayy accepted Islam, married Prophet',
            'Land cultivated by Jews for half the produce',
            'Set precedent for dealings with conquered people'
        ],
        location: 'Khaybar',
        icon: Sword,
        color: 'primary',
        category: 'Battles'
    },
    {
        id: 'letters-kings',
        year: '628 CE',
        hijriYear: '7 AH',
        title: 'Letters to Kings and Rulers',
        arabicTitle: 'رسائل إلى الملوك',
        description: 'Prophet sent letters inviting world leaders to Islam.',
        details: [
            'Letters sent to Byzantine Emperor Heraclius',
            'Persian Emperor Khosrow II',
            'King of Egypt (Muqawqis)',
            'King of Abyssinia (Najashi)',
            'Heraclius acknowledged truth but feared his people',
            'Khosrow tore the letter; Prophet predicted his kingdom\'s destruction',
            'Muqawqis sent gifts and Maria al-Qibtiyyah',
            'Najashi had already accepted Islam',
            'Islam proclaimed as message for all humanity'
        ],
        location: 'Madinah',
        icon: Scroll,
        color: 'gold',
        category: 'Dawah'
    },
    {
        id: 'conquest-makkah',
        year: '630 CE',
        hijriYear: '8 AH',
        title: 'Conquest of Makkah',
        arabicTitle: 'فتح مكة',
        description: 'Victorious return with 10,000 Muslims; general amnesty.',
        details: [
            'Quraysh violated treaty by attacking Muslim allies',
            '10,000 Muslims marched secretly toward Makkah',
            'Abu Sufyan met Prophet, accepted Islam',
            'Makkah conquered with almost no bloodshed',
            'Four exceptions to amnesty, even they were mostly forgiven',
            'Prophet entered humbly, head bowed to his camel',
            '360 idols destroyed around Kaaba',
            'Recited: "Truth has come, falsehood has vanished"',
            'Bilal gave adhan from top of Kaaba',
            'General amnesty: "Go, you are free"',
            'Former enemies became Muslims',
            'Greatest day of victory for Islam'
        ],
        location: 'Makkah',
        icon: Crown,
        color: 'primary',
        category: 'Conquests'
    },
    {
        id: 'hunayn',
        year: '630 CE',
        hijriYear: '8 AH',
        title: 'Battle of Hunayn',
        arabicTitle: 'غزوة حنين',
        description: 'Victory after initial ambush; lesson against pride.',
        details: [
            'Hawazin and Thaqif tribes gathered to attack',
            '12,000 Muslims marched; some proud of their numbers',
            'Ambushed in narrow valley; army scattered in panic',
            'Only Prophet and few companions held ground',
            '"I am the Prophet, no lie! I am son of Abdul Muttalib!"',
            'Muslims regrouped and won decisively',
            'Lesson: victory from Allah, not numbers',
            'Massive spoils distributed; some complained',
            'Prophet gave generously to new Muslims to win hearts',
            'Ansar worried; Prophet assured his love for them'
        ],
        location: 'Valley of Hunayn',
        icon: Sword,
        color: 'gold',
        category: 'Battles'
    },
    {
        id: 'tabuk',
        year: '630 CE',
        hijriYear: '9 AH',
        title: 'Expedition to Tabuk',
        arabicTitle: 'غزوة تبوك',
        description: 'Largest expedition; test of faith in extreme heat.',
        details: [
            'Rumors of Byzantine army gathering',
            '30,000 Muslims marched in extreme summer heat',
            'Longest and most difficult expedition',
            'Hypocrites found excuses to stay behind',
            'Abu Bakr donated entire wealth',
            'Umar donated half his wealth',
            'Uthman equipped one-third of the army',
            'No battle occurred; Byzantines retreated',
            'Border tribes made treaties',
            'Three sincere believers left behind forgiven after 50 days',
            'Surah At-Tawbah revealed exposing hypocrites'
        ],
        location: 'Tabuk (Syria border)',
        icon: Sword,
        color: 'primary',
        category: 'Expeditions'
    },
    {
        id: 'farewell-pilgrimage',
        year: '632 CE',
        hijriYear: '10 AH',
        title: 'Farewell Pilgrimage',
        arabicTitle: 'حجة الوداع',
        description: 'Final Hajj with 100,000+ Muslims; Farewell Sermon.',
        details: [
            'Only Hajj performed by Prophet after conquest',
            'Over 100,000 Muslims gathered',
            'Taught all rituals of Hajj',
            'Delivered Farewell Sermon at Arafat',
            '"All mankind is from Adam and Eve... no superiority except by piety"',
            '"I leave with you Quran and Sunnah"',
            '"Have I conveyed the message?" All said yes',
            '"O Allah, be witness"',
            'Revelation: "Today I have perfected your religion"',
            'Prophet sensed approaching death',
            'Taught humanity\'s final divine guidance'
        ],
        location: 'Makkah and Arafat',
        icon: Users,
        color: 'gold',
        category: 'Final Year'
    },
    {
        id: 'passing',
        year: '632 CE',
        hijriYear: '12 Rabi al-Awwal, 11 AH',
        title: 'Passing of the Prophet ﷺ',
        arabicTitle: 'وفاة النبي ﷺ',
        description: 'The Prophet ﷺ passed away in the arms of Aisha.',
        details: [
            'Became ill with fever after returning from Cemetery visit',
            'Stayed in Aisha\'s room with her permission from other wives',
            'Continued leading prayer until too weak',
            'Abu Bakr led prayers in his place',
            'Final sermon: "Treat women well, establish prayer"',
            'Freed his slaves, gave away all his money',
            'On Monday 12 Rabi al-Awwal, fever intensified',
            'Head in Aisha\'s lap, repeated "With the highest companion"',
            'Pointing upward, passed away at age 63',
            'Most difficult day for the Ummah',
            'Abu Bakr: "Whoever worshipped Muhammad, Muhammad has died. Whoever worships Allah, Allah is Ever-Living."',
            'Buried in Aisha\'s room, now part of Masjid an-Nabawi'
        ],
        location: 'Madinah',
        icon: Moon,
        color: 'primary',
        category: 'Final Year'
    }
];

const categories = [...new Set(seerahTimeline.map(e => e.category))];

export default function SeerahPage() {
    const [expandedId, setExpandedId] = React.useState<string | null>(null);
    const [filterCategory, setFilterCategory] = React.useState<string>('All');

    const filteredEvents = filterCategory === 'All'
        ? seerahTimeline
        : seerahTimeline.filter(e => e.category === filterCategory);

    return (
        <div className="min-h-screen py-20 px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <Link
                    href="/resources"
                    className="inline-flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Resources</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="font-arabic text-5xl text-[var(--color-text)] mb-3" dir="rtl">
                        السيرة النبوية
                    </h1>
                    <h2 className="font-serif text-2xl text-[var(--color-text-secondary)] mb-2">
                        The Prophetic Biography
                    </h2>
                    <p className="text-[var(--color-text-muted)] max-w-xl mx-auto">
                        A comprehensive journey through the life of Prophet Muhammad ﷺ with {seerahTimeline.length} major events
                    </p>
                </motion.div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    <button
                        onClick={() => setFilterCategory('All')}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterCategory === 'All'
                                ? 'bg-[var(--color-primary)] text-white'
                                : 'bg-[var(--color-bg-warm)] text-[var(--color-text)] hover:bg-[var(--color-bg-hover)]'
                            }`}
                    >
                        All ({seerahTimeline.length})
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterCategory === cat
                                    ? 'bg-[var(--color-primary)] text-white'
                                    : 'bg-[var(--color-bg-warm)] text-[var(--color-text)] hover:bg-[var(--color-bg-hover)]'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Timeline */}
                <div className="relative">
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)] md:transform md:-translate-x-1/2" />

                    {filteredEvents.map((event, index) => {
                        const Icon = event.icon;
                        const isExpanded = expandedId === event.id;
                        const isLeft = index % 2 === 0;

                        return (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className={`relative flex items-start gap-4 md:gap-8 mb-6 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                            >
                                <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-[var(--color-bg)] border-3 border-[var(--color-primary)] transform -translate-x-1/2 z-10 mt-6" />

                                <div className={`ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${isLeft ? 'md:pr-8' : 'md:pl-8'}`}>
                                    <div
                                        className="card-premium p-5 cursor-pointer transition-all hover:shadow-md"
                                        onClick={() => setExpandedId(isExpanded ? null : event.id)}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${event.color === 'gold'
                                                    ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                                                    : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                                                }`}>
                                                {event.year}
                                            </span>
                                            <span className="text-xs text-[var(--color-text-muted)]">{event.hijriYear}</span>
                                        </div>

                                        <div className="flex items-start gap-3 mb-2">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${event.color === 'gold' ? 'bg-[var(--color-accent)]/10' : 'bg-[var(--color-primary)]/10'
                                                }`}>
                                                <Icon className={`w-5 h-5 ${event.color === 'gold' ? 'text-[var(--color-accent)]' : 'text-[var(--color-primary)]'}`} />
                                            </div>
                                            <div>
                                                <h3 className="font-serif text-lg text-[var(--color-text)]">{event.title}</h3>
                                                <p className="font-arabic text-sm text-[var(--color-text-muted)]" dir="rtl">{event.arabicTitle}</p>
                                            </div>
                                        </div>

                                        <p className="text-sm text-[var(--color-text-secondary)] mb-2">{event.description}</p>

                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pt-3 border-t border-[var(--color-border)] mt-3">
                                                        <ul className="space-y-2">
                                                            {event.details.map((detail, i) => (
                                                                <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                                                                    <span className="text-[var(--color-primary)] mt-0.5">•</span>
                                                                    {detail}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        <div className="flex items-center gap-2 mt-3 text-xs text-[var(--color-text-muted)]">
                                                            <MapPin className="w-3 h-3" />
                                                            <span>{event.location}</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="flex justify-center mt-2">
                                            <ChevronDown className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center card-premium p-6 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-accent)]/5"
                >
                    <p className="font-arabic text-2xl text-[var(--color-text)] mb-2" dir="rtl">
                        صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                        May Allah&apos;s peace and blessings be upon him
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
