'use client';
// ============================================================
// GHG Shield — Benchmark Comparison Chart
// ============================================================
import React from 'react';

interface BenchmarkChartProps {
    clientIntensity: number;
    industryAvg: number;
    topQuartile: number;
    industry: string;
}

export function BenchmarkChart({ clientIntensity, industryAvg, topQuartile, industry }: BenchmarkChartProps) {
    // Determine the max value for the chart scale
    const maxVal = Math.max(clientIntensity, industryAvg, topQuartile) * 1.3;

    const getBarWidth = (val: number) => `${Math.min((val / maxVal) * 100, 100)}%`;

    const getPerformanceColor = () => {
        if (clientIntensity <= topQuartile) return '#4CAF80'; // Excellent — green
        if (clientIntensity <= industryAvg) return '#F59E0B'; // Good — amber
        return '#EF4444'; // Needs improvement — red
    };

    const performanceColor = getPerformanceColor();

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {/* Your Company */}
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-medium text-white">Your Company</span>
                        <span className="text-sm font-mono font-bold" style={{ color: performanceColor }}>
                            {clientIntensity.toFixed(1)} tCO₂e
                        </span>
                    </div>
                    <div className="w-full bg-[#1a1a1a] rounded-full h-5 overflow-hidden">
                        <div
                            className="h-5 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                            style={{
                                width: getBarWidth(clientIntensity),
                                backgroundColor: performanceColor,
                            }}
                        >
                            <span className="text-[10px] font-bold text-black/70">YOU</span>
                        </div>
                    </div>
                </div>

                {/* Industry Average */}
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm text-gray-400">{industry} Average</span>
                        <span className="text-sm font-mono text-gray-400">
                            {industryAvg.toFixed(1)} tCO₂e
                        </span>
                    </div>
                    <div className="w-full bg-[#1a1a1a] rounded-full h-5 overflow-hidden">
                        <div
                            className="h-5 rounded-full transition-all duration-1000 ease-out bg-gray-600 flex items-center justify-end pr-2"
                            style={{ width: getBarWidth(industryAvg) }}
                        >
                            <span className="text-[10px] font-bold text-gray-300">AVG</span>
                        </div>
                    </div>
                </div>

                {/* Top Quartile */}
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm text-gray-400">Top 25% Performers</span>
                        <span className="text-sm font-mono text-[#4CAF80]">
                            {topQuartile.toFixed(1)} tCO₂e
                        </span>
                    </div>
                    <div className="w-full bg-[#1a1a1a] rounded-full h-5 overflow-hidden">
                        <div
                            className="h-5 rounded-full transition-all duration-1000 ease-out bg-[#4CAF80]/30 flex items-center justify-end pr-2"
                            style={{ width: getBarWidth(topQuartile) }}
                        >
                            <span className="text-[10px] font-bold text-[#4CAF80]">TOP</span>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-[11px] text-gray-500 text-center mt-4">
                Intensity = tCO₂e per $1M annual revenue · Source: CDP / EPA 2023 sector averages
            </p>
        </div>
    );
}
