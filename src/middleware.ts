import { NextResponse, type NextRequest } from 'next/server'
import { verifyAdminToken, AUTH_COOKIE_NAME } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginRoute = pathname === '/admin/login'

  if (isAdminRoute) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
    const payload = token ? await verifyAdminToken(token) : null

    // If attempting to visit protected admin route without valid session -> redirect to login
    if (!isLoginRoute && !payload) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    // If logged in and visiting login page -> redirect to dashboard
    if (isLoginRoute && payload) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files
     */
    '/((?!_next/static|_next/image|favicon.ico|uploads|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
