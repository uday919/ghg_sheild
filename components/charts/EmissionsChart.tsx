'use client';
// ============================================================
// GHG Shield — Emissions Bar Chart (Scope 1 vs Scope 2)
// ============================================================
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EmissionsChartProps {
    data: { category: string; scope1: number; scope2: number }[];
    height?: number;
}

export function EmissionsChart({ data, height = 350 }: EmissionsChartProps) {
    if (!data.length) {
        return (
            <div className="flex items-center justify-center h-[350px] text-gray-500">
                No emission data available
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a5c3822" />
                <XAxis
                    dataKey="category"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    axisLine={{ stroke: '#1a5c3844' }}
                    tickLine={{ stroke: '#1a5c3844' }}
                />
                <YAxis
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    axisLine={{ stroke: '#1a5c3844' }}
                    tickLine={{ stroke: '#1a5c3844' }}
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
                <Legend
                    wrapperStyle={{ color: '#9ca3af', fontSize: 12 }}
                />
                <Bar dataKey="scope1" name="Scope 1 (Direct)" fill="#4CAF80" radius={[4, 4, 0, 0]} />
                <Bar dataKey="scope2" name="Scope 2 (Electricity)" fill="#2196F3" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}
