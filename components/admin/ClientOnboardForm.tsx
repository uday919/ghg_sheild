'use client';
// ============================================================
// GHG Shield — Client Onboarding Form (Admin)
// ============================================================
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select, Textarea, Modal } from '@/components/ui';
import { INDUSTRY_SECTORS } from '@/lib/constants';
import toast from 'react-hot-toast';

const clientSchema = z.object({
    companyName: z.string().min(2, 'Company name is required'),
    contactName: z.string().min(2, 'Contact name is required'),
    contactEmail: z.string().email('Valid email required'),
    industry: z.string().min(1, 'Industry is required'),
    annualRevenue: z.string().optional(),
    facilityCount: z.coerce.number().int().min(1).optional(),
    fiscalYearStart: z.string().optional(),
    fiscalYearEnd: z.string().optional(),
    setupFee: z.coerce.number().min(0).optional(),
    monthlyFee: z.coerce.number().min(0).optional(),
    notes: z.string().optional(),
});

type FormData = z.infer<typeof clientSchema>;

interface ClientOnboardFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: FormData) => Promise<void>;
}

export function ClientOnboardForm({ isOpen, onClose, onSubmit }: ClientOnboardFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(clientSchema) as any,
        defaultValues: {
            setupFee: 4999,
            monthlyFee: 1999,
            fiscalYearStart: `${new Date().getFullYear()}-01-01`,
            fiscalYearEnd: `${new Date().getFullYear()}-12-31`,
        },
    });

    const handleFormSubmit = async (data: FormData) => {
        try {
            setIsSubmitting(true);
            await onSubmit(data);
            toast.success('Client onboarded successfully');
            reset();
            onClose();
        } catch (error: any) {
            const rawError = error?.clerkDetail;
            if (rawError) {
                console.error('🔍 Deep Clerk Error Info:', rawError);
                toast.error(`Clerk: ${rawError.message || 'Details in console'}`);
            } else {
                toast.error(error?.message || 'Failed to onboard client');
            }
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Onboard New Client" size="lg">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Company Name"
                        placeholder="Acme Manufacturing Inc."
                        error={errors.companyName?.message}
                        {...register('companyName')}
                    />
                    <Input
                        label="Contact Name"
                        placeholder="John Smith"
                        error={errors.contactName?.message}
                        {...register('contactName')}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Contact Email"
                        type="email"
                        placeholder="john@acme.com"
                        error={errors.contactEmail?.message}
                        {...register('contactEmail')}
                    />
                    <Select
                        label="Industry"
                        options={INDUSTRY_SECTORS.map((s) => ({ value: s, label: s }))}
                        error={errors.industry?.message}
                        {...register('industry')}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        label="Annual Revenue"
                        placeholder="$10M-$50M"
                        {...register('annualRevenue')}
                    />
                    <Input
                        type="number"
                        label="Number of Facilities"
                        {...register('facilityCount')}
                    />
                    <Select
                        label="Fiscal Year Start"
                        options={[
                            { value: `${new Date().getFullYear()}-01-01`, label: 'January' },
                            { value: `${new Date().getFullYear()}-04-01`, label: 'April' },
                            { value: `${new Date().getFullYear()}-07-01`, label: 'July' },
                            { value: `${new Date().getFullYear()}-10-01`, label: 'October' },
                        ]}
                        {...register('fiscalYearStart')}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        type="number"
                        label="Setup Fee ($)"
                        {...register('setupFee')}
                    />
                    <Input
                        type="number"
                        label="Monthly Fee ($)"
                        {...register('monthlyFee')}
                    />
                </div>

                <Textarea
                    label="Notes"
                    rows={3}
                    placeholder="Any additional notes about this client..."
                    {...register('notes')}
                />

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isSubmitting}>
                        Onboard Client
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
