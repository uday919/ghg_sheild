'use client';
// ============================================================
// GHG Shield — Client Reports Page
// ============================================================
import { useAuth } from '@/hooks/useAuth';
import { useEmissions } from '@/hooks/useEmissions';
import { ReportCard } from '@/components/client/ReportCard';
import { Card, Skeleton } from '@/components/ui';
import { FileText } from 'lucide-react';
import type { Report } from '@/types';

// Demo reports
const DEMO_REPORTS: Partial<Report>[] = [
    {
        $id: '1',
        reportId: 'RPT-2025-001',
        clientId: 'demo',
        reportingYear: 2025,
        reportName: 'FY2025 GHG Emissions Report',
        status: 'final',
        totalScope1: 142.87,
        totalScope2Location: 89.34,
        totalScope3: 23.10,
        verificationStatus: 'complete',
        createdAt: '2025-06-15T00:00:00Z',
    },
    {
        $id: '2',
        reportId: 'RPT-2024-001',
        clientId: 'demo',
        reportingYear: 2024,
        reportName: 'FY2024 GHG Emissions Report',
        status: 'submitted',
        totalScope1: 156.22,
        totalScope2Location: 95.41,
        totalScope3: 16.48,
        verificationStatus: 'complete',
        createdAt: '2024-07-01T00:00:00Z',
    },
];

export default function ClientReportsPage() {
    const { user } = useAuth();
    const { reports, isLoading } = useEmissions(user?.clientId);

    const displayReports = reports.length > 0 ? reports : DEMO_REPORTS as Report[];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-syne)]">
                    Reports
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                    Your GHG emissions reports and downloads
                </p>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                        <Card key={i}>
                            <Skeleton className="h-6 w-48 mb-3" />
                            <Skeleton className="h-4 w-32" />
                        </Card>
                    ))}
                </div>
            ) : displayReports.length === 0 ? (
                <Card>
                    <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-white font-medium mb-2">Your GHG Report is Being Prepared</h3>
                        <p className="text-gray-400 text-sm max-w-sm mx-auto">
                            Your GHG report is being prepared. We&apos;ll notify you when it&apos;s ready to download.
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayReports.map((report) => (
                        <ReportCard key={report.id} report={report} />
                    ))}
                </div>
            )}
        </div>
    );
}
