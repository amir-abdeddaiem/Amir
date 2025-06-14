// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {

  const token = request.cookies.get('jwt')?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'b795999a079f8e38336f0dd24fcbe6830b7d6289dd7f0436f778cf034ce92d66s');

    const { payload } = await jwtVerify(token, secret);
    console.log("✅ Token is valid:", payload);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', String(payload.userId));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (err) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/api/profile/:path*',"/api/matchy/:path*","/api/animal/:path*"
    ,"/api/products/:path*",
    "/api/myproduct/:path*",
    "/api/favoriteproduct/:path*",
    "/api/review/:path*",
    "/api/myanimal/:path*",
    "/api/provider/:path*",
    "/api/admin/:path*",
    "/api/services/:path*", 
    
  ],
};
