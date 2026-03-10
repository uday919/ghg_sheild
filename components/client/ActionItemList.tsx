'use client';
// ============================================================
// GHG Shield — Action Item List (Client)
// ============================================================
import { Card, Badge } from '@/components/ui';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import type { ActionItem } from '@/types';

interface ActionItemListProps {
    items: ActionItem[];
}

const priorityConfig: Record<string, { variant: 'danger' | 'warning' | 'default' }> = {
    high: { variant: 'danger' },
    medium: { variant: 'warning' },
    low: { variant: 'default' },
};

const statusIcons: Record<string, React.ReactNode> = {
    open: <Clock className="w-4 h-4 text-amber-400" />,
    complete: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    overdue: <AlertCircle className="w-4 h-4 text-red-400" />,
};

export function ActionItemList({ items }: ActionItemListProps) {
    if (!items.length) {
        return (
            <Card>
                <div className="text-center py-8">
                    <CheckCircle2 className="w-8 h-8 text-[#4CAF80] mx-auto mb-3" />
                    <p className="text-gray-400">No action items — you&apos;re all caught up!</p>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {items.map((item) => {
                const priority = priorityConfig[item.priority] || priorityConfig.low;
                const dueDate = item.dueDate ? new Date(item.dueDate).toLocaleDateString() : null;

                return (
                    <Card key={item.id} hover>
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5">{statusIcons[item.status]}</div>
                            <div className="flex-1">
                                <p className={`text-sm ${item.status === 'complete' ? 'text-gray-500 line-through' : 'text-white'}`}>
                                    {item.text}
                                </p>
                                <div className="flex items-center gap-3 mt-2">
                                    <Badge variant={priority.variant} size="sm">
                                        {item.priority}
                                    </Badge>
                                    {dueDate && (
                                        <span className="text-xs text-gray-500">
                                            Due: {dueDate}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
