// ============================================================
// GHG Shield — React-PDF Report Template
// ============================================================
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const BRAND_GREEN = '#1a5c38';
const BRAND_LIGHT = '#4CAF80';

const styles = StyleSheet.create({
    page: { padding: 50, fontFamily: 'Helvetica', fontSize: 10, color: '#333' },
    coverPage: { padding: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' },
    coverTitle: { fontSize: 36, fontFamily: 'Helvetica-Bold', color: BRAND_GREEN, textAlign: 'center' },
    coverSubtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 12 },
    coverCompany: { fontSize: 22, color: '#000', textAlign: 'center', marginTop: 40, fontFamily: 'Helvetica-Bold' },
    coverYear: { fontSize: 18, color: '#666', textAlign: 'center', marginTop: 8 },
    coverPrepared: { fontSize: 11, color: '#888', textAlign: 'center', marginTop: 60 },
    coverCert: { fontSize: 9, color: BRAND_LIGHT, textAlign: 'center', marginTop: 4 },
    sectionTitle: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: BRAND_GREEN, marginBottom: 12, marginTop: 24, borderBottomWidth: 2, borderBottomColor: BRAND_GREEN, paddingBottom: 6 },
    paragraph: { fontSize: 10, lineHeight: 1.6, marginBottom: 10, color: '#444' },
    table: { width: '100%', marginTop: 10, marginBottom: 10 },
    tableHeader: { flexDirection: 'row', backgroundColor: BRAND_GREEN, padding: 6 },
    tableHeaderCell: { flex: 1, fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#fff' },
    tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#ddd', padding: 6 },
    tableCell: { flex: 1, fontSize: 9, color: '#444' },
    tableCellBold: { flex: 1, fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#333' },
    footer: { position: 'absolute', bottom: 30, left: 50, right: 50, flexDirection: 'row', justifyContent: 'space-between', fontSize: 8, color: '#aaa' },
    logo: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: BRAND_GREEN },
    totalRow: { flexDirection: 'row', backgroundColor: '#f0f7f0', padding: 6, borderTopWidth: 1, borderTopColor: BRAND_GREEN },
});

interface ReportData {
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

export function GHGReportDocument(data: ReportData) {
    const totalEmissions = data.scope1Total + data.scope2LocationTotal + data.scope3Total;

    return (
        <Document>
            {/* Cover Page */}
            <Page size="A4" style={styles.coverPage}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.coverTitle}>🛡️ GHG Shield</Text>
                    <Text style={styles.coverSubtitle}>Greenhouse Gas Emissions Report</Text>
                    <Text style={styles.coverCompany}>{data.companyName}</Text>
                    <Text style={styles.coverYear}>Fiscal Year {data.fiscalYear}</Text>
                    <Text style={styles.coverPrepared}>Prepared by {data.preparedBy}</Text>
                    <Text style={styles.coverCert}>ISO 14064 Certified | SB 253 Compliant</Text>
                </View>
                <View style={styles.footer}>
                    <Text>GHG Shield</Text>
                    <Text>Confidential</Text>
                </View>
            </Page>

            {/* Executive Summary */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.sectionTitle}>1. Executive Summary</Text>
                <Text style={styles.paragraph}>{data.executiveSummary}</Text>

                <Text style={styles.sectionTitle}>2. Organizational Boundary</Text>
                <Text style={styles.paragraph}>{data.boundaryStatement}</Text>

                <View style={styles.footer}>
                    <Text style={styles.logo}>GHG Shield</Text>
                    <Text>Page 2</Text>
                </View>
            </Page>

            {/* Methodology */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.sectionTitle}>3. Methodology & Emission Factors</Text>
                <Text style={styles.paragraph}>{data.methodologyText}</Text>

                <Text style={styles.sectionTitle}>4. Results</Text>

                {/* Scope 1 Table */}
                <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#333', marginTop: 16, marginBottom: 8 }}>
                    Scope 1 — Direct Emissions ({data.scope1Total.toFixed(2)} tCO₂e)
                </Text>
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableHeaderCell}>Source</Text>
                        <Text style={styles.tableHeaderCell}>Fuel Type</Text>
                        <Text style={styles.tableHeaderCell}>Activity</Text>
                        <Text style={styles.tableHeaderCell}>Unit</Text>
                        <Text style={styles.tableHeaderCell}>tCO₂e</Text>
                    </View>
                    {data.scope1Details.map((row, i) => (
                        <View key={i} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{row.source}</Text>
                            <Text style={styles.tableCell}>{row.fuel}</Text>
                            <Text style={styles.tableCell}>{row.activity.toLocaleString()}</Text>
                            <Text style={styles.tableCell}>{row.unit}</Text>
                            <Text style={styles.tableCellBold}>{row.tCO2e.toFixed(2)}</Text>
                        </View>
                    ))}
                    <View style={styles.totalRow}>
                        <Text style={styles.tableCellBold}>Total Scope 1</Text>
                        <Text style={styles.tableCell}></Text>
                        <Text style={styles.tableCell}></Text>
                        <Text style={styles.tableCell}></Text>
                        <Text style={styles.tableCellBold}>{data.scope1Total.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Scope 2 Table */}
                <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#333', marginTop: 16, marginBottom: 8 }}>
                    Scope 2 — Indirect Emissions ({data.scope2LocationTotal.toFixed(2)} tCO₂e)
                </Text>
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableHeaderCell}>Facility</Text>
                        <Text style={styles.tableHeaderCell}>kWh</Text>
                        <Text style={styles.tableHeaderCell}>eGRID Region</Text>
                        <Text style={styles.tableHeaderCell}>tCO₂e</Text>
                    </View>
                    {data.scope2Details.map((row, i) => (
                        <View key={i} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{row.facility}</Text>
                            <Text style={styles.tableCell}>{row.kWh.toLocaleString()}</Text>
                            <Text style={styles.tableCell}>{row.subregion}</Text>
                            <Text style={styles.tableCellBold}>{row.tCO2e.toFixed(2)}</Text>
                        </View>
                    ))}
                    <View style={styles.totalRow}>
                        <Text style={styles.tableCellBold}>Total Scope 2 (Location)</Text>
                        <Text style={styles.tableCell}></Text>
                        <Text style={styles.tableCell}></Text>
                        <Text style={styles.tableCellBold}>{data.scope2LocationTotal.toFixed(2)}</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.logo}>GHG Shield</Text>
                    <Text>Page 3</Text>
                </View>
            </Page>

            {/* Data Quality + Summary */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.sectionTitle}>5. Data Quality Statement</Text>
                <Text style={styles.paragraph}>{data.dataQualityStatement}</Text>

                <Text style={styles.sectionTitle}>6. Emissions Summary</Text>
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Category</Text>
                        <Text style={styles.tableHeaderCell}>tCO₂e</Text>
                        <Text style={styles.tableHeaderCell}>% of Total</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { flex: 2 }]}>Scope 1 — Direct</Text>
                        <Text style={styles.tableCellBold}>{data.scope1Total.toFixed(2)}</Text>
                        <Text style={styles.tableCell}>{((data.scope1Total / totalEmissions) * 100).toFixed(1)}%</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { flex: 2 }]}>Scope 2 — Location-based</Text>
                        <Text style={styles.tableCellBold}>{data.scope2LocationTotal.toFixed(2)}</Text>
                        <Text style={styles.tableCell}>{((data.scope2LocationTotal / totalEmissions) * 100).toFixed(1)}%</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { flex: 2 }]}>Scope 3 — Value Chain</Text>
                        <Text style={styles.tableCellBold}>{data.scope3Total.toFixed(2)}</Text>
                        <Text style={styles.tableCell}>{((data.scope3Total / totalEmissions) * 100).toFixed(1)}%</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={[styles.tableCellBold, { flex: 2 }]}>Total Emissions</Text>
                        <Text style={styles.tableCellBold}>{totalEmissions.toFixed(2)}</Text>
                        <Text style={styles.tableCellBold}>100%</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.logo}>GHG Shield</Text>
                    <Text>Page 4</Text>
                </View>
            </Page>
        </Document>
    );
}
