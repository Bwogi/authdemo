import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Don't protect login and register routes
    if (request.nextUrl.pathname.match(/^\/admin\/(login|register)$/)) {
      return NextResponse.next();
    }

    // Protect other admin routes
    return withAuth(request as any, {
      callbacks: {
        authorized: ({ token }) => !!(token && (token as any).isAdmin),
      },
      pages: {
        signIn: '/admin/login',
      },
    } as any);
  }

  // Regular user routes
  return withAuth(request as any, {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  } as any);
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
};
