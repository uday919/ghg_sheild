'use client';
// ============================================================
// GHG Shield — Client Documents Page (Two-Tab Layout)
// ============================================================
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useClient } from '@/hooks/useClient';
import { Card, Badge, Skeleton } from '@/components/ui';
import { FileText, Download, Eye, FolderOpen, FileCheck } from 'lucide-react';
import type { GHGDocument } from '@/types';
// No longer using Appwrite config

// Demo documents
const DEMO_DOCS: Partial<GHGDocument>[] = [
    {
        id: '1', docId: 'DOC-001', clientId: 'demo',
        name: 'FY2025 GHG Report - Final.pdf', docType: 'Report',
        uploadDate: '2025-06-15T00:00:00Z', visibleToClient: true,
        uploadedBy: 'admin', fileId: 'demo-1',
    },
    {
        id: '2', docId: 'DOC-002', clientId: 'demo',
        name: 'ISO 14064 Methodology Statement.pdf', docType: 'Methodology',
        uploadDate: '2025-05-20T00:00:00Z', visibleToClient: true,
        uploadedBy: 'admin', fileId: 'demo-2',
    },
    {
        id: '3', docId: 'DOC-003', clientId: 'demo',
        name: 'Verification Statement - Third Party.pdf', docType: 'Verification',
        uploadDate: '2025-06-10T00:00:00Z', visibleToClient: true,
        uploadedBy: 'admin', fileId: 'demo-3',
    },
    {
        id: '4', docId: 'DOC-004', clientId: 'demo',
        name: 'Invoice - Jun 2025.pdf', docType: 'Invoice',
        uploadDate: '2025-06-01T00:00:00Z', visibleToClient: true,
        uploadedBy: 'admin', fileId: 'demo-4',
    },
];

const docTypeVariant: Record<string, 'success' | 'info' | 'warning' | 'default'> = {
    Report: 'success',
    Verification: 'info',
    Methodology: 'warning',
    Invoice: 'default',
    'Data Summary': 'default',
    Data: 'default',
    Other: 'default',
};

type DocTab = 'reports' | 'all';

// Superseded by Supabase fileUrl properties

export default function ClientDocumentsPage() {
    const { user } = useAuth();
    const { documents, isLoading } = useClient(user?.clientId);
    const [activeTab, setActiveTab] = useState<DocTab>('reports');

    const displayDocs = documents.length > 0 ? documents : DEMO_DOCS as GHGDocument[];

    // Tab filtering
    const filteredDocs = activeTab === 'reports'
        ? displayDocs.filter((d) => d.docType === 'Report' || d.docType === 'Verification')
        : displayDocs;

    const reportCount = displayDocs.filter((d) => d.docType === 'Report' || d.docType === 'Verification').length;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-syne)]">
                    Document Vault
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                    All your compliance documents in one place
                </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2 border-b border-[#1a5c3844] pb-0">
                <button
                    onClick={() => setActiveTab('reports')}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'reports'
                        ? 'text-[#4CAF80] border-[#4CAF80]'
                        : 'text-gray-400 border-transparent hover:text-white'
                        }`}
                >
                    <FileCheck className="w-4 h-4" />
                    Reports ({reportCount})
                </button>
                <button
                    onClick={() => setActiveTab('all')}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'all'
                        ? 'text-[#4CAF80] border-[#4CAF80]'
                        : 'text-gray-400 border-transparent hover:text-white'
                        }`}
                >
                    <FolderOpen className="w-4 h-4" />
                    All Documents ({displayDocs.length})
                </button>
            </div>

            {isLoading ? (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <Skeleton className="h-5 w-64 mb-2" />
                            <Skeleton className="h-4 w-32" />
                        </Card>
                    ))}
                </div>
            ) : filteredDocs.length === 0 ? (
                <Card>
                    <div className="text-center py-12">
                        <FolderOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-white font-medium mb-2">No Documents Yet</h3>
                        <p className="text-gray-400 text-sm max-w-sm mx-auto">
                            Your documents will appear here once your consultant uploads them.
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filteredDocs.map((doc) => (
                        <Card key={doc.id} hover>
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="p-2 bg-[#4CAF80]/10 rounded-lg shrink-0">
                                        <FileText className="w-5 h-5 text-[#4CAF80]" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-white text-sm font-medium truncate">{doc.name}</p>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            <Badge variant={docTypeVariant[doc.docType || 'Data'] || 'default'} size="sm">
                                                {doc.docType}
                                            </Badge>
                                            <span className="text-xs text-gray-500">
                                                {doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString() : ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    {doc.fileUrl && (
                                        <button
                                            onClick={() => window.open(doc.fileUrl!, '_blank')}
                                            className="p-2 text-gray-400 hover:text-[#4CAF80] hover:bg-[#4CAF80]/10 rounded-lg transition-colors"
                                            title="View/Download"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
