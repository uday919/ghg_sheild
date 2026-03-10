'use client';
// ============================================================
// GHG Shield — CSV Export Utility
// ============================================================

interface ExportColumn {
    key: string;
    header: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transform?: (value: any) => string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function exportToCSV(data: any[], columns: ExportColumn[], filename: string) {
    if (!data.length) return;

    const header = columns.map(c => `"${c.header}"`).join(',');
    const rows = data.map(row =>
        columns.map(col => {
            const value = row[col.key];
            const formatted = col.transform ? col.transform(value) : String(value ?? '');
            return `"${formatted.replace(/"/g, '""')}"`;
        }).join(',')
    );

    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

// Preset export configs for common data types
export const EMISSION_EXPORT_COLUMNS: ExportColumn[] = [
    { key: 'scope', header: 'Scope' },
    { key: 'category', header: 'Category' },
    { key: 'fuelType', header: 'Fuel Type' },
    { key: 'activityData', header: 'Activity Data' },
    { key: 'activityUnit', header: 'Unit' },
    { key: 'month', header: 'Month' },
    { key: 'tCO2e', header: 'tCO₂e', transform: (v) => Number(v)?.toFixed(3) || '0' },
    { key: 'kgCO2e', header: 'kgCO₂e', transform: (v) => String(v || 0) },
    { key: 'calculationMethod', header: 'Calculation Method' },
    { key: 'factorVersion', header: 'Factor Version' },
    { key: 'verified', header: 'Verified', transform: (v) => v ? 'Yes' : 'No' },
    { key: '$createdAt', header: 'Created', transform: (v) => v ? new Date(v).toLocaleDateString() : '' },
];
