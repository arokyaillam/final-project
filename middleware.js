import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

// Paths that require authentication
const protectedPaths = ['/dashboard'];

// Paths that should be accessible only to non-authenticated users
const authPaths = ['/login', '/register'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  // Check if the path is an auth path
  const isAuthPath = authPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  // Get token from cookies
  const token = request.cookies.get('token')?.value;
  
  // Verify token
  const isAuthenticated = token && verifyToken(token);
  
  // Redirect authenticated users away from auth pages
  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Redirect unauthenticated users away from protected pages
  if (isProtectedPath && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
