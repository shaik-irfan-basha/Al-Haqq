import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://al-haqq.app';

    // Core routes
    const routes = [
        '',
        '/quran',
        '/hadith',
        '/basira',
        '/resources',
        '/tools',
        '/about',
        '/privacy',
    ].map(route => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Add dyanmic routes handled by server/ISR (simplified for now)

    return routes;
}
