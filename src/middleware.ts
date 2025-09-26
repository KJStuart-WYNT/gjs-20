import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Check if user has admin role
    if (req.nextUrl.pathname.startsWith('/admin') && req.nextUrl.pathname !== '/admin/login') {
      if (req.nextauth.token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/admin/login', req.url))
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page without authentication
        if (req.nextUrl.pathname === '/admin/login') {
          return true
        }
        
        // Require authentication for all other admin routes
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return !!token && token.role === 'admin'
        }
        
        // Allow access to public routes
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/export'
  ]
}

