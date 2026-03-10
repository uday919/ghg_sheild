
import { clerkClient } from '@clerk/nextjs/server';

async function diagnoseClerk() {
    console.log('🧪 Diagnosing Clerk SDK...');
    try {
        const clerk = await clerkClient();
        console.log('✅ clerkClient initialized');

        // Inspect properties of users object
        console.log('📋 User Methods:', Object.keys(clerk.users));

        // We can't easily see types at runtime without better introspection, 
        // but the error "missing data" usually points to specific fields.
        // Let's try to find if emailAddress is expected as a key.

    } catch (err) {
        console.error('❌ Diagnostic failed:', err);
    }
}

diagnoseClerk();
