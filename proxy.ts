import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected route patterns
const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/reports(.*)',
    '/documents(.*)',
    '/action-items(.*)',
    '/settings(.*)',
    '/profile(.*)',
    '/admin(.*)'
]);

export const proxy = clerkMiddleware(async (auth, req) => {
    // If the user isn't authenticated and trying to access a protected route, Clerk will redirect them to sign-in
    if (isProtectedRoute(req)) {
        try {
            await auth.protect();
        } catch (err) {
            console.error('Middleware Auth Protect Error:', err);
            // Re-throw so Clerk handles it, but we log the potential key issue
            throw err;
        }
    }
});

export default proxy;

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
