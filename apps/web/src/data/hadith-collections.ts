// Complete list of all 17+ authentic Hadith collections
// This is authentic data, not demo content

export interface HadithCollection {
    id: string;
    arabicName: string;
    englishName: string;
    author: string;
    authorArabic: string;
    totalHadiths: number;
    description: string;
}

export const hadithCollections: HadithCollection[] = [
    {
        id: 'bukhari',
        arabicName: 'صحيح البخاري',
        englishName: 'Sahih al-Bukhari',
        author: 'Imam Muhammad al-Bukhari',
        authorArabic: 'الإمام محمد البخاري',
        totalHadiths: 7563,
        description: 'The most authentic collection of Hadith, compiled by Imam Bukhari over 16 years.'
    },
    {
        id: 'muslim',
        arabicName: 'صحيح مسلم',
        englishName: 'Sahih Muslim',
        author: 'Imam Muslim ibn al-Hajjaj',
        authorArabic: 'الإمام مسلم بن الحجاج',
        totalHadiths: 7500,
        description: 'The second most authentic collection, known for its strict methodology.'
    },
    {
        id: 'nasai',
        arabicName: 'سنن النسائي',
        englishName: 'Sunan an-Nasa\'i',
        author: 'Imam Ahmad an-Nasa\'i',
        authorArabic: 'الإمام أحمد النسائي',
        totalHadiths: 5761,
        description: 'One of the six major collections, known for its critical analysis.'
    },
    {
        id: 'abudawud',
        arabicName: 'سنن أبي داود',
        englishName: 'Sunan Abi Dawud',
        author: 'Imam Abu Dawud',
        authorArabic: 'الإمام أبو داود',
        totalHadiths: 5274,
        description: 'Focuses on hadith relevant to Islamic jurisprudence (fiqh).'
    },
    {
        id: 'tirmidhi',
        arabicName: 'جامع الترمذي',
        englishName: 'Jami\' at-Tirmidhi',
        author: 'Imam at-Tirmidhi',
        authorArabic: 'الإمام الترمذي',
        totalHadiths: 3956,
        description: 'Known for its commentary and grading of hadith authenticity.'
    },
    {
        id: 'ibnmajah',
        arabicName: 'سنن ابن ماجه',
        englishName: 'Sunan Ibn Majah',
        author: 'Imam Ibn Majah',
        authorArabic: 'الإمام ابن ماجه',
        totalHadiths: 4341,
        description: 'The sixth of the Kutub al-Sittah (six major collections).'
    },
    {
        id: 'malik',
        arabicName: 'موطأ مالك',
        englishName: 'Muwatta Malik',
        author: 'Imam Malik ibn Anas',
        authorArabic: 'الإمام مالك بن أنس',
        totalHadiths: 1832,
        description: 'One of the earliest compilations, written by the founder of the Maliki school.'
    },
    {
        id: 'ahmad',
        arabicName: 'مسند أحمد',
        englishName: 'Musnad Ahmad',
        author: 'Imam Ahmad ibn Hanbal',
        authorArabic: 'الإمام أحمد بن حنبل',
        totalHadiths: 27647,
        description: 'The largest collection, compiled by the founder of the Hanbali school.'
    },
    {
        id: 'darimi',
        arabicName: 'سنن الدارمي',
        englishName: 'Sunan ad-Darimi',
        author: 'Imam ad-Darimi',
        authorArabic: 'الإمام الدارمي',
        totalHadiths: 3503,
        description: 'An early collection predating Bukhari and Muslim.'
    },
    {
        id: 'riyadussalihin',
        arabicName: 'رياض الصالحين',
        englishName: 'Riyad as-Salihin',
        author: 'Imam an-Nawawi',
        authorArabic: 'الإمام النووي',
        totalHadiths: 1896,
        description: 'A compilation of hadith focused on ethics and spiritual guidance.'
    },
    {
        id: 'adab',
        arabicName: 'الأدب المفرد',
        englishName: 'Al-Adab al-Mufrad',
        author: 'Imam Muhammad al-Bukhari',
        authorArabic: 'الإمام محمد البخاري',
        totalHadiths: 1322,
        description: 'A collection by Imam Bukhari focused on Islamic manners and etiquette.'
    },
    {
        id: 'shamail',
        arabicName: 'الشمائل المحمدية',
        englishName: 'Shama\'il Muhammadiyah',
        author: 'Imam at-Tirmidhi',
        authorArabic: 'الإمام الترمذي',
        totalHadiths: 415,
        description: 'Describes the physical and moral characteristics of Prophet Muhammad ﷺ.'
    },
    {
        id: 'bulugh',
        arabicName: 'بلوغ المرام',
        englishName: 'Bulugh al-Maram',
        author: 'Ibn Hajar al-Asqalani',
        authorArabic: 'ابن حجر العسقلاني',
        totalHadiths: 1596,
        description: 'A collection of hadith pertaining to legal rulings.'
    },
    {
        id: 'qudsi',
        arabicName: 'الأحاديث القدسية',
        englishName: 'Hadith Qudsi',
        author: 'Various Compilers',
        authorArabic: 'مؤلفون متعددون',
        totalHadiths: 110,
        description: 'Sacred hadith where Allah speaks through the Prophet ﷺ.'
    },
    {
        id: 'arbaeen',
        arabicName: 'الأربعين النووية',
        englishName: '40 Hadith Nawawi',
        author: 'Imam an-Nawawi',
        authorArabic: 'الإمام النووي',
        totalHadiths: 42,
        description: 'Forty-two foundational hadith on Islamic principles.'
    },
    {
        id: 'mishkat',
        arabicName: 'مشكاة المصابيح',
        englishName: 'Mishkat al-Masabih',
        author: 'Al-Khatib at-Tabrizi',
        authorArabic: 'الخطيب التبريزي',
        totalHadiths: 6285,
        description: 'An expansion of Masabih as-Sunnah with additional hadith.'
    },
    {
        id: 'hisn',
        arabicName: 'حصن المسلم',
        englishName: 'Hisn al-Muslim',
        author: 'Sa\'id al-Qahtani',
        authorArabic: 'سعيد القحطاني',
        totalHadiths: 265,
        description: 'Fortress of the Muslim - a collection of authentic duas and adhkar.'
    },
];

export default hadithCollections;
