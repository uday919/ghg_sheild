'use client';
// ============================================================
// GHG Shield — Global Trash / Recovery Admin Board
// ============================================================
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { keysToCamelCase } from '@/lib/utils';
import { Card, Table, Badge, Skeleton, Button } from '@/components/ui';
import { ArrowLeft, RefreshCcw, Trash2, FileText, Database } from 'lucide-react';
import type { EmissionData, GHGDocument } from '@/types';
import toast from 'react-hot-toast';

interface TrashItem {
    id: string;
    type: 'emission_data' | 'document';
    client_name: string;
    facility_name?: string;
    deletedAt: string;

    // Emission specific
    scope?: string;
    fuelType?: string;

    // Document specific
    name?: string;
    docType?: string;
    fileId?: string;
}

export default function AdminTrashPage() {
    const router = useRouter();
    const [deletedItems, setDeletedItems] = useState<TrashItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDeleted();
    }, []);

    const fetchDeleted = async () => {
        setIsLoading(true);
        try {
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

            // Fetch soft-deleted emissions
            const { data: recordsData, error: recordsError } = await supabase
                .from('emission_data')
                .select(`
                    *,
                    clients ( company_name ),
                    facilities ( name )
                `)
                .not('deleted_at', 'is', null)
                .gte('deleted_at', sevenDaysAgo)
                .order('deleted_at', { ascending: false });

            if (recordsError) throw recordsError;

            // Fetch soft-deleted documents
            const { data: docsData, error: docsError } = await supabase
                .from('documents')
                .select(`
                    *,
                    clients ( company_name )
                `)
                .not('deleted_at', 'is', null)
                .gte('deleted_at', sevenDaysAgo)
                .order('deleted_at', { ascending: false });

            if (docsError) throw docsError;

            // Map joined data to flat properties
            const mappedRecords: TrashItem[] = (recordsData || []).map((row: any) => ({
                id: row.id,
                type: 'emission_data',
                client_name: row.clients?.company_name || 'Unknown Client',
                facility_name: row.facilities?.name || 'Unknown Facility',
                deletedAt: row.deleted_at,
                scope: row.scope,
                fuelType: row.fuel_type,
            }));

            const mappedDocs: TrashItem[] = (docsData || []).map((row: any) => ({
                id: row.id,
                type: 'document',
                client_name: row.clients?.company_name || 'Unknown Client',
                deletedAt: row.deleted_at,
                name: row.name,
                docType: row.doc_type,
                fileId: row.file_id,
            }));

            // Combine and sort by deletedAt DESC
            const combined = [...mappedRecords, ...mappedDocs].sort((a, b) =>
                new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime()
            );

            setDeletedItems(combined);
        } catch (error) {
            console.error('Failed to fetch deleted records:', error);
            toast.error('Failed to load trash bin');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestore = async (item: TrashItem) => {
        try {
            const { error: restoreError } = await supabase
                .from(item.type === 'emission_data' ? 'emission_data' : 'documents')
                .update({ deleted_at: null })
                .eq('id', item.id);

            if (restoreError) throw restoreError;

            toast.success(`${item.type === 'document' ? 'Document' : 'Record'} restored`);
            fetchDeleted();
        } catch (error: any) {
            toast.error(`Failed to restore ${item.type}: ${error?.message || ''}`);
        }
    };

    const handleHardDelete = async (item: TrashItem) => {
        if (!window.confirm("Are you sure you want to permanently delete this? This cannot be undone.")) return;

        try {
            // Delete file from storage if it's a document
            if (item.type === 'document' && item.fileId) {
                await supabase.storage.from('documents').remove([item.fileId]);
            }

            const { error: deleteError } = await supabase
                .from(item.type === 'emission_data' ? 'emission_data' : 'documents')
                .delete()
                .eq('id', item.id);

            if (deleteError) throw deleteError;

            toast.success(`${item.type === 'document' ? 'Document' : 'Record'} permanently deleted`);
            fetchDeleted();
        } catch (error: any) {
            toast.error(`Failed to permanently delete: ${error?.message || ''}`);
        }
    };

    const columns = [
        {
            key: 'type',
            header: 'Type',
            render: (item: Record<string, unknown>) => {
                const isDoc = (item as unknown as TrashItem).type === 'document';
                return (
                    <div className="flex items-center gap-2">
                        {isDoc ? <FileText className="w-4 h-4 text-[#4CAF80]" /> : <Database className="w-4 h-4 text-blue-400" />}
                        <span className="text-gray-300 text-sm hidden sm:inline">{isDoc ? 'Document' : 'Emission Data'}</span>
                    </div>
                );
            }
        },
        { key: 'client_name', header: 'Client', render: (item: Record<string, unknown>) => <span className="text-white font-medium">{item.client_name as string}</span> },
        {
            key: 'details',
            header: 'Item Details',
            render: (item: Record<string, unknown>) => {
                const t = item as unknown as TrashItem;
                if (t.type === 'document') {
                    return (
                        <div className="flex flex-col">
                            <span className="text-gray-300 text-sm">{t.name}</span>
                            <span className="text-gray-500 text-xs">{t.docType}</span>
                        </div>
                    );
                } else {
                    return (
                        <div className="flex items-center gap-2">
                            <Badge variant={t.scope === '1' ? 'success' : t.scope === '2' ? 'info' : 'default'} size="sm">Scope {t.scope}</Badge>
                            <span className="text-gray-400 text-sm">{t.fuelType}</span>
                        </div>
                    );
                }
            }
        },
        { key: 'deletedAt', header: 'Deleted At', render: (item: Record<string, unknown>) => <span className="text-xs text-gray-400">{new Date(item.deletedAt as string).toLocaleString()}</span> },
        {
            key: 'actions', header: '', render: (item: Record<string, unknown>) => {
                const e = item as unknown as TrashItem;
                return (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleRestore(e)}
                            className="px-2 py-1 text-xs bg-[#4CAF80]/10 text-[#4CAF80] hover:bg-[#4CAF80] hover:text-black rounded transition-colors"
                        >
                            Restore
                        </button>
                        <button
                            onClick={() => handleHardDelete(e)}
                            className="p-1.5 text-gray-400 hover:text-red-400 transition-colors rounded hover:bg-red-500/10"
                            title="Permanently Delete"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                );
            }
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <button
                            onClick={() => router.push('/admin')}
                            className="p-1.5 rounded-md hover:bg-[#1a5c3844] text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-syne)] flex items-center gap-2">
                            <Trash2 className="w-6 h-6 text-red-400" />
                            Global Trash Bin
                        </h1>
                    </div>
                    <p className="text-gray-400 text-sm ml-9">
                        Recover soft-deleted emission records across all clients (7-day retention)
                    </p>
                </div>
                <Button variant="secondary" onClick={fetchDeleted}>
                    <RefreshCcw className="w-4 h-4" />
                    Refresh
                </Button>
            </div>

            <Card>
                {isLoading ? (
                    <Skeleton className="h-48" />
                ) : (
                    <Table
                        columns={columns}
                        data={deletedItems as unknown as Record<string, unknown>[]}
                        emptyMessage="No deleted items found in the last 7 days."
                    />
                )}
            </Card>
        </div>
    );
}
