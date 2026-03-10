'use client';
// ============================================================
// GHG Shield — Admin Action Items Page
// ============================================================
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { keysToCamelCase } from '@/lib/utils';
import { Card, Button, Input, Select, Textarea, Badge, Table } from '@/components/ui';
import { Plus, CheckCircle2, Trash2 } from 'lucide-react';
import type { ActionItem } from '@/types';
import toast from 'react-hot-toast';
import { logActivity } from '@/lib/activityLog';



const actionSchema = z.object({
    text: z.string().min(3, 'Description required'),
    dueDate: z.string().optional(),
    priority: z.enum(['high', 'medium', 'low']),
    visibleToClient: z.boolean(),
});

type FormData = z.infer<typeof actionSchema>;

export default function AdminActionsPage() {
    const { clientId } = useParams();
    const [items, setItems] = useState<ActionItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(actionSchema),
        defaultValues: { priority: 'medium', visibleToClient: true },
    });

    useEffect(() => {
        fetchItems();
    }, [clientId]);

    const fetchItems = async () => {
        try {
            const { data, error } = await supabase
                .from('action_items')
                .select('*')
                .eq('client_id', clientId)
                .order('created_at', { ascending: false })
                .limit(5000);

            if (error) throw error;
            setItems(keysToCamelCase(data) as ActionItem[]);
        } catch {
            // Demo mode
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (data: FormData) => {
        try {
            setIsSubmitting(true);
            const { error } = await supabase
                .from('action_items')
                .insert([{
                    client_id: clientId as string,
                    text: data.text,
                    due_date: data.dueDate ? new Date(data.dueDate).toISOString() : null,
                    status: 'open',
                    priority: data.priority,
                    visible_to_client: data.visibleToClient,
                }]);

            if (error) throw error;
            toast.success('Action item created');
            logActivity(clientId as string, 'action_item_created', `Created: "${data.text}" (${data.priority} priority)`);

            // Notification trigger: Notify client if visible
            if (data.visibleToClient) {
                try {
                    const { data: clientDoc } = await supabase
                        .from('clients')
                        .select('contact_name, contact_email')
                        .eq('id', clientId)
                        .single();

                    if (clientDoc) {
                        await fetch('/api/email/send', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                type: 'action_item',
                                to: clientDoc.contact_email,
                                name: clientDoc.contact_name,
                                actionText: data.text,
                                priority: data.priority,
                                loginUrl: `${window.location.origin}/action-items`,
                            }),
                        });
                    }
                } catch (emailErr) {
                    console.error('Failed to send task notification:', emailErr);
                }
            }

            reset();
            setShowForm(false);
            fetchItems();
        } catch (error) {
            toast.error('Failed to create action item');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleStatus = async (item: ActionItem) => {
        try {
            const newStatus = item.status === 'complete' ? 'open' : 'complete';
            const { error } = await supabase
                .from('action_items')
                .update({ status: newStatus })
                .eq('id', item.id);

            if (error) throw error;
            toast.success(`Marked as ${newStatus}`);
            logActivity(clientId as string, 'action_item_updated', `"${item.text?.substring(0, 40)}" → ${newStatus}`);
            fetchItems();
        } catch (error) {
            toast.error('Failed to update');
            console.error(error);
        }
    };

    const handleDelete = async (item: ActionItem) => {
        try {
            const { error } = await supabase
                .from('action_items')
                .delete()
                .eq('id', item.id);

            if (error) throw error;
            toast.success('Deleted');
            logActivity(clientId as string, 'action_item_deleted', `Deleted action item: "${item.text?.substring(0, 40)}"`);
            fetchItems();
        } catch (error) {
            toast.error('Failed to delete');
            console.error(error);
        }
    };

    const columns = [
        { key: 'text', header: 'Action Item', className: 'max-w-xs' },
        {
            key: 'priority', header: 'Priority', render: (item: Record<string, unknown>) => {
                const v: Record<string, 'danger' | 'warning' | 'default'> = { high: 'danger', medium: 'warning', low: 'default' };
                return <Badge variant={v[item.priority as string] || 'default'}>{item.priority as string}</Badge>;
            }
        },
        {
            key: 'status', header: 'Status', render: (item: Record<string, unknown>) => {
                const s = item.status as string;
                return <Badge variant={s === 'complete' ? 'success' : s === 'overdue' ? 'danger' : 'warning'}>{s}</Badge>;
            }
        },
        { key: 'dueDate', header: 'Due', render: (item: Record<string, unknown>) => item.dueDate ? new Date(item.dueDate as string).toLocaleDateString() : '—' },
        {
            key: 'actions', header: '', render: (item: Record<string, unknown>) => (
                <div className="flex gap-1">
                    <button onClick={() => toggleStatus(item as unknown as ActionItem)} className="p-1 text-gray-400 hover:text-[#4CAF80] transition-colors">
                        <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item as unknown as ActionItem)} className="p-1 text-gray-400 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-syne)]">
                        Action Items
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Manage tasks for this client</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    <Plus className="w-4 h-4" />
                    New Action Item
                </Button>
            </div>

            {showForm && (
                <Card>
                    <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
                        <Textarea
                            label="Action Item Description"
                            rows={2}
                            placeholder="e.g. Upload Q3 electricity bills for all CA facilities"
                            error={errors.text?.message}
                            {...register('text')}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input type="date" label="Due Date" {...register('dueDate')} />
                            <Select
                                label="Priority"
                                options={[
                                    { value: 'high', label: 'High' },
                                    { value: 'medium', label: 'Medium' },
                                    { value: 'low', label: 'Low' },
                                ]}
                                {...register('priority')}
                            />
                            <div className="flex items-end gap-2">
                                <label className="flex items-center gap-2 text-sm text-gray-300 pb-2">
                                    <input type="checkbox" {...register('visibleToClient')} className="rounded border-gray-600" />
                                    Visible to client
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                            <Button type="submit" isLoading={isSubmitting}>Create</Button>
                        </div>
                    </form>
                </Card>
            )}

            <Card>
                <Table columns={columns} data={items as unknown as Record<string, unknown>[]} emptyMessage="No action items yet" />
            </Card>
        </div>
    );
}
