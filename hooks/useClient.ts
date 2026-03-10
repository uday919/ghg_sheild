'use client';
// ============================================================
// GHG Shield — useClient Hook (Supabase Implementation)
// ============================================================
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { keysToCamelCase } from '@/lib/utils';
import type { Client, Facility, ActionItem, GHGDocument } from '@/types';

export function useClient(clientId?: string) {
    const [client, setClient] = useState<Client | null>(null);
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [actionItems, setActionItems] = useState<ActionItem[]>([]);
    const [documents, setDocuments] = useState<GHGDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // In Supabase, our frontend clientId is actually the primary key `id`
    const fetchClient = useCallback(async () => {
        if (!clientId) return;
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .eq('id', clientId)
                .single();

            if (error) throw error;
            if (data) setClient(keysToCamelCase(data) as Client);
        } catch (error) {
            console.error('Error fetching client:', error);
        } finally {
            setIsLoading(false);
        }
    }, [clientId]);

    const fetchFacilities = useCallback(async () => {
        if (!clientId) return;
        try {
            const { data, error } = await supabase
                .from('facilities')
                .select('*')
                .eq('client_id', clientId)
                .limit(5000);

            if (error) throw error;
            if (data) setFacilities(keysToCamelCase(data) as Facility[]);
        } catch (error) {
            console.error('Error fetching facilities:', error);
        }
    }, [clientId]);

    const fetchActionItems = useCallback(async () => {
        if (!clientId) return;
        try {
            const { data, error } = await supabase
                .from('action_items')
                .select('*')
                .eq('client_id', clientId)
                .order('created_at', { ascending: false })
                .limit(5000);

            if (error) throw error;
            if (data) setActionItems(keysToCamelCase(data) as ActionItem[]);
        } catch (error) {
            console.error('Error fetching action items:', error);
        }
    }, [clientId]);

    const fetchDocuments = useCallback(async () => {
        if (!clientId) return;
        try {
            const { data, error } = await supabase
                .from('documents')
                .select('*')
                .eq('client_id', clientId)
                .eq('visible_to_client', true)
                .order('created_at', { ascending: false })
                .limit(5000);

            if (error) throw error;
            if (data) setDocuments(keysToCamelCase(data) as GHGDocument[]);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    }, [clientId]);

    useEffect(() => {
        if (clientId) {
            fetchClient();
            fetchFacilities();
            fetchActionItems();
            fetchDocuments();
        }
    }, [clientId, fetchClient, fetchFacilities, fetchActionItems, fetchDocuments]);

    return {
        client,
        facilities,
        actionItems,
        documents,
        isLoading,
        refetch: () => {
            fetchClient();
            fetchFacilities();
            fetchActionItems();
            fetchDocuments();
        },
    };
}
