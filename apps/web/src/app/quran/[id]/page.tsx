import { surahs as localSurahs } from '@/data/surahs';
import SurahPageClient from './SurahPageClient';

export async function generateStaticParams() {
    return localSurahs.map((surah) => ({
        id: surah.number.toString(),
    }));
}

export default function SurahPage({ params }: { params: { id: string } }) {
    return <SurahPageClient params={params} />;
}
