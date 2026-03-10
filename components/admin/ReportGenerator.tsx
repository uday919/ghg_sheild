'use client';
// ============================================================
// GHG Shield — Report Generator (Admin)
// ============================================================
import { useState } from 'react';
import { Button, Card, Badge } from '@/components/ui';
import { Sparkles, FileText, Download, Loader2 } from 'lucide-react';
import type { Report } from '@/types';
import toast from 'react-hot-toast';

interface ReportGeneratorProps {
    clientId: string;
    reportingYear: number;
    report?: Report | null;
    onGenerateAI: () => Promise<void>;
    onGeneratePDF: () => Promise<void>;
}

export function ReportGenerator({
    clientId,
    reportingYear,
    report,
    onGenerateAI,
    onGeneratePDF,
}: ReportGeneratorProps) {
    const [aiLoading, setAiLoading] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);

    const handleAI = async () => {
        try {
            setAiLoading(true);
            await onGenerateAI();
            toast.success('AI report sections generated successfully');
        } catch (error) {
            toast.error('Failed to generate AI content');
            console.error(error);
        } finally {
            setAiLoading(false);
        }
    };

    const handlePDF = async () => {
        try {
            setPdfLoading(true);
            await onGeneratePDF();
            toast.success('PDF report generated successfully');
        } catch (error) {
            toast.error('Failed to generate PDF');
            console.error(error);
        } finally {
            setPdfLoading(false);
        }
    };

    const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'info' | 'default' }> = {
        draft: { label: 'Draft', variant: 'default' },
        ai_review: { label: 'AI Review', variant: 'info' },
        final: { label: 'Final', variant: 'success' },
        submitted: { label: 'Submitted', variant: 'success' },
    };

    const status = report ? statusConfig[report.status] || statusConfig.draft : null;

    return (
        <Card>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white font-[family-name:var(--font-syne)]">
                    Report Generation
                </h3>
                {status && <Badge variant={status.variant}>{status.label}</Badge>}
            </div>

            <div className="space-y-4">
                <div className="p-4 bg-[#0a0f0a] rounded-lg border border-[#1a5c3844]">
                    <p className="text-sm text-gray-400 mb-1">Reporting Year</p>
                    <p className="text-white font-[family-name:var(--font-dm-mono)]">{reportingYear}</p>
                </div>

                {report && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-[#0a0f0a] rounded-lg border border-[#1a5c3844]">
                            <p className="text-xs text-gray-400 mb-1">Scope 1</p>
                            <p className="text-lg font-bold text-white font-[family-name:var(--font-dm-mono)]">
                                {report.totalScope1?.toFixed(2) || '—'} <span className="text-xs text-gray-400">tCO₂e</span>
                            </p>
                        </div>
                        <div className="p-4 bg-[#0a0f0a] rounded-lg border border-[#1a5c3844]">
                            <p className="text-xs text-gray-400 mb-1">Scope 2</p>
                            <p className="text-lg font-bold text-white font-[family-name:var(--font-dm-mono)]">
                                {report.totalScope2Location?.toFixed(2) || '—'} <span className="text-xs text-gray-400">tCO₂e</span>
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        onClick={handleAI}
                        isLoading={aiLoading}
                        className="flex-1"
                    >
                        <Sparkles className="w-4 h-4" />
                        Generate AI Content
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={handlePDF}
                        isLoading={pdfLoading}
                        disabled={!report?.aiExecutiveSummary}
                        className="flex-1"
                    >
                        <FileText className="w-4 h-4" />
                        Generate PDF
                    </Button>

                    {report?.finalPdfUrl && (
                        <Button
                            variant="ghost"
                            onClick={() => window.open(report.finalPdfUrl!, '_blank')}
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </Button>
                    )}
                </div>

                {report?.aiExecutiveSummary && (
                    <div className="mt-4 p-4 bg-[#0a0f0a] rounded-lg border border-[#1a5c3844]">
                        <p className="text-xs text-[#4CAF80] mb-2 font-medium">AI Executive Summary Preview</p>
                        <p className="text-sm text-gray-300 line-clamp-4">
                            {report.aiExecutiveSummary}
                        </p>
                    </div>
                )}
            </div>
        </Card>
    );
}
