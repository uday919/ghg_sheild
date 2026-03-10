'use client';
// ============================================================
// GHG Shield — Admin Facilities Management Page
// ============================================================
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { keysToCamelCase } from '@/lib/utils';
import { EGRID_SUBREGIONS } from '@/lib/constants';
import { Card, Button, Input, Select, Badge, Table, Modal } from '@/components/ui';
import { Building2, Plus, Trash2, Edit, MapPin } from 'lucide-react';
import type { Facility } from '@/types';
import toast from 'react-hot-toast';


const facilitySchema = z.object({
    name: z.string().min(2, 'Facility name required'),
    facilityType: z.enum(['Office', 'Plant', 'Warehouse', 'Retail', 'Data Center', 'Distribution', 'Other']),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    egridSubregion: z.string().min(1, 'eGRID subregion required'),
    inBoundary: z.boolean(),
});

type FormData = z.infer<typeof facilitySchema>;

const FACILITY_TYPES = [
    { value: 'Office', label: 'Office' },
    { value: 'Plant', label: 'Manufacturing Plant' },
    { value: 'Warehouse', label: 'Warehouse' },
    { value: 'Retail', label: 'Retail Location' },
    { value: 'Data Center', label: 'Data Center' },
    { value: 'Other', label: 'Other' },
];

const US_STATES = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS',
    'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY',
    'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
].map((s) => ({ value: s, label: s }));

export default function AdminFacilitiesPage() {
    const { clientId } = useParams();
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(facilitySchema) as any,
        defaultValues: { inBoundary: true },
    });

    useEffect(() => { fetchFacilities(); }, [clientId]);

    const fetchFacilities = async () => {
        try {
            const { data, error } = await supabase
                .from('facilities')
                .select('*')
                .eq('client_id', clientId)
                .limit(5000);
            if (error) throw error;
            if (data) setFacilities(keysToCamelCase(data) as Facility[]);
        } catch { /* demo mode */ } finally { setIsLoading(false); }
    };

    const handleCreate = async (data: FormData) => {
        try {
            setIsSubmitting(true);
            if (editingId) {
                const { error } = await supabase
                    .from('facilities')
                    .update({
                        name: data.name,
                        facility_type: data.facilityType,
                        address: data.address || null,
                        city: data.city || null,
                        state: data.state || null,
                        zip_code: data.zipCode || null,
                        egrid_subregion: data.egridSubregion,
                        in_boundary: data.inBoundary
                    })
                    .eq('id', editingId);
                if (error) throw error;
                toast.success('Facility updated');
            } else {
                const { error } = await supabase
                    .from('facilities')
                    .insert([{
                        client_id: clientId as string,
                        name: data.name,
                        facility_type: data.facilityType,
                        address: data.address || null,
                        city: data.city || null,
                        state: data.state || null,
                        zip_code: data.zipCode || null,
                        egrid_subregion: data.egridSubregion,
                        in_boundary: data.inBoundary
                    }]);
                if (error) throw error;
                toast.success('Facility added');
            }
            reset();
            setShowForm(false);
            setEditingId(null);
            fetchFacilities();
        } catch (error: any) {
            toast.error(error.message || 'Failed to save facility');
            console.error(error);
        } finally { setIsSubmitting(false); }
    };

    const handleEdit = (fac: Facility) => {
        setEditingId(fac.id);
        setValue('name', fac.name);
        setValue('facilityType', fac.facilityType);
        setValue('address', fac.address || '');
        setValue('city', fac.city || '');
        setValue('state', fac.state || '');
        setValue('zipCode', fac.zipCode || '');
        setValue('egridSubregion', fac.egridSubregion);
        setValue('inBoundary', fac.inBoundary);
        setShowForm(true);
    };

    const handleDelete = async (fac: Facility) => {
        try {
            const { error } = await supabase.from('facilities').delete().eq('id', fac.id);
            if (error) throw error;
            toast.success('Facility deleted');
            fetchFacilities();
        } catch { toast.error('Delete failed'); }
    };

    const egridOptions = EGRID_SUBREGIONS.map((s) => ({ value: s, label: s }));

    const columns = [
        {
            key: 'name', header: 'Facility', render: (item: Record<string, unknown>) => (
                <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#4CAF80]" />
                    <span className="text-white font-medium">{item.name as string}</span>
                </div>
            )
        },
        { key: 'facilityType', header: 'Type', render: (item: Record<string, unknown>) => <Badge>{item.facilityType as string}</Badge> },
        { key: 'state', header: 'State', render: (item: Record<string, unknown>) => (item.state as string) || '—' },
        { key: 'egridSubregion', header: 'eGRID', render: (item: Record<string, unknown>) => <Badge variant="info">{item.egridSubregion as string}</Badge> },
        { key: 'inBoundary', header: 'In Boundary', render: (item: Record<string, unknown>) => <Badge variant={(item.inBoundary as boolean) ? 'success' : 'default'}>{(item.inBoundary as boolean) ? 'Yes' : 'No'}</Badge> },
        {
            key: 'actions', header: '', render: (item: Record<string, unknown>) => (
                <div className="flex gap-1">
                    <button onClick={() => handleEdit(item as unknown as Facility)} className="p-1 text-gray-400 hover:text-[#4CAF80] transition-colors"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item as unknown as Facility)} className="p-1 text-gray-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
            )
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-syne)]">Facilities</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage facilities under operational control</p>
                </div>
                <Button onClick={() => { setEditingId(null); reset(); setShowForm(true); }}>
                    <Plus className="w-4 h-4" /> Add Facility
                </Button>
            </div>

            <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditingId(null); }} title={editingId ? 'Edit Facility' : 'Add Facility'} size="lg">
                <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Facility Name" placeholder="HQ — San Jose, CA" error={errors.name?.message} {...register('name')} />
                        <Select label="Facility Type" options={FACILITY_TYPES} error={errors.facilityType?.message} {...register('facilityType')} />
                    </div>
                    <Input label="Address" placeholder="123 Main St" {...register('address')} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input label="City" placeholder="San Jose" {...register('city')} />
                        <Select label="State" options={US_STATES} {...register('state')} />
                        <Input label="ZIP Code" placeholder="95110" {...register('zipCode')} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select label="eGRID Subregion" options={egridOptions} error={errors.egridSubregion?.message} {...register('egridSubregion')} />
                        <div className="flex items-end gap-2">
                            <label className="flex items-center gap-2 text-sm text-gray-300 pb-2">
                                <input type="checkbox" {...register('inBoundary')} className="rounded border-gray-600" />
                                Within organizational boundary
                            </label>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</Button>
                        <Button type="submit" isLoading={isSubmitting}>{editingId ? 'Update' : 'Add'} Facility</Button>
                    </div>
                </form>
            </Modal>

            <Card>
                <Table columns={columns} data={facilities as unknown as Record<string, unknown>[]} emptyMessage="No facilities added yet. Click 'Add Facility' to get started." />
            </Card>
        </div>
    );
}
