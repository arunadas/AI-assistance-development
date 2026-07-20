import { NextRequest, NextResponse } from 'next/server';

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/signup', '/forgot-password'];
const API_ROUTES = /^\/api\//;

interface JWTPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  email?: string;
  [key: string]: any;
}

/**
 * Decode JWT payload (without verification for this demo)
 * In production, verify against your secret key using jsonwebtoken or similar
 */
function decodeJWT(token: string): JWTPayload | null {
  try {
    // JWT format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode payload (base64url decode)
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString('utf-8')
    );

    return payload;
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
}

/**
 * Check if JWT token is still valid
 */
function isTokenValid(payload: JWTPayload): boolean {
  if (!payload.exp) {
    return false;
  }

  // exp is in seconds, Date.now() is in milliseconds
  const expirationTime = payload.exp * 1000;
  const now = Date.now();

  return now < expirationTime;
}

/**
 * Middleware to check authentication
 * Runs on all routes except public routes and API routes
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow API routes (handle separately if needed)
  if (API_ROUTES.test(pathname)) {
    return NextResponse.next();
  }

  // Get auth token from cookies
  const authToken = request.cookies.get('auth_token')?.value;

  if (!authToken) {
    // No token, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Decode and validate token
  const payload = decodeJWT(authToken);

  if (!payload || !isTokenValid(payload)) {
    // Invalid or expired token, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Token is valid, add user info to request headers for downstream handlers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', payload.sub || '');
  requestHeaders.set('x-user-email', payload.email || '');

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

/**
 * Configure which routes the middleware should run on
 * This ensures middleware only runs on protected routes
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes, unless we want to check them too)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public static files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
