'use client';
// ============================================================
// GHG Shield — Report Card (Client)
// ============================================================
import { Card, Badge, Button } from '@/components/ui';
import { FileText, Download, Eye } from 'lucide-react';
import type { Report } from '@/types';

interface ReportCardProps {
    report: Report;
}

const statusVariants: Record<string, { label: string; variant: 'success' | 'warning' | 'info' | 'default' }> = {
    draft: { label: 'Being Prepared', variant: 'warning' },
    in_review: { label: 'Being Prepared', variant: 'warning' },
    approved: { label: 'Being Prepared', variant: 'warning' },
    final: { label: 'Ready to Download', variant: 'success' },
    submitted: { label: 'Submitted to CARB', variant: 'success' },
};

export function ReportCard({ report }: ReportCardProps) {
    const status = statusVariants[report.status] || statusVariants.draft;
    const totalEmissions = (report.totalScope1 || 0) + (report.totalScope2Location || 0) + (report.totalScope3 || 0);

    return (
        <Card hover>
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#4CAF80]/10 rounded-lg">
                        <FileText className="w-5 h-5 text-[#4CAF80]" />
                    </div>
                    <div>
                        <h4 className="text-white font-medium">
                            {report.reportName || `GHG Report ${report.reportingYear}`}
                        </h4>
                        <p className="text-xs text-gray-400">FY {report.reportingYear}</p>
                    </div>
                </div>
                <Badge variant={status.variant}>{status.label}</Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                    <p className="text-xs text-gray-400">Scope 1</p>
                    <p className="text-sm font-mono text-white">{report.totalScope1?.toFixed(2) || '—'}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400">Scope 2</p>
                    <p className="text-sm font-mono text-white">{report.totalScope2Location?.toFixed(2) || '—'}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="text-sm font-mono text-[#4CAF80]">{totalEmissions.toFixed(2)} tCO₂e</p>
                </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-[#1a5c3844]">
                {report.status === 'final' && report.finalPdfUrl ? (
                    <>
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => window.open(report.finalPdfUrl!, '_blank')}
                        >
                            <Download className="w-3 h-3" />
                            Download PDF
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(report.finalPdfUrl!, '_blank')}
                        >
                            <Eye className="w-3 h-3" />
                            Preview
                        </Button>
                    </>
                ) : (
                    <p className="text-xs text-gray-500 italic">
                        {report.status === 'submitted' ? 'Report has been submitted to CARB' : 'Report is being prepared by your consultant'}
                    </p>
                )}
            </div>
        </Card>
    );
}
