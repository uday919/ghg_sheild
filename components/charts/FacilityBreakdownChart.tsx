'use client';
// ============================================================
// GHG Shield — Facility Breakdown Bar Chart
// ============================================================
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface FacilityBreakdownChartProps {
    data: { facility: string; tCO2e: number }[];
    height?: number;
}

export function FacilityBreakdownChart({ data, height = 300 }: FacilityBreakdownChartProps) {
    if (!data.length) {
        return (
            <div className="flex items-center justify-center text-gray-500" style={{ height }}>
                Facility data will appear as entries are recorded
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1a5c3822" />
                <XAxis
                    type="number"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    axisLine={{ stroke: '#1a5c3844' }}
                    label={{
                        value: 'tCO₂e',
                        position: 'insideBottomRight',
                        offset: -5,
                        fill: '#9ca3af',
                        fontSize: 12,
                    }}
                />
                <YAxis
                    type="category"
                    dataKey="facility"
                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                    axisLine={{ stroke: '#1a5c3844' }}
                    width={150}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#0d1a0d',
                        border: '1px solid #1a5c3844',
                        borderRadius: '8px',
                        color: '#fff',
                    }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={((value: any) => [`${Number(value).toFixed(2)} tCO₂e`, 'Emissions']) as any}
                />
                <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
                <Bar
                    dataKey="tCO2e"
                    name="Total Emissions"
                    fill="#4CAF80"
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
