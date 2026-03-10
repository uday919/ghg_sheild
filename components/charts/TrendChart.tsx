'use client';
// ============================================================
// GHG Shield — Year-over-Year Trend Chart
// ============================================================
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface TrendChartProps {
    data: { year: number; tCO2e: number }[];
    height?: number;
}

export function TrendChart({ data, height = 300 }: TrendChartProps) {
    if (!data.length) {
        return (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
                Trend data will appear when multiple years are available
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4CAF80" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4CAF80" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a5c3822" />
                <XAxis
                    dataKey="year"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
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
                    formatter={((value: any) => [`${Number(value).toFixed(2)} tCO₂e`, 'Total Emissions']) as any}
                />
                <Area
                    type="monotone"
                    dataKey="tCO2e"
                    stroke="#4CAF80"
                    strokeWidth={2}
                    fill="url(#colorEmissions)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
