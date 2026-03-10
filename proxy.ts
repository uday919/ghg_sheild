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

export default clerkMiddleware(async (auth, req) => {
    // If the user isn't authenticated and trying to access a protected route, Clerk will redirect them to sign-in
    if (isProtectedRoute(req)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
