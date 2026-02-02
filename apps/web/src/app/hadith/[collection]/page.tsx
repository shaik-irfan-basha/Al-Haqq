import { hadithCollections as localCollections } from '@/data/hadith-collections';
import HadithBookPageClient from './HadithBookPageClient';

export async function generateStaticParams() {
    return localCollections.map((collection) => ({
        collection: collection.id,
    }));
}

export default function HadithBookPage({ params }: { params: { collection: string } }) {
    return <HadithBookPageClient params={params} />;
}
