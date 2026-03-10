'use client';
// ============================================================
// GHG Shield — Client Profile Page (Read-Only)
// ============================================================
import { useAuth } from '@/hooks/useAuth';
import { useClient } from '@/hooks/useClient';
import { Card, Skeleton } from '@/components/ui';
import { Building2, User, Mail, Calendar, Shield, Headphones } from 'lucide-react';
import { ClientMessenger } from '@/components/client/ClientMessenger';

export default function ClientProfilePage() {
    const { user } = useAuth();
    const { client, isLoading } = useClient(user?.clientId);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Card><Skeleton className="h-6 w-48 mb-4" /><Skeleton className="h-4 w-64" /></Card>
                <Card><Skeleton className="h-32" /></Card>
            </div>
        );
    }

    const fields = [
        { icon: Building2, label: 'Company Name', value: client?.companyName || '—' },
        { icon: User, label: 'Industry', value: client?.industry || '—' },
        { icon: Calendar, label: 'Reporting Year', value: '2025' },
        { icon: Calendar, label: 'Contract Start Date', value: client?.contractStart ? new Date(client.contractStart).toLocaleDateString() : '—' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-syne)]">
                    Company Profile
                </h1>
                <p className="text-gray-400 text-sm mt-1">Your account details and consultant information</p>
            </div>

            {/* Company Details */}
            <Card>
                <h3 className="text-white font-semibold mb-6 font-[family-name:var(--font-syne)]">
                    Company Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {fields.map((field) => (
                        <div key={field.label} className="flex items-start gap-3">
                            <div className="p-2 bg-[#4CAF80]/10 rounded-lg mt-0.5">
                                <field.icon className="w-4 h-4 text-[#4CAF80]" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">{field.label}</p>
                                <p className="text-white font-medium mt-0.5">{field.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Consultant Information */}
            <Card>
                <h3 className="text-white font-semibold mb-6 font-[family-name:var(--font-syne)]">
                    Your GHG Consultant
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#4CAF80]/10 rounded-lg mt-0.5">
                            <User className="w-4 h-4 text-[#4CAF80]" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Consultant</p>
                            <p className="text-white font-medium mt-0.5">GHG Shield Team</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#4CAF80]/10 rounded-lg mt-0.5">
                            <Shield className="w-4 h-4 text-[#4CAF80]" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Certification</p>
                            <p className="text-white font-medium mt-0.5">TÜV SÜD ISO 14064 Certified</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#4CAF80]/10 rounded-lg mt-0.5">
                            <Mail className="w-4 h-4 text-[#4CAF80]" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Contact Email</p>
                            <p className="text-white font-medium mt-0.5">support@ghgshield.com</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#4CAF80]/10 rounded-lg mt-0.5">
                            <Headphones className="w-4 h-4 text-[#4CAF80]" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Support</p>
                            <p className="text-white font-medium mt-0.5">Reply to your welcome email for support</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Concierge Messenger */}
            <ClientMessenger
                clientId={user?.clientId}
                clientName={client?.contactName}
                clientEmail={client?.contactEmail}
            />
        </div>
    );
}
