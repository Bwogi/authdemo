import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Protect registration route
  if (request.nextUrl.pathname === '/register') {
    if (process.env.ENABLE_REGISTRATION !== 'true') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Continue with auth middleware for protected routes
  return withAuth(request as any, {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  } as any);
}

export const config = {
  matcher: ['/dashboard/:path*', '/register']
};
