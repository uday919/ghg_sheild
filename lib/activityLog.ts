// ============================================================
// GHG Shield — Activity Log Helper
// ============================================================
import { supabase } from '@/lib/supabase';
import type { ActivityAction } from '@/types';

export async function logActivity(clientId: string, action: ActivityAction, details: string) {
    try {
        await supabase
            .from('activity_log')
            .insert([{
                client_id: clientId,
                action,
                details,
                timestamp: new Date().toISOString(),
            }]);
    } catch (error) {
        // Non-blocking — never let a failed log break the main action
        console.error('Activity log error:', error);
    }
}
