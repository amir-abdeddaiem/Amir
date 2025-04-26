// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log("✅ Middleware is running!");

  return new NextResponse('Hello from middleware!', { status: 200 });
}

export const config = {
  matcher: [
    '/:path*',

  ],
};
