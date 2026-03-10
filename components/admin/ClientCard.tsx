'use client';
// ============================================================
// GHG Shield — Client Card (Admin)
// ============================================================
import { Card, Badge } from '@/components/ui';
import { Building2, Users, TrendingUp } from 'lucide-react';
import type { Client } from '@/types';

interface ClientCardProps {
    client: Client;
    onClick?: () => void;
}

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' }> = {
    on_track: { label: 'On Track', variant: 'success' },
    at_risk: { label: 'At Risk', variant: 'warning' },
    submitted: { label: 'Submitted', variant: 'info' },
    overdue: { label: 'Overdue', variant: 'danger' },
};

export function ClientCard({ client, onClick }: ClientCardProps) {
    const status = statusConfig[client.complianceStatus] || statusConfig.on_track;

    return (
        <Card hover className="cursor-pointer" onClick={onClick}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#4CAF80]/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-[#4CAF80]" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold font-[family-name:var(--font-syne)]">
                            {client.companyName}
                        </h3>
                        <p className="text-xs text-gray-400">{client.industry}</p>
                    </div>
                </div>
                <Badge variant={status.variant}>{status.label}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{client.contactName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>{client.facilityCount || 0} facilities</span>
                </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#1a5c3844]">
                <span className="text-xs text-gray-500">
                    ${client.monthlyFee?.toLocaleString() || '—'}/mo
                </span>
                <span className={`text-xs ${client.isActive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {client.isActive ? '● Active' : '● Inactive'}
                </span>
            </div>
        </Card>
    );
}
