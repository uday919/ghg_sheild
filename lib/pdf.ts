// ============================================================
// GHG Shield — PDF Generation Logic
// ============================================================
// This module wraps @react-pdf/renderer for server-side usage.
// The actual template is in components/pdf/GHGReportTemplate.tsx

export async function generatePDFBuffer(
    reportData: {
        companyName: string;
        fiscalYear: string;
        reportName: string;
        executiveSummary: string;
        boundaryStatement: string;
        methodologyText: string;
        dataQualityStatement: string;
        scope1Total: number;
        scope2LocationTotal: number;
        scope2MarketTotal: number;
        scope3Total: number;
        scope1Details: { source: string; fuel: string; activity: number; unit: string; tCO2e: number }[];
        scope2Details: { facility: string; kWh: number; subregion: string; tCO2e: number }[];
        preparedBy: string;
    }
): Promise<Buffer> {
    // Dynamic import for server-side rendering
    const { renderToBuffer } = await import('@react-pdf/renderer');
    const { GHGReportDocument } = await import('@/components/pdf/GHGReportTemplate');

    const buffer = await renderToBuffer(GHGReportDocument(reportData));
    return Buffer.from(buffer);
}
