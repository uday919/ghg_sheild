import { createClerkClient } from '@clerk/backend';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function createAdmin() {
    const email = 'kallemudaykiran05@gmail.com';
    const password = `GHGAdmin!${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    try {
        const user = await clerkClient.users.createUser({
            emailAddress: [email],
            password: password,
            phoneNumber: ['+12025550172'],
            skipPasswordChecks: true,
            firstName: 'Uday',
            lastName: 'Admin',
            publicMetadata: { role: 'admin' },
        });
        console.log('Admin created successfully:');
        console.log(`ID: ${user.id}`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
    } catch (error) {
        console.error('Failed to create admin:', error);
    }
}

createAdmin();
