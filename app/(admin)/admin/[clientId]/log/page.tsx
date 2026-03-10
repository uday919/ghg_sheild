'use client';
// ============================================================
// GHG Shield — Admin Activity Log Page
// ============================================================
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { keysToCamelCase } from '@/lib/utils';
import { Card, Skeleton, Badge } from '@/components/ui';
import type { ActivityLog } from '@/types';
import {
    FileText, Database, Eye, ClipboardList,
    Trash2, Edit, Plus, Building2
} from 'lucide-react';


const ACTION_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    data_entry_saved: { label: 'Data Entry', color: '#4CAF80', icon: Database },
    data_entry_updated: { label: 'Data Updated', color: '#F59E0B', icon: Edit },
    data_entry_deleted: { label: 'Data Deleted', color: '#EF4444', icon: Trash2 },
    document_uploaded: { label: 'Document Upload', color: '#4CAF80', icon: FileText },
    document_visibility_changed: { label: 'Visibility Changed', color: '#F59E0B', icon: Eye },
    document_deleted: { label: 'Document Deleted', color: '#EF4444', icon: Trash2 },
    report_status_changed: { label: 'Report Updated', color: '#2196F3', icon: ClipboardList },
    action_item_created: { label: 'Action Created', color: '#4CAF80', icon: Plus },
    action_item_updated: { label: 'Action Updated', color: '#F59E0B', icon: Edit },
    action_item_deleted: { label: 'Action Deleted', color: '#EF4444', icon: Trash2 },
    facility_created: { label: 'Facility Created', color: '#4CAF80', icon: Building2 },
    client_onboarded: { label: 'Client Onboarded', color: '#4CAF80', icon: Plus },
};

export default function AdminActivityLogPage() {
    const { clientId } = useParams();
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, [clientId]);

    const fetchLogs = async () => {
        try {
            const { data, error } = await supabase
                .from('activity_log')
                .select('*')
                .eq('client_id', clientId)
                .order('timestamp', { ascending: false })
                .limit(200);

            if (error) throw error;
            setLogs(keysToCamelCase(data) as ActivityLog[]);
        } catch {
            // Demo mode
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (ts: string) => {
        const d = new Date(ts);
        const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        return { time, date };
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-syne)]">
                    Activity Log
                </h1>
                <p className="text-gray-400 text-sm mt-1">All admin actions for this client</p>
            </div>

            <Card>
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12" />)}
                    </div>
                ) : logs.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-sm">No activity recorded yet</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {logs.map((log) => {
                            const config = ACTION_CONFIG[log.action] || { label: log.action, color: '#666', icon: Database };
                            const Icon = config.icon;
                            const { time, date } = formatTime(log.timestamp);
                            return (
                                <div
                                    key={log.id}
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#0d1a0d] transition-colors"
                                >
                                    <div
                                        className="p-2 rounded-lg mt-0.5 shrink-0"
                                        style={{ backgroundColor: `${config.color}15` }}
                                    >
                                        <Icon className="w-4 h-4" style={{ color: config.color }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <Badge variant={config.color === '#EF4444' ? 'danger' : config.color === '#F59E0B' ? 'warning' : 'success'}>
                                                {config.label}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-300 truncate">{log.details}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-xs text-gray-500">{date}</p>
                                        <p className="text-xs text-gray-600">{time}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>
        </div>
    );
}
