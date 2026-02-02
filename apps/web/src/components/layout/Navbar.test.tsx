import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from './Navbar';
import { AudioProvider } from '@/context/AudioContext';

// Mock dependencies
vi.mock('next/navigation', () => ({
    usePathname: () => '/',
    useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/features/prayer-times/hooks/usePrayerCountdown', () => ({
    usePrayerCountdown: () => ({
        timeLeft: '02:30:00',
        nextPrayerName: 'Asr',
        progress: 45,
    }),
}));

const renderNavbar = () => {
    return render(
        <AudioProvider>
            <Navbar />
        </AudioProvider>
    );
};

describe('Navbar Component', () => {
    it('renders logo and brand name', () => {
        renderNavbar();
        expect(screen.getByText('Al-Haqq')).toBeDefined();
    });

    it('renders navigation links', () => {
        renderNavbar();
        expect(screen.getByText('Quran')).toBeDefined();
        expect(screen.getByText('Hadith')).toBeDefined();
        expect(screen.getByText('Basira')).toBeDefined();
    });

    it('opens search modal on click', () => {
        renderNavbar();
        const searchButton = screen.getAllByRole('button')[0]; // Adjust selector as needed
        fireEvent.click(searchButton);
        // Add assertion for modal open if applicable, or check for inputs
    });
});
