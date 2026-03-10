'use client';
// ============================================================
// GHG Shield — Client Dashboard (Enhanced with Time Filters + 5 Charts)
// ============================================================
import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEmissions } from '@/hooks/useEmissions';
import { useClient } from '@/hooks/useClient';
import { EmissionsSummary } from '@/components/client/EmissionsSummary';
import { ComplianceTracker } from '@/components/client/ComplianceTracker';
import { BenchmarkDashboard } from '@/components/client/BenchmarkDashboard';
import { EmissionsChart } from '@/components/charts/EmissionsChart';
import { TrendChart } from '@/components/charts/TrendChart';
import { ScopeBreakdownChart } from '@/components/charts/ScopeBreakdownChart';
import { MonthlyTrendChart } from '@/components/charts/MonthlyTrendChart';
import { FacilityBreakdownChart } from '@/components/charts/FacilityBreakdownChart';
import { AIInsights } from '@/components/client/AIInsights';
import { Card, Skeleton } from '@/components/ui';
import { SubscriptionStatus } from '@/components/client/SubscriptionStatus';
import { BarChart3, LayoutDashboard, TrendingDown, TrendingUp, Minus, Calendar, Download } from 'lucide-react';
import { exportToCSV, EMISSION_EXPORT_COLUMNS } from '@/lib/csvExport';

// Demo data
const DEMO_SUMMARY = {
    totalScope1: 142.87,
    totalScope2: 89.34,
    totalScope3: 23.10,
    totalEmissions: 255.31,
};

const DEMO_CHART_DATA = [
    { category: 'Stationary Combustion', scope1: 85.42, scope2: 0 },
    { category: 'Mobile Combustion', scope1: 45.15, scope2: 0 },
    { category: 'Fugitive Emissions', scope1: 12.30, scope2: 0 },
    { category: 'Purchased Electricity', scope1: 0, scope2: 89.34 },
];

const DEMO_TREND = [
    { year: 2022, tCO2e: 312.5 },
    { year: 2023, tCO2e: 287.3 },
    { year: 2024, tCO2e: 268.1 },
    { year: 2025, tCO2e: 255.31 },
];

const DEMO_MONTHLY = [
    { month: 'Jan', scope1: 12.5, scope2: 8.2, scope3: 2.1 },
    { month: 'Feb', scope1: 11.8, scope2: 7.9, scope3: 1.9 },
    { month: 'Mar', scope1: 13.2, scope2: 8.5, scope3: 2.3 },
    { month: 'Apr', scope1: 11.0, scope2: 7.1, scope3: 1.8 },
    { month: 'May', scope1: 12.1, scope2: 7.4, scope3: 2.0 },
    { month: 'Jun', scope1: 11.5, scope2: 6.8, scope3: 1.7 },
    { month: 'Jul', scope1: 12.8, scope2: 8.0, scope3: 2.2 },
    { month: 'Aug', scope1: 13.0, scope2: 8.3, scope3: 2.4 },
    { month: 'Sep', scope1: 11.2, scope2: 7.0, scope3: 1.6 },
    { month: 'Oct', scope1: 10.8, scope2: 6.5, scope3: 1.5 },
    { month: 'Nov', scope1: 11.5, scope2: 7.2, scope3: 1.8 },
    { month: 'Dec', scope1: 11.5, scope2: 6.5, scope3: 1.8 },
];

const DEMO_FACILITY = [
    { facility: 'HQ — San Jose, CA', tCO2e: 128.45 },
    { facility: 'Plant — Sacramento', tCO2e: 89.76 },
    { facility: 'Warehouse — Reno', tCO2e: 37.10 },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type TimeFilter = 'monthly' | 'quarterly' | 'yearly';

export default function ClientDashboard() {
    const { user } = useAuth();
    const { summary, emissionData, isLoading: emissionsLoading } = useEmissions(user?.clientId, 2025);
    const { client, isLoading: clientLoading } = useClient(user?.clientId);
    const [activeTab, setActiveTab] = useState<'overview' | 'benchmarks'>('overview');
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('monthly');

    const isLoading = emissionsLoading || clientLoading;
    const displaySummary = summary || DEMO_SUMMARY;
    const complianceStatus = client?.complianceStatus || 'on_track';

    // YoY change calculation
    const prevYear = DEMO_TREND.length >= 2 ? DEMO_TREND[DEMO_TREND.length - 2].tCO2e : 0;
    const currYear = displaySummary.totalEmissions;
    const yoyChange = prevYear > 0 ? ((currYear - prevYear) / prevYear) * 100 : 0;

    // Compute monthly data from real emissionData or use demo
    const monthlyData = useMemo(() => {
        if (emissionData.length === 0) return DEMO_MONTHLY;
        const byMonth: Record<string, { scope1: number; scope2: number; scope3: number }> = {};
        MONTHS.forEach(m => { byMonth[m] = { scope1: 0, scope2: 0, scope3: 0 }; });
        emissionData.forEach(e => {
            const monthIdx = e.month ? Number(e.month) - 1 : new Date(e.created_at).getMonth();
            const mKey = MONTHS[monthIdx] || 'Jan';
            if (e.scope === '1') byMonth[mKey].scope1 += (e.tCO2e || 0);
            else if (e.scope === '2') byMonth[mKey].scope2 += (e.tCO2e || 0);
            else byMonth[mKey].scope3 += (e.tCO2e || 0);
        });
        return MONTHS.map(m => ({ month: m, ...byMonth[m] }));
    }, [emissionData]);

    // Time-filtered monthly data
    const filteredMonthly = useMemo(() => {
        if (timeFilter === 'yearly') {
            const totals = monthlyData.reduce((acc, m) => ({
                scope1: acc.scope1 + m.scope1,
                scope2: acc.scope2 + m.scope2,
                scope3: acc.scope3 + m.scope3,
            }), { scope1: 0, scope2: 0, scope3: 0 });
            return [{ month: '2025', ...totals }];
        } else if (timeFilter === 'quarterly') {
            const q = ['Q1', 'Q2', 'Q3', 'Q4'];
            return q.map((label, i) => {
                const slice = monthlyData.slice(i * 3, i * 3 + 3);
                return {
                    month: label,
                    scope1: slice.reduce((s, m) => s + m.scope1, 0),
                    scope2: slice.reduce((s, m) => s + m.scope2, 0),
                    scope3: slice.reduce((s, m) => s + m.scope3, 0),
                };
            });
        }
        return monthlyData;
    }, [monthlyData, timeFilter]);

    // Facility data from real data or demo
    const facilityData = useMemo(() => {
        if (emissionData.length === 0) return DEMO_FACILITY;
        const byFac: Record<string, number> = {};
        emissionData.forEach(e => {
            const key = e.facilityId || 'Unknown';
            byFac[key] = (byFac[key] || 0) + (e.tCO2e || 0);
        });
        return Object.entries(byFac).map(([facility, tCO2e]) => ({ facility, tCO2e })).sort((a, b) => b.tCO2e - a.tCO2e);
    }, [emissionData]);

    const hasData = displaySummary.totalEmissions > 0;

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-syne)]">
                        Emissions Dashboard
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        {client?.companyName || 'Your company'} — FY 2025 Overview
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex gap-2 bg-[#0d1a0d] border border-[#1a5c3844] rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'overview'
                            ? 'bg-[#4CAF80] text-black'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('benchmarks')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'benchmarks'
                            ? 'bg-[#4CAF80] text-black'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <BarChart3 className="w-4 h-4" />
                        Industry Benchmarks
                    </button>
                </div>
                <button
                    onClick={() => exportToCSV(emissionData.length > 0 ? emissionData : [], EMISSION_EXPORT_COLUMNS, `ghg-emissions-${new Date().getFullYear()}`)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white bg-[#0d1a0d] border border-[#1a5c3844] hover:border-[#4CAF80]/50 transition-colors"
                    title="Export CSV"
                >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export CSV</span>
                </button>
            </div>

            {activeTab === 'overview' ? (
                !hasData && !isLoading ? (
                    /* Empty State */
                    <Card>
                        <div className="text-center py-16">
                            <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-white font-semibold text-lg mb-2 font-[family-name:var(--font-syne)]">
                                Your Dashboard is Being Prepared
                            </h3>
                            <p className="text-gray-400 text-sm max-w-md mx-auto">
                                Your emissions data is being processed. You&apos;ll receive an email when your dashboard is ready.
                            </p>
                        </div>
                    </Card>
                ) : (
                    <>
                        {/* Summary Cards with YoY */}
                        <AIInsights clientId={user?.clientId} />

                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <Card key={i}>
                                        <Skeleton className="h-4 w-24 mb-2" />
                                        <Skeleton className="h-8 w-32" />
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <>
                                <EmissionsSummary
                                    totalScope1={displaySummary.totalScope1}
                                    totalScope2={displaySummary.totalScope2}
                                    totalScope3={displaySummary.totalScope3}
                                    totalEmissions={displaySummary.totalEmissions}
                                />
                                {/* YoY Change Card */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <Card>
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${yoyChange < 0 ? 'bg-green-500/10' : yoyChange > 0 ? 'bg-red-500/10' : 'bg-gray-500/10'}`}>
                                                {yoyChange < 0 ? <TrendingDown className="w-5 h-5 text-green-400" /> :
                                                    yoyChange > 0 ? <TrendingUp className="w-5 h-5 text-red-400" /> :
                                                        <Minus className="w-5 h-5 text-gray-400" />}
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">YoY Change</p>
                                                <p className={`text-lg font-bold font-mono ${yoyChange < 0 ? 'text-green-400' : yoyChange > 0 ? 'text-red-400' : 'text-gray-400'}`}>
                                                    {yoyChange > 0 ? '+' : ''}{yoyChange.toFixed(1)}%
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                    <Card>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-[#4CAF80]/10">
                                                <Calendar className="w-5 h-5 text-[#4CAF80]" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">Reporting Year</p>
                                                <p className="text-lg font-bold text-white font-mono">2025</p>
                                            </div>
                                        </div>
                                    </Card>
                                    <Card>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-[#2196F3]/10">
                                                <BarChart3 className="w-5 h-5 text-[#2196F3]" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">Data Points</p>
                                                <p className="text-lg font-bold text-white font-mono">
                                                    {emissionData.length || '12'}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </>
                        )}

                        {/* Time Filter */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                            <span className="text-xs text-gray-500 shrink-0">Time period:</span>
                            {(['monthly', 'quarterly', 'yearly'] as TimeFilter[]).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setTimeFilter(f)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${timeFilter === f
                                        ? 'bg-[#4CAF80] text-black'
                                        : 'bg-[#0d1a0d] border border-[#1a5c3844] text-gray-400 hover:text-white hover:border-[#4CAF80]/50'
                                        }`}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Charts Grid — Row 1: Monthly Trend + Scope Breakdown */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <h3 className="text-white font-semibold mb-4 font-[family-name:var(--font-syne)]">
                                    Emissions Trend ({timeFilter})
                                </h3>
                                <MonthlyTrendChart data={filteredMonthly} />
                            </Card>
                            <Card>
                                <h3 className="text-white font-semibold mb-4 font-[family-name:var(--font-syne)]">
                                    Scope Breakdown
                                </h3>
                                <ScopeBreakdownChart
                                    scope1={displaySummary.totalScope1}
                                    scope2={displaySummary.totalScope2}
                                    scope3={displaySummary.totalScope3}
                                />
                            </Card>
                        </div>

                        {/* Charts Grid — Row 2: Category + Facility Breakdown */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <h3 className="text-white font-semibold mb-4 font-[family-name:var(--font-syne)]">
                                    Emissions by Category
                                </h3>
                                <EmissionsChart data={DEMO_CHART_DATA} />
                            </Card>
                            <Card>
                                <h3 className="text-white font-semibold mb-4 font-[family-name:var(--font-syne)]">
                                    Emissions by Facility
                                </h3>
                                <FacilityBreakdownChart data={facilityData} />
                            </Card>
                        </div>

                        {/* Charts Grid — Row 3: YoY Trend */}
                        <Card>
                            <h3 className="text-white font-semibold mb-4 font-[family-name:var(--font-syne)]">
                                Year-over-Year Trend
                            </h3>
                            <TrendChart data={DEMO_TREND} />
                        </Card>

                        {/* Subscription & Compliance */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <SubscriptionStatus
                                plan={client?.monthlyFee === 1999 ? 'Standard' : 'Enterprise'}
                                status="active"
                                monthlyFee={client?.monthlyFee || 1999}
                            />
                            <ComplianceTracker
                                complianceStatus={complianceStatus}
                                reportingYear={2025}
                            />
                        </div>
                    </>
                )
            ) : (
                <BenchmarkDashboard
                    totalEmissions={displaySummary.totalEmissions}
                    annualRevenue={client?.annualRevenue || '$5M'}
                    industry={client?.industry || 'Manufacturing'}
                />
            )}
        </div>
    );
}
