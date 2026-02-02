'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Droplets, Box, Users, Shovel, Info } from 'lucide-react';

const steps = [
    {
        id: 'moments-after',
        title: 'Upon Death',
        icon: Activity,
        content: [
            'Close the eyes of the deceased.',
            'Bind the lower jaw to the head so the mouth does not fall open.',
            'Cover the body with a clean sheet.',
            'Hasten the preparation for burial.',
            'Make Dua for forgiveness and mercy.'
        ]
    },
    {
        id: 'ghusl',
        title: 'Ghusl (Washing)',
        icon: Droplets,
        content: [
            'Performed by same-gender close relatives or trustworthy persons.',
            'Ensure privacy and dignity.',
            'Wash the body an odd number of times (3, 5, or 7).',
            'Start with Wudu (ablution).',
            'Wash with water and sidr (lote tree leaves) or soap.',
            'The final wash should contain camphor or perfume.'
        ]
    },
    {
        id: 'kafan',
        title: 'Kafan (Shrouding)',
        icon: Box,
        content: [
            'Use clean, white cloth (preferred).',
            'For Men: 3 sheets.',
            'For Women: 5 pieces (lower garment, head cover, shirt, and two wrapping sheets).',
            'Parfume the shroud with incense.',
            'Wrap the body modestly and securely.'
        ]
    },
    {
        id: 'janazah-salah',
        title: 'Janazah Prayer',
        icon: Users,
        content: [
            'Communal obligation (Fard Kifayah).',
            'No Ruku or Sujood.',
            'Format:',
            '1. 1st Takbir: Read Surah Al-Fatihah.',
            '2. 2nd Takbir: Send Salawat (Durood-e-Ibrahim) upon the Prophet ﷺ.',
            '3. 3rd Takbir: Make sincere Dua for the deceased.',
            '4. 4th Takbir: Make Dua for the Ummah, then Tasleem.'
        ]
    },
    {
        id: 'burial',
        title: 'The Burial',
        icon: Shovel,
        content: [
            'Carry the body to the grave with respect.',
            'Place the body in the grave on the right side, facing the Qibla.',
            'Untie the knots of the shroud.',
            'Recite "Bismillahi wa ala millati rasulillah" when placing body.',
            'Fill the grave with soil. It is recommended to throw three handfuls of soil.',
            'Stay after burial to make Dua for firmness and forgiveness.'
        ]
    }
];

export default function JanazahPage() {
    return (
        <div className="min-h-screen pt-28 pb-20 px-6 bg-[var(--color-bg)]">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium mb-4">
                        Essential Guide
                    </span>
                    <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] mb-6">Janazah Guide</h1>
                    <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
                        A step-by-step guide to the funeral rites in Islam, respecting the dignity of the deceased and the rights of the living.
                    </p>
                </div>

                <div className="space-y-12">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="card-premium p-8 md:p-10 relative overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg-warm)] flex items-center justify-center flex-shrink-0 border border-[var(--color-border)]">
                                    <step.icon className="w-8 h-8 text-[var(--color-primary)]" />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-bold">
                                            {index + 1}
                                        </span>
                                        <h2 className="font-serif text-2xl text-[var(--color-text)]">{step.title}</h2>
                                    </div>

                                    <ul className="space-y-3">
                                        {step.content.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-[var(--color-text-secondary)] leading-relaxed">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-border)] mt-2.5 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 p-8 rounded-3xl bg-[var(--color-primary)] text-white text-center">
                    <Heart className="w-12 h-12 mx-auto mb-6 text-[var(--color-accent)]" />
                    <h3 className="font-serif text-2xl mb-4">Condolence Etiquette</h3>
                    <p className="text-white/80 max-w-2xl mx-auto leading-relaxed mb-6">
                        &quot;Inna lillahi wa inna ilayhi raji&apos;un&quot; <br />
                        (Indeed we belong to Allah, and indeed to Him we will return).
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                            <h4 className="font-bold mb-2">Be Gentle</h4>
                            <p className="text-sm text-white/70">Offer support without overwhelming the family. Short visits are often better.</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                            <h4 className="font-bold mb-2">Offer Food</h4>
                            <p className="text-sm text-white/70">Preparing food for the grieving family is a Sunnah.</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                            <h4 className="font-bold mb-2">Make Dua</h4>
                            <p className="text-sm text-white/70">Pray for the deceased and patience for the family.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
