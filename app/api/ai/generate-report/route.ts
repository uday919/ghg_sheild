// ============================================================
// GHG Shield — AI Report Generation API Route
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { keysToCamelCase } from '@/lib/utils';
import { generateReportWithClaude } from '@/lib/claude';
import { aggregateByScope, aggregateByCategory } from '@/lib/calculations';
import type { Client, EmissionData, Facility } from '@/types';

export async function POST(req: NextRequest) {
    try {
        const { reportId, clientId } = await req.json();

        if (!reportId || !clientId) {
            return NextResponse.json({ error: 'reportId and clientId required' }, { status: 400 });
        }

        // Fetch client details
        const { data: clientRaw, error: clientErr } = await supabase
            .from('clients')
            .select('*')
            .eq('id', clientId)
            .single();

        if (clientErr || !clientRaw) throw new Error('Client not found');
        const client = keysToCamelCase(clientRaw) as unknown as Client;

        // Fetch report
        const { data: reportRaw } = await supabase
            .from('reports')
            .select('reporting_year')
            .eq('id', reportId)
            .single();

        const reportingYear = reportRaw?.reporting_year || new Date().getFullYear();

        // Fetch all emission data for this client+year
        const { data: emissionDataRes } = await supabase
            .from('emission_data')
            .select('*')
            .eq('client_id', clientId)
            .eq('reporting_year', reportingYear)
            .limit(500);

        const emissionData = keysToCamelCase(emissionDataRes) as EmissionData[];

        // Fetch facilities
        const { data: facRes } = await supabase
            .from('facilities')
            .select('*')
            .eq('client_id', clientId)
            .limit(5000);

        const facilities = keysToCamelCase(facRes) as Facility[];

        // Aggregate data
        const scopeTotals = aggregateByScope(emissionData);
        const byCategory = aggregateByCategory(emissionData);

        // Build scope breakdown
        const scope1Breakdown = byCategory
            .filter((c) => {
                const related = emissionData.find((e) => e.category === c.category && e.scope === '1');
                return !!related;
            })
            .map((c) => ({ source: c.category, tCO2e: c.tCO2e }));

        const scope2Breakdown = facilities.map((f) => ({
            facility: f.name,
            tCO2e: emissionData
                .filter((e) => e.facilityId === f.id && e.scope === '2')
                .reduce((sum, e) => sum + (e.tCO2e || 0), 0),
            method: 'Location-based',
        })).filter((f) => f.tCO2e > 0);

        const states = [...new Set(facilities.map((f) => f.state).filter(Boolean))];
        const dataSources = [...new Set(emissionData.map((e) => e.dataSource).filter(Boolean))] as string[];

        // Generate with Claude
        const aiResult = await generateReportWithClaude({
            companyName: client.companyName,
            fiscalYear: `${reportingYear}`,
            industry: client.industry,
            facilityCount: facilities.length,
            states: states as string[],
            scope1Total: scopeTotals.scope1,
            scope1Breakdown,
            scope2Total: scopeTotals.scope2,
            scope2Breakdown,
            scope3Total: scopeTotals.scope3,
            dataSources,
        });

        // Save AI-generated content back to the report
        await supabase
            .from('reports')
            .update({
                ai_executive_summary: aiResult.executiveSummary,
                ai_methodology_text: aiResult.methodologyText,
                ai_boundary_statement: aiResult.boundaryStatement,
                ai_data_quality_statement: aiResult.dataQualityStatement,
                status: 'ai_review',
                total_scope_1: scopeTotals.scope1,
                total_scope_2_location: scopeTotals.scope2,
                total_scope_3: scopeTotals.scope3,
            })
            .eq('id', reportId);

        return NextResponse.json({ success: true, data: aiResult });
    } catch (error) {
        console.error('AI report generation error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
