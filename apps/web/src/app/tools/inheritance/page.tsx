'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, Users, RefreshCw } from 'lucide-react';
import { calculateInheritance, Heirs, CalculationResult } from '@/lib/inheritance';

export default function InheritancePage() {
    const [assets, setAssets] = useState<number>(100000);
    const [heirs, setHeirs] = useState<Heirs>({
        husband: false,
        wife: false,
        father: false,
        mother: false,
        sons: 0,
        daughters: 0
    });
    const [result, setResult] = useState<CalculationResult | null>(null);

    const handleCalculate = () => {
        const res = calculateInheritance(assets, heirs);
        setResult(res);
    };

    return (
        <div className="min-h-screen pt-28 pb-20 px-6 bg-[var(--color-bg)]">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium mb-4">
                        Islamic Fara&apos;id
                    </span>
                    <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] mb-6">Inheritance Calculator</h1>
                    <br />
                    <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
                        Calculate the distribution of an estate according to Islamic Inheritance Law.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="card-premium p-8"
                    >
                        <h2 className="font-serif text-2xl mb-6 flex items-center gap-3">
                            <DollarSign className="w-6 h-6 text-[var(--color-primary)]" />
                            Estate Details
                        </h2>

                        <div className="mb-8">
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Total Net Assets Value</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">$</span>
                                <input
                                    type="number"
                                    value={assets}
                                    onChange={(e) => setAssets(Number(e.target.value))}
                                    className="input-premium pl-10"
                                />
                            </div>
                            <p className="text-xs text-[var(--color-text-muted)] mt-2">After funeral expenses and debts.</p>
                        </div>

                        <h2 className="font-serif text-2xl mb-6 flex items-center gap-3">
                            <Users className="w-6 h-6 text-[var(--color-primary)]" />
                            Select Heirs
                        </h2>

                        <div className="space-y-4">
                            {/* Spouses */}
                            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-bg-warm)]">
                                <span>Husband</span>
                                <input
                                    type="checkbox"
                                    checked={heirs.husband}
                                    disabled={heirs.wife}
                                    onChange={(e) => setHeirs({ ...heirs, husband: e.target.checked })}
                                    className="w-5 h-5 accent-[var(--color-primary)]"
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-bg-warm)]">
                                <span>Wife</span>
                                <input
                                    type="checkbox"
                                    checked={heirs.wife}
                                    disabled={heirs.husband}
                                    onChange={(e) => setHeirs({ ...heirs, wife: e.target.checked })}
                                    className="w-5 h-5 accent-[var(--color-primary)]"
                                />
                            </div>

                            {/* Parents */}
                            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-bg-warm)]">
                                <span>Father</span>
                                <input
                                    type="checkbox"
                                    checked={heirs.father}
                                    onChange={(e) => setHeirs({ ...heirs, father: e.target.checked })}
                                    className="w-5 h-5 accent-[var(--color-primary)]"
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-bg-warm)]">
                                <span>Mother</span>
                                <input
                                    type="checkbox"
                                    checked={heirs.mother}
                                    onChange={(e) => setHeirs({ ...heirs, mother: e.target.checked })}
                                    className="w-5 h-5 accent-[var(--color-primary)]"
                                />
                            </div>

                            {/* Children */}
                            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-bg-warm)]">
                                <span>Sons</span>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setHeirs({ ...heirs, sons: Math.max(0, heirs.sons - 1) })}
                                        className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                                    >-</button>
                                    <span className="w-8 text-center font-medium">{heirs.sons}</span>
                                    <button
                                        onClick={() => setHeirs({ ...heirs, sons: heirs.sons + 1 })}
                                        className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                                    >+</button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-bg-warm)]">
                                <span>Daughters</span>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setHeirs({ ...heirs, daughters: Math.max(0, heirs.daughters - 1) })}
                                        className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                                    >-</button>
                                    <span className="w-8 text-center font-medium">{heirs.daughters}</span>
                                    <button
                                        onClick={() => setHeirs({ ...heirs, daughters: heirs.daughters + 1 })}
                                        className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                                    >+</button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleCalculate}
                            className="btn-primary w-full mt-8 flex items-center justify-center gap-2"
                        >
                            <Calculator className="w-5 h-5" />
                            Calculate Distribution
                        </button>
                    </motion.div>

                    {/* Results Section */}
                    <div className="space-y-6">
                        {result ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="card-premium p-8 h-full bg-[var(--color-primary)] text-white"
                            >
                                <h2 className="font-serif text-3xl mb-8 border-b border-white/20 pb-4">Distribution Result</h2>

                                <div className="space-y-6">
                                    {result.heirs.map((heir, idx) => (
                                        <div key={idx} className="bg-white/10 rounded-xl p-5 backdrop-blur-sm">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-medium text-lg">{heir.heir} {heir.count > 1 ? `(${heir.count})` : ''}</h3>
                                                    <span className="text-sm text-white/70">{heir.shareFraction} Share</span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold">${heir.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                                                    {heir.count > 1 && (
                                                        <div className="text-xs text-white/60">
                                                            ${(heir.amount / heir.count).toLocaleString(undefined, { maximumFractionDigits: 2 })} each
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {heir.notes && (
                                                <p className="text-xs text-white/50 bg-black/20 p-2 rounded mt-2">
                                                    Note: {heir.notes}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {result.residue > 0 && Math.abs(result.residue - 1) > 0.01 && (
                                    <div className="mt-8 p-4 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
                                        <h4 className="font-medium text-yellow-200 mb-1">Undistributed Residue</h4>
                                        <p className="text-sm text-yellow-100/80">
                                            There is a remainder of {result.residue.toFixed(4)} ({(result.residue * 100).toFixed(1)}%) that goes to distant agnatic relatives (Bayt al-Mal if none).
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center card-premium bg-[var(--color-bg-warm)] p-12 text-center text-[var(--color-text-muted)] border-dashed">
                                <Calculator className="w-16 h-16 mb-4 opacity-20" />
                                <p className="text-lg">Enter estate details and select heirs to view the distribution.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-12 p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-sm text-blue-800 dark:text-blue-200">
                    <strong>Disclaimer:</strong> This calculator provides estimations based on Standard Islamic Principles for primary heirs.
                    Complex cases involve detailed rules for grandparents, grandchildren, and distant relatives.
                    Always consult a qualified scholar or Islamic estate planner for official settlements.
                </div>
            </div>
        </div>
    );
}
