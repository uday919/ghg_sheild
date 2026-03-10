'use client';
// ============================================================
// GHG Shield — Admin Reports Page
// ============================================================
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { keysToCamelCase } from '@/lib/utils';
import { ReportGenerator } from '@/components/admin/ReportGenerator';
import { Card, Table, Badge, Skeleton, Button } from '@/components/ui';
import type { Report } from '@/types';
import toast from 'react-hot-toast';
import { logActivity } from '@/lib/activityLog';

export default function AdminReportsPage() {
    const { clientId } = useParams();
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentReport, setCurrentReport] = useState<Report | null>(null);

    useEffect(() => {
        fetchReports();
    }, [clientId]);

    const fetchReports = async () => {
        try {
            const { data, error } = await supabase
                .from('reports')
                .select('*')
                .eq('client_id', clientId)
                .order('created_at', { ascending: false })
                .limit(5000);

            if (error) throw error;

            const reps = keysToCamelCase(data) as Report[];
            setReports(reps);
            if (reps.length > 0) setCurrentReport(reps[0]);
        } catch {
            // Demo mode
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateReport = async () => {
        try {
            const { error } = await supabase
                .from('reports')
                .insert([{
                    client_id: clientId as string,
                    reporting_year: new Date().getFullYear(),
                    report_name: `FY${new Date().getFullYear()} GHG Emissions Report`,
                    status: 'draft',
                    verification_status: 'not_started',
                }]);

            if (error) throw error;

            toast.success('Report created');
            logActivity(clientId as string, 'report_status_changed', `Created new report: FY${new Date().getFullYear()} GHG Emissions Report — status: draft`);
            fetchReports();
        } catch (error) {
            toast.error('Failed to create report');
            console.error(error);
        }
    };

    const handleStatusChange = async (report: Report, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('reports')
                .update({ status: newStatus })
                .eq('id', report.id);

            if (error) throw error;

            toast.success(`Status → ${newStatus.replace('_', ' ')}`);
            logActivity(clientId as string, 'report_status_changed', `"${report.reportName}" status: ${report.status} → ${newStatus}`);
            fetchReports();
        } catch (error) {
            toast.error('Failed to update status');
            console.error(error);
        }
    };

    const handleGenerateAI = async () => {
        if (!currentReport) return;
        try {
            const res = await fetch('/api/ai/generate-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reportId: currentReport.id,
                    clientId: clientId,
                }),
            });
            if (!res.ok) throw new Error('AI generation failed');
            toast.success('AI content generated');
            fetchReports();
        } catch (error) {
            throw error;
        }
    };

    const handleGeneratePDF = async () => {
        if (!currentReport) return;
        try {
            const res = await fetch('/api/pdf/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reportId: currentReport.id,
                    clientId: clientId,
                }),
            });
            if (!res.ok) throw new Error('PDF generation failed');
            toast.success('PDF generated');
            fetchReports();
        } catch (error) {
            throw error;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-syne)]">
                        Reports
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Generate and manage GHG reports
                    </p>
                </div>
                <Button onClick={handleCreateReport}>
                    Create New Report
                </Button>
            </div>

            <ReportGenerator
                clientId={clientId as string}
                reportingYear={new Date().getFullYear()}
                report={currentReport}
                onGenerateAI={handleGenerateAI}
                onGeneratePDF={handleGeneratePDF}
            />

            {reports.length > 0 && (
                <Card>
                    <h3 className="text-white font-semibold mb-4 font-[family-name:var(--font-syne)]">
                        Report History
                    </h3>
                    <Table
                        columns={[
                            { key: 'reportName', header: 'Report' },
                            { key: 'reportingYear', header: 'Year' },
                            {
                                key: 'status', header: 'Status', render: (item) => {
                                    const r = item as unknown as Report;
                                    const v: Record<string, 'success' | 'warning' | 'info' | 'default'> = {
                                        draft: 'default', in_review: 'warning', approved: 'info', final: 'success', submitted: 'success'
                                    };
                                    return <Badge variant={v[r.status] || 'default'}>{r.status.replace('_', ' ')}</Badge>;
                                }
                            },
                            {
                                key: 'pipeline', header: 'Advance', render: (item) => {
                                    const r = item as unknown as Report;
                                    const next: Record<string, string> = {
                                        draft: 'in_review', in_review: 'approved', approved: 'final', final: 'submitted'
                                    };
                                    const ns = next[r.status];
                                    return ns ? (
                                        <button
                                            onClick={() => handleStatusChange(r, ns)}
                                            className="text-xs px-2 py-1 bg-[#4CAF80]/10 text-[#4CAF80] rounded hover:bg-[#4CAF80]/20 transition-colors"
                                        >
                                            → {ns.replace('_', ' ')}
                                        </button>
                                    ) : <span className="text-xs text-gray-500">Complete</span>;
                                }
                            },
                            {
                                key: 'createdAt', header: 'Created', render: (item) => {
                                    const r = item as unknown as Report;
                                    return new Date(r.createdAt || new Date()).toLocaleDateString();
                                }
                            },
                        ]}
                        data={reports as unknown as Record<string, unknown>[]}
                    />
                </Card>
            )}
        </div>
    );
}
