'use client';
// ============================================================
// GHG Shield — Scope Breakdown Pie Chart
// ============================================================
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ScopeBreakdownChartProps {
    scope1: number;
    scope2: number;
    scope3: number;
    height?: number;
}

const COLORS = ['#4CAF80', '#2196F3', '#F59E0B'];

export function ScopeBreakdownChart({ scope1, scope2, scope3, height = 300 }: ScopeBreakdownChartProps) {
    const data = [
        { name: 'Scope 1', value: scope1 },
        { name: 'Scope 2', value: scope2 },
        { name: 'Scope 3', value: scope3 },
    ].filter(d => d.value > 0);

    if (!data.length) {
        return (
            <div className="flex items-center justify-center text-gray-500" style={{ height }}>
                No scope data available
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={height}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                >
                    {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
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
            </PieChart>
        </ResponsiveContainer>
    );
}
