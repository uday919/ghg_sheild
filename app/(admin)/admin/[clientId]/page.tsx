'use client';
// ============================================================
// GHG Shield — Admin Client Detail Page
// ============================================================
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { keysToCamelCase } from '@/lib/utils';
import { Card, Badge, StatCard, Skeleton, Button } from '@/components/ui';
import { EmissionsChart } from '@/components/charts/EmissionsChart';
import {
    Building2, Users, Mail, Calendar, DollarSign, MapPin,
    FileText, Database, ClipboardList, ChevronRight, Power, PowerOff
} from 'lucide-react';
import type { Client, Facility } from '@/types';
import toast from 'react-hot-toast';
import AdminMessenger from '@/components/admin/AdminMessenger';

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' }> = {
    on_track: { label: 'On Track', variant: 'success' },
    at_risk: { label: 'At Risk', variant: 'warning' },
    submitted: { label: 'Submitted', variant: 'info' },
    overdue: { label: 'Overdue', variant: 'danger' },
};

// Demo data
const DEMO_CLIENT: Partial<Client> = {
    id: 'client-001',
    clientId: 'client-001',
    companyName: 'Pacific Manufacturing Co.',
    contactName: 'Sarah Chen',
    contactEmail: 'sarah@pacificmfg.com',
    industry: 'Manufacturing',
    annualRevenue: '$50M-$100M',
    facilityCount: 4,
    fiscalYearStart: '2025-01-01',
    fiscalYearEnd: '2025-12-31',
    complianceStatus: 'on_track',
    isActive: true,
    monthlyFee: 1999,
    setupFee: 4999,
};

const DEMO_CHART = [
    { category: 'Stationary', scope1: 85.42, scope2: 0 },
    { category: 'Mobile', scope1: 45.15, scope2: 0 },
    { category: 'Fugitive', scope1: 12.30, scope2: 0 },
    { category: 'Electricity', scope1: 0, scope2: 89.34 },
];

const ADMIN_LINKS = [
    { href: 'facilities', label: 'Facilities', icon: Building2, description: 'Manage facilities and eGRID subregions' },
    { href: 'data', label: 'Emission Data', icon: Database, description: 'Enter and manage emission data' },
    { href: 'reports', label: 'Reports', icon: FileText, description: 'Generate and manage reports' },
    { href: 'documents', label: 'Documents', icon: FileText, description: 'Upload and manage documents' },
    { href: 'actions', label: 'Action Items', icon: ClipboardList, description: 'Manage client tasks' },
];

export default function AdminClientDetailPage() {
    const { clientId } = useParams();
    const [client, setClient] = useState<Client | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchClient();
    }, [clientId]);

    const fetchClient = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .eq('id', clientId)
                .single();

            if (error) throw error;
            if (data) setClient(keysToCamelCase(data) as Client);
        } catch {
            setClient(DEMO_CLIENT as Client);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleActive = async () => {
        if (!client) return;

        const newStatus = !client.isActive;
        const confirmMsg = newStatus
            ? "Reactivate this client? They will reappear on your active dashboard."
            : "Deactivate this client? They will be moved to the Inactive Services tab.";

        if (!window.confirm(confirmMsg)) return;

        try {
            const { error } = await supabase
                .from('clients')
                .update({ is_active: newStatus })
                .eq('id', client.id);

            if (error) throw error;

            toast.success(newStatus ? 'Client reactivated' : 'Client deactivated');
            setClient({ ...client, isActive: newStatus });
        } catch (error: any) {
            toast.error(`Operation failed: ${error?.message || ''}`);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-64" />
                <div className="grid grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
                </div>
            </div>
        );
    }

    const c = client || DEMO_CLIENT as Client;
    const status = statusConfig[c.complianceStatus] || statusConfig.on_track;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-[#4CAF80]/10 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-[#4CAF80]" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-syne)]">
                                {c.companyName}
                            </h1>
                            <p className="text-gray-400 text-sm">{c.industry}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={handleToggleActive}
                        className={c.isActive ? "text-red-400 hover:bg-red-500/10" : "text-emerald-400 hover:bg-emerald-500/10"}
                    >
                        {c.isActive ? (
                            <><PowerOff className="w-4 h-4 mr-2" /> Deactivate</>
                        ) : (
                            <><Power className="w-4 h-4 mr-2" /> Reactivate</>
                        )}
                    </Button>
                    <Badge variant={status.variant} size="md">{status.label}</Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Left Content (Main) */}
                <div className="xl:col-span-3 space-y-8">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard title="Contact" value={c.contactName} icon={<Users className="w-5 h-5" />} />
                        <StatCard title="Facilities" value={c.facilityCount || 0} icon={<MapPin className="w-5 h-5" />} />
                        <StatCard title="Monthly Fee" value={`$${c.monthlyFee?.toLocaleString() || 0}`} icon={<DollarSign className="w-5 h-5" />} />
                        <StatCard title="Fiscal Year" value={c.fiscalYearStart?.substring(0, 4) || '2025'} icon={<Calendar className="w-5 h-5" />} />
                    </div>

                    {/* Client Info Card */}
                    <Card>
                        <h3 className="text-white font-semibold mb-4 font-[family-name:var(--font-syne)]">
                            Client Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Mail className="w-4 h-4" />
                                <span>{c.contactEmail}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <DollarSign className="w-4 h-4" />
                                <span>Revenue: {c.annualRevenue || 'Not specified'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <Calendar className="w-4 h-4" />
                                <span>FY: {c.fiscalYearStart} to {c.fiscalYearEnd}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <Building2 className="w-4 h-4" />
                                <span>{c.facilityCount} facilities under operational control</span>
                            </div>
                        </div>
                    </Card>

                    {/* Emissions Overview */}
                    <Card>
                        <h3 className="text-white font-semibold mb-4 font-[family-name:var(--font-syne)]">
                            Emissions Overview
                        </h3>
                        <EmissionsChart data={DEMO_CHART} height={300} />
                    </Card>

                    {/* Management Links */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {ADMIN_LINKS.map((link) => (
                            <Link key={link.href} href={`/admin/${clientId}/${link.href}`}>
                                <Card hover className="h-full">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-[#4CAF80]/10 rounded-lg">
                                                <link.icon className="w-5 h-5 text-[#4CAF80]" />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{link.label}</p>
                                                <p className="text-xs text-gray-400">{link.description}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-500" />
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right Sidebar (Messenger) */}
                <div className="xl:col-span-1">
                    <AdminMessenger clientId={clientId as string} />
                </div>
            </div>
        </div>
    );
}
