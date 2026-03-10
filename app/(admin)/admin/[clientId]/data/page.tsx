'use client';
// ============================================================
// GHG Shield — Admin Emission Data Entry Page
// ============================================================
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { keysToCamelCase } from '@/lib/utils';
import { EmissionDataForm } from '@/components/admin/EmissionDataForm';
import { SupplierUpload } from '@/components/admin/SupplierUpload';
import { Card, Table, Badge, Skeleton, Button } from '@/components/ui';
import { calculateEmissions } from '@/lib/calculations';
import type { Facility, EmissionData } from '@/types';
import toast from 'react-hot-toast';
import { logActivity } from '@/lib/activityLog';
import { Edit, Trash2, X } from 'lucide-react';


const DEMO_FACILITIES: Partial<Facility>[] = [
    { id: 'fac-1', facilityId: 'fac-1', clientId: 'demo', name: 'HQ — San Jose, CA', egridSubregion: 'CAMX' as const, facilityType: 'Office' as const, inBoundary: true },
    { id: 'fac-2', facilityId: 'fac-2', clientId: 'demo', name: 'Plant — Sacramento, CA', egridSubregion: 'CAMX' as const, facilityType: 'Plant' as const, inBoundary: true },
];

const DEMO_DATA: Partial<EmissionData>[] = [
    { id: '1', dataId: 'ED-001', facilityId: 'fac-1', reportingYear: 2025, scope: '1' as const, category: 'Stationary Combustion', fuelType: 'Natural Gas', activityData: 25000, activityUnit: 'therms', tCO2e: 1.327, verified: true },
    { id: '2', dataId: 'ED-002', facilityId: 'fac-2', reportingYear: 2025, scope: '1' as const, category: 'Mobile Combustion', fuelType: 'Diesel', activityData: 3500, activityUnit: 'gallons', tCO2e: 35.735, verified: false },
];

export default function AdminEmissionDataPage() {
    const { clientId } = useParams();
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [emissionData, setEmissionData] = useState<EmissionData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [entryMode, setEntryMode] = useState<'manual' | 'bulk'>('manual');
    const [editingRecord, setEditingRecord] = useState<EmissionData | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<EmissionData | null>(null);
    const [deletedData, setDeletedData] = useState<EmissionData[]>([]);
    const [showDeleted, setShowDeleted] = useState(false);

    useEffect(() => {
        fetchData();
    }, [clientId]);

    const fetchData = async () => {
        try {
            const [facRes, dataRes] = await Promise.all([
                supabase
                    .from('facilities')
                    .select('*')
                    .eq('client_id', clientId)
                    .limit(5000),
                supabase
                    .from('emission_data')
                    .select('*')
                    .eq('client_id', clientId)
                    .order('created_at', { ascending: false })
                    .limit(5000),
            ]);

            if (facRes.error) throw facRes.error;
            if (dataRes.error) throw dataRes.error;

            setFacilities(keysToCamelCase(facRes.data) as Facility[]);

            const allData = keysToCamelCase(dataRes.data) as EmissionData[];
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

            const active = allData.filter(d => !d.deletedAt);
            const deleted = allData.filter(d => d.deletedAt && new Date(d.deletedAt) > sevenDaysAgo);

            setEmissionData(active);
            setDeletedData(deleted);
        } catch {
            setFacilities(DEMO_FACILITIES as Facility[]);
            setEmissionData(DEMO_DATA as EmissionData[]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (formData: Record<string, unknown>) => {
        try {
            const scope = formData.scope as string;
            const fuelType = formData.fuelType as string;
            const activityData = formData.activityData as number;

            const facility = facilities.find((f) => f.id === formData.facilityId);
            const egridSubregion = facility?.egridSubregion;

            const result = calculateEmissions(scope, fuelType, activityData, egridSubregion);

            if (editingRecord) {
                // UPDATE existing record
                const beforeValues = `Scope ${editingRecord.scope}, ${editingRecord.fuelType}, ${editingRecord.activityData} ${editingRecord.activityUnit} → ${editingRecord.tCO2e?.toFixed(3)} tCO₂e`;

                const { error: updateError } = await supabase
                    .from('emission_data')
                    .update({
                        facility_id: formData.facilityId,
                        reporting_year: formData.reportingYear,
                        month: formData.month || null,
                        scope: scope,
                        category: formData.category || null,
                        fuel_type: fuelType,
                        activity_data: activityData,
                        activity_unit: formData.activityUnit,
                        data_source: formData.dataSource || null,
                        data_quality: formData.dataQuality || null,
                        notes: formData.notes || null,
                        supplier_name: formData.supplierName || null,
                        spend_amount: formData.spendAmount || null,
                        emission_factor_override: formData.emissionFactorOverride || null,
                        ef_unit: result.efUnit,
                        kgco2e: result.kgCO2e,
                        tco2e: result.tCO2e,
                        calculation_method: result.calculationMethod,
                        factor_year: result.factorYear,
                        factor_version: result.factorVersion,
                        calculated_at: result.calculatedAt,
                    })
                    .eq('id', editingRecord.id);

                if (updateError) throw updateError;

                const afterValues = `Scope ${scope}, ${fuelType}, ${activityData} ${formData.activityUnit} → ${result.tCO2e.toFixed(3)} tCO₂e`;
                logActivity(clientId as string, 'data_entry_updated', `Updated record: ${beforeValues} changed to ${afterValues}`);
                toast.success('Record updated');
                setEditingRecord(null);
            } else {
                // CREATE new record
                const { error: insertError } = await supabase
                    .from('emission_data')
                    .insert([{
                        client_id: clientId as string,
                        facility_id: formData.facilityId,
                        reporting_year: formData.reportingYear,
                        month: formData.month || null,
                        scope: scope,
                        category: formData.category || null,
                        fuel_type: fuelType,
                        activity_data: activityData,
                        activity_unit: formData.activityUnit,
                        data_source: formData.dataSource || null,
                        data_quality: formData.dataQuality || null,
                        notes: formData.notes || null,
                        supplier_name: formData.supplierName || null,
                        spend_amount: formData.spendAmount || null,
                        emission_factor_override: formData.emissionFactorOverride || null,
                        ef_unit: result.efUnit,
                        kgco2e: result.kgCO2e,
                        tco2e: result.tCO2e,
                        verified: false,
                        calculation_method: result.calculationMethod,
                        factor_year: result.factorYear,
                        factor_version: result.factorVersion,
                        calculated_at: result.calculatedAt,
                    }]);

                if (insertError) throw insertError;

                logActivity(clientId as string, 'data_entry_saved', `Saved: Scope ${scope}, ${fuelType}, ${activityData} ${formData.activityUnit} = ${result.tCO2e.toFixed(3)} tCO₂e`);
            }

            fetchData();
        } catch (error) {
            console.error('Error saving emission data:', error);
            const msg = error instanceof Error ? error.message : (error as any).message || JSON.stringify(error);
            toast.error(`Failed to save: ${msg}`);
            throw error;
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            const details = `Deleted: Scope ${deleteTarget.scope}, ${deleteTarget.fuelType}, ${deleteTarget.activityData} ${deleteTarget.activityUnit} = ${deleteTarget.tCO2e?.toFixed(3)} tCO₂e`;

            const { error: deleteError } = await supabase
                .from('emission_data')
                .update({ deleted_at: new Date().toISOString() })
                .eq('id', deleteTarget.id);

            if (deleteError) throw deleteError;

            logActivity(clientId as string, 'data_entry_deleted', details);
            toast.success('Record deleted');
            setDeleteTarget(null);
            fetchData();
        } catch (error: any) {
            const msg = error?.message || JSON.stringify(error);
            toast.error(`Failed to delete record: ${msg}`);
            console.error(error);
        }
    };

    const handleRestore = async (record: EmissionData) => {
        try {
            const { error: restoreError } = await supabase
                .from('emission_data')
                .update({ deleted_at: null })
                .eq('id', record.id);

            if (restoreError) throw restoreError;

            logActivity(clientId as string, 'data_entry_saved', `Restored record: Scope ${record.scope}, ${record.fuelType}`);
            toast.success('Record restored');
            fetchData();
        } catch (error: any) {
            const msg = error?.message || JSON.stringify(error);
            toast.error(`Failed to restore record: ${msg}`);
            console.error(error);
        }
    };

    const handleHardDelete = async (record: EmissionData) => {
        if (!window.confirm("Are you sure you want to permanently delete this record? This cannot be undone.")) return;

        try {
            const { error: deleteError } = await supabase
                .from('emission_data')
                .delete()
                .eq('id', record.id);

            if (deleteError) throw deleteError;

            logActivity(clientId as string, 'data_entry_deleted', `Permanently deleted record: Scope ${record.scope}, ${record.fuelType}`);
            toast.success('Record permanently deleted');
            fetchData();
        } catch (error: any) {
            const msg = error?.message || JSON.stringify(error);
            toast.error(`Failed to permanently delete record: ${msg}`);
            console.error(error);
        }
    };

    const handleSupplierImport = async (records: Partial<EmissionData>[]) => {
        try {
            const mappedRecords = records.map(record => ({
                client_id: clientId as string,
                facility_id: record.facilityId || null,
                reporting_year: record.reportingYear,
                month: record.month || null,
                scope: record.scope,
                category: record.category || null,
                fuel_type: record.fuelType,
                activity_data: record.activityData,
                activity_unit: record.activityUnit,
                data_source: record.dataSource || null,
                kgco2e: record.kgCO2e || 0,
                tco2e: record.tCO2e || 0,
                verified: false,
            }));

            const { error } = await supabase
                .from('emission_data')
                .insert(mappedRecords);

            if (error) throw error;

            logActivity(clientId as string, 'data_entry_saved', `Bulk imported ${records.length} Scope 3 supplier records`);
            toast.success(`Successfully imported ${records.length} Scope 3 records!`);
            fetchData();
            setEntryMode('manual');
        } catch (error) {
            console.error('Bulk import error:', error);
            toast.error('Failed to import supplier data. Ensure schema fields exist.');
        }
    };

    const displayFacilities = facilities.length > 0 ? facilities : DEMO_FACILITIES as Facility[];
    const displayData = emissionData.length > 0 ? emissionData : DEMO_DATA as EmissionData[];

    const getFacilityName = (facId: string) => {
        const f = displayFacilities.find(fac => fac.id === facId);
        return f?.name || facId;
    };

    const columns = [
        { key: 'scope', header: 'Scope', render: (item: Record<string, unknown>) => { const e = item as unknown as EmissionData; return <Badge variant={e.scope === '1' ? 'success' : e.scope === '2' ? 'info' : 'default'}>Scope {e.scope}</Badge>; } },
        { key: 'category', header: 'Category' },
        { key: 'facility', header: 'Facility', render: (item: Record<string, unknown>) => { const e = item as unknown as EmissionData; return <span className="text-xs text-gray-400">{getFacilityName(e.facilityId)}</span>; } },
        { key: 'activityData', header: 'Activity', render: (item: Record<string, unknown>) => { const e = item as unknown as EmissionData; return <span className="text-xs text-gray-300">{e.activityData?.toLocaleString()} {e.activityUnit}</span>; } },
        { key: 'tCO2e', header: 'tCO₂e', render: (item: Record<string, unknown>) => { const e = item as unknown as EmissionData; return <span className="font-mono text-[#4CAF80]">{e.tCO2e?.toFixed(3)}</span>; } },
        { key: 'verified', header: 'Status', render: (item: Record<string, unknown>) => { const e = item as unknown as EmissionData; return <Badge variant={e.verified ? 'success' : 'warning'}>{e.verified ? 'Verified' : 'Pending'}</Badge>; } },
        {
            key: 'actions', header: '', render: (item: Record<string, unknown>) => {
                const e = item as unknown as EmissionData;
                return (
                    <div className="flex gap-1">
                        <button
                            onClick={() => setEditingRecord(e)}
                            className="p-1.5 text-gray-400 hover:text-[#4CAF80] transition-colors rounded hover:bg-[#4CAF80]/10"
                            title="Edit"
                        >
                            <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => setDeleteTarget(e)}
                            className="p-1.5 text-gray-400 hover:text-red-400 transition-colors rounded hover:bg-red-500/10"
                            title="Delete"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                );
            }
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-syne)]">
                    Emission Data Entry
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                    Enter and manage emission data for this client
                </p>
            </div>

            <div className="flex gap-4 border-b border-[#1a5c3844] pb-4">
                <button
                    onClick={() => { setEntryMode('manual'); setEditingRecord(null); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${entryMode === 'manual' ? 'bg-[#4CAF80] text-black' : 'bg-[#1a2e1a] text-[#4CAF80] hover:bg-[#4CAF80]/20'}`}
                >
                    Manual / Single Entry
                </button>
                <button
                    onClick={() => { setEntryMode('bulk'); setEditingRecord(null); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${entryMode === 'bulk' ? 'bg-[#4CAF80] text-black' : 'bg-[#1a2e1a] text-[#4CAF80] hover:bg-[#4CAF80]/20'}`}
                >
                    Scope 3 CSV Bulk Upload
                </button>
            </div>

            {/* Edit banner */}
            {editingRecord && (
                <div className="flex items-center justify-between bg-[#4CAF80]/10 border border-[#4CAF80]/30 rounded-lg px-4 py-3">
                    <p className="text-sm text-[#4CAF80]">
                        <Edit className="w-4 h-4 inline mr-1" />
                        Editing: Scope {editingRecord.scope} — {editingRecord.fuelType} ({editingRecord.activityData} {editingRecord.activityUnit})
                    </p>
                    <button onClick={() => setEditingRecord(null)} className="text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {entryMode === 'manual' ? (
                <EmissionDataForm
                    clientId={clientId as string}
                    facilities={facilities}
                    onSubmit={handleSubmit}
                />
            ) : (
                <SupplierUpload
                    clientId={clientId as string}
                    onImport={handleSupplierImport}
                />
            )}

            <Card>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold font-[family-name:var(--font-syne)]">
                        {showDeleted ? 'Recently Deleted (7 Days)' : 'Emission Records'}
                    </h3>
                    {deletedData.length > 0 && (
                        <button
                            onClick={() => setShowDeleted(!showDeleted)}
                            className="text-xs text-[#4CAF80] hover:text-white transition-colors"
                        >
                            {showDeleted ? 'View Active Records' : `View Deleted (${deletedData.length})`}
                        </button>
                    )}
                </div>
                {isLoading ? (
                    <Skeleton className="h-48" />
                ) : (
                    <Table
                        columns={showDeleted ? [
                            ...columns.slice(0, -1),
                            {
                                key: 'actions', header: '', render: (item: Record<string, unknown>) => {
                                    const e = item as unknown as EmissionData;
                                    return (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleRestore(e)}
                                                className="px-2 py-1 text-xs bg-[#4CAF80]/10 text-[#4CAF80] hover:bg-[#4CAF80] hover:text-black rounded transition-colors"
                                            >
                                                Restore
                                            </button>
                                            <button
                                                onClick={() => handleHardDelete(e)}
                                                className="p-1.5 text-gray-400 hover:text-red-400 transition-colors rounded hover:bg-red-500/10"
                                                title="Permanently Delete"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    );
                                }
                            }
                        ] : columns}
                        data={showDeleted ? deletedData as unknown as Record<string, unknown>[] : displayData as unknown as Record<string, unknown>[]}
                    />
                )}
            </Card>

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#0d1a0d] border border-[#1a5c3844] rounded-xl p-6 max-w-md w-full">
                        <h3 className="text-white text-lg font-semibold mb-2 font-[family-name:var(--font-syne)]">
                            Delete Emission Record?
                        </h3>
                        <p className="text-gray-400 text-sm mb-2">
                            This will permanently delete this record and recalculate all totals.
                        </p>
                        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 mb-6">
                            <p className="text-sm text-gray-300">
                                <strong>Scope {deleteTarget.scope}</strong> — {deleteTarget.fuelType}
                            </p>
                            <p className="text-xs text-gray-500">
                                {deleteTarget.activityData} {deleteTarget.activityUnit} = <span className="text-red-400">{deleteTarget.tCO2e?.toFixed(3)} tCO₂e</span>
                            </p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                            >
                                Delete Record
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
