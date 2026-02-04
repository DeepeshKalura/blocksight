import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    // Only run on /dapp routes
    if (request.nextUrl.pathname.startsWith('/dapp')) {
        // Whitelist the login page itself
        if (request.nextUrl.pathname === '/dapp/login') {
            // If already logged in, redirect to main dapp page
            const session = request.cookies.get('dapp_session');
            if (session?.value === 'true') {
                return NextResponse.redirect(new URL('/dapp', request.url));
            }
            return NextResponse.next();
        }

        // Check for session cookie
        const session = request.cookies.get('dapp_session');

        // If no session, redirect to login
        if (!session || session.value !== 'true') {
            const loginUrl = new URL('/dapp/login', request.url);
            // Optional: Add return URL for better UX later
            // loginUrl.searchParams.set('from', request.nextUrl.pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/dapp/:path*',
};
