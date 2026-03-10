// ============================================================
// GHG Shield — Emission Calculations
// ============================================================
import { SCOPE1_FACTORS, EGRID_FACTORS, FUEL_TYPE_MAP } from './constants';
import type { CalculationResult } from '@/types';

/**
 * Calculate Scope 1 emissions (direct)
 * Uses EPA 40 CFR 98 Tables C-1 and C-2
 */
export function calculateScope1(fuelType: string, activityData: number): CalculationResult {
    const key = FUEL_TYPE_MAP[fuelType] || fuelType;
    const factor = SCOPE1_FACTORS[key];

    if (!factor) {
        throw new Error(`Unknown fuel type: ${fuelType}. Available: ${Object.keys(FUEL_TYPE_MAP).join(', ')}`);
    }

    const kgCO2e = activityData * factor.factor;
    const tCO2e = kgCO2e / 1000;

    return {
        kgCO2e,
        tCO2e,
        emissionFactor: factor.factor,
        efSource: factor.source,
        efUnit: factor.unit,
        calculationMethod: 'EPA 40 CFR 98 Equation C-1',
        factorYear: 2024,
        factorVersion: 'EPA GHG Emission Factors Hub v1.0',
        calculatedAt: new Date().toISOString(),
    };
}

/**
 * Calculate Scope 2 emissions (indirect — purchased electricity)
 * Uses eGRID 2024 location-based emission factors
 */
export function calculateScope2(kWh: number, egridSubregion: string): CalculationResult {
    const factor = EGRID_FACTORS[egridSubregion];

    if (factor === undefined) {
        throw new Error(`Unknown eGRID subregion: ${egridSubregion}. Available: ${Object.keys(EGRID_FACTORS).join(', ')}`);
    }

    const tCO2e = kWh * factor;
    const kgCO2e = tCO2e * 1000;

    return {
        kgCO2e,
        tCO2e,
        emissionFactor: factor,
        efSource: `eGRID 2024 ${egridSubregion}`,
        efUnit: 'tCO2e/kWh',
        calculationMethod: 'EPA eGRID Location-Based',
        factorYear: 2024,
        factorVersion: 'eGRID2022 Data File',
        calculatedAt: new Date().toISOString(),
    };
}

/**
 * Auto-calculate emissions based on scope and fuel type
 */
export function calculateEmissions(
    scope: string,
    fuelType: string,
    activityData: number,
    egridSubregion?: string
): CalculationResult {
    if (scope === '1') {
        return calculateScope1(fuelType, activityData);
    }

    if (scope === '2') {
        if (!egridSubregion) {
            throw new Error('eGRID subregion required for Scope 2 calculation');
        }
        return calculateScope2(activityData, egridSubregion);
    }

    // Scope 3 — custom factor needed; placeholder
    return {
        kgCO2e: 0,
        tCO2e: 0,
        emissionFactor: 0,
        efSource: 'Custom',
        efUnit: 'custom',
        calculationMethod: 'Spend-based proxy method',
        factorYear: new Date().getFullYear(),
        factorVersion: 'Custom Upload',
        calculatedAt: new Date().toISOString(),
    };
}

/**
 * Sum up emissions by scope from an array of records
 */
export function aggregateByScope(records: { scope: string; tCO2e?: number }[]) {
    const totals = { scope1: 0, scope2: 0, scope3: 0 };

    for (const r of records) {
        const val = r.tCO2e ?? 0;
        if (r.scope === '1') totals.scope1 += val;
        else if (r.scope === '2') totals.scope2 += val;
        else if (r.scope === '3') totals.scope3 += val;
    }

    return totals;
}

/**
 * Aggregate emissions by category
 */
export function aggregateByCategory(records: { category?: string; tCO2e?: number }[]) {
    const map: Record<string, number> = {};

    for (const r of records) {
        const cat = r.category || 'Uncategorized';
        map[cat] = (map[cat] || 0) + (r.tCO2e ?? 0);
    }

    return Object.entries(map).map(([category, tCO2e]) => ({ category, tCO2e }));
}

/**
 * Aggregate emissions by facility name
 */
export function aggregateByFacility(
    records: { facilityId: string; tCO2e?: number }[],
    facilityNames: Record<string, string>
) {
    const map: Record<string, number> = {};

    for (const r of records) {
        const name = facilityNames[r.facilityId] || r.facilityId;
        map[name] = (map[name] || 0) + (r.tCO2e ?? 0);
    }

    return Object.entries(map).map(([facility, tCO2e]) => ({ facility, tCO2e }));
}

/**
 * Format tCO2e for display
 */
export function formatEmissions(tCO2e: number, decimals = 2): string {
    if (tCO2e >= 1000) {
        return `${(tCO2e / 1000).toFixed(decimals)}k`;
    }
    return tCO2e.toFixed(decimals);
}
