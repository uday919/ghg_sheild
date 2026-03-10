'use client';
// ============================================================
// GHG Shield — useEmissions Hook (Supabase Implementation)
// ============================================================
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { keysToCamelCase } from '@/lib/utils';
import { aggregateByScope, aggregateByCategory, aggregateByFacility } from '@/lib/calculations';
import type { EmissionData, Report, EmissionsSummary } from '@/types';

export function useEmissions(clientId?: string, reportingYear?: number) {
    const [emissionData, setEmissionData] = useState<EmissionData[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [summary, setSummary] = useState<EmissionsSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchEmissionData = useCallback(async () => {
        if (!clientId) return;
        try {
            setIsLoading(true);
            let query = supabase
                .from('emission_data')
                .select('*')
                .eq('client_id', clientId)
                .limit(5000);

            if (reportingYear) {
                query = query.eq('reporting_year', reportingYear);
            }

            const { data, error } = await query;
            if (error) throw error;

            const camelData = keysToCamelCase<EmissionData[]>(data);
            setEmissionData(camelData);

            // Build summary
            const scopeTotals = aggregateByScope(camelData);
            const byCategory = aggregateByCategory(camelData);
            const byFacility = aggregateByFacility(camelData, {});

            setSummary({
                totalScope1: scopeTotals.scope1,
                totalScope2: scopeTotals.scope2,
                totalScope3: scopeTotals.scope3,
                totalEmissions: scopeTotals.scope1 + scopeTotals.scope2 + scopeTotals.scope3,
                byCategory,
                byFacility,
                yearOverYear: [],
            });
        } catch (error) {
            console.error('Error fetching emission data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [clientId, reportingYear]);

    const fetchReports = useCallback(async () => {
        if (!clientId) return;
        try {
            const { data, error } = await supabase
                .from('reports')
                .select('*')
                .eq('client_id', clientId)
                .order('created_at', { ascending: false })
                .limit(5000);

            if (error) throw error;
            setReports(keysToCamelCase(data) as Report[]);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    }, [clientId]);

    useEffect(() => {
        if (clientId) {
            fetchEmissionData();
            fetchReports();
        }
    }, [clientId, fetchEmissionData, fetchReports]);

    return {
        emissionData,
        reports,
        summary,
        isLoading,
        refetch: () => {
            fetchEmissionData();
            fetchReports();
        },
    };
}
