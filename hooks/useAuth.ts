'use client';
// ============================================================
// GHG Shield — useAuth Hook (Clerk Implementation)
// ============================================================
import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import type { AuthUser } from '@/types';

export function useAuth() {
    const { user: clerkUser, isLoaded: isUserLoaded } = useUser();
    const { signOut, isLoaded: isAuthLoaded } = useClerkAuth();
    const router = useRouter();

    const isLoading = !isUserLoaded || !isAuthLoaded;
    const isAuthenticated = !!clerkUser;

    // Determine if admin based on email or public metadata
    const isAdmin = clerkUser?.emailAddresses[0]?.emailAddress === 'kallemudaykiran05@gmail.com' ||
        clerkUser?.publicMetadata?.role === 'admin';

    // Construct the backwards-compatible AuthUser object
    const user: AuthUser | null = clerkUser ? {
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        name: clerkUser.fullName || clerkUser.emailAddresses[0]?.emailAddress || '',
        role: isAdmin ? 'admin' : 'client',
        // For clients, their ID in Supabase will be mapped via clerk_id
        // We temporarily store the clerk id here until the database layer resolves the true UUID
        clientId: isAdmin ? undefined : clerkUser.id,
    } : null;

    const login = async () => {
        // Clerk handles login via the <SignIn /> component, this is just for backwards compatibility 
        // in places that might try to call it programmatically
        router.push('/login');
        return { success: true };
    };

    const logout = async () => {
        await signOut();
        router.push('/login');
    };

    const checkSession = async () => {
        // Clerk handles session sync automatically
    };

    return {
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        checkSession,
    };
}
