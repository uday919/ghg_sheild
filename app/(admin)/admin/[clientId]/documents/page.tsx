'use client';
// ============================================================
// GHG Shield — Admin Documents Page
// ============================================================
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { keysToCamelCase } from '@/lib/utils';
import { Card, Button, Badge, Table, Skeleton, Select, Input } from '@/components/ui';
import { Upload, FileText, Trash2, Eye, EyeOff } from 'lucide-react';
import type { GHGDocument } from '@/types';
import toast from 'react-hot-toast';
import { logActivity } from '@/lib/activityLog';


const DOC_TYPES = ['Report', 'Verification', 'Methodology', 'Invoice', 'Data Summary', 'Other'];

export default function AdminDocumentsPage() {
    const { clientId } = useParams();
    const [documents, setDocuments] = useState<GHGDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showMetaForm, setShowMetaForm] = useState(false);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [docName, setDocName] = useState('');
    const [docType, setDocType] = useState('Report');
    const [visibleToClient, setVisibleToClient] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchDocuments();
    }, [clientId]);

    const fetchDocuments = async () => {
        try {
            const { data, error } = await supabase
                .from('documents')
                .select('*')
                .eq('client_id', clientId)
                .is('deleted_at', null)
                .order('upload_date', { ascending: false })
                .limit(5000);

            if (error) throw error;
            setDocuments(keysToCamelCase(data) as GHGDocument[]);
        } catch {
            // Demo mode
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setPendingFile(file);
        setDocName(file.name.replace(/\.[^.]+$/, ''));
        setDocType('Report');
        setVisibleToClient(true);
        setShowMetaForm(true);
    };

    const handleUploadConfirm = async () => {
        if (!pendingFile) return;

        try {
            setUploading(true);

            // 1. Upload to Supabase Storage
            const fileExt = pendingFile.name.split('.').pop();
            const fileName = `${clientId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { error: uploadError, data: uploadData } = await supabase.storage
                .from('documents')
                .upload(fileName, pendingFile);

            if (uploadError) throw uploadError;

            // Get public URL (or path for signed URLs later)
            const { data: urlData } = supabase.storage
                .from('documents')
                .getPublicUrl(fileName);

            // 2. Save metadata to Database
            const { error: dbError } = await supabase
                .from('documents')
                .insert([{
                    client_id: clientId as string,
                    name: docName || pendingFile.name,
                    doc_type: docType,
                    file_id: uploadData.path,
                    file_url: urlData.publicUrl,
                    upload_date: new Date().toISOString(),
                    visible_to_client: visibleToClient,
                    uploaded_by: 'admin',
                }]);

            if (dbError) throw dbError;

            toast.success('Document uploaded');
            logActivity(clientId as string, 'document_uploaded', `Uploaded "${docName || pendingFile.name}" (${docType})`);

            // Notification trigger: Only if visible
            if (visibleToClient) {
                try {
                    const { data: clientDoc } = await supabase
                        .from('clients')
                        .select('contact_name, contact_email')
                        .eq('id', clientId)
                        .single();

                    if (clientDoc) {
                        const loginUrl = `${window.location.origin}/documents`;
                        await fetch('/api/email/send', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                type: 'document_available',
                                to: clientDoc.contact_email,
                                name: clientDoc.contact_name,
                                docName: docName || pendingFile.name,
                                loginUrl,
                            }),
                        });
                    }
                } catch {
                    console.error('Failed to send upload notification');
                }
            }

            setShowMetaForm(false);
            setPendingFile(null);
            fetchDocuments();
        } catch (error) {
            toast.error('Upload failed');
            console.error(error);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleToggleVisibility = async (doc: GHGDocument) => {
        const wasHidden = !doc.visibleToClient;
        try {
            const { error } = await supabase
                .from('documents')
                .update({ visible_to_client: !doc.visibleToClient })
                .eq('id', doc.id);

            if (error) throw error;
            toast.success(doc.visibleToClient ? 'Hidden from client' : 'Visible to client');
            logActivity(clientId as string, 'document_visibility_changed', `"${doc.name}" → ${wasHidden ? 'visible' : 'hidden'}`);

            // Notification trigger: only when changing from hidden to visible
            if (wasHidden) {
                try {
                    // Fetch client info for email
                    const { data: clientDoc } = await supabase
                        .from('clients')
                        .select('contact_name, contact_email')
                        .eq('id', clientId)
                        .single();

                    if (clientDoc) {
                        const loginUrl = `${window.location.origin}/documents`;
                        await fetch('/api/email/send', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                type: 'document_available',
                                to: clientDoc.contact_email,
                                name: clientDoc.contact_name,
                                docName: doc.name,
                                loginUrl,
                            }),
                        });
                    }
                } catch {
                    // Non-blocking — don't fail the toggle even if email fails
                    console.error('Failed to send notification email');
                }
            }

            fetchDocuments();
        } catch (error) {
            toast.error('Failed to update visibility');
            console.error(error);
        }
    };

    const handleDelete = async (doc: GHGDocument) => {
        try {
            const { error } = await supabase
                .from('documents')
                .update({ deleted_at: new Date().toISOString() })
                .eq('id', doc.id);

            if (error) throw error;
            toast.success('Document moved to trash');
            logActivity(clientId as string, 'document_deleted', `Deleted "${doc.name}"`);
            fetchDocuments();
        } catch (error) {
            toast.error('Delete failed');
            console.error(error);
        }
    };

    const columns = [
        {
            key: 'name', header: 'Document', render: (item: Record<string, unknown>) => (
                <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#4CAF80]" />
                    <span className="text-white">{item.name as string}</span>
                </div>
            )
        },
        { key: 'docType', header: 'Type', render: (item: Record<string, unknown>) => <Badge>{item.docType as string}</Badge> },
        { key: 'uploadDate', header: 'Uploaded', render: (item: Record<string, unknown>) => item.uploadDate ? new Date(item.uploadDate as string).toLocaleDateString() : '—' },
        {
            key: 'visibleToClient', header: 'Client Visible', render: (item: Record<string, unknown>) => (
                <button
                    onClick={() => handleToggleVisibility(item as unknown as GHGDocument)}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors ${(item.visibleToClient as boolean)
                        ? 'bg-[#4CAF80]/10 text-[#4CAF80] hover:bg-[#4CAF80]/20'
                        : 'bg-gray-700/30 text-gray-400 hover:bg-gray-700/50'
                        }`}
                >
                    {(item.visibleToClient as boolean) ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {(item.visibleToClient as boolean) ? 'Visible' : 'Hidden'}
                </button>
            )
        },
        {
            key: 'actions', header: '', render: (item: Record<string, unknown>) => (
                <button onClick={() => handleDelete(item as unknown as GHGDocument)} className="p-1 text-gray-400 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                </button>
            )
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-syne)]">
                        Documents
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Manage client documents</p>
                </div>
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFileSelect}
                        accept=".pdf,.png,.jpg,.jpeg,.xlsx,.docx"
                    />
                    <Button onClick={() => fileInputRef.current?.click()}>
                        <Upload className="w-4 h-4" />
                        Upload Document
                    </Button>
                </div>
            </div>

            {/* Metadata Form — appears after file is selected */}
            {showMetaForm && (
                <Card>
                    <h3 className="text-white font-semibold mb-4 font-[family-name:var(--font-syne)]">
                        Document Details
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                        File: <span className="text-[#4CAF80] font-mono">{pendingFile?.name}</span>
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <Input
                            label="Document Name"
                            value={docName}
                            onChange={(e) => setDocName(e.target.value)}
                            placeholder="e.g. FY2025 GHG Report"
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Document Type</label>
                            <select
                                value={docType}
                                onChange={(e) => setDocType(e.target.value)}
                                className="w-full bg-[#0d1a0d] border border-[#1a5c3844] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#4CAF80] transition-colors"
                            >
                                {DOC_TYPES.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-3 px-3 py-2.5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={visibleToClient}
                                    onChange={(e) => setVisibleToClient(e.target.checked)}
                                    className="rounded border-gray-600 w-4 h-4"
                                />
                                <span className="text-sm text-gray-300">Visible to Client</span>
                            </label>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => { setShowMetaForm(false); setPendingFile(null); }}>
                            Cancel
                        </Button>
                        <Button onClick={handleUploadConfirm} isLoading={uploading}>
                            <Upload className="w-4 h-4" />
                            Upload & Save
                        </Button>
                    </div>
                </Card>
            )}

            <Card>
                {isLoading ? (
                    <Skeleton className="h-48" />
                ) : (
                    <Table columns={columns} data={documents as unknown as Record<string, unknown>[]} emptyMessage="No documents uploaded yet" />
                )}
            </Card>
        </div>
    );
}
