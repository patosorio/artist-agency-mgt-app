import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add paths that don't require authentication
const publicPaths = [
  '/agency/login',
  '/agency/signup',
  '/agency/forgot-password',
  '/api/tenants/firebase-login'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Get the current tenant from localStorage
  const currentTenant = request.cookies.get('currentTenant')?.value

  // If no tenant is set, redirect to login
  if (!currentTenant) {
    return NextResponse.redirect(new URL('/agency/login', request.url))
  }

  // Clone the request headers
  const requestHeaders = new Headers(request.headers)
  
  // Add the tenant subdomain header
  requestHeaders.set('X-Tenant-Subdomain', currentTenant)

  // Return the response with the modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
} 