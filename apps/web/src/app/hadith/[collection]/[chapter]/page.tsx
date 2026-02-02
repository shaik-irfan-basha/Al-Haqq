import { hadithCollections as localCollections } from '@/data/hadith-collections';
import ChapterPageClient from './ChapterPageClient';

// Generate static params for all chapters - we'll generate first 100 chapters for each book
// This is a safe approximation for static export
export async function generateStaticParams() {
    const params: { collection: string; chapter: string }[] = [];

    // For each collection, generate params for chapters 1-100
    // This covers most hadith books adequately for static generation
    for (const collection of localCollections) {
        for (let i = 1; i <= 100; i++) {
            params.push({
                collection: collection.id,
                chapter: i.toString()
            });
        }
    }

    return params;
}

export default function ChapterPage({ params }: { params: { collection: string; chapter: string } }) {
    return <ChapterPageClient params={params} />;
}
