'use client';
// ============================================================
// GHG Shield — Monthly Trend Line Chart
// ============================================================
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface MonthlyTrendChartProps {
    data: { month: string; scope1: number; scope2: number; scope3: number }[];
    height?: number;
}

export function MonthlyTrendChart({ data, height = 300 }: MonthlyTrendChartProps) {
    if (!data.length) {
        return (
            <div className="flex items-center justify-center text-gray-500" style={{ height }}>
                Monthly data will appear as entries are recorded
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a5c3822" />
                <XAxis
                    dataKey="month"
                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                    axisLine={{ stroke: '#1a5c3844' }}
                />
                <YAxis
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    axisLine={{ stroke: '#1a5c3844' }}
                    label={{
                        value: 'tCO₂e',
                        angle: -90,
                        position: 'insideLeft',
                        fill: '#9ca3af',
                        fontSize: 12,
                    }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#0d1a0d',
                        border: '1px solid #1a5c3844',
                        borderRadius: '8px',
                        color: '#fff',
                    }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={((value: any) => [`${Number(value).toFixed(2)} tCO₂e`, undefined]) as any}
                />
                <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
                <Line type="monotone" dataKey="scope1" name="Scope 1" stroke="#4CAF80" strokeWidth={2} dot={{ fill: '#4CAF80', r: 3 }} />
                <Line type="monotone" dataKey="scope2" name="Scope 2" stroke="#2196F3" strokeWidth={2} dot={{ fill: '#2196F3', r: 3 }} />
                <Line type="monotone" dataKey="scope3" name="Scope 3" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B', r: 3 }} />
            </LineChart>
        </ResponsiveContainer>
    );
}
