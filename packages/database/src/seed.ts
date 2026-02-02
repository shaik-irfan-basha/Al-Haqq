/**
 * Database Seeder Entry Point
 * Runs all seed scripts in order
 */

import { seedQuran } from './seeds/quran';
import { seedHadith } from './seeds/hadith';

async function seed() {
    console.log('🌱 Al-Haqq Database Seeder');
    console.log('==========================\n');

    try {
        // First, ensure the schema is applied
        console.log('📝 Note: Make sure you have run schema.sql in Supabase SQL Editor first!\n');

        // Seed Quran data
        console.log('Step 1/2: Seeding Quran...');
        await seedQuran();

        // Seed Hadith data
        console.log('\nStep 2/2: Seeding Hadith...');
        await seedHadith();

        console.log('\n🎉 All seeding complete!');

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seed();
