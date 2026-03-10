
import { clerkClient } from '@clerk/nextjs/server';
import { loadEnvConfig } from '@next/env';

async function testCreate() {
    loadEnvConfig(process.cwd());
    console.log('🧪 Testing Clerk User Creation (Verbose)...');

    try {
        const clerk = await clerkClient();
        const email = `test_admin_${Date.now()}@example.com`;

        console.log(`📡 Sending request for ${email}...`);

        const response = await clerk.users.createUser({
            emailAddress: [email],
            password: 'TestPassword123!',
            firstName: 'Test',
            lastName: 'User',
            publicMetadata: { role: 'client' },
        });

        console.log('✅ Success! User created:', response.id);
    } catch (err: any) {
        console.error('❌ Clerk Error captured:');

        // Deeper inspection
        console.log('Error Message:', err.message);
        if (err.errors) {
            console.log('📋 Individual Errors (JSON):', JSON.stringify(err.errors, null, 2));
        } else {
            console.log('📋 Full Error JSON:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
        }

        // Checking for specific metadata often found in Clerk 422 errors
        if (err.errors?.[0]?.meta) {
            console.log('🔍 Meta Info:', JSON.stringify(err.errors[0].meta, null, 2));
        }

        console.log('🔄 Attempting Minimal Payload (No name/metadata)...');
        try {
            const clerk = await clerkClient();
            const email2 = `test_min_${Date.now()}@example.com`;
            await clerk.users.createUser({
                emailAddress: [email2],
                password: 'MinimalPassword123!',
            });
            console.log('✅ Minimal Payload worked!');
        } catch (err2: any) {
            console.error('❌ Minimal Payload failed too:', err2.message);
            if (err2.errors) console.log('📋 Minimal Error details:', JSON.stringify(err2.errors, null, 2));
        }
    }
}

testCreate();
