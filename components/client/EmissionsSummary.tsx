'use client';
// ============================================================
// GHG Shield — Emissions Summary (Client Dashboard)
// ============================================================
import { StatCard } from '@/components/ui';
import { Flame, Zap, Globe, BarChart3 } from 'lucide-react';

interface EmissionsSummaryProps {
    totalScope1: number;
    totalScope2: number;
    totalScope3: number;
    totalEmissions: number;
}

export function EmissionsSummary({
    totalScope1,
    totalScope2,
    totalScope3,
    totalEmissions,
}: EmissionsSummaryProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                title="Total Emissions"
                value={`${totalEmissions.toFixed(2)}`}
                subtitle="tCO₂e total"
                icon={<BarChart3 className="w-5 h-5" />}
            />
            <StatCard
                title="Scope 1 — Direct"
                value={`${totalScope1.toFixed(2)}`}
                subtitle="tCO₂e from owned sources"
                icon={<Flame className="w-5 h-5" />}
            />
            <StatCard
                title="Scope 2 — Electricity"
                value={`${totalScope2.toFixed(2)}`}
                subtitle="tCO₂e from purchased electricity"
                icon={<Zap className="w-5 h-5" />}
            />
            <StatCard
                title="Scope 3 — Value Chain"
                value={`${totalScope3.toFixed(2)}`}
                subtitle="tCO₂e from value chain"
                icon={<Globe className="w-5 h-5" />}
            />
        </div>
    );
}
