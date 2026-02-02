
'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, Info, ShieldCheck, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

// Pricing Constants (Fallback if API fails - could be updated dynamically in future)
const GOLD_PRICE_PER_GRAM = 65.0; // USD approx
const SILVER_PRICE_PER_GRAM = 0.80; // USD approx

type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'PKR';

export default function ZakatCalculator() {
    const [currency, setCurrency] = useState<Currency>('USD');
    const [nisabStandard, setNisabStandard] = useState<'gold' | 'silver'>('silver');

    // Assets
    const [cash, setCash] = useState<string>('');
    const [goldWeight, setGoldWeight] = useState<string>('');
    const [silverWeight, setSilverWeight] = useState<string>('');
    const [investments, setInvestments] = useState<string>('');
    const [businessAssets, setBusinessAssets] = useState<string>('');
    const [debts, setDebts] = useState<string>('');

    // Calculations
    const totalAssets = useMemo(() => {
        const c = parseFloat(cash) || 0;
        const g = (parseFloat(goldWeight) || 0) * GOLD_PRICE_PER_GRAM;
        const s = (parseFloat(silverWeight) || 0) * SILVER_PRICE_PER_GRAM;
        const i = parseFloat(investments) || 0;
        const b = parseFloat(businessAssets) || 0;
        return c + g + s + i + b;
    }, [cash, goldWeight, silverWeight, investments, businessAssets]);

    const totalLiabilities = parseFloat(debts) || 0;
    const netAssets = totalAssets - totalLiabilities;

    const nisabThreshold = nisabStandard === 'gold'
        ? 87.48 * GOLD_PRICE_PER_GRAM
        : 612.36 * SILVER_PRICE_PER_GRAM;

    const zakatDue = netAssets >= nisabThreshold ? netAssets * 0.025 : 0;
    const isEligible = netAssets >= nisabThreshold;

    return (
        <div className="w-full max-w-4xl mx-auto p-4 space-y-8">

            {/* Header */}
            <div className="text-center space-y-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-full mb-4"
                >
                    <Calculator className="w-8 h-8 text-emerald-500" />
                </motion.div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                    Zakat Calculator
                </h1>
                <p className="text-gray-400 max-w-xl mx-auto">
                    Calculate your annual Zakat with precision and privacy. All calculations are performed efficiently on your device and are never stored.
                </p>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Privacy Guaranteed - Client-side Only</span>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl space-y-8"
                    >

                        {/* Cash & Liquid */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
                                <DollarSign className="w-5 h-5" /> Cash & Liquid Assets
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Cash on Hand / Bank</label>
                                    <input
                                        type="number"
                                        value={cash}
                                        onChange={(e) => setCash(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500/50 outline-none transition text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Investments / Stocks</label>
                                    <input
                                        type="number"
                                        value={investments}
                                        onChange={(e) => setInvestments(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500/50 outline-none transition text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-white/5 w-full" />

                        {/* Gold & Silver */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center text-[10px] font-bold">Au</div>
                                Gold & Silver
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Gold Weight (grams)</label>
                                    <input
                                        type="number"
                                        value={goldWeight}
                                        onChange={(e) => setGoldWeight(e.target.value)}
                                        placeholder="0g"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-yellow-500/50 outline-none transition text-white"
                                    />
                                    <p className="text-[10px] text-gray-500 text-right">~${GOLD_PRICE_PER_GRAM}/g</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Silver Weight (grams)</label>
                                    <input
                                        type="number"
                                        value={silverWeight}
                                        onChange={(e) => setSilverWeight(e.target.value)}
                                        placeholder="0g"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-gray-400/50 outline-none transition text-white"
                                    />
                                    <p className="text-[10px] text-gray-500 text-right">~${SILVER_PRICE_PER_GRAM}/g</p>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-white/5 w-full" />

                        {/* Business & Liabilities */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
                                <RefreshCw className="w-5 h-5" /> Business & Liabilities
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Business Inventory Value</label>
                                    <input
                                        type="number"
                                        value={businessAssets}
                                        onChange={(e) => setBusinessAssets(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-red-300">Debts & Liabilities (Deductible)</label>
                                    <input
                                        type="number"
                                        value={debts}
                                        onChange={(e) => setDebts(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-black/40 border border-red-500/20 rounded-xl p-3 focus:ring-2 focus:ring-red-500/50 outline-none transition text-white"
                                    />
                                </div>
                            </div>
                        </div>

                    </motion.div>
                </div>

                {/* Results Sidebar */}
                <div className="lg:col-span-1">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="sticky top-24 bg-gradient-to-br from-emerald-900/40 to-black backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-6 shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Summary</h2>
                            <div className="text-emerald-500">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Total Assets</span>
                                <span className="text-white font-medium">${totalAssets.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Liabilities</span>
                                <span className="text-red-400 font-medium">-${totalLiabilities.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="h-px bg-white/10 w-full my-2" />
                            <div className="flex justify-between text-base">
                                <span className="text-gray-300">Net Zakatable</span>
                                <span className="text-white font-bold">${netAssets.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        <div className={`p-4 rounded-xl border-dashed border-2 mb-6 text-center transition-colors ${isEligible ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-gray-700 bg-gray-800/20'
                            }`}>
                            <p className="text-sm text-gray-400 mb-1">Total Zakat Due (2.5%)</p>
                            <p className={`text-3xl font-bold ${isEligible ? 'text-emerald-400' : 'text-gray-500'}`}>
                                ${zakatDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                            {!isEligible && (
                                <p className="text-xs text-yellow-500 mt-2">
                                    Below Nisab Threshold (${nisabThreshold.toFixed(0)}) based on {nisabStandard}.
                                </p>
                            )}
                        </div>

                        {/* Settings Toggle */}
                        <div className="space-y-3">
                            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Nisab Standard</p>
                            <div className="flex bg-black/40 rounded-lg p-1">
                                <button
                                    onClick={() => setNisabStandard('silver')}
                                    className={`flex-1 py-2 text-xs rounded-md font-medium transition-all ${nisabStandard === 'silver' ? 'bg-gray-700 text-white shadow' : 'text-gray-500 hover:text-gray-400'
                                        }`}
                                >
                                    Silver (Recommended)
                                </button>
                                <button
                                    onClick={() => setNisabStandard('gold')}
                                    className={`flex-1 py-2 text-xs rounded-md font-medium transition-all ${nisabStandard === 'gold' ? 'bg-yellow-600/20 text-yellow-500 shadow' : 'text-gray-500 hover:text-gray-400'
                                        }`}
                                >
                                    Gold
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-500 leading-relaxed">
                                The Silver standard (612.36g) is safer for caution, making more people eligible to pay. Gold (87.48g) has a higher threshold.
                            </p>
                        </div>

                    </motion.div>
                </div>

            </div>
        </div>
    );
}
