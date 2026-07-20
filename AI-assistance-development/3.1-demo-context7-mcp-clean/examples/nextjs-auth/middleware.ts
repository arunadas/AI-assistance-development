import { NextRequest, NextResponse } from 'next/server'

interface JwtPayload {
  exp?: number
  [key: string]: unknown
}

function isTokenValid(token: string): boolean {
  try {
    const payload = token.split('.')[1]
    if (!payload) return false

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decoded: JwtPayload = JSON.parse(atob(base64))

    if (typeof decoded.exp !== 'number') return false
    return decoded.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value

  if (!token || !isTokenValid(token)) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Runs on all routes except /login and /api/*
export const config = {
  matcher: ['/((?!login|api|_next/static|_next/image|favicon.ico).*)'],
}
