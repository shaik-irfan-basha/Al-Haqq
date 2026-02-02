
import fs from 'fs';
import path from 'path';

// Standard Bukhari Book List (99 Books)
// Source: https://sunnah.com/bukhari
const STANDARD_BUKHARI_BOOKS = [
    { number: 1, english: "Revelation" },
    { number: 2, english: "Belief" },
    { number: 3, english: "Knowledge" },
    { number: 4, english: "Ablutions (Wudu')" },
    { number: 5, english: "Bathing (Ghusl)" },
    { number: 6, english: "Menstrual Periods" },
    { number: 7, english: "Rubbing hands and feet with dust (Tayammum)" },
    { number: 8, english: "Prayers (Salat)" },
    { number: 9, english: "Times of the Prayers" },
    { number: 10, english: "Call to Prayers (Adhaan)" },
    { number: 11, english: "Friday Prayer" },
    { number: 12, english: "Fear Prayer" },
    { number: 13, english: "The Two Festivals (Eids)" },
    { number: 14, english: "Witr Prayer" },
    { number: 15, english: "Invoking Allah for Rain (Istisqaa)" },
    { number: 16, english: "Eclipses" },
    { number: 17, english: "Prostration During Recital of Qur'an" },
    { number: 18, english: "Shortening the Prayers (At-Taqseer)" },
    { number: 19, english: "Prayer at Night (Tahajjud)" },
    { number: 20, english: "Virtues of Prayer at Masjid Makkah and Madinah" },
    { number: 21, english: "Actions while Praying" },
    { number: 22, english: "Forgetfulness in Prayer" },
    { number: 23, english: "Funerals (Al-Janaa'iz)" },
    { number: 24, english: "Obligatory Charity Tax (Zakat)" },
    { number: 25, english: "Hajj (Pilgrimage)" },
    { number: 26, english: "Umrah (Minor pilgrimage)" },
    { number: 27, english: "Pilgrims Prevented from Completing the Pilgrimage" },
    { number: 28, english: "Penalty of Hunting while on Pilgrimage" },
    { number: 29, english: "Virtues of Madinah" },
    { number: 30, english: "Fasting" },
    { number: 31, english: "Tarawih Prayers" },
    { number: 32, english: "Virtues of the Night of Qadr" },
    { number: 33, english: "Retiring to a Mosque for Remembrance of Allah (I'tikaf)" },
    { number: 34, english: "Sales and Trade" },
    { number: 35, english: "Sales in which a Price is paid for Goods to be Delivered Later (As-Salam)" },
    { number: 36, english: "Hiring" },
    { number: 37, english: "Transferance of a Debt from One Person to Another (Al-Hawaala)" },
    { number: 38, english: "Representation, Authorization, Business by Proxy" },
    { number: 39, english: "Agriculture" },
    { number: 40, english: "Distribution of Water" },
    { number: 41, english: "Loans, Payment of Loans, Freezing of Property, Bankruptcy" },
    { number: 42, english: "Lost Things Picked up by Someone (Luqata)" },
    { number: 43, english: "Oppressions" },
    { number: 44, english: "Partnership" },
    { number: 45, english: "Mortgaging" },
    { number: 46, english: "Manumission of Slaves" },
    { number: 47, english: "Gifts" },
    { number: 48, english: "Witnesses" },
    { number: 49, english: "Peacemaking" },
    { number: 50, english: "Conditions" },
    { number: 51, english: "Wills and Testaments (Wasaayaa)" },
    { number: 52, english: "Fighting for the Cause of Allah (Jihad)" },
    { number: 53, english: "One-fifth of Booty to the Cause of Allah (Khumus)" },
    { number: 54, english: "Jizyah and Mawaada'ah" },
    { number: 55, english: "Creation" },
    { number: 56, english: "Prophets" },
    { number: 57, english: "Companions of the Prophet" },
    { number: 58, english: "Merits of the Helpers in Madinah (Ansaar)" },
    { number: 59, english: "Military Expeditions led by the Prophet (pbuh) (Al-Maghaazi)" },
    { number: 60, english: "Prophetic Commentary on the Qur'an (Tafseer of the Prophet (pbuh))" },
    { number: 61, english: "Virtues of the Qur'an" },
    { number: 62, english: "Wedlock, Marriage (Nikaah)" },
    { number: 63, english: "Divorce" },
    { number: 64, english: "Supporting the Family" },
    { number: 65, english: "Food, Meals" },
    { number: 66, english: "Sacrifice on Occasion of Birth (Aqiqa)" },
    { number: 67, english: "Hunting, Slaughtering" },
    { number: 68, english: "Al-Adha Festival Sacrifice (Adaahi)" },
    { number: 69, english: "Drinks" },
    { number: 70, english: "Patients" },
    { number: 71, english: "Medicine" },
    { number: 72, english: "Dress" },
    { number: 73, english: "Good Manners and Form (Al-Adab)" },
    { number: 74, english: "Asking Permission" },
    { number: 75, english: "Invocations" },
    { number: 76, english: "To make the Heart Tender (Ar-Riqaq)" },
    { number: 77, english: "Divine Will (Al-Qadar)" },
    { number: 78, english: "Oaths and Vows" },
    { number: 79, english: "Expiation for Unfulfilled Oaths" },
    { number: 80, english: "Laws of Inheritance (Al-Faraa'id)" },
    { number: 81, english: "Limits and Punishments set by Allah (Hudood)" },
    { number: 82, english: "Punishment of Disbelievers at War with Allah and His Apostle" },
    { number: 83, english: "Blood Money (Ad-Diyat)" },
    { number: 84, english: "Dealing with Apostates" },
    { number: 85, english: "Saying Something under Compulsion (Ikraah)" },
    { number: 86, english: "Tricks" },
    { number: 87, english: "Interpretation of Dreams" },
    { number: 88, english: "Afflictions and the End of the World" },
    { number: 89, english: "Judgments (Ahkaam)" },
    { number: 90, english: "Wishes" },
    { number: 91, english: "Accepting Information Given by a Truthful Person" },
    { number: 92, english: "Holding Fast to the Qur'an and Sunnah" },
    { number: 93, english: "Oneness, Uniqueness of Allah (Tawheed)" },
    // Often there are 97 or 99 depending on if some are split.
    // 97 is common in some numberings like Darussalam, 99 in others.
    // We will list up to 97 as per typical JSONs found online to see where the mismatch is.
];

async function verifyBukhari() {
    console.log("🔍 Verifying Sahih al-Bukhari Data Integrity...\n");

    // Hardcoded for reliability in this environment
    const filePath = 'c:/Irfan Basha/Projects/AL-HAQQ/data/Hadith/bukhari.json';

    if (!fs.existsSync(filePath)) {
        console.error(`❌ bukhari.json not found at: ${filePath}`);
        // Try relative just in case
        const altPath = path.resolve('../../../data/Hadith/bukhari.json');
        console.log(`   Trying alternate: ${altPath}`);
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    const books = data.chapters;

    console.log(`📂 Found ${books.length} books in bukhari.json`);
    console.log(`📋 Expected ~97-99 books typically.\n`);

    console.log("Comapring against Standard List (First 50 checks for drift):");

    // Check for drift
    let driftIndex = -1;

    for (let i = 0; i < Math.min(books.length, STANDARD_BUKHARI_BOOKS.length); i++) {
        const jsonBook = books[i];
        const standardBook = STANDARD_BUKHARI_BOOKS[i];

        // Simple similarity check
        const jsonTitle = jsonBook.english.toLowerCase();
        const stdTitle = standardBook.english.toLowerCase();

        // Very basic fuzzy match (contains)
        const isSimilar = jsonTitle.includes(stdTitle.split(' ')[0]) || stdTitle.includes(jsonTitle.split(' ')[0]);

        if (!isSimilar) {
            console.log(`\n⚠️  Possible Mismatch at Book #${i + 1}:`);
            console.log(`   JSON:     "${jsonBook.english}"`);
            console.log(`   Standard: "${standardBook.english}"`);
            if (driftIndex === -1) driftIndex = i;
        }
    }

    if (driftIndex !== -1) {
        console.log(`\n🚨 Drift detected starting around Book #${driftIndex + 1}.`);
        console.log("This suggests a missing book or a merged book earlier in the sequence.");
    } else {
        console.log("\n✅ No major title drift detected in the first scan.");
    }

    // Check last few
    console.log("\nLast 5 Books in JSON:");
    const last5 = books.slice(-5);
    last5.forEach((b: any, i: number) => {
        console.log(`  #${books.length - 5 + i + 1}: ${b.english}`);
    });

}

verifyBukhari().catch(console.error);
