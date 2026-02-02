/**
 * Ayah Display Component
 */

import styles from './AyahDisplay.module.css';

interface AyahDisplayProps {
    number: number;
    arabicText: string;
    translation: string;
    reference?: string;
    showNumber?: boolean;
}

export function AyahDisplay({
    number,
    arabicText,
    translation,
    reference,
    showNumber = true,
}: AyahDisplayProps) {
    return (
        <div className={styles.ayah}>
            <div className={styles.header}>
                {showNumber && <span className={styles.number}>{number}</span>}
                {reference && <span className={styles.reference}>{reference}</span>}
            </div>

            <p className={styles.arabic} dir="rtl" lang="ar">
                {arabicText}
            </p>

            <p className={styles.translation}>
                {translation}
            </p>
        </div>
    );
}
