// ============================================================
// GHG Shield — PDF Generation API Route
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { keysToCamelCase } from '@/lib/utils';
import { generatePDFBuffer } from '@/lib/pdf';
import type { Client, EmissionData, Facility, Report } from '@/types';

export async function POST(req: NextRequest) {
    try {
        const { reportId, clientId } = await req.json();

        if (!reportId || !clientId) {
            return NextResponse.json({ error: 'reportId and clientId required' }, { status: 400 });
        }

        // Fetch data
        const { data: clientRaw, error: clientErr } = await supabase
            .from('clients')
            .select('*')
            .eq('id', clientId)
            .single();

        if (clientErr || !clientRaw) throw new Error('Client not found');

        const { data: reportRaw } = await supabase
            .from('reports')
            .select('*')
            .eq('id', reportId)
            .single();

        const { data: emissionRes } = await supabase
            .from('emission_data')
            .select('*')
            .eq('client_id', clientId)
            .limit(500);

        const { data: facilityRes } = await supabase
            .from('facilities')
            .select('*')
            .eq('client_id', clientId)
            .limit(5000);

        const client = keysToCamelCase(clientRaw) as unknown as Client;
        const report = keysToCamelCase(reportRaw) as unknown as Report;
        const emissions = keysToCamelCase(emissionRes) as EmissionData[];
        const facilities = keysToCamelCase(facilityRes) as Facility[];

        const facilityMap = Object.fromEntries(facilities.map((f) => [f.id, f]));

        // Build PDF data
        const scope1Details = emissions
            .filter((e) => e.scope === '1')
            .map((e) => ({
                source: e.category || 'Unknown',
                fuel: e.fuelType || 'Unknown',
                activity: e.activityData || 0,
                unit: e.activityUnit || '',
                tCO2e: e.tCO2e || 0,
            }));

        const scope2Details = emissions
            .filter((e) => e.scope === '2')
            .map((e) => ({
                facility: facilityMap[e.facilityId]?.name || e.facilityId,
                kWh: e.activityData || 0,
                subregion: facilityMap[e.facilityId]?.egridSubregion || 'Unknown',
                tCO2e: e.tCO2e || 0,
            }));

        const pdfBuffer = await generatePDFBuffer({
            companyName: client.companyName,
            fiscalYear: report.reportingYear?.toString() || '2025',
            reportName: report.reportName || `FY${report.reportingYear} GHG Report`,
            executiveSummary: report.aiExecutiveSummary || 'Executive summary pending.',
            boundaryStatement: report.aiBoundaryStatement || 'Boundary statement pending.',
            methodologyText: report.aiMethodologyText || 'Methodology pending.',
            dataQualityStatement: report.aiDataQualityStatement || 'Data quality assessment pending.',
            scope1Total: report.totalScope1 || 0,
            scope2LocationTotal: report.totalScope2Location || 0,
            scope2MarketTotal: report.totalScope2Market || 0,
            scope3Total: report.totalScope3 || 0,
            scope1Details,
            scope2Details,
            preparedBy: 'GHG Shield Consultant, ISO 14064 Certified',
        });

        // Upload PDF to Supabase Storage
        const fileName = `${client.companyName.replace(/\s+/g, '_')}_GHG_Report_${report.reportingYear}_${Date.now()}.pdf`;

        const { error: uploadError } = await supabase.storage
            .from('reports')
            .upload(fileName, pdfBuffer, {
                contentType: 'application/pdf',
            });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
            .from('reports')
            .getPublicUrl(fileName);

        const fileUrl = urlData.publicUrl;

        // Update report with PDF URL
        await supabase
            .from('reports')
            .update({
                final_pdf_url: fileUrl,
                status: 'final',
            })
            .eq('id', reportId);

        return NextResponse.json({ success: true, fileUrl });
    } catch (error) {
        console.error('PDF generation error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
