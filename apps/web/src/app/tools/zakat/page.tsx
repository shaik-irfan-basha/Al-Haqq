'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, AlertCircle, RefreshCw, ChevronDown, Check } from 'lucide-react';
import Link from 'next/link';

// Nisab defaults (approx)
const DEFAULT_GOLD_PRICE = 80.50; // per gram
const DEFAULT_SILVER_PRICE = 0.95; // per gram
const GOLD_NISAB_GRAMS = 85;
const SILVER_NISAB_GRAMS = 595;

interface Asset {
    id: string;
    label: string;
    value: number;
    description: string;
}

export default function ZakatPage() {
    const [goldPrice, setGoldPrice] = useState(DEFAULT_GOLD_PRICE);
    const [silverPrice, setSilverPrice] = useState(DEFAULT_SILVER_PRICE);

    // Assets state
    const [assets, setAssets] = useState({
        gold_grams: 0,
        silver_grams: 0,
        cash_hand: 0,
        cash_bank: 0,
        stocks: 0,
        business_goods: 0,
        lent_loans: 0, // Money you lent to others expected to be returned
        other_savings: 0,
    });

    // Liabilities
    const [liabilities, setLiabilities] = useState({
        debts_due: 0, // Debts due immediately
        expenses_due: 0, // Immediate bills/expenses
    });

    const handleAssetChange = (key: keyof typeof assets, val: string) => {
        setAssets(prev => ({ ...prev, [key]: parseFloat(val) || 0 }));
    };

    const handleLiabilityChange = (key: keyof typeof liabilities, val: string) => {
        setLiabilities(prev => ({ ...prev, [key]: parseFloat(val) || 0 }));
    };

    // Calculations
    const goldValue = assets.gold_grams * goldPrice;
    const silverValue = assets.silver_grams * silverPrice;

    const totalAssets = goldValue + silverValue + assets.cash_hand + assets.cash_bank +
        assets.stocks + assets.business_goods + assets.lent_loans + assets.other_savings;

    const totalLiabilities = liabilities.debts_due + liabilities.expenses_due;
    const netWealth = totalAssets - totalLiabilities;

    const goldNisabValue = GOLD_NISAB_GRAMS * goldPrice;
    const silverNisabValue = SILVER_NISAB_GRAMS * silverPrice;

    // Using Silver Nisab is safer for cautious payers, but Gold is standard for gold-only owners.
    // We'll show both, but typically if netWealth > Silver Nisab, Zakat is due.
    const isEligible = netWealth >= silverNisabValue;
    const zakatPayable = isEligible ? netWealth * 0.025 : 0;

    return (
        <div className="min-h-screen pt-28 pb-20 bg-[var(--color-bg)]">
            <div className="max-w-4xl mx-auto px-6">

                {/* Header */}
                <div className="mb-12">
                    <Link href="/tools" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-4 inline-block">
                        ← Back to Tools
                    </Link>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                            <Coins className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="font-serif text-3xl md:text-4xl text-[var(--color-text)]">Zakat Calculator</h1>
                            <p className="text-[var(--color-text-muted)]">Calculate 2.5% of your eligible wealth</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Input Section */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* 1. Precious Metals */}
                        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6">
                            <h3 className="font-serif text-xl mb-4 border-b border-[var(--color-border)] pb-2">1. Precious Metals</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Gold (grams)</label>
                                    <input
                                        type="number"
                                        value={assets.gold_grams || ''}
                                        onChange={e => handleAssetChange('gold_grams', e.target.value)}
                                        className="w-full p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                                        placeholder="0"
                                    />
                                    <p className="text-xs text-[var(--color-text-muted)] mt-1">Current Value: ${goldValue.toFixed(2)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Silver (grams)</label>
                                    <input
                                        type="number"
                                        value={assets.silver_grams || ''}
                                        onChange={e => handleAssetChange('silver_grams', e.target.value)}
                                        className="w-full p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                                        placeholder="0"
                                    />
                                    <p className="text-xs text-[var(--color-text-muted)] mt-1">Current Value: ${silverValue.toFixed(2)}</p>
                                </div>
                            </div>

                            {/* Price Settings Toggle could go here */}
                            <div className="mt-4 p-4 bg-[var(--color-bg)] rounded-xl text-sm text-[var(--color-text-muted)] flex flex-wrap gap-4">
                                <span className="flex items-center gap-1">Price/g Gold: <strong>${goldPrice}</strong></span>
                                <span className="flex items-center gap-1">Price/g Silver: <strong>${silverPrice}</strong></span>
                            </div>
                        </div>

                        {/* 2. Cash & Savings */}
                        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6">
                            <h3 className="font-serif text-xl mb-4 border-b border-[var(--color-border)] pb-2">2. Cash & Savings</h3>
                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Cash on Hand</label>
                                        <input
                                            type="number"
                                            value={assets.cash_hand || ''}
                                            onChange={e => handleAssetChange('cash_hand', e.target.value)}
                                            className="w-full p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Bank Accounts</label>
                                        <input
                                            type="number"
                                            value={assets.cash_bank || ''}
                                            onChange={e => handleAssetChange('cash_bank', e.target.value)}
                                            className="w-full p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Other Savings / Mobile Wallets</label>
                                    <input
                                        type="number"
                                        value={assets.other_savings || ''}
                                        onChange={e => handleAssetChange('other_savings', e.target.value)}
                                        className="w-full p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 3. Investments & Business */}
                        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6">
                            <h3 className="font-serif text-xl mb-4 border-b border-[var(--color-border)] pb-2">3. Investments & Business</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Stocks & Shares (Market Value)</label>
                                    <input
                                        type="number"
                                        value={assets.stocks || ''}
                                        onChange={e => handleAssetChange('stocks', e.target.value)}
                                        className="w-full p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Business Goods (Inventory)</label>
                                    <input
                                        type="number"
                                        value={assets.business_goods || ''}
                                        onChange={e => handleAssetChange('business_goods', e.target.value)}
                                        className="w-full p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                                    />
                                    <p className="text-xs text-[var(--color-text-muted)] mt-1">Current market value of goods for sale</p>
                                </div>
                            </div>
                        </div>

                        {/* 4. Liabilities */}
                        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6">
                            <h3 className="font-serif text-xl mb-4 border-b border-[var(--color-border)] pb-2 text-red-500">4. Liabilities (Deductible)</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Debts Due Immediately</label>
                                    <input
                                        type="number"
                                        value={liabilities.debts_due || ''}
                                        onChange={e => handleLiabilityChange('debts_due', e.target.value)}
                                        className="w-full p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Immediate Expenses</label>
                                    <input
                                        type="number"
                                        value={liabilities.expenses_due || ''}
                                        onChange={e => handleLiabilityChange('expenses_due', e.target.value)}
                                        className="w-full p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 space-y-6">

                            {/* Result Card */}
                            <div className="bg-gradient-to-br from-amber-500 to-yellow-600 rounded-3xl p-8 text-white shadow-xl shadow-amber-500/20">
                                <h3 className="text-lg font-medium opacity-90 mb-2">Total Zakat Payable</h3>
                                <div className="text-4xl font-bold font-serif mb-6">
                                    ${zakatPayable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>

                                <div className="space-y-3 text-sm opacity-90 pb-6 border-b border-white/20 mb-6">
                                    <div className="flex justify-between">
                                        <span>Total Assets</span>
                                        <span className="font-medium">${totalAssets.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total Liabilities</span>
                                        <span className="font-medium">-${totalLiabilities.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between font-bold pt-2 border-t border-white/10">
                                        <span>Net Wealth</span>
                                        <span>${netWealth.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className={`flex items-start gap-2 text-sm p-3 rounded-xl ${isEligible ? 'bg-white/20' : 'bg-red-500/20'}`}>
                                    {isEligible ? (
                                        <>
                                            <Check className="w-5 h-5 flex-shrink-0" />
                                            <p>You are equal to or above the Nisab threshold (${silverNisabValue.toLocaleString()}). Zakat is due.</p>
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                            <p>Your net wealth is below the Nisab threshold (${silverNisabValue.toLocaleString()}). No Zakat is due.</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Nisab Info */}
                            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6">
                                <h4 className="font-serif text-lg mb-4">Current Nisab Thresholds</h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Silver (Preferred)</p>
                                        <p className="text-xl font-medium">${silverNisabValue.toLocaleString()}</p>
                                        <p className="text-xs text-[var(--color-text-muted)]">{SILVER_NISAB_GRAMS}g × ${silverPrice}/g</p>
                                    </div>
                                    <div className="pt-4 border-t border-[var(--color-border)]">
                                        <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Gold</p>
                                        <p className="text-xl font-medium">${goldNisabValue.toLocaleString()}</p>
                                        <p className="text-xs text-[var(--color-text-muted)]">{GOLD_NISAB_GRAMS}g × ${goldPrice}/g</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
