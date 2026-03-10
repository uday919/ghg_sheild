'use client';
// ============================================================
// GHG Shield — Emission Data Entry Form (Admin)
// ============================================================
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select, Textarea, Card } from '@/components/ui';
import { EMISSION_CATEGORIES, ACTIVITY_UNITS, EGRID_LABELS } from '@/lib/constants';
import type { Facility } from '@/types';
import toast from 'react-hot-toast';
import { UploadCloud, Loader2 } from 'lucide-react';

const emissionDataSchema = z.object({
    facilityId: z.string().min(1, 'Facility is required'),
    reportingYear: z.coerce.number().min(2020).max(2030),
    month: z.coerce.number().min(1).max(12),
    scope: z.enum(['1', '2', '3']),
    category: z.string().optional(),
    fuelType: z.string().min(1, 'Fuel type is required'),
    activityData: z.coerce.number().positive('Must be positive'),
    activityUnit: z.string().min(1, 'Unit is required'),
    emissionFactorOverride: z.coerce.number().optional(),
    dataSource: z.string().optional(),
    dataQuality: z.enum(['High', 'Medium', 'Low']).optional(),
    notes: z.string().optional(),
});

type FormData = z.infer<typeof emissionDataSchema>;

interface EmissionDataFormProps {
    clientId: string;
    facilities: Facility[];
    onSubmit: (data: FormData) => Promise<void>;
}

const SCOPE1_FUELS = ['Natural Gas', 'Diesel', 'Gasoline', 'Propane', 'R-410A'];
const SCOPE1_CATEGORIES = ['Stationary Combustion', 'Mobile Combustion', 'Fugitive'];
const SCOPE2_CATEGORIES = ['Purchased Electricity', 'Purchased Steam', 'District Heating'];
const DATA_SOURCES = ['Utility Bill', 'Fleet Records', 'Estimate', 'Meter Reading', 'Invoice', 'Supplier Data'];
const MONTHS = [
    { value: '1', label: 'January' }, { value: '2', label: 'February' },
    { value: '3', label: 'March' }, { value: '4', label: 'April' },
    { value: '5', label: 'May' }, { value: '6', label: 'June' },
    { value: '7', label: 'July' }, { value: '8', label: 'August' },
    { value: '9', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' },
];

export function EmissionDataForm({ clientId, facilities, onSubmit }: EmissionDataFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(emissionDataSchema) as any,
        defaultValues: {
            reportingYear: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            scope: '1',
            dataQuality: 'High',
        },
    });

    const scope = watch('scope');
    const fuelType = watch('fuelType');

    useEffect(() => {
        if (scope === '2') {
            setValue('activityUnit', 'kWh');
        } else if (scope === '1' && fuelType && ACTIVITY_UNITS[fuelType]) {
            setValue('activityUnit', ACTIVITY_UNITS[fuelType]);
        }
    }, [scope, fuelType, setValue]);

    const handleFormSubmit = async (data: FormData) => {
        try {
            setIsSubmitting(true);
            await onSubmit(data);
            toast.success('Emission data saved successfully');
            reset({
                reportingYear: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
                scope: '1',
                dataQuality: 'High',
            });
        } catch (error) {
            toast.error('Failed to save emission data');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const formData = new window.FormData();
            formData.append('file', file);

            const res = await fetch('/api/ai/parse-invoice', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to parse invoice');
            }

            const data = await res.json();

            // Auto-populate form
            if (data.fuelType) setValue('fuelType', data.fuelType);
            if (data.activityData) setValue('activityData', data.activityData);
            if (data.activityUnit) setValue('activityUnit', data.activityUnit);
            if (data.dataSource) setValue('dataSource', data.dataSource);
            if (data.dataQuality) setValue('dataQuality', data.dataQuality as any);
            if (data.notes) setValue('notes', data.notes);

            toast.success('Invoice data extracted successfully!');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error extracting data');
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Card>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white font-[family-name:var(--font-syne)]">
                    Enter Emission Data
                </h3>
            </div>

            {/* AI Magic Upload Dropzone */}
            <div className="mb-8 p-6 border-2 border-dashed border-gray-700 bg-gray-900/50 rounded-xl relative hover:border-[#4CAF80] hover:bg-gray-800/50 transition-colors group cursor-pointer overflow-hidden">
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                />
                <div className="flex flex-col items-center justify-center text-center space-y-3 pointer-events-none">
                    {isUploading ? (
                        <>
                            <Loader2 className="w-8 h-8 text-[#4CAF80] animate-spin" />
                            <div className="space-y-1">
                                <p className="text-white font-medium">Claude is reading your invoice...</p>
                                <p className="text-sm text-gray-400">Extracting consumption data using Vision AI</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-[#4CAF80]/20 transition-colors">
                                <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-[#4CAF80] transition-colors" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-white text-sm font-medium">
                                    <span className="text-[#4CAF80]">Magic Upload:</span> Drop a utility bill here (Image)
                                </p>
                                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                                    Our AI automatically extracts the activity data, fuel type, and units. Supports JPG, PNG, WEBP.
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select
                        label="Facility"
                        options={facilities.length > 0 ? facilities.map((f) => ({ value: f.id, label: f.name })) : [{ value: '', label: 'No facilities available' }]}
                        error={errors.facilityId?.message}
                        {...register('facilityId')}
                        disabled={facilities.length === 0}
                    />
                    <Input
                        type="number"
                        label="Reporting Year"
                        error={errors.reportingYear?.message}
                        {...register('reportingYear')}
                    />
                    <Select
                        label="Month"
                        options={MONTHS}
                        error={errors.month?.message}
                        {...register('month')}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Scope"
                        options={[
                            { value: '1', label: 'Scope 1 — Direct Emissions' },
                            { value: '2', label: 'Scope 2 — Purchased Energy' },
                            { value: '3', label: 'Scope 3 — Other Indirect' },
                        ]}
                        error={errors.scope?.message}
                        {...register('scope')}
                    />
                    <Select
                        label="Category"
                        options={
                            scope === '1'
                                ? SCOPE1_CATEGORIES.map((c) => ({ value: c, label: c }))
                                : scope === '2'
                                    ? SCOPE2_CATEGORIES.map((c) => ({ value: c, label: c }))
                                    : [{ value: 'Purchased Goods', label: 'Purchased Goods' },
                                    { value: 'Business Travel', label: 'Business Travel' },
                                    { value: 'Employee Commuting', label: 'Employee Commuting' },
                                    { value: 'Upstream Transport', label: 'Upstream Transport' },
                                    { value: 'Waste', label: 'Waste' },
                                    { value: 'Other', label: 'Other' }]
                        }
                        error={errors.category?.message}
                        {...register('category')}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {scope === '1' ? (
                        <Select
                            label="Fuel Type"
                            options={SCOPE1_FUELS.map((f) => ({ value: f, label: f }))}
                            error={errors.fuelType?.message}
                            {...register('fuelType')}
                        />
                    ) : scope === '2' ? (
                        <Select
                            label="eGRID Subregion"
                            options={Object.entries(EGRID_LABELS).map(([k, v]) => ({ value: k, label: v }))}
                            error={errors.fuelType?.message}
                            {...register('fuelType')}
                        />
                    ) : (
                        <Input
                            label="Emission Source"
                            error={errors.fuelType?.message}
                            {...register('fuelType')}
                        />
                    )}

                    <Input
                        type="number"
                        step="0.01"
                        label="Activity Data"
                        placeholder="e.g. 15000"
                        error={errors.activityData?.message}
                        {...register('activityData')}
                    />

                    <Select
                        label="Unit"
                        options={
                            scope === '2'
                                ? [{ value: 'kWh', label: 'kWh' }]
                                : scope === '1' && ACTIVITY_UNITS[fuelType]
                                    ? [{ value: ACTIVITY_UNITS[fuelType], label: ACTIVITY_UNITS[fuelType] }]
                                    : [
                                        { value: 'kWh', label: 'kWh' },
                                        { value: 'therms', label: 'therms' },
                                        { value: 'gallons', label: 'gallons' },
                                        { value: 'liters', label: 'liters' },
                                        { value: 'kg', label: 'kg' },
                                        { value: 'lbs', label: 'lbs' },
                                        { value: 'tons', label: 'tons' },
                                        { value: 'miles', label: 'miles' },
                                        { value: 'km', label: 'km' },
                                        { value: 'USD', label: 'USD ($)' },
                                    ]
                        }
                        error={errors.activityUnit?.message}
                        {...register('activityUnit')}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Data Source"
                        options={DATA_SOURCES.map((s) => ({ value: s, label: s }))}
                        error={errors.dataSource?.message}
                        {...register('dataSource')}
                    />
                    <Select
                        label="Data Quality"
                        options={[
                            { value: 'High', label: 'High — Primary metered data' },
                            { value: 'Medium', label: 'Medium — Industry average' },
                            { value: 'Low', label: 'Low — Estimated' },
                        ]}
                        error={errors.dataQuality?.message}
                        {...register('dataQuality')}
                    />
                </div>

                <Textarea
                    label="Notes"
                    rows={2}
                    placeholder="Optional notes about this data entry..."
                    {...register('notes')}
                />

                <div className="flex justify-end">
                    <Button type="submit" isLoading={isSubmitting} disabled={facilities.length === 0}>
                        {facilities.length === 0 ? 'Add a Facility First' : 'Save Emission Data'}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
