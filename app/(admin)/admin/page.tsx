'use client';
// ============================================================
// GHG Shield — Admin Dashboard (All Clients Overview)
// ============================================================
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { keysToCamelCase } from '@/lib/utils';
import { ClientCard } from '@/components/admin/ClientCard';
import { ClientOnboardForm } from '@/components/admin/ClientOnboardForm';
import { Button, Card, StatCard, Skeleton } from '@/components/ui';
import { Plus, Users, TrendingUp, AlertTriangle, DollarSign, Search, Trash2 } from 'lucide-react';
import type { Client } from '@/types';
import toast from 'react-hot-toast';

// Demo clients for realistic UI
const DEMO_CLIENTS: Partial<Client>[] = [
    {
        id: 'client-001',
        clientId: 'client-001',
        companyName: 'Pacific Manufacturing Co.',
        contactName: 'Sarah Chen',
        contactEmail: 'sarah@pacificmfg.com',
        industry: 'Manufacturing',
        facilityCount: 4,
        complianceStatus: 'on_track',
        isActive: true,
        monthlyFee: 1999,
        setupFee: 4999,
    },
    {
        id: 'client-002',
        clientId: 'client-002',
        companyName: 'Westcoast Logistics Inc.',
        contactName: 'Mike Rodriguez',
        contactEmail: 'mike@westcoastlog.com',
        industry: 'Transportation',
        facilityCount: 7,
        complianceStatus: 'at_risk',
        isActive: true,
        monthlyFee: 3999,
        setupFee: 9999,
    },
    {
        id: 'client-003',
        clientId: 'client-003',
        companyName: 'Golden State Foods LLC',
        contactName: 'Lisa Park',
        contactEmail: 'lisa@goldenstatefoods.com',
        industry: 'Food & Beverage',
        facilityCount: 3,
        complianceStatus: 'submitted',
        isActive: true,
        monthlyFee: 1999,
        setupFee: 4999,
    },
    {
        id: 'client-004',
        clientId: 'client-004',
        companyName: 'Bay Area Tech Solutions',
        contactName: 'David Kim',
        contactEmail: 'david@bayareatech.com',
        industry: 'Technology',
        facilityCount: 2,
        complianceStatus: 'on_track',
        isActive: true,
        monthlyFee: 1999,
        setupFee: 4999,
    },
];

export default function AdminDashboard() {
    const router = useRouter();
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showOnboard, setShowOnboard] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .limit(5000);

            if (error) throw error;
            if (data) setClients(keysToCamelCase(data) as Client[]);
        } catch {
            // Use demo data if Supabase is not configured
            setClients(DEMO_CLIENTS as Client[]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOnboard = async (data: Record<string, unknown>) => {
        try {
            const res = await fetch('/api/admin/create-client', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!res.ok) {
                const err = new Error(result.error || 'Failed to create client') as any;
                err.clerkDetail = result.clerkDetail;
                throw err;
            }

            toast.success(result.message || 'Client created successfully');
            if (result.tempPassword) {
                console.log('Temporary Password (email failed):', result.tempPassword);
            }
            fetchClients();
        } catch (error) {
            console.error('Error onboarding client:', error);
            throw error;
        }
    };

    const handleSeed = async () => {
        try {
            toast.loading('Seeding database...', { id: 'seed' });
            const res = await fetch('/api/seed', { method: 'POST' });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error);
            toast.success(`Seeded ${result.details?.length || 0} items!`, { id: 'seed' });
            fetchClients();
        } catch (error) {
            toast.error('Seed failed — check console', { id: 'seed' });
            console.error(error);
        }
    };

    const displayClients = clients.length > 0 ? clients : DEMO_CLIENTS as Client[];

    // Filter by tab
    const tabClients = displayClients.filter(c => activeTab === 'active' ? c.isActive : !c.isActive);

    const filteredClients = searchQuery
        ? tabClients.filter((c) =>
            c.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.contactName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.industry?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : tabClients;

    const activeClients = displayClients.filter((c) => c.isActive);
    const atRiskClients = activeClients.filter((c) => c.complianceStatus === 'at_risk' || c.complianceStatus === 'overdue');
    const totalMRR = activeClients.reduce((sum, c) => sum + (c.monthlyFee || 0), 0);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-syne)]">
                        Client Overview
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Manage all GHG compliance clients
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="ghost" onClick={() => router.push('/admin/trash')}>
                        <Trash2 className="w-4 h-4 text-gray-400" />
                        <span className="hidden sm:inline">Trash</span>
                    </Button>
                    <Button variant="secondary" onClick={handleSeed}>
                        Seed Database
                    </Button>
                    <Button onClick={() => setShowOnboard(true)}>
                        <Plus className="w-4 h-4" />
                        Onboard Client
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Active Clients"
                    value={activeClients.length}
                    icon={<Users className="w-5 h-5" />}
                />
                <StatCard
                    title="Total Facilities"
                    value={displayClients.reduce((sum, c) => sum + (c.facilityCount || 0), 0)}
                    icon={<TrendingUp className="w-5 h-5" />}
                />
                <StatCard
                    title="At Risk"
                    value={atRiskClients.length}
                    icon={<AlertTriangle className="w-5 h-5" />}
                />
                <StatCard
                    title="Monthly Revenue"
                    value={`$${totalMRR.toLocaleString()}`}
                    icon={<DollarSign className="w-5 h-5" />}
                />
            </div>

            {/* Search Bar & Tabs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-2">
                <div className="flex bg-[#1a2e1a] p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'active' ? 'bg-[#4CAF80] text-black' : 'text-gray-400 hover:text-white'}`}
                    >
                        Active Services
                    </button>
                    <button
                        onClick={() => setActiveTab('inactive')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'inactive' ? 'bg-[#4CAF80] text-black' : 'text-gray-400 hover:text-white'}`}
                    >
                        Inactive Services
                    </button>
                </div>
                <div className="relative flex-1">
                    <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search clients by name, contact, or industry..."
                        className="w-full h-full min-h-[40px] bg-[#0d1a0d] border border-[#1a5c3844] rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#4CAF80] transition-colors placeholder:text-gray-600"
                    />
                </div>
            </div>

            {/* Client Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <Skeleton className="h-6 w-48 mb-4" />
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-4 w-24" />
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredClients.map((client) => (
                        <ClientCard
                            key={client.id}
                            client={client}
                            onClick={() => router.push(`/admin/${client.id}`)}
                        />
                    ))}
                    {filteredClients.length === 0 && (
                        <div className="col-span-3 text-center py-8">
                            <p className="text-gray-500 text-sm">No clients match "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            )}

            <ClientOnboardForm
                isOpen={showOnboard}
                onClose={() => setShowOnboard(false)}
                onSubmit={handleOnboard}
            />
        </div>
    );
}
