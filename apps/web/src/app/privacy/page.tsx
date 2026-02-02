'use client';

import React from 'react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen pt-28 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <header className="mb-12">
                    <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-[var(--color-text-muted)]">
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </header>

                <div className="card-premium p-8 md:p-12 space-y-8 text-[var(--color-text-secondary)] leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-medium text-[var(--color-text)] mb-4">1. Introduction</h2>
                        <p>
                            At Al-Haqq, we respect your privacy and are committed to protecting it through our compliance with this policy. This policy describes the types of information we may collect from you or that you may provide when you visit the website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-medium text-[var(--color-text)] mb-4">2. Data Collection</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>
                                <strong>Personal Information:</strong> We do not collect personal information (like names or emails) unless you explicitly provide it (e.g., when signing up for an account, which is optional).
                            </li>
                            <li>
                                <strong>Usage Data:</strong> We may collect non-identifiable usage statistics to improve the platform.
                            </li>
                            <li>
                                <strong>Location Data:</strong> For Prayer Times and Qibla features, we use your device&apos;s location. This happens entirely client-side or via a temporary request. We do not store your location history.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-medium text-[var(--color-text)] mb-4">3. Basira AI</h2>
                        <p>
                            When using Basira AI, your queries are processed to provide relevant Islamic answers. We do not use your conversations for advertising purposes. Conversations are stored locally or associated with your account for your history only.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-medium text-[var(--color-text)] mb-4">4. Cookies</h2>
                        <p>
                            We use local storage and essential cookies to remember your preferences (e.g., dark mode, preferred translation language, saved bookmarks). You can clear these at any time via your browser settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-medium text-[var(--color-text)] mb-4">5. Contact</h2>
                        <p>
                            For privacy concerns, please contact us at: <a href="mailto:muhammadirfanbasha@gmail.com" className="text-[var(--color-primary)] hover:underline">muhammadirfanbasha@gmail.com</a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
