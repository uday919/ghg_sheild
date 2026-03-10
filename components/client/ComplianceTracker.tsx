'use client';
// ============================================================
// GHG Shield — Compliance Tracker (Client)
// ============================================================
import { Card, Badge } from '@/components/ui';
import { Shield, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import type { ComplianceStatus } from '@/types';

interface ComplianceTrackerProps {
    complianceStatus: ComplianceStatus;
    fiscalYearEnd?: string;
    reportingYear?: number;
}

const COMPLIANCE_STEPS = [
    { id: 'data', label: 'Data Collection', description: 'Gathering utility bills, fleet records, and facility data' },
    { id: 'calc', label: 'Emissions Calculation', description: 'Applying EPA and eGRID emission factors' },
    { id: 'review', label: 'AI Review & QA', description: 'Automated quality checks and narrative generation' },
    { id: 'report', label: 'Report Generation', description: 'ISO 14064 compliant report with all required disclosures' },
    { id: 'submit', label: 'Submission', description: 'Filed with California CARB under SB 253' },
];

function getCompletedSteps(status: ComplianceStatus): number {
    switch (status) {
        case 'submitted': return 5;
        case 'on_track': return 2;
        case 'at_risk': return 1;
        case 'overdue': return 0;
        default: return 0;
    }
}

export function ComplianceTracker({ complianceStatus, fiscalYearEnd, reportingYear }: ComplianceTrackerProps) {
    const completedSteps = getCompletedSteps(complianceStatus);

    const statusConfig: Record<ComplianceStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'info'; icon: React.ReactNode }> = {
        on_track: { label: 'On Track', variant: 'success', icon: <CheckCircle className="w-5 h-5" /> },
        at_risk: { label: 'At Risk', variant: 'warning', icon: <AlertTriangle className="w-5 h-5" /> },
        submitted: { label: 'Submitted', variant: 'info', icon: <Shield className="w-5 h-5" /> },
        overdue: { label: 'Overdue', variant: 'danger', icon: <Clock className="w-5 h-5" /> },
    };

    const config = statusConfig[complianceStatus];

    return (
        <Card>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#4CAF80]/10 rounded-lg text-[#4CAF80]">
                        <Shield className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold font-[family-name:var(--font-syne)]">
                            SB 253 Compliance Tracker
                        </h3>
                        <p className="text-xs text-gray-400">
                            California Climate Corporate Data Accountability Act
                        </p>
                    </div>
                </div>
                <Badge variant={config.variant} size="md">
                    {config.label}
                </Badge>
            </div>

            <div className="space-y-4">
                {COMPLIANCE_STEPS.map((step, idx) => {
                    const isComplete = idx < completedSteps;
                    const isCurrent = idx === completedSteps;

                    return (
                        <div
                            key={step.id}
                            className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${isCurrent ? 'bg-[#4CAF80]/5 border border-[#4CAF80]/20' : ''
                                }`}
                        >
                            <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isComplete
                                    ? 'bg-[#4CAF80] text-black'
                                    : isCurrent
                                        ? 'border-2 border-[#4CAF80] text-[#4CAF80]'
                                        : 'border border-gray-600 text-gray-600'
                                }`}>
                                {isComplete ? '✓' : idx + 1}
                            </div>
                            <div>
                                <p className={`text-sm font-medium ${isComplete ? 'text-[#4CAF80]' : isCurrent ? 'text-white' : 'text-gray-500'}`}>
                                    {step.label}
                                </p>
                                <p className="text-xs text-gray-500">{step.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 pt-4 border-t border-[#1a5c3844] flex items-center justify-between">
                <div className="text-xs text-gray-400">
                    <span className="text-[#4CAF80] font-medium">ISO 14064</span> Certified Process
                </div>
                <div className="text-xs text-gray-400">
                    Deadline: <span className="text-white font-[family-name:var(--font-dm-mono)]">Aug 10, {reportingYear || 2025}</span>
                </div>
            </div>
        </Card>
    );
}
