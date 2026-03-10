'use client';
// ============================================================
// GHG Shield — Subscription Status Component
// ============================================================
import { Card, Badge, Button } from '@/components/ui';
import { CreditCard, Calendar, CheckCircle } from 'lucide-react';

interface SubscriptionStatusProps {
    plan?: string;
    status?: 'active' | 'cancelled' | 'past_due' | 'pending';
    nextBillingDate?: string;
    monthlyFee?: number;
}

export function SubscriptionStatus({
    plan = 'Core',
    status = 'active',
    nextBillingDate,
    monthlyFee = 1499,
}: SubscriptionStatusProps) {
    const statusConfig = {
        active: { label: 'Active', variant: 'success' as const },
        cancelled: { label: 'Cancelled', variant: 'danger' as const },
        past_due: { label: 'Past Due', variant: 'warning' as const },
        pending: { label: 'Pending', variant: 'info' as const },
    };

    const { label, variant } = statusConfig[status] || statusConfig.active;

    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#4CAF80]/10 rounded-lg">
                        <CreditCard className="w-5 h-5 text-[#4CAF80]" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold font-[family-name:var(--font-syne)]">
                            Subscription
                        </h3>
                        <p className="text-xs text-gray-400">{plan} Plan</p>
                    </div>
                </div>
                <Badge variant={variant} size="md">{label}</Badge>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Monthly Fee</span>
                    <span className="text-white font-bold font-[family-name:var(--font-dm-mono)]">
                        ${monthlyFee.toLocaleString()}/mo
                    </span>
                </div>

                {nextBillingDate && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Next Billing
                        </span>
                        <span className="text-white">
                            {new Date(nextBillingDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </span>
                    </div>
                )}

                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Includes
                    </span>
                    <span className="text-gray-300 text-xs">
                        Full compliance service
                    </span>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#1a5c3844]">
                <p className="text-xs text-gray-500">
                    For billing questions contact{' '}
                    <span className="text-[#4CAF80]">billing@ghgshield.com</span>
                </p>
            </div>
        </Card>
    );
}
