'use client';
// ============================================================
// GHG Shield — Benchmark Dashboard Component
// ============================================================
import React from 'react';
import { Card } from '@/components/ui';
import { BenchmarkChart } from '@/components/charts/BenchmarkChart';
import { INDUSTRY_BENCHMARKS } from '@/lib/constants';
import { TrendingDown, TrendingUp, Award, Target, AlertTriangle } from 'lucide-react';

interface BenchmarkDashboardProps {
    totalEmissions: number; // tCO2e
    annualRevenue: string;  // e.g. "$5M" — we parse the number
    industry: string;
}

function parseRevenue(rev: string): number {
    // Parse strings like "$5M", "5000000", "$12.5M", etc.
    const cleaned = rev.replace(/[^0-9.MmBbKk]/g, '');
    let num = parseFloat(cleaned);
    if (isNaN(num)) return 1;
    if (/[Bb]/.test(rev)) num *= 1000; // Billions → millions
    else if (/[Mm]/.test(rev)) num *= 1; // Already in millions
    else if (/[Kk]/.test(rev)) num /= 1000; // Thousands → millions
    else if (num > 1000) num /= 1000000; // Raw dollars → millions
    return Math.max(num, 0.001);
}

export function BenchmarkDashboard({ totalEmissions, annualRevenue, industry }: BenchmarkDashboardProps) {
    const revenueMM = parseRevenue(annualRevenue);
    const clientIntensity = totalEmissions / revenueMM;

    const benchmark = INDUSTRY_BENCHMARKS[industry] || INDUSTRY_BENCHMARKS['Manufacturing'];
    const industryAvg = benchmark.avgIntensity;
    const topQuartile = benchmark.topQuartile;

    // Calculate metrics
    const vsAvgPct = ((industryAvg - clientIntensity) / industryAvg) * 100;
    const vsTopPct = ((topQuartile - clientIntensity) / topQuartile) * 100;

    // Determine percentile (simplified linear interpolation)
    let percentile: number;
    if (clientIntensity <= topQuartile) {
        percentile = 90 + (1 - clientIntensity / topQuartile) * 10;
    } else if (clientIntensity <= industryAvg) {
        const range = industryAvg - topQuartile;
        const position = industryAvg - clientIntensity;
        percentile = 25 + (position / range) * 65;
    } else {
        const overshoot = clientIntensity / industryAvg;
        percentile = Math.max(1, 25 - (overshoot - 1) * 50);
    }

    const performanceLevel =
        clientIntensity <= topQuartile ? 'excellent' :
            clientIntensity <= industryAvg ? 'good' : 'needs_improvement';

    const performanceConfig = {
        excellent: {
            label: 'Excellent',
            color: '#4CAF80',
            bgColor: '#4CAF80/10',
            icon: Award,
            message: `Your emissions intensity is in the top 25% of ${benchmark.label} companies. Outstanding performance.`,
        },
        good: {
            label: 'Good',
            color: '#F59E0B',
            bgColor: '#F59E0B/10',
            icon: Target,
            message: `You're performing better than the ${benchmark.label} average. With targeted reductions, you can reach top-quartile status.`,
        },
        needs_improvement: {
            label: 'Needs Improvement',
            color: '#EF4444',
            bgColor: '#EF4444/10',
            icon: AlertTriangle,
            message: `Your emissions intensity exceeds the ${benchmark.label} average. Consider reviewing your highest-emitting activities for reduction opportunities.`,
        },
    };

    const perf = performanceConfig[performanceLevel];
    const PerfIcon = perf.icon;

    return (
        <div className="space-y-6">
            {/* Performance Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Percentile Rank */}
                <Card>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${perf.color}15` }}>
                            <PerfIcon className="w-5 h-5" style={{ color: perf.color }} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Peer Rank</p>
                            <p className="text-2xl font-bold font-[family-name:var(--font-dm-mono)]" style={{ color: perf.color }}>
                                {Math.round(percentile)}th
                            </p>
                            <p className="text-[10px] text-gray-500">percentile</p>
                        </div>
                    </div>
                </Card>

                {/* Your Intensity */}
                <Card>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#4CAF80]/10 rounded-lg">
                            <Target className="w-5 h-5 text-[#4CAF80]" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Your Intensity</p>
                            <p className="text-2xl font-bold text-white font-[family-name:var(--font-dm-mono)]">
                                {clientIntensity.toFixed(1)}
                            </p>
                            <p className="text-[10px] text-gray-500">tCO₂e / $1M rev</p>
                        </div>
                    </div>
                </Card>

                {/* vs Industry */}
                <Card>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${vsAvgPct >= 0 ? 'bg-[#4CAF80]/10' : 'bg-red-500/10'}`}>
                            {vsAvgPct >= 0 ? (
                                <TrendingDown className="w-5 h-5 text-[#4CAF80]" />
                            ) : (
                                <TrendingUp className="w-5 h-5 text-red-400" />
                            )}
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">vs. Industry Avg</p>
                            <p className={`text-2xl font-bold font-[family-name:var(--font-dm-mono)] ${vsAvgPct >= 0 ? 'text-[#4CAF80]' : 'text-red-400'}`}>
                                {vsAvgPct >= 0 ? '-' : '+'}{Math.abs(vsAvgPct).toFixed(0)}%
                            </p>
                            <p className="text-[10px] text-gray-500">{vsAvgPct >= 0 ? 'below avg' : 'above avg'}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Chart */}
            <Card>
                <h3 className="text-white font-semibold mb-6 font-[family-name:var(--font-syne)]">
                    Emissions Intensity Comparison
                </h3>
                <BenchmarkChart
                    clientIntensity={clientIntensity}
                    industryAvg={industryAvg}
                    topQuartile={topQuartile}
                    industry={benchmark.label}
                />
            </Card>

            {/* Performance Insight */}
            <Card>
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: `${perf.color}15` }}>
                        <PerfIcon className="w-6 h-6" style={{ color: perf.color }} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-white font-semibold font-[family-name:var(--font-syne)]">
                                Performance: {perf.label}
                            </h4>
                            <span
                                className="text-xs font-bold px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: `${perf.color}20`, color: perf.color }}
                            >
                                {Math.round(percentile)}th percentile
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">{perf.message}</p>
                        {performanceLevel !== 'excellent' && (
                            <div className="mt-3 p-3 bg-[#0d1a0d] rounded-lg border border-[#1a5c3844]">
                                <p className="text-xs text-gray-400">
                                    <strong className="text-white">To reach top quartile:</strong> Reduce emissions by{' '}
                                    <span className="text-[#4CAF80] font-mono font-bold">
                                        {Math.max(0, clientIntensity - topQuartile).toFixed(1)} tCO₂e/$1M
                                    </span>{' '}
                                    ({Math.max(0, ((clientIntensity - topQuartile) / clientIntensity) * 100).toFixed(0)}% reduction needed)
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}
