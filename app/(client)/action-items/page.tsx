'use client';
// ============================================================
// GHG Shield — Client Action Items Page
// ============================================================
import { useAuth } from '@/hooks/useAuth';
import { useClient } from '@/hooks/useClient';
import { ActionItemList } from '@/components/client/ActionItemList';
import { Card, Skeleton } from '@/components/ui';
import { CheckSquare } from 'lucide-react';
import type { ActionItem } from '@/types';

// Demo action items
const DEMO_ITEMS: Partial<ActionItem>[] = [
    {
        $id: '1',
        actionId: 'ACT-001',
        clientId: 'demo',
        text: 'Upload Q3 2025 electricity bills for all California facilities',
        dueDate: '2025-07-15T00:00:00Z',
        status: 'open',
        priority: 'high',
        visibleToClient: true,
        createdAt: '2025-06-01T00:00:00Z',
    },
    {
        $id: '2',
        actionId: 'ACT-002',
        clientId: 'demo',
        text: 'Confirm fleet vehicle fuel records for fiscal year 2025',
        dueDate: '2025-07-01T00:00:00Z',
        status: 'open',
        priority: 'medium',
        visibleToClient: true,
        createdAt: '2025-06-01T00:00:00Z',
    },
    {
        $id: '3',
        actionId: 'ACT-003',
        clientId: 'demo',
        text: 'Review and sign the GHG inventory report for FY2024',
        dueDate: '2025-06-20T00:00:00Z',
        status: 'complete',
        priority: 'high',
        visibleToClient: true,
        createdAt: '2025-05-15T00:00:00Z',
    },
    {
        $id: '4',
        actionId: 'ACT-004',
        clientId: 'demo',
        text: 'Provide HVAC refrigerant type and recharge logs',
        dueDate: '2025-07-30T00:00:00Z',
        status: 'open',
        priority: 'low',
        visibleToClient: true,
        createdAt: '2025-06-10T00:00:00Z',
    },
];

export default function ClientActionItemsPage() {
    const { user } = useAuth();
    const { actionItems, isLoading } = useClient(user?.clientId);

    const displayItems = actionItems.length > 0
        ? actionItems.filter((i) => i.visibleToClient)
        : DEMO_ITEMS as ActionItem[];

    const openItems = displayItems.filter((i) => i.status !== 'complete');
    const completedItems = displayItems.filter((i) => i.status === 'complete');

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-syne)]">
                    Action Items
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                    Items that need your attention to keep compliance on track
                </p>
            </div>

            {isLoading ? (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <Skeleton className="h-5 w-full mb-2" />
                            <Skeleton className="h-4 w-32" />
                        </Card>
                    ))}
                </div>
            ) : displayItems.length === 0 ? (
                <Card>
                    <div className="text-center py-12">
                        <CheckSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-white font-medium mb-2">All Caught Up</h3>
                        <p className="text-gray-400 text-sm max-w-sm mx-auto">
                            No action items at the moment. You&apos;re all caught up.
                        </p>
                    </div>
                </Card>
            ) : (
                <>
                    {openItems.length > 0 && (
                        <div>
                            <h2 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
                                Open ({openItems.length})
                            </h2>
                            <ActionItemList items={openItems} />
                        </div>
                    )}

                    {completedItems.length > 0 && (
                        <div>
                            <h2 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
                                Completed ({completedItems.length})
                            </h2>
                            <ActionItemList items={completedItems} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
