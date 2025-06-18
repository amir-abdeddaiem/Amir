// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import path from 'path';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt')?.value;
  const { pathname } = request.nextUrl;

  // Redirect to login if no token
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const { payload } = await jwtVerify(token, secret);
    
    // Set user ID in headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', String(payload.userId));
    requestHeaders.set('x-user-role', String(payload.role));

    // Role-based route protection
    if (pathname.startsWith('/api/services') || pathname.startsWith('/api/provider')) {
      if (payload.role !== 'provider' && payload.role !== 'admin') {
        const redirectUrl = new URL('/user', request.url);
        return NextResponse.redirect(redirectUrl);
      }
    }

    if (pathname.startsWith('/api/admin')) {
      if (payload.role !== 'admin') {
        const redirectUrl = new URL('/user', request.url);
        return NextResponse.redirect(redirectUrl);
      }
    }

    // Regular user routes
    if (pathname.startsWith('/api/profile') || 
        pathname.startsWith('/api/matchy') || 
        pathname.startsWith('/api/animal') ||
        pathname.startsWith('/api/products') ||
        pathname.startsWith('/api/myproduct') ||
        pathname.startsWith('/api/favoriteproduct') ||
        pathname.startsWith('/api/review') ||
        pathname.startsWith('/api/myanimal')) {
      if (!['regular', 'provider', 'admin'].includes(String(payload?.role))) {
        const redirectUrl = new URL('/login', request.url);
        return NextResponse.redirect(redirectUrl);
      }
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (err) {
    console.error("❌ Token verification failed:", err);
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    '/api/profile/:path*',
    '/api/matchy/:path*',
    '/api/animal/:path*',
    '/api/products/:path*',
    '/api/myproduct/:path*',
    '/api/favoriteproduct/:path*',
    '/api/review/:path*',
    '/api/myanimal/:path*',
    '/api/provider/:path*',
    '/api/admin/:path*',
    // '/api/services/:path*',
    "/user/:path*",
    "/marcket_place/:path*",
    "/service_provider/:path*",
    "/matchy/:path*",
    "/animal/:path*",
    "/service/:path*"
  ],
};