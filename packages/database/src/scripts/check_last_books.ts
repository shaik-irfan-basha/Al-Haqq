
import fs from 'fs';
import path from 'path';

const DATA_DIR = 'c:/Irfan Basha/Projects/AL-HAQQ/data/Hadith';

function checkCollection(filename: string, name: string) {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
        console.log(`❌ ${name} not found.`);
        return;
    }

    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const books = data.chapters;
        const last = books[books.length - 1];
        console.log(`\n${name}: ${books.length} Books`);
        console.log(`Last: [${books.length}] ${last.english}`);
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
}

checkCollection('bukhari.json', 'Sahih Bukhari');
checkCollection('muslim.json', 'Sahih Muslim');
