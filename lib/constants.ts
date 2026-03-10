// ============================================================
// GHG Shield — Constants & Emission Factor Data
// ============================================================

// EPA 40 CFR 98 Table C-1 & C-2 — Scope 1 Stationary & Mobile Combustion
export const SCOPE1_FACTORS: Record<string, {
    factor: number;
    unit: string;
    source: string;
}> = {
    naturalGas: { factor: 0.05306, unit: 'kgCO2e/therm', source: 'EPA 40 CFR 98 Table C-1' },
    diesel: { factor: 10.21, unit: 'kgCO2e/gallon', source: 'EPA 40 CFR 98 Table C-2' },
    gasoline: { factor: 8.78, unit: 'kgCO2e/gallon', source: 'EPA 40 CFR 98 Table C-2' },
    propane: { factor: 5.68, unit: 'kgCO2e/gallon', source: 'EPA 40 CFR 98 Table C-1' },
    'r-410a': { factor: 2088, unit: 'kgCO2e/kg', source: 'IPCC AR6 GWP100' },
};

// eGRID 2024 — Scope 2 Location-based factors (tCO2e/kWh)
export const EGRID_FACTORS: Record<string, number> = {
    CAMX: 0.000215,   // California
    ERCT: 0.000432,   // Texas
    NWPP: 0.000218,   // Northwest
    RMPA: 0.000513,   // Rocky Mountain
    SERC: 0.000394,   // Southeast
    RFCW: 0.000428,   // Midwest
    NYUP: 0.000196,   // New York
    ISNE: 0.000237,   // New England
    MROW: 0.000456,   // Midwest
    SRSO: 0.000423,   // South
};

// Map display names → constant keys for Scope 1
export const FUEL_TYPE_MAP: Record<string, string> = {
    'Natural Gas': 'naturalGas',
    'Diesel': 'diesel',
    'Gasoline': 'gasoline',
    'Propane': 'propane',
    'R-410A': 'r-410a',
};

// Activity units by fuel type
export const ACTIVITY_UNITS: Record<string, string> = {
    'Natural Gas': 'therms',
    'Diesel': 'gallons',
    'Gasoline': 'gallons',
    'Propane': 'gallons',
    'R-410A': 'kg',
    'Electricity': 'kWh',
};

// eGRID subregion labels
export const EGRID_LABELS: Record<string, string> = {
    CAMX: 'WECC California (CAMX)',
    ERCT: 'ERCOT Texas (ERCT)',
    NWPP: 'WECC Northwest (NWPP)',
    RMPA: 'WECC Rocky Mountain (RMPA)',
    SERC: 'SERC Southeast (SERC)',
    RFCW: 'RFC West (RFCW)',
    NYUP: 'NPCC Upstate NY (NYUP)',
    ISNE: 'NPCC New England (ISNE)',
    MROW: 'MRO West (MROW)',
    SRSO: 'SERC South (SRSO)',
};

// eGRID subregion shortcodes
export const EGRID_SUBREGIONS = Object.keys(EGRID_FACTORS);

// Emission categories
export const EMISSION_CATEGORIES = [
    'Stationary Combustion',
    'Mobile Combustion',
    'Fugitive',
    'Purchased Electricity',
] as const;

// Scope descriptions
export const SCOPE_DESCRIPTIONS: Record<string, string> = {
    '1': 'Direct GHG emissions from owned/controlled sources',
    '2': 'Indirect emissions from purchased electricity',
    '3': 'All other indirect emissions in the value chain',
};

// Facility types
export const FACILITY_TYPES = ['Office', 'Plant', 'Warehouse', 'Retail', 'Data Center', 'Distribution', 'Other'] as const;

// Industry sectors
export const INDUSTRY_SECTORS = [
    'Manufacturing',
    'Technology',
    'Healthcare',
    'Retail',
    'Transportation',
    'Food & Beverage',
    'Energy',
    'Construction',
    'Financial Services',
    'Agriculture',
    'Real Estate',
    'Professional Services',
] as const;

// Data quality descriptions
export const DATA_QUALITY_DESCRIPTIONS: Record<string, string> = {
    High: 'Primary data from metered sources or direct measurement',
    Medium: 'Secondary data from industry averages or engineering estimates',
    Low: 'Estimated data based on proxy information or assumptions',
};

// Industry benchmark data — Average tCO2e per $1M revenue (CDP/EPA 2023 averages)
export const INDUSTRY_BENCHMARKS: Record<string, { avgIntensity: number; topQuartile: number; label: string }> = {
    'Manufacturing': { avgIntensity: 185, topQuartile: 95, label: 'Manufacturing' },
    'Technology': { avgIntensity: 28, topQuartile: 12, label: 'Technology' },
    'Healthcare': { avgIntensity: 62, topQuartile: 30, label: 'Healthcare' },
    'Retail': { avgIntensity: 45, topQuartile: 22, label: 'Retail' },
    'Transportation': { avgIntensity: 310, topQuartile: 180, label: 'Transportation' },
    'Food & Beverage': { avgIntensity: 120, topQuartile: 55, label: 'Food & Beverage' },
    'Energy': { avgIntensity: 520, topQuartile: 280, label: 'Energy' },
    'Construction': { avgIntensity: 150, topQuartile: 75, label: 'Construction' },
    'Financial Services': { avgIntensity: 15, topQuartile: 6, label: 'Financial Services' },
    'Agriculture': { avgIntensity: 240, topQuartile: 110, label: 'Agriculture' },
    'Real Estate': { avgIntensity: 55, topQuartile: 25, label: 'Real Estate' },
    'Professional Services': { avgIntensity: 18, topQuartile: 8, label: 'Professional Services' },
};


