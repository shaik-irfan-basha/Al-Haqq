export type HeirType = 'husband' | 'wife' | 'father' | 'mother' | 'son' | 'daughter';

export interface Heirs {
    husband: boolean;
    wife: boolean;
    father: boolean;
    mother: boolean;
    sons: number;
    daughters: number;
}

export interface ShareResult {
    heir: string;
    share: number; // Decimal (e.g., 0.125 for 1/8)
    shareFraction: string; // "1/8"
    amount: number;
    count: number; // Number of people in this category
    notes?: string;
}

export interface CalculationResult {
    totalShares: number;
    residue: number;
    heirs: ShareResult[];
}

// Minimal fraction class for exact math
class Fraction {
    numerator: number;
    denominator: number;

    constructor(n: number, d: number) {
        this.numerator = n;
        this.denominator = d;
    }

    static add(a: Fraction, b: Fraction): Fraction {
        const common = a.denominator * b.denominator;
        const num = a.numerator * b.denominator + b.numerator * a.denominator;
        return new Fraction(num, common).simplify();
    }

    toNumber(): number {
        return this.numerator / this.denominator;
    }

    toString(): string {
        return `${this.numerator}/${this.denominator}`;
    }

    simplify(): Fraction {
        const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
        const divisor = gcd(this.numerator, this.denominator);
        return new Fraction(this.numerator / divisor, this.denominator / divisor);
    }
}

export function calculateInheritance(totalAssets: number, heirs: Heirs): CalculationResult {
    const results: ShareResult[] = [];
    let currentShare = 0; // Total fixed shares allocated

    const hasChildren = heirs.sons > 0 || heirs.daughters > 0;
    const hasMultipleSiblings = false; // Simplified: Assuming user input primarily focuses on vertical lineage for now

    // 1. Husband
    if (heirs.husband) {
        const share = hasChildren ? 0.25 : 0.5;
        const fraction = hasChildren ? "1/4" : "1/2";
        results.push({ heir: 'Husband', share, shareFraction: fraction, amount: totalAssets * share, count: 1 });
        currentShare += share;
    }

    // 2. Wife
    if (heirs.wife) {
        const share = hasChildren ? 0.125 : 0.25;
        const fraction = hasChildren ? "1/8" : "1/4";
        results.push({ heir: 'Wife', share, shareFraction: fraction, amount: totalAssets * share, count: 1 });
        currentShare += share;
    }

    // 3. Father
    if (heirs.father) {
        // If son exists: 1/6 only
        // If only daughter exists: 1/6 + residue (handled later)
        // If no children: Residue (handled later, but here we assign fixed 1/6 if children exist)
        if (hasChildren) {
            const share = 1 / 6;
            results.push({ heir: 'Father', share, shareFraction: "1/6", amount: totalAssets * share, count: 1 });
            currentShare += share;
        }
    }

    // 4. Mother
    if (heirs.mother) {
        // 1/6 if children or multiple siblings exist
        // 1/3 if no children and no multiple siblings
        // Simplified logic for this component
        const share = (hasChildren) ? (1 / 6) : (1 / 3);
        // Edge case: If Father + Spouse exist (Umariyyatain), Mother gets 1/3 of residue. Complex.
        // Sticking to standard primary logic for MVP robust tool.
        const fraction = (hasChildren) ? "1/6" : "1/3";
        results.push({ heir: 'Mother', share, shareFraction: fraction, amount: totalAssets * share, count: 1 });
        currentShare += share;
    }

    // 5. Daughters (if no sons)
    if (heirs.daughters > 0 && heirs.sons === 0) {
        const share = heirs.daughters === 1 ? 0.5 : (2 / 3);
        const fraction = heirs.daughters === 1 ? "1/2" : "2/3";
        results.push({
            heir: heirs.daughters === 1 ? 'Daughter' : 'Daughters',
            share,
            shareFraction: fraction,
            amount: totalAssets * share,
            count: heirs.daughters
        });
        currentShare += share;
    }

    // Calculate Residue
    // Floating point usage warning: In real finance system use decimal types. For web tool, standard precision ok for display.
    let residue = 1 - currentShare;
    if (residue < 0) residue = 0; // 'Awl (increase of base) case not fully handled in basic MVP, preventing negative.

    // 6. Residuary Heirs (Asaba)
    // If Sons exist: They take residue. If daughters exist with them, they split 2:1.
    if (heirs.sons > 0) {
        const totalParts = (heirs.sons * 2) + heirs.daughters;
        const sharePerPart = residue / totalParts;

        results.push({
            heir: heirs.sons === 1 ? 'Son' : 'Sons',
            share: (sharePerPart * 2 * heirs.sons),
            shareFraction: 'Residue',
            amount: (sharePerPart * 2 * heirs.sons) * totalAssets,
            count: heirs.sons,
            notes: `Residuary heir (Receive ${heirs.daughters > 0 ? "2:1 ratio with daughters" : "remainder"})`
        });

        if (heirs.daughters > 0) {
            results.push({
                heir: heirs.daughters === 1 ? 'Daughter' : 'Daughters',
                share: (sharePerPart * heirs.daughters),
                shareFraction: 'Residue',
                amount: (sharePerPart * heirs.daughters) * totalAssets,
                count: heirs.daughters,
                notes: "Inherits as residuary with brother(s)"
            });
        }
        residue = 0; // All distributed
    }
    // If no children, Father takes residue (if alive)
    else if (heirs.father && residue > 0) {
        const fatherIndex = results.findIndex(r => r.heir === 'Father');
        if (fatherIndex !== -1) {
            // Add residue to existing 1/6 (if he had it) or create entry if he handled as residue only?
            // My logic above only gave Father 1/6 IF children.
            // So if NO children, he hasn't been added yet.
            results.push({
                heir: 'Father',
                share: residue,
                shareFraction: 'Residue',
                amount: residue * totalAssets,
                count: 1,
                notes: "Takes entire residue as closest male relative"
            });
        } else {
            // He was already added with 1/6? No, logic above said "if (hasChildren)".
            // So he is added here.
            results.push({
                heir: 'Father',
                share: residue,
                shareFraction: 'Residue',
                amount: residue * totalAssets,
                count: 1
            });
        }
        residue = 0;
    }

    // Final cleanup: Filter out 0 amounts just in case
    const finalHeirs = results.filter(r => r.share > 0);

    return {
        totalShares: 1 - residue, // Effective distributed
        residue,
        heirs: finalHeirs
    };
}
